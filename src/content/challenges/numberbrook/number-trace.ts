import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * Stand-in for a bespoke trace component (planned for M4 polish):
 * for now, recognize the number by name.
 */
export const numberTrace: ChallengeDef = {
  id: 'numberbrook.number-trace',
  regionId: 'numberbrook',
  titleKey: 'number-trace.title',
  narrationKey: 'challengeIntro.number-trace',
  estSeconds: 90,
  tags: ['math'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'numberbrook-pebble',
  spec: {
    sv: {
      kind: 'match',
      prompt: 'Para ihop siffra och ord.',
      pairs: [
        { id: '1', left: '1', right: 'ett' },
        { id: '2', left: '2', right: 'två' },
        { id: '3', left: '3', right: 'tre' },
        { id: '4', left: '4', right: 'fyra' },
      ],
    },
    en: {
      kind: 'match',
      prompt: 'Match each numeral to its word.',
      pairs: [
        { id: '1', left: '1', right: 'one' },
        { id: '2', left: '2', right: 'two' },
        { id: '3', left: '3', right: 'three' },
        { id: '4', left: '4', right: 'four' },
      ],
    },
  },
};
