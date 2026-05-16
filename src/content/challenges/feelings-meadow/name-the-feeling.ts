import type { ChallengeDef } from '@/engine/challenge/types';

export const nameTheFeeling: ChallengeDef = {
  id: 'feelings-meadow.name-the-feeling',
  regionId: 'feelings-meadow',
  titleKey: 'name-the-feeling.title',
  narrationKey: 'challengeIntro.name-the-feeling',
  estSeconds: 90,
  tags: ['social'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'meadow-smile',
  spec: {
    sv: {
      kind: 'match',
      prompt: 'Vad känner molnet?',
      pairs: [
        { id: 'happy', left: '😊', right: 'Glad' },
        { id: 'sad', left: '😢', right: 'Ledsen' },
        { id: 'angry', left: '😠', right: 'Arg' },
        { id: 'scared', left: '😨', right: 'Rädd' },
      ],
    },
    en: {
      kind: 'match',
      prompt: 'What does the cloud feel?',
      pairs: [
        { id: 'happy', left: '😊', right: 'Happy' },
        { id: 'sad', left: '😢', right: 'Sad' },
        { id: 'angry', left: '😠', right: 'Angry' },
        { id: 'scared', left: '😨', right: 'Scared' },
      ],
    },
  },
};
