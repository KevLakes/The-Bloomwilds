import type { ChallengeDef } from '@/engine/challenge/types';

export const habitatSort: ChallengeDef = {
  id: 'critter-cove.habitat-sort',
  regionId: 'critter-cove',
  titleKey: 'habitat-sort.title',
  narrationKey: 'challengeIntro.habitat-sort',
  estSeconds: 120,
  tags: ['pattern'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'cove-shell',
  spec: {
    sv: {
      kind: 'sort',
      prompt: 'Vart hör djuret hemma?',
      bins: [
        { id: 'sea', label: 'Hav', icon: '🌊' },
        { id: 'land', label: 'Land', icon: '🌿' },
        { id: 'sky', label: 'Himmel', icon: '☁️' },
      ],
      items: [
        { id: 'fish', label: 'Fisk', binId: 'sea' },
        { id: 'crab', label: 'Krabba', binId: 'sea' },
        { id: 'fox', label: 'Räv', binId: 'land' },
        { id: 'rabbit', label: 'Kanin', binId: 'land' },
        { id: 'bird', label: 'Fågel', binId: 'sky' },
        { id: 'bee', label: 'Bi', binId: 'sky' },
      ],
    },
    en: {
      kind: 'sort',
      prompt: 'Where does the critter live?',
      bins: [
        { id: 'sea', label: 'Sea', icon: '🌊' },
        { id: 'land', label: 'Land', icon: '🌿' },
        { id: 'sky', label: 'Sky', icon: '☁️' },
      ],
      items: [
        { id: 'fish', label: 'Fish', binId: 'sea' },
        { id: 'crab', label: 'Crab', binId: 'sea' },
        { id: 'fox', label: 'Fox', binId: 'land' },
        { id: 'rabbit', label: 'Rabbit', binId: 'land' },
        { id: 'bird', label: 'Bird', binId: 'sky' },
        { id: 'bee', label: 'Bee', binId: 'sky' },
      ],
    },
  },
};
