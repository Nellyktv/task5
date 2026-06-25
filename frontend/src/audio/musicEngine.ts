import * as Tone from 'tone';
import { Soundfont, DrumMachine } from 'smplr';
import { API_BASE } from '../api/client';

export interface Progress {
  position: number;
  duration: number;
  playing: boolean;
}

interface Note {
  time: string;
  note: number;
  dur: string;
  vel: number;
}

interface Chord {
  time: string;
  notes: number[];
  dur: string;
  vel: number;
}

interface Hit {
  time: string;
}

interface Score {
  bpm: number;
  chords: Chord[];
  leads: Note[];
  basses: Note[];
  kicks: Hit[];
  snares: Hit[];
  hats: Hit[];
  duration: number;
}

interface InstrumentSet {
  pad: string;
  lead: string;
  bass: string;
}

const instrumentSets: InstrumentSet[] = [
  { pad: 'pad_2_warm', lead: 'lead_2_sawtooth', bass: 'synth_bass_1' },
  { pad: 'electric_piano_1', lead: 'vibraphone', bass: 'electric_bass_finger' },
  { pad: 'string_ensemble_1', lead: 'electric_piano_2', bass: 'electric_bass_pick' },
  { pad: 'string_ensemble_2', lead: 'acoustic_grand_piano', bass: 'acoustic_bass' },
  { pad: 'pad_4_choir', lead: 'lead_1_square', bass: 'synth_bass_2' },
];

let context: AudioContext;
const instrumentCache = new Map<string, Soundfont>();
let pad: Soundfont;
let lead: Soundfont;
let bass: Soundfont;
let drums: DrumMachine;
let parts: Tone.Part[] = [];

let ready = false;
let currentSeed: number | null = null;
let duration = 0;
let raf = 0;
let onProgress: ((p: Progress) => void) | undefined;
let onEnd: (() => void) | undefined;

const getInstrument = (name: string) => {
  const cached = instrumentCache.get(name);
  if (cached) return cached;
  const inst = new Soundfont(context, { instrument: name });
  instrumentCache.set(name, inst);
  return inst;
};

const setup = () => {
  if (ready) return;

  context = Tone.getContext().rawContext as unknown as AudioContext;
  drums = new DrumMachine(context, { instrument: 'TR-808' });
  ready = true;
};

const stopVoices = () => {
  pad?.stop();
  lead?.stop();
  bass?.stop();
};

const handleEnd = () => {
  const transport = Tone.getTransport();
  transport.stop();
  transport.position = 0;
  stopVoices();
  cancelAnimationFrame(raf);
  onEnd?.();
};

const loadScore = async (seed: number) => {
  const res = await fetch(`${API_BASE}/audio/${seed}`);
  const score: Score = await res.json();

  const transport = Tone.getTransport();
  transport.stop();
  transport.cancel();
  parts.forEach((el) => el.dispose());

  transport.bpm.value = score.bpm;
  duration = score.duration;

  const set = instrumentSets[seed % instrumentSets.length];
  pad = getInstrument(set.pad);
  lead = getInstrument(set.lead);
  bass = getInstrument(set.bass);
  await Promise.all([pad.load, lead.load, bass.load, drums.load]);

  parts = [
    new Tone.Part<Chord>((time, el) => {
      const dur = Tone.Time(el.dur).toSeconds();
      el.notes.forEach((note) => pad.start({ note, time, duration: dur, velocity: el.vel * 100 }));
    }, score.chords),
    new Tone.Part<Note>((time, el) => lead.start({ note: el.note, time, duration: Tone.Time(el.dur).toSeconds(), velocity: el.vel * 100 }), score.leads),
    new Tone.Part<Note>((time, el) => bass.start({ note: el.note, time, duration: Tone.Time(el.dur).toSeconds(), velocity: el.vel * 100 }), score.basses),
    new Tone.Part<Hit>((time) => drums.start({ note: 'kick', time }), score.kicks),
    new Tone.Part<Hit>((time) => drums.start({ note: 'snare', time }), score.snares),
    new Tone.Part<Hit>((time) => drums.start({ note: 'hihat', time }), score.hats),
  ];
  parts.forEach((el) => el.start(0));

  transport.scheduleOnce(handleEnd, duration);
};

const tick = () => {
  const transport = Tone.getTransport();
  const playing = transport.state === 'started';
  onProgress?.({ position: transport.seconds, duration, playing });
  if (playing) raf = requestAnimationFrame(tick);
};

const play = async (seed: number, progress?: (p: Progress) => void, end?: () => void, startAt?: number) => {
  onProgress = progress;
  onEnd = end;
  await Tone.start();
  setup();

  if (seed !== currentSeed) {
    await loadScore(seed);
    currentSeed = seed;
  }

  const transport = Tone.getTransport();
  if (startAt !== undefined) transport.seconds = startAt;
  transport.start();
  cancelAnimationFrame(raf);
  tick();
};

const pause = () => {
  const transport = Tone.getTransport();
  transport.pause();
  stopVoices();
  cancelAnimationFrame(raf);
  onProgress?.({ position: transport.seconds, duration, playing: false });
};

const stop = () => {
  const transport = Tone.getTransport();
  transport.stop();
  transport.position = 0;
  stopVoices();
  cancelAnimationFrame(raf);
  onProgress?.({ position: 0, duration: 0, playing: false });
};

export const musicEngine = { play, pause, stop };
