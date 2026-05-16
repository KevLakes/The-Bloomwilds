import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * Standin via PickGame — labels include the color WORD as well as the swatch,
 * so the challenge is solvable without color perception.
 */
export const colorMix: ChallengeDef = {
  id: 'hue-hills.color-mix',
  regionId: 'hue-hills',
  titleKey: 'color-mix.title',
  narrationKey: 'challengeIntro.color-mix',
  estSeconds: 90,
  tags: ['pattern'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'hills-rainbow',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Gul 🟡 + Blå 🔵 = ?',
      options: [
        { id: 'green', label: '🟢 Grön', isCorrect: true },
        { id: 'orange', label: '🟠 Orange', isCorrect: false },
        { id: 'purple', label: '🟣 Lila', isCorrect: false },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'Yellow 🟡 + Blue 🔵 = ?',
      options: [
        { id: 'green', label: '🟢 Green', isCorrect: true },
        { id: 'orange', label: '🟠 Orange', isCorrect: false },
        { id: 'purple', label: '🟣 Purple', isCorrect: false },
      ],
      pickCount: 1,
    },
  },
};
