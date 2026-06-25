import { Scale, Note } from 'tonal';
import { createRand } from './rng.js';

const TOTAL_BARS = 20;
const BEATS_PER_BAR = 4;
const SECONDS_PER_MINUTE = 60;
const SLOTS_PER_BAR = 8;
const OCTAVE = 12;
const TRIAD = [0, 2, 4];

const SCALE_TYPES = ['major', 'minor', 'dorian', 'mixolydian', 'phrygian'];
const TONICS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const VERSE_PROGS = [[0, 5, 3, 4], [0, 3, 4, 4], [5, 3, 0, 4], [0, 4, 1, 4]];
const CHORUS_PROGS = [[3, 4, 0, 5], [0, 4, 5, 4], [3, 0, 4, 5], [5, 4, 3, 4]];

const STYLES = [
  { name: 'house', bpmMin: 118, bpmMax: 128, kick: 'four', hats: 'offbeat' },
  { name: 'hiphop', bpmMin: 82, bpmMax: 96, kick: 'boombap', hats: 'eighth' },
  { name: 'pop', bpmMin: 100, bpmMax: 118, kick: 'backbeat', hats: 'eighth' },
  { name: 'ballad', bpmMin: 68, bpmMax: 82, kick: 'sparse', hats: 'quarter' },
  { name: 'dnb', bpmMin: 140, bpmMax: 168, kick: 'breaks', hats: 'sixteenth' },
];

const STRUCTURE = [
  { name: 'intro', bars: 2, density: 0.3, octave: 0, quiet: true },
  { name: 'verse', bars: 4, density: 0.6, octave: 0, quiet: false },
  { name: 'chorus', bars: 4, density: 0.85, octave: OCTAVE, quiet: false },
  { name: 'verse', bars: 4, density: 0.6, octave: 0, quiet: false },
  { name: 'chorus', bars: 4, density: 0.85, octave: OCTAVE, quiet: false },
  { name: 'outro', bars: 2, density: 0.3, octave: 0, quiet: true },
];

const pick = (rand, arr) => arr[Math.floor(rand() * arr.length)];

const chooseStyle = (rand) => {
  const style = pick(rand, STYLES);
  const bpm = style.bpmMin + Math.floor(rand() * (style.bpmMax - style.bpmMin));
  return { style, bpm };
};

const songDuration = (bpm) => (TOTAL_BARS * BEATS_PER_BAR * SECONDS_PER_MINUTE) / bpm;

const kickPattern = (kind, bar) => {
  switch (kind) {
    case 'four': return [`${bar}:0:0`, `${bar}:1:0`, `${bar}:2:0`, `${bar}:3:0`];
    case 'boombap': return [`${bar}:0:0`, `${bar}:2:2`];
    case 'sparse': return [`${bar}:0:0`];
    case 'breaks': return [`${bar}:0:0`, `${bar}:2:2`, `${bar}:3:0`];
    default: return [`${bar}:0:0`, `${bar}:2:0`];
  }
};

const hatPattern = (kind, bar) => {
  const out = [];
  for (let beat = 0; beat < BEATS_PER_BAR; beat++) {
    switch (kind) {
      case 'offbeat':
        out.push(`${bar}:${beat}:2`);
        break;
      case 'quarter':
        out.push(`${bar}:${beat}:0`);
        break;
      case 'sixteenth':
        out.push(`${bar}:${beat}:0`, `${bar}:${beat}:1`, `${bar}:${beat}:2`, `${bar}:${beat}:3`);
        break;
      default:
        out.push(`${bar}:${beat}:0`, `${bar}:${beat}:2`);
    }
  }
  return out;
};

export const generateScore = (seed) => {
  const rand = createRand(seed);
  const { style, bpm } = chooseStyle(rand);
  const tonic = pick(rand, TONICS);
  const scaleType = pick(rand, SCALE_TYPES);
  const degreeAt = Scale.degrees(`${tonic}3 ${scaleType}`);
  const degreeToMidi = (degree) => Note.midi(degreeAt(degree + 1));
  const triad = (degree) => TRIAD.map((interval) => degreeToMidi(degree + interval));
  const verseProg = pick(rand, VERSE_PROGS);
  const chorusProg = pick(rand, CHORUS_PROGS);

  const chords = [], leads = [], basses = [], kicks = [], snares = [], hats = [];

  let bar = 0;
  for (const section of STRUCTURE) {
    const prog = section.name === 'chorus' ? chorusProg : verseProg;

    for (let b = 0; b < section.bars; b++, bar++) {
      const degree = prog[b % prog.length];
      const notes = triad(degree);

      chords.push({ time: `${bar}:0:0`, notes, dur: '1m', vel: section.quiet ? 0.35 : 0.5 });
      basses.push({ time: `${bar}:0:0`, note: notes[0] - OCTAVE, dur: '2n', vel: 0.7 });
      if (!section.quiet) basses.push({ time: `${bar}:2:0`, note: notes[1] - OCTAVE, dur: '2n', vel: 0.6 });

      for (let slot = 0; slot < SLOTS_PER_BAR; slot++) {
        if (rand() > section.density) continue;
        const deg = rand() < 0.6
          ? pick(rand, TRIAD.map((interval) => degree + interval))
          : degree + Math.floor(rand() * TONICS.length);
        const midi = degreeToMidi(deg) + OCTAVE + section.octave;
        const beat = Math.floor(slot / 2);
        const sub = (slot % 2) * 2;
        leads.push({ time: `${bar}:${beat}:${sub}`, note: midi, dur: '8n', vel: 0.5 + rand() * 0.3 });
      }

      if (!section.quiet) {
        for (const t of kickPattern(style.kick, bar)) kicks.push({ time: t });
        snares.push({ time: `${bar}:1:0` }, { time: `${bar}:3:0` });
        for (const t of hatPattern(style.hats, bar)) hats.push({ time: t });
      } else {
        hats.push({ time: `${bar}:0:0` }, { time: `${bar}:2:0` });
      }
    }
  }

  return { bpm, chords, leads, basses, kicks, snares, hats, duration: songDuration(bpm) };
};

export const previewDuration = (seed) => {
  const rand = createRand(seed);
  const { bpm } = chooseStyle(rand);
  return songDuration(bpm);
};
