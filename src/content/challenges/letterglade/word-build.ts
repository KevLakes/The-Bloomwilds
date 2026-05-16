import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * "Build a word" — implemented on top of MatchGame for MVP:
 * left side shows a target word, right side scrambled letters, kid pairs them in order.
 * Kept simple to stay within the primitive set.
 */
export const wordBuild: ChallengeDef = {
  id: 'letterglade.word-build',
  regionId: 'letterglade',
  titleKey: 'word-build.title',
  narrationKey: 'challengeIntro.word-build',
  estSeconds: 90,
  tags: ['reading'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'letterglade-mushroom',
  spec: {
    sv: {
      kind: 'match',
      prompt: 'Sätt rätt bokstav på rätt plats: SOL',
      pairs: [
        { id: '1', left: '1: S', right: 'S' },
        { id: '2', left: '2: O', right: 'O' },
        { id: '3', left: '3: L', right: 'L' },
      ],
    },
    en: {
      kind: 'match',
      prompt: 'Put each letter in the right slot: CAT',
      pairs: [
        { id: '1', left: '1: C', right: 'C' },
        { id: '2', left: '2: A', right: 'A' },
        { id: '3', left: '3: T', right: 'T' },
      ],
    },
  },
};
