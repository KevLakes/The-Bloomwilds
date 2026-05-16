import type { ChallengeDef } from '@/engine/challenge/types';

export const countLilies: ChallengeDef = {
  id: 'numberbrook.count-lilies',
  regionId: 'numberbrook',
  titleKey: 'count-lilies.title',
  narrationKey: 'challengeIntro.count-lilies',
  estSeconds: 90,
  tags: ['math'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'numberbrook-lily',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Hur många näckrosor? 🌸 🌸 🌸 🌸',
      options: [
        { id: '3', label: '3', isCorrect: false },
        { id: '4', label: '4', isCorrect: true },
        { id: '5', label: '5', isCorrect: false },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'How many lilies? 🌸 🌸 🌸 🌸',
      options: [
        { id: '3', label: '3', isCorrect: false },
        { id: '4', label: '4', isCorrect: true },
        { id: '5', label: '5', isCorrect: false },
      ],
      pickCount: 1,
    },
  },
};
