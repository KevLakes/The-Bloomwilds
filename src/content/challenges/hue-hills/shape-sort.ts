import type { ChallengeDef } from '@/engine/challenge/types';

export const shapeSort: ChallengeDef = {
  id: 'hue-hills.shape-sort',
  regionId: 'hue-hills',
  titleKey: 'shape-sort.title',
  narrationKey: 'challengeIntro.shape-sort',
  estSeconds: 90,
  tags: ['pattern'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'hills-triangle',
  spec: {
    sv: {
      kind: 'sort',
      prompt: 'Sortera formerna.',
      bins: [
        { id: 'round', label: 'Runda', icon: '⚪' },
        { id: 'corner', label: 'Hörn', icon: '⬛' },
      ],
      items: [
        { id: 'sun', label: '☀️ sol', binId: 'round' },
        { id: 'ball', label: '⚽ boll', binId: 'round' },
        { id: 'moon', label: '🌕 måne', binId: 'round' },
        { id: 'box', label: '📦 låda', binId: 'corner' },
        { id: 'house', label: '🏠 hus', binId: 'corner' },
        { id: 'kite', label: '🪁 drake', binId: 'corner' },
      ],
    },
    en: {
      kind: 'sort',
      prompt: 'Sort the shapes.',
      bins: [
        { id: 'round', label: 'Round', icon: '⚪' },
        { id: 'corner', label: 'Cornered', icon: '⬛' },
      ],
      items: [
        { id: 'sun', label: '☀️ sun', binId: 'round' },
        { id: 'ball', label: '⚽ ball', binId: 'round' },
        { id: 'moon', label: '🌕 moon', binId: 'round' },
        { id: 'box', label: '📦 box', binId: 'corner' },
        { id: 'house', label: '🏠 house', binId: 'corner' },
        { id: 'kite', label: '🪁 kite', binId: 'corner' },
      ],
    },
  },
};
