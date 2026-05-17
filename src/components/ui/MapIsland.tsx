import { motion } from 'framer-motion';
import { TapTarget } from './TapTarget';
import { RegionGlyph } from '@/assets/illustrations/regions/RegionGlyph';
import { Sparkle } from '@/assets/illustrations/shapes';
import { useA11yStore } from '@/stores/a11yStore';
import type { RegionId } from '@/types';

interface Props {
  regionId: RegionId;
  label: string;
  /** 0 = locked (asleep, greyscale + ZZZ icon), 1 = available, 2 = blooming, 3 = bloomed */
  state: 0 | 1 | 2 | 3;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  subLabel?: string;
  /** When true this island scales up and others fade — used for the zoom-in transition. */
  zooming?: boolean;
  /** When non-null, *another* island is zooming in — this one fades out. */
  someoneElseZooming?: boolean;
}

const INK = '#2E3440';

/**
 * A region "island" on the overworld. Renders the designed RegionGlyph on a
 * paper-cut island base, with state-driven glow, sleeping-Z for locked,
 * sparkles for bloomed, and a zoom-in animation on tap.
 *
 * Sits inside an absolutely-positioned parent at the region's world coordinates;
 * its own transform-origin = center so the zoom scales out from the island.
 */
export function MapIsland({
  regionId,
  label,
  state,
  onClick,
  disabled,
  ariaLabel,
  subLabel,
  zooming = false,
  someoneElseZooming = false,
}: Props) {
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const animated = motionLevel !== 'off' && !calm;

  const locked = state === 0 || disabled;
  const bloomed = state === 3;
  const inProgress = state === 2;
  const accent = bloomed
    ? 'var(--color-accent)'
    : inProgress
      ? 'var(--color-accent-3)'
      : locked
        ? 'rgba(46,52,64,0.35)'
        : 'var(--color-accent-2)';

  return (
    <motion.div
      style={{ transformOrigin: 'center' }}
      initial={false}
      animate={
        zooming
          ? { scale: animated ? 2.6 : 1, opacity: 1 }
          : someoneElseZooming
            ? { scale: 0.85, opacity: 0 }
            : { scale: 1, opacity: 1 }
      }
      transition={{ duration: animated ? 0.55 : 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <TapTarget
        onClick={onClick}
        disabled={disabled || state === 0}
        aria-label={ariaLabel ?? label}
        className="group relative -translate-x-1/2 -translate-y-1/2 select-none"
      >
        {/* Glow ring */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: accent }}
          animate={
            animated && (bloomed || inProgress)
              ? { opacity: [0.4, 0.75, 0.4], scale: [1, 1.08, 1] }
              : { opacity: locked ? 0 : 0.35, scale: 1 }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Paper island base (oval beneath glyph) */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[78%] block h-5 w-[88%] -translate-x-1/2 rounded-full"
          style={{
            background: 'rgba(46,52,64,0.18)',
            filter: 'blur(6px)',
          }}
        />

        {/* The island itself: round paper card with glyph */}
        <span
          className={`relative flex flex-col items-center justify-center gap-0.5 rounded-full border-[3px] bg-white px-2 py-2 transition group-hover:-translate-y-0.5 ${
            locked ? 'grayscale' : ''
          }`}
          style={{
            borderColor: locked ? 'rgba(46,52,64,0.25)' : INK,
            boxShadow: locked
              ? 'none'
              : `5px 6px 0 0 ${accent}, 0 14px 30px -14px rgba(46,52,64,0.5)`,
            width: 'clamp(6rem, 14vw, 9.5rem)',
            height: 'clamp(6rem, 14vw, 9.5rem)',
          }}
        >
          <RegionGlyph region={regionId} size={56} className="drop-shadow-sm" />
          <span
            className="px-1 text-center font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(0.7rem, 1.4vw, 0.95rem)', color: INK }}
          >
            {label}
          </span>
          {subLabel && (
            <span
              className="text-center uppercase tracking-wide"
              style={{ fontSize: 'clamp(0.5rem, 1vw, 0.65rem)', color: 'rgba(46,52,64,0.55)' }}
            >
              {subLabel}
            </span>
          )}
        </span>

        {/* Sleeping Z for locked / asleep regions */}
        {locked && (
          <span
            aria-hidden
            className="absolute right-1 top-1 font-display text-xl font-bold"
            style={{ color: 'rgba(46,52,64,0.55)' }}
          >
            Zz
          </span>
        )}

        {/* Sparkles for bloomed regions */}
        {bloomed && animated && (
          <>
            <motion.span
              aria-hidden
              className="absolute -right-2 -top-2"
              style={{ color: 'var(--color-accent-3)' }}
              animate={{ scale: [0.8, 1.15, 0.8], rotate: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkle size={22} />
            </motion.span>
            <motion.span
              aria-hidden
              className="absolute -left-3 top-3"
              style={{ color: 'var(--color-accent-2)' }}
              animate={{ scale: [0.6, 1, 0.6], rotate: [12, 0, 12] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
              <Sparkle size={14} />
            </motion.span>
          </>
        )}

        {/* Pulse dot for the next available (state===1) region — visual "go here" cue */}
        {state === 1 && animated && (
          <motion.span
            aria-hidden
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full"
            style={{ background: 'var(--color-accent-2)', border: `2px solid ${INK}` }}
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </TapTarget>
    </motion.div>
  );
}

export default MapIsland;
