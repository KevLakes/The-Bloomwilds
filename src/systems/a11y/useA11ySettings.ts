import { useEffect } from 'react';
import { useA11yStore } from '@/stores/a11yStore';
import type { A11ySettings } from '@/types';

const FONT_SCALES = { normal: 1, big: 1.4 } as const;

function applySettings(a: A11ySettings): void {
  const root = document.documentElement;

  root.style.setProperty(
    '--font-family',
    a.fontFamily === 'dyslexic'
      ? '"OpenDyslexic", "Atkinson Hyperlegible", system-ui, sans-serif'
      : 'system-ui, "Quicksand", sans-serif',
  );
  root.style.setProperty('--font-scale', String(a.bigText ? FONT_SCALES.big : FONT_SCALES.normal));
  root.style.setProperty('--line-height', a.bigText ? '1.6' : '1.4');

  const motionScale = a.motion === 'off' ? 0 : a.motion === 'reduced' ? 0.5 : 1;
  root.style.setProperty('--motion-scale', String(motionScale));

  root.dataset.contrast = a.contrast;
  root.dataset.calm = a.calm ? 'on' : 'off';
  root.dataset.captions = a.captions ? 'on' : 'off';
  root.dataset.dwell = String(a.dwellMs);
  root.dataset.oneSwitch = a.oneSwitch ? 'on' : 'off';

  if (a.motion === 'off') {
    root.style.setProperty('--motion-duration-ms', '0ms');
  } else if (a.motion === 'reduced') {
    root.style.setProperty('--motion-duration-ms', '600ms');
  } else {
    root.style.setProperty('--motion-duration-ms', '300ms');
  }
}

/**
 * Mount once near the root. Reads a11y settings and bridges them to CSS variables on <html>.
 */
export function useA11yCssBridge(): void {
  const a = useA11yStore((s) => s.settings);
  useEffect(() => {
    applySettings(a);
  }, [a]);
}

export function useMotionScale(): number {
  const motion = useA11yStore((s) => s.settings.motion);
  return motion === 'off' ? 0 : motion === 'reduced' ? 0.5 : 1;
}
