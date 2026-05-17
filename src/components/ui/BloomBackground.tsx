import { RegionIllustration } from '@/assets/illustrations/regions';
import type { RegionId } from '@/types';

interface Props {
  region: RegionId | 'home';
  tier?: 0 | 1 | 2 | 3;
  /** Fade the bottom of the illustration into the page so content above sits on a clean canvas. */
  fadeBottom?: boolean;
  className?: string;
}

/**
 * Full-bleed positioned wrapper that renders a region's illustration behind page content.
 * Place inside a `position: relative` parent. Decorative-only — hidden in calm mode.
 */
export function BloomBackground({ region, tier = 3, fadeBottom = true, className = '' }: Props) {
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
      <RegionIllustration region={region} tier={tier} />
    </div>
  );
}

export default BloomBackground;
