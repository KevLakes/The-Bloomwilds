import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * Patterns use shape NAMES alongside color so it's solvable without sight of color.
 */
export const patternFinish: ChallengeDef = {
  id: 'hue-hills.pattern-finish',
  regionId: 'hue-hills',
  titleKey: 'pattern-finish.title',
  narrationKey: 'challengeIntro.pattern-finish',
  estSeconds: 90,
  tags: ['pattern'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'hills-circle',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Cirkel — Kvadrat — Cirkel — ?',
      options: [
        { id: 'sq', label: '⬛ Kvadrat', isCorrect: true },
        { id: 'tr', label: '🔺 Triangel', isCorrect: false },
        { id: 'ci', label: '⚪ Cirkel', isCorrect: false },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'Circle — Square — Circle — ?',
      options: [
        { id: 'sq', label: '⬛ Square', isCorrect: true },
        { id: 'tr', label: '🔺 Triangle', isCorrect: false },
        { id: 'ci', label: '⚪ Circle', isCorrect: false },
      ],
      pickCount: 1,
    },
  },
};
