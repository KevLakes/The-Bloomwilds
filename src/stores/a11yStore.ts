import { create } from 'zustand';
import { defaultA11y, type A11ySettings } from '@/types';

interface A11yState {
  settings: A11ySettings;
  set<K extends keyof A11ySettings>(key: K, value: A11ySettings[K]): void;
  replace(settings: A11ySettings): void;
  reset(): void;
}

export const useA11yStore = create<A11yState>((set) => ({
  settings: { ...defaultA11y },
  set: (key, value) =>
    set((s) => ({ settings: { ...s.settings, [key]: value } })),
  replace: (settings) => set({ settings }),
  reset: () => set({ settings: { ...defaultA11y } }),
}));
