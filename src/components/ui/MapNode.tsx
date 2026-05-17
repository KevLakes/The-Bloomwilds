import { TapTarget } from './TapTarget';
import { Sparkle } from '@/assets/illustrations/shapes';

interface Props {
  label: string;
  /** Visual glyph or emoji shown on the node. */
  glyph?: React.ReactNode;
  /** 0 = locked (greyscale), 1 = available, 2 = in progress, 3 = completed (glow + sparkle). */
  state: 0 | 1 | 2 | 3;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  subLabel?: string;
  className?: string;
}

/**
 * A clickable island/node on the overworld map (and challenge dots inside a region).
 * Self-sizing via clamp(); centers on its parent's positioned coordinates via -translate-1/2.
 */
export function MapNode({
  label,
  glyph,
  state,
  onClick,
  disabled,
  ariaLabel,
  subLabel,
  className = '',
}: Props) {
  const locked = state === 0 || disabled;
  const completed = state === 3;
  const inProgress = state === 2;

  const ringColor = completed
    ? 'var(--color-accent)'
    : inProgress
      ? 'var(--color-accent-3)'
      : locked
        ? 'var(--color-ink-soft)'
        : 'var(--color-accent-2)';

  return (
    <TapTarget
      onClick={onClick}
      disabled={disabled || state === 0}
      aria-label={ariaLabel ?? label}
      className={`group relative -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      {/* Glow ring */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full blur-md transition-opacity ${
          completed ? 'opacity-70 animate-soft-pulse' : inProgress ? 'opacity-40' : 'opacity-0'
        }`}
        style={{ background: ringColor }}
      />

      {/* The node body */}
      <span
        className={`relative flex h-[clamp(4.5rem,11vw,7.5rem)] w-[clamp(4.5rem,11vw,7.5rem)] flex-col items-center justify-center gap-0.5 rounded-full border-[3px] font-display font-bold transition ${
          locked
            ? 'border-ink-soft/40 bg-white/60 text-ink-soft grayscale'
            : 'bg-white text-ink shadow-bloom'
        } ${completed ? 'group-hover:scale-105' : ''}`}
        style={{
          borderColor: locked ? undefined : ringColor,
          boxShadow: completed
            ? `0 6px 0 0 ${ringColor}`
            : inProgress
              ? `0 5px 0 0 ${ringColor}`
              : undefined,
        }}
      >
        {glyph && (
          <span aria-hidden className="text-2xl sm:text-3xl">
            {glyph}
          </span>
        )}
        <span className="px-1 text-center text-[10px] leading-tight sm:text-xs">{label}</span>
        {subLabel && (
          <span className="text-[8px] uppercase tracking-wide text-ink-soft sm:text-[9px]">
            {subLabel}
          </span>
        )}
      </span>

      {/* Sparkle for completed */}
      {completed && (
        <span
          aria-hidden
          className="absolute -right-2 -top-2 animate-sparkle"
          style={{ color: 'var(--color-accent-3)' }}
        >
          <Sparkle size={20} />
        </span>
      )}
    </TapTarget>
  );
}

export default MapNode;
