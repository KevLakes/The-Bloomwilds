import type { RegionId } from '@/types';

export interface RegionMeta {
  id: RegionId;
  /** Position on the overworld world (percent — anchor centers the island). */
  pos: { x: number; y: number };
  /** Available in MVP. */
  available: boolean;
  /** Emoji fallback (designed glyphs live in `src/assets/illustrations/regions/RegionGlyph.tsx`). */
  glyph: string;
}

export const regions: RegionMeta[] = [
  // Spread the islands across the WorldMap so each sits in a thematically-matching zone:
  // letterglade in the forest-left, numberbrook by the central hills, hue-hills in the
  // colourful foreground meadow, critter-cove on the lake/coast right, feelings-meadow
  // higher up in the cloud territory.
  { id: 'letterglade', pos: { x: 16, y: 56 }, available: true, glyph: '🌳' },
  { id: 'numberbrook', pos: { x: 42, y: 42 }, available: true, glyph: '🐸' },
  { id: 'hue-hills', pos: { x: 32, y: 74 }, available: true, glyph: '🌈' },
  { id: 'critter-cove', pos: { x: 80, y: 64 }, available: true, glyph: '🦀' },
  { id: 'feelings-meadow', pos: { x: 70, y: 28 }, available: true, glyph: '☁️' },
];

export const regionById = (id: RegionId): RegionMeta | undefined => regions.find((r) => r.id === id);
