import type { HTMLAttributes, ReactNode } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Apply the jagged paper-cut edge filter. Skip on screens with many small paper layers (perf). */
  edge?: boolean;
  /** Apply the subtle paper grain noise overlay. */
  grain?: boolean;
  /** Tiny rotation (degrees) for a hand-placed feel. */
  tilt?: number;
  /** Show 4 corner glue dots. */
  glue?: boolean;
  /** Shadow depth — "sm" 2px, "md" 4px, "lg" 8px offset. */
  depth?: 'sm' | 'md' | 'lg' | 'none';
}

const DEPTH: Record<NonNullable<Props['depth']>, { x: string; y: string }> = {
  none: { x: '0', y: '0' },
  sm: { x: '2px', y: '3px' },
  md: { x: '4px', y: '5px' },
  lg: { x: '6px', y: '8px' },
};

/**
 * The workhorse paper card. Wraps children with two-layer depth, optional
 * jagged edge, optional grain, optional tilt, optional glue dots. Use this
 * for any surface that should feel hand-cut: profile cards, settings sections,
 * stickers, etc.
 */
export function PaperLayer({
  children,
  edge = false,
  grain = true,
  tilt = 0,
  glue = false,
  depth = 'md',
  className = '',
  style,
  ...rest
}: Props) {
  const d = DEPTH[depth];
  const classes = [
    'bw-card',
    grain ? 'bw-paper-grain' : '',
    glue ? 'bw-glue-dots' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={classes}
      style={{
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        boxShadow:
          depth === 'none'
            ? 'none'
            : `${d.x} ${d.y} 0 0 color-mix(in srgb, var(--color-ink) 22%, transparent), 0 14px 28px -16px color-mix(in srgb, var(--color-ink) 30%, transparent)`,
        filter: edge ? 'url(#bw-paper-edge)' : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export default PaperLayer;
