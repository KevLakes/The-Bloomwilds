import type { ChallengeDef } from '@/engine/challenge/types';

export const frogJumpAdd: ChallengeDef = {
  id: 'numberbrook.frog-jump-add',
  regionId: 'numberbrook',
  titleKey: 'frog-jump-add.title',
  narrationKey: 'challengeIntro.frog-jump-add',
  estSeconds: 120,
  tags: ['math'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'numberbrook-frog',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Grodan hoppar 2 + 3 näckrosor. Hur långt kom grodan? 🐸',
      options: [
        { id: '4', label: '4', isCorrect: false },
        { id: '5', label: '5', isCorrect: true },
        { id: '6', label: '6', isCorrect: false },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'The frog jumps 2 + 3 lilies. How far did it land? 🐸',
      options: [
        { id: '4', label: '4', isCorrect: false },
        { id: '5', label: '5', isCorrect: true },
        { id: '6', label: '6', isCorrect: false },
      ],
      pickCount: 1,
    },
  },
};
