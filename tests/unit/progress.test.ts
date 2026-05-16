import { describe, it, expect } from 'vitest';
import { computeTier } from '@/stores/progressStore';

describe('progress.computeTier', () => {
  it('starts at 0', () => {
    expect(computeTier(0)).toBe(0);
  });
  it('reaches tier 1 after 3 challenges', () => {
    expect(computeTier(2)).toBe(0);
    expect(computeTier(3)).toBe(1);
  });
  it('reaches tier 2 after 6 challenges', () => {
    expect(computeTier(5)).toBe(1);
    expect(computeTier(6)).toBe(2);
  });
  it('reaches tier 3 after 9 challenges and caps there', () => {
    expect(computeTier(8)).toBe(2);
    expect(computeTier(9)).toBe(3);
    expect(computeTier(20)).toBe(3);
  });
});
