import { create } from 'zustand';

type Mode = 'light' | 'dark';

type AppStore = {
  mode: Mode;
  toggleMode: () => void;
};

const savedMode = localStorage.getItem('theme') as Mode | null;

export const useAppStore = create<AppStore>((set) => ({
  mode: savedMode ?? 'dark',
  toggleMode: () =>
    set((state) => {
      const mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', mode);
      return { mode };
    }),
}));