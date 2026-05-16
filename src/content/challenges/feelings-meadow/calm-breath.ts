import type { ChallengeDef } from '@/engine/challenge/types';

/**
 * Bespoke breathing component planned for M4.
 * MVP placeholder: a gentle Pick — "pick what helps when you feel big feelings."
 * Every option here is "correct" (kid-led), so they always succeed.
 */
export const calmBreath: ChallengeDef = {
  id: 'feelings-meadow.calm-breath',
  regionId: 'feelings-meadow',
  titleKey: 'calm-breath.title',
  narrationKey: 'challengeIntro.calm-breath',
  estSeconds: 60,
  tags: ['social'],
  seedsAwarded: 2,
  stickerOnFirstClear: 'meadow-cloud',
  spec: {
    sv: {
      kind: 'pick',
      prompt: 'Vad gör dig lugn? Välj en sak.',
      options: [
        { id: 'breath', label: '🌬️ Djupa andetag', isCorrect: true },
        { id: 'hug', label: '🤗 En kram', isCorrect: true },
        { id: 'water', label: '💧 Lite vatten', isCorrect: true },
      ],
      pickCount: 1,
    },
    en: {
      kind: 'pick',
      prompt: 'What helps you feel calm? Pick one.',
      options: [
        { id: 'breath', label: '🌬️ Deep breaths', isCorrect: true },
        { id: 'hug', label: '🤗 A hug', isCorrect: true },
        { id: 'water', label: '💧 Some water', isCorrect: true },
      ],
      pickCount: 1,
    },
  },
};
