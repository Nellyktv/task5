import { create } from 'zustand';
import { musicEngine, type Progress } from '../audio/musicEngine';
import type { Song } from '../types';

interface ActiveTrack {
  audioSeed: number;
  title: string;
  artist: string;
  coverSeed: number;
}

export const toTrack = (song: Song): ActiveTrack => ({
  audioSeed: song.audioSeed,
  title: song.title,
  artist: song.artist,
  coverSeed: song.coverSeed,
});

interface PlayerStore {
  activeSeed: number | null;
  activeTrack: ActiveTrack | null;
  playing: boolean;
  loading: boolean;
  position: number;
  duration: number;
  toggle: (seed: number, track?: ActiveTrack) => void;
  seek: (seed: number, seconds: number, track?: ActiveTrack) => void;
  stop: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => {
  const handleProgress = (p: Progress) => {
    set({ position: p.position, duration: p.duration, playing: p.playing, loading: false });
  };

  const handleEnd = () => {
    set({ playing: false, activeSeed: null, position: 0 });
  };

  return {
    activeSeed: null,
    activeTrack: null,
    playing: false,
    loading: false,
    position: 0,
    duration: 0,

    toggle: (seed, track) => {
      if (track) set({ activeTrack: track });
      const { activeSeed, playing } = get();
      if (activeSeed === seed && playing) {
        musicEngine.pause();
        set({ playing: false });
        return;
      }
      if (activeSeed !== seed) set({ position: 0, duration: 0 });
      set({ activeSeed: seed, loading: true });
      void musicEngine.play(seed, handleProgress, handleEnd);
    },

    seek: (seed, seconds, track) => {
      if (track) set({ activeTrack: track });
      set({ activeSeed: seed, position: seconds, loading: true });
      void musicEngine.play(seed, handleProgress, handleEnd, seconds);
    },

    stop: () => {
      musicEngine.stop();
      set({ playing: false, activeSeed: null, activeTrack: null });
    },
  };
});
