import { describe, it, expect } from 'vitest';
import { resources, supportedLngs } from '@/i18n';

describe('i18n key parity', () => {
  it('every narration key in sv exists in en (and vice versa)', () => {
    const svKeys = Object.keys(resources.sv.narration);
    const enKeys = Object.keys(resources.en.narration);
    expect(new Set(svKeys)).toEqual(new Set(enKeys));
  });

  it('every challenge title in sv exists in en', () => {
    const svKeys = Object.keys(resources.sv.challenges);
    const enKeys = Object.keys(resources.en.challenges);
    expect(new Set(svKeys)).toEqual(new Set(enKeys));
  });

  it('every region name in sv exists in en', () => {
    const svKeys = Object.keys(resources.sv.regions);
    const enKeys = Object.keys(resources.en.regions);
    expect(new Set(svKeys)).toEqual(new Set(enKeys));
  });

  it('supports exactly sv and en for MVP', () => {
    expect([...supportedLngs].sort()).toEqual(['en', 'sv']);
  });
});
