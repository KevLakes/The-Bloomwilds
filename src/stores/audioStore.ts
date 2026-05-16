import { create } from 'zustand';

interface AudioState {
  muted: boolean;
  music: number;
  sfx: number;
  narration: number;
  setMuted(muted: boolean): void;
  setVolume(channel: 'music' | 'sfx' | 'narration', vol: number): void;
}

export const useAudioStore = create<AudioState>((set) => ({
  muted: false,
  music: 0.4,
  sfx: 0.7,
  narration: 1,
  setMuted: (muted) => set({ muted }),
  setVolume: (channel, vol) => set({ [channel]: vol } as Partial<AudioState>),
}));
