import type { ChallengeDef } from './types';
import { allChallenges } from '@/content/challenges';

const dynamic = new Map<string, ChallengeDef>();

export function listChallenges(): ChallengeDef[] {
  return [...allChallenges, ...dynamic.values()];
}

export function listForRegion(regionId: ChallengeDef['regionId']): ChallengeDef[] {
  return listChallenges().filter((c) => c.regionId === regionId);
}

export function getChallenge(id: string): ChallengeDef | undefined {
  return listChallenges().find((c) => c.id === id);
}

/**
 * Phase-2 seam: AI-generated challenges (or teacher-uploaded) can be registered at runtime.
 * The static MVP catalog does not use this; do not remove.
 */
export function register(def: ChallengeDef): void {
  dynamic.set(def.id, def);
}

export function unregister(id: string): void {
  dynamic.delete(id);
}
