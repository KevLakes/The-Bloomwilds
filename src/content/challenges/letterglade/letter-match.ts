import type { ChallengeDef } from '@/engine/challenge/types';

export const letterMatch: ChallengeDef = {
  id: 'letterglade.letter-match',
  regionId: 'letterglade',
  titleKey: 'letter-match.title',
  narrationKey: 'challengeIntro.letter-match',
  estSeconds: 90,
  tags: ['reading'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'letterglade-acorn',
  spec: {
    sv: {
      kind: 'match',
      prompt: 'Para ihop stora och små bokstäver.',
      pairs: [
        { id: 'a', left: 'A', right: 'a' },
        { id: 'å', left: 'Å', right: 'å' },
        { id: 'ä', left: 'Ä', right: 'ä' },
        { id: 'ö', left: 'Ö', right: 'ö' },
        { id: 's', left: 'S', right: 's' },
      ],
    },
    en: {
      kind: 'match',
      prompt: 'Match each big letter to its small letter.',
      pairs: [
        { id: 'a', left: 'A', right: 'a' },
        { id: 'b', left: 'B', right: 'b' },
        { id: 'c', left: 'C', right: 'c' },
        { id: 's', left: 'S', right: 's' },
        { id: 't', left: 'T', right: 't' },
      ],
    },
  },
};
