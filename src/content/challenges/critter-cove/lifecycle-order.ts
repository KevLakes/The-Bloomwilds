import type { ChallengeDef } from '@/engine/challenge/types';

export const lifecycleOrder: ChallengeDef = {
  id: 'critter-cove.lifecycle-order',
  regionId: 'critter-cove',
  titleKey: 'lifecycle-order.title',
  narrationKey: 'challengeIntro.lifecycle-order',
  estSeconds: 90,
  tags: ['pattern'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'cove-butterfly',
  spec: {
    sv: {
      kind: 'order',
      prompt: 'Sätt fjärilens liv i rätt ordning.',
      items: [
        { id: 'egg', label: '🥚 Ägg', rank: 1 },
        { id: 'caterpillar', label: '🐛 Larv', rank: 2 },
        { id: 'cocoon', label: '🟫 Puppa', rank: 3 },
        { id: 'butterfly', label: '🦋 Fjäril', rank: 4 },
      ],
    },
    en: {
      kind: 'order',
      prompt: 'Put the butterfly’s life in order.',
      items: [
        { id: 'egg', label: '🥚 Egg', rank: 1 },
        { id: 'caterpillar', label: '🐛 Caterpillar', rank: 2 },
        { id: 'cocoon', label: '🟫 Cocoon', rank: 3 },
        { id: 'butterfly', label: '🦋 Butterfly', rank: 4 },
      ],
    },
  },
};
