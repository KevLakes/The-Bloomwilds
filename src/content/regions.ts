import type { RegionId } from '@/types';

export interface RegionMeta {
  id: RegionId;
  /** Position on the overworld map (percent of viewport). */
  pos: { x: number; y: number };
  /** Available in MVP. */
  available: boolean;
  /** Emoji used as the icon when SVG art isn't ready yet. */
  glyph: string;
}

export const regions: RegionMeta[] = [
  { id: 'letterglade', pos: { x: 20, y: 30 }, available: true, glyph: '🌳' },
  { id: 'numberbrook', pos: { x: 60, y: 25 }, available: true, glyph: '🐸' },
  { id: 'critter-cove', pos: { x: 80, y: 55 }, available: true, glyph: '🦀' },
  { id: 'hue-hills', pos: { x: 40, y: 65 }, available: true, glyph: '🌈' },
  { id: 'feelings-meadow', pos: { x: 70, y: 80 }, available: true, glyph: '☁️' },
];

export const regionById = (id: RegionId): RegionMeta | undefined => regions.find((r) => r.id === id);
