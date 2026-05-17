import type { RegionId } from '@/types';

interface RegionTheme {
  canvas: string;
  canvas2: string;
  ink: string;
  inkSoft: string;
  accent: string;
  accent2: string;
  accent3: string;
  glow: string;
  musicSrc: string;
}

const themes: Record<RegionId | 'home', RegionTheme> = {
  home: {
    canvas: '#FFF8EA',
    canvas2: '#FFFBF0',
    ink: '#2E3440',
    inkSoft: '#4A5666',
    accent: '#7FB069',
    accent2: '#F4A6C0',
    accent3: '#F9D77E',
    glow: '#FFE9A3',
    musicSrc: '/audio/music/home.mp3',
  },
  letterglade: {
    canvas: '#E8F5D6',
    canvas2: '#F2FBE3',
    ink: '#1F3315',
    inkSoft: '#4A6240',
    accent: '#69C04E',
    accent2: '#F9D77E',
    accent3: '#F4A6C0',
    glow: '#D7F4A8',
    musicSrc: '/audio/music/letterglade.mp3',
  },
  numberbrook: {
    canvas: '#DEEDF8',
    canvas2: '#EBF6FC',
    ink: '#152C3A',
    inkSoft: '#3F5B70',
    accent: '#5BB3DC',
    accent2: '#7FB069',
    accent3: '#F9D77E',
    glow: '#B6E1F5',
    musicSrc: '/audio/music/numberbrook.mp3',
  },
  'critter-cove': {
    canvas: '#FFE6CC',
    canvas2: '#FFF0DA',
    ink: '#3A2010',
    inkSoft: '#6A4A30',
    accent: '#F8825B',
    accent2: '#5BB3DC',
    accent3: '#F4A6C0',
    glow: '#FFD2A8',
    musicSrc: '/audio/music/critter-cove.mp3',
  },
  'hue-hills': {
    canvas: '#F2DDF2',
    canvas2: '#F9E9F9',
    ink: '#2E1F38',
    inkSoft: '#5B4566',
    accent: '#B395E8',
    accent2: '#F4A6C0',
    accent3: '#F9D77E',
    glow: '#E8D2F5',
    musicSrc: '/audio/music/hue-hills.mp3',
  },
  'feelings-meadow': {
    canvas: '#DCEAEF',
    canvas2: '#ECF3F6',
    ink: '#1A2C32',
    inkSoft: '#4A5E66',
    accent: '#7BC4D2',
    accent2: '#F4A6C0',
    accent3: '#F9D77E',
    glow: '#BFE0E8',
    musicSrc: '/audio/music/feelings-meadow.mp3',
  },
};

export function applyRegionTheme(id: RegionId | 'home'): void {
  const t = themes[id];
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty('--color-canvas', t.canvas);
  root.style.setProperty('--color-canvas-2', t.canvas2);
  root.style.setProperty('--color-ink', t.ink);
  root.style.setProperty('--color-ink-soft', t.inkSoft);
  root.style.setProperty('--color-accent', t.accent);
  root.style.setProperty('--color-accent-2', t.accent2);
  root.style.setProperty('--color-accent-3', t.accent3);
  root.style.setProperty('--color-glow', t.glow);
  root.dataset.region = id;
}

export function regionMusicSrc(id: RegionId | 'home'): string {
  return themes[id].musicSrc;
}

export function regionPalette(id: RegionId | 'home'): RegionTheme {
  return themes[id];
}
