import { describe, it, expect, beforeEach } from 'vitest';
import {
  getChallenge,
  listChallenges,
  listForRegion,
  register,
  unregister,
} from '@/engine/challenge/registry';
import type { ChallengeDef } from '@/engine/challenge/types';

describe('challenge registry', () => {
  it('exposes the three Letterglade challenges', () => {
    const lg = listForRegion('letterglade').map((c) => c.id);
    expect(lg).toContain('letterglade.letter-match');
    expect(lg).toContain('letterglade.word-build');
    expect(lg).toContain('letterglade.phonics-pop');
  });

  it('every MVP challenge has a sv AND en spec', () => {
    for (const c of listChallenges()) {
      if (!c.component) {
        expect(c.spec?.sv, `${c.id} missing sv spec`).toBeDefined();
        expect(c.spec?.en, `${c.id} missing en spec`).toBeDefined();
      }
    }
  });

  it('allows dynamic registration (Phase-2 seam)', () => {
    const def: ChallengeDef = {
      id: 'test.dynamic',
      regionId: 'letterglade',
      titleKey: 't',
      narrationKey: 'n',
      estSeconds: 30,
      tags: ['reading'],
      spec: {
        sv: { kind: 'pick', prompt: 'x', options: [] },
        en: { kind: 'pick', prompt: 'x', options: [] },
      },
    };
    register(def);
    expect(getChallenge('test.dynamic')).toBeDefined();
    unregister('test.dynamic');
    expect(getChallenge('test.dynamic')).toBeUndefined();
  });

  beforeEach(() => {
    unregister('test.dynamic');
  });
});
