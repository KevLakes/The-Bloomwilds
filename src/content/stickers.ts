import type { RegionId } from '@/types';

export interface StickerMeta {
  id: string;
  regionId: RegionId;
  glyph: string;
  nameKey: string;
}

export const stickers: StickerMeta[] = [
  { id: 'letterglade-acorn', regionId: 'letterglade', glyph: '🌰', nameKey: 'letterglade-acorn' },
  { id: 'letterglade-mushroom', regionId: 'letterglade', glyph: '🍄', nameKey: 'letterglade-mushroom' },
  { id: 'letterglade-leaf', regionId: 'letterglade', glyph: '🍃', nameKey: 'letterglade-leaf' },
  { id: 'numberbrook-lily', regionId: 'numberbrook', glyph: '🌸', nameKey: 'numberbrook-lily' },
  { id: 'numberbrook-frog', regionId: 'numberbrook', glyph: '🐸', nameKey: 'numberbrook-frog' },
  { id: 'numberbrook-pebble', regionId: 'numberbrook', glyph: '🪨', nameKey: 'numberbrook-pebble' },
  { id: 'cove-shell', regionId: 'critter-cove', glyph: '🐚', nameKey: 'cove-shell' },
  { id: 'cove-butterfly', regionId: 'critter-cove', glyph: '🦋', nameKey: 'cove-butterfly' },
  { id: 'cove-fish', regionId: 'critter-cove', glyph: '🐠', nameKey: 'cove-fish' },
  { id: 'hills-circle', regionId: 'hue-hills', glyph: '⚪', nameKey: 'hills-circle' },
  { id: 'hills-triangle', regionId: 'hue-hills', glyph: '🔺', nameKey: 'hills-triangle' },
  { id: 'hills-rainbow', regionId: 'hue-hills', glyph: '🌈', nameKey: 'hills-rainbow' },
  { id: 'meadow-smile', regionId: 'feelings-meadow', glyph: '😊', nameKey: 'meadow-smile' },
  { id: 'meadow-cloud', regionId: 'feelings-meadow', glyph: '☁️', nameKey: 'meadow-cloud' },
  { id: 'meadow-heart', regionId: 'feelings-meadow', glyph: '💚', nameKey: 'meadow-heart' },
];

export const stickerById = (id: string): StickerMeta | undefined => stickers.find((s) => s.id === id);
