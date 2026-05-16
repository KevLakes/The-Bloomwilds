import { create } from 'zustand';
import { idbAdapter } from '@/systems/persistence/idbAdapter';
import type { BloomTier, ChallengeId, ProfileProgress, RegionId } from '@/types';

const STARS_PER_TIER = 3;

function emptyProgress(profileId: string): ProfileProgress {
  return {
    profileId,
    bloomTier: {},
    completed: {},
    seeds: 0,
    inventory: { stickers: [], outfits: [], lullabies: [], secrets: [] },
  };
}

function computeTier(completedInRegion: number): BloomTier {
  if (completedInRegion >= STARS_PER_TIER * 3) return 3;
  if (completedInRegion >= STARS_PER_TIER * 2) return 2;
  if (completedInRegion >= STARS_PER_TIER) return 1;
  return 0;
}

interface ProgressState {
  progress?: ProfileProgress;
  loadFor(profileId: string): Promise<void>;
  recordCompletion(args: {
    regionId: RegionId;
    challengeId: ChallengeId;
    stars: 1 | 2 | 3;
    seedsAwarded?: number;
    stickerAwarded?: string;
  }): Promise<{ newTier: BloomTier; tierIncreased: boolean }>;
  reset(): void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: undefined,

  async loadFor(profileId) {
    const existing = await idbAdapter.getProgress(profileId);
    const progress = existing ?? emptyProgress(profileId);
    if (!existing) await idbAdapter.saveProgress(progress);
    set({ progress });
  },

  async recordCompletion({ regionId, challengeId, stars, seedsAwarded = 1, stickerAwarded }) {
    const current = get().progress;
    if (!current) throw new Error('No active progress loaded');

    const completed = {
      ...current.completed,
      [challengeId]: {
        attempts: (current.completed[challengeId]?.attempts ?? 0) + 1,
        stars,
      },
    };

    const completedInRegion = Object.keys(completed).filter((id) =>
      id.startsWith(`${regionId}.`),
    ).length;

    const prevTier = current.bloomTier[regionId] ?? 0;
    const newTier = computeTier(completedInRegion);

    const stickers = stickerAwarded && !current.inventory.stickers.includes(stickerAwarded)
      ? [...current.inventory.stickers, stickerAwarded]
      : current.inventory.stickers;

    const next: ProfileProgress = {
      ...current,
      completed,
      bloomTier: { ...current.bloomTier, [regionId]: newTier },
      seeds: current.seeds + seedsAwarded,
      inventory: { ...current.inventory, stickers },
    };

    await idbAdapter.saveProgress(next);
    set({ progress: next });
    return { newTier, tierIncreased: newTier > prevTier };
  },

  reset() {
    set({ progress: undefined });
  },
}));

export { computeTier };
