import type { RegionId } from '@/types';

interface RegionTheme {
  canvas: string;
  ink: string;
  accent: string;
  accent2: string;
  musicSrc: string;
}

const themes: Record<RegionId | 'home', RegionTheme> = {
  home: {
    canvas: '#FDF6E3',
    ink: '#2E3440',
    accent: '#7FB069',
    accent2: '#F4A6C0',
    musicSrc: '/audio/music/home.mp3',
  },
  letterglade: {
    canvas: '#EEF6E2',
    ink: '#2E3823',
    accent: '#7FB069',
    accent2: '#F9D77E',
    musicSrc: '/audio/music/letterglade.mp3',
  },
  numberbrook: {
    canvas: '#E6F1F8',
    ink: '#1F3340',
    accent: '#8DC9E5',
    accent2: '#7FB069',
    musicSrc: '/audio/music/numberbrook.mp3',
  },
  'critter-cove': {
    canvas: '#FFF1E0',
    ink: '#3A2A1A',
    accent: '#F4A6C0',
    accent2: '#8DC9E5',
    musicSrc: '/audio/music/critter-cove.mp3',
  },
  'hue-hills': {
    canvas: '#F6EAF6',
    ink: '#3A2740',
    accent: '#F4A6C0',
    accent2: '#F9D77E',
    musicSrc: '/audio/music/hue-hills.mp3',
  },
  'feelings-meadow': {
    canvas: '#EAF1F4',
    ink: '#27343A',
    accent: '#B8D8E0',
    accent2: '#F4A6C0',
    musicSrc: '/audio/music/feelings-meadow.mp3',
  },
};

export function applyRegionTheme(id: RegionId | 'home'): void {
  const t = themes[id];
  if (!t) return;
  const root = document.documentElement;
  root.style.setProperty('--color-canvas', t.canvas);
  root.style.setProperty('--color-ink', t.ink);
  root.style.setProperty('--color-accent', t.accent);
  root.style.setProperty('--color-accent-2', t.accent2);
  root.dataset.region = id;
}

export function regionMusicSrc(id: RegionId | 'home'): string {
  return themes[id].musicSrc;
}
