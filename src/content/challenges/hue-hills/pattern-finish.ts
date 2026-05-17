import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * Pattern uses shape NAMES + designed shape SVG icons (no emoji), so it's solvable
 * without seeing colour — colour-blind and high-contrast modes still convey the pattern.
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
        { id: 'sq', label: 'Kvadrat', icon: 'square', iconTint: 'var(--color-accent)', isCorrect: true },
        { id: 'tr', label: 'Triangel', icon: 'triangle', iconTint: 'var(--color-accent-2)', isCorrect: false },
        { id: 'ci', label: 'Cirkel', icon: 'circle', iconTint: 'var(--color-accent-3)', isCorrect: false },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'Circle — Square — Circle — ?',
      options: [
        { id: 'sq', label: 'Square', icon: 'square', iconTint: 'var(--color-accent)', isCorrect: true },
        { id: 'tr', label: 'Triangle', icon: 'triangle', iconTint: 'var(--color-accent-2)', isCorrect: false },
        { id: 'ci', label: 'Circle', icon: 'circle', iconTint: 'var(--color-accent-3)', isCorrect: false },
      ],
      pickCount: 1,
    },
  },
};
