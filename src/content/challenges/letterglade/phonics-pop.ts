import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * "Sound pop" — tap the leaves whose word starts with the target sound.
 * Swedish: target sound "S" — find words starting with S.
 * English: target sound "S" — same idea.
 */
export const phonicsPop: ChallengeDef = {
  id: 'letterglade.phonics-pop',
  regionId: 'letterglade',
  titleKey: 'phonics-pop.title',
  narrationKey: 'challengeIntro.phonics-pop',
  estSeconds: 90,
  tags: ['reading'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'letterglade-leaf',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Tryck på alla löv som börjar med S.',
      options: [
        { id: 'sol', label: 'sol', isCorrect: true },
        { id: 'katt', label: 'katt', isCorrect: false },
        { id: 'sten', label: 'sten', isCorrect: true },
        { id: 'mus', label: 'mus', isCorrect: false },
        { id: 'sko', label: 'sko', isCorrect: true },
        { id: 'bok', label: 'bok', isCorrect: false },
      ],
    },
    en: {
      kind: 'pick',
      prompt: 'Tap every leaf that starts with S.',
      options: [
        { id: 'sun', label: 'sun', isCorrect: true },
        { id: 'cat', label: 'cat', isCorrect: false },
        { id: 'star', label: 'star', isCorrect: true },
        { id: 'dog', label: 'dog', isCorrect: false },
        { id: 'shoe', label: 'shoe', isCorrect: true },
        { id: 'book', label: 'book', isCorrect: false },
      ],
    },
  },
};
