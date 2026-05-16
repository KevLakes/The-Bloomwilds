import type { ChallengeDef } from '@/engine/challenge/types';

export const critterCall: ChallengeDef = {
  id: 'critter-cove.critter-call',
  regionId: 'critter-cove',
  titleKey: 'critter-call.title',
  narrationKey: 'challengeIntro.critter-call',
  estSeconds: 90,
  tags: ['reading'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'cove-fish',
  spec: {
    sv: {
      kind: 'match',
      prompt: 'Vem säger vad?',
      pairs: [
        { id: 'dog', left: '🐶', right: 'Voff!' },
        { id: 'cat', left: '🐱', right: 'Mjau' },
        { id: 'cow', left: '🐮', right: 'Muu' },
        { id: 'duck', left: '🦆', right: 'Kvack' },
      ],
    },
    en: {
      kind: 'match',
      prompt: 'Who says what?',
      pairs: [
        { id: 'dog', left: '🐶', right: 'Woof!' },
        { id: 'cat', left: '🐱', right: 'Meow' },
        { id: 'cow', left: '🐮', right: 'Moo' },
        { id: 'duck', left: '🦆', right: 'Quack' },
      ],
    },
  },
};
