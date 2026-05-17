import { useEffect, useRef } from 'react';
import { RegionIllustration } from '@/assets/illustrations/regions';
import { useA11yStore } from '@/stores/a11yStore';
import type { RegionId } from '@/types';

interface Props {
  region: RegionId | 'home';
  tier?: 0 | 1 | 2 | 3;
  /** Fade the bottom of the illustration into the page so content above sits on a clean canvas. */
  fadeBottom?: boolean;
  /** Enable subtle pointer-driven parallax. Disabled when motion is reduced/off or calm is on. */
  parallax?: boolean;
  className?: string;
}

/**
 * Full-bleed positioned wrapper that renders a region's illustration behind page content.
 * Place inside a `position: relative` parent. Decorative-only — hidden in calm mode.
 *
 * Parallax: pointer position drives a tiny X/Y translate on the illustration so it feels
 * like layered paper that subtly shifts when the user looks around the screen.
 */
export function BloomBackground({
  region,
  tier = 3,
  fadeBottom = true,
  parallax = true,
  className = '',
}: Props) {
  const innerRef = useRef<HTMLDivElement>(null);
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const parallaxOn = parallax && motionLevel === 'full' && !calm;

  useEffect(() => {
    if (!parallaxOn) return;
    let frame: number | undefined;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const tx = ((e.clientX - w / 2) / w) * 14; // max ±7px
      const ty = ((e.clientY - h / 2) / h) * 10; // max ±5px
      lastX = tx;
      lastY = ty;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        if (innerRef.current) {
          innerRef.current.style.transform = `translate3d(${lastX.toFixed(1)}px, ${lastY.toFixed(1)}px, 0)`;
        }
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
      if (innerRef.current) innerRef.current.style.transform = '';
    };
  }, [parallaxOn]);

  return (
    <div
      data-decorative
      aria-hidden
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
      style={
        fadeBottom
          ? {
              maskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 70%, transparent 100%)',
            }
          : undefined
      }
    >
      <div
        ref={innerRef}
        style={{
          width: '100%',
          height: '100%',
          willChange: parallaxOn ? 'transform' : undefined,
          transition: parallaxOn ? 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
        }}
      >
        <RegionIllustration region={region} tier={tier} />
      </div>
    </div>
  );
}

export default BloomBackground;
