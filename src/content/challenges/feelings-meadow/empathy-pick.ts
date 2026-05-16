import type { ChallengeDef } from '@/engine/challenge/types';

export const empathyPick: ChallengeDef = {
  id: 'feelings-meadow.empathy-pick',
  regionId: 'feelings-meadow',
  titleKey: 'empathy-pick.title',
  narrationKey: 'challengeIntro.empathy-pick',
  estSeconds: 90,
  tags: ['social'],
  seedsAwarded: 3,
  stickerOnFirstClear: 'meadow-heart',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Ett moln är ledset. Vad gör en snäll vän?',
      options: [
        { id: 'ask', label: '💬 Frågar vad som hänt', isCorrect: true },
        { id: 'leave', label: '🚶 Går iväg', isCorrect: false },
        { id: 'laugh', label: '😆 Skrattar', isCorrect: false },
        { id: 'hug', label: '🤗 Frågar om en kram', isCorrect: true },
      ],
      pickCount: 2,
    },
    en: {
      kind: 'pick',
      prompt: 'A cloud is sad. What would a kind friend do?',
      options: [
        { id: 'ask', label: '💬 Ask what happened', isCorrect: true },
        { id: 'leave', label: '🚶 Walk away', isCorrect: false },
        { id: 'laugh', label: '😆 Laugh', isCorrect: false },
        { id: 'hug', label: '🤗 Offer a hug', isCorrect: true },
      ],
      pickCount: 2,
    },
  },
};
