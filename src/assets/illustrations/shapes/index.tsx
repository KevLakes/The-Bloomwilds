import type { SVGProps } from 'react';

export interface ShapeProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string;
  tint?: string;
}

/** Soft fluffy cloud — uses currentColor for body, optional tint for shadow. */
export function Cloud({ size = 96, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 120 64"
      width={size}
      height={(typeof size === 'number' ? size : 96) * (64 / 120)}
      fill="none"
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M22 50c-9 0-16-6-16-15s7-15 16-15c2 0 4 .4 6 1 3-7 11-13 21-13 11 0 21 7 23 17 1 0 2-.1 3-.1 9 0 17 7 17 16s-8 15-17 15H22z"
        fill={tint ?? 'currentColor'}
      />
      <path
        d="M26 50c-7 0-12-5-12-12s5-12 12-12c1 0 3 .2 4 .6 2-6 8-10 16-10 8 0 16 5 18 13 1 0 1-.1 2-.1 7 0 13 5 13 12s-6 12-13 12H26z"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  );
}

/** Rolling hill silhouette. */
export function Hill({ size = 200, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 200 80"
      width={size}
      height={(typeof size === 'number' ? size : 200) * (80 / 200)}
      preserveAspectRatio="none"
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M0 80 C 30 30, 60 30, 100 50 S 170 30, 200 80 Z"
        fill={tint ?? 'currentColor'}
      />
    </svg>
  );
}

/** Wavy water/ground line. */
export function Wave({ size = 200, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 200 24"
      width={size}
      height={(typeof size === 'number' ? size : 200) * (24 / 200)}
      preserveAspectRatio="none"
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M0 12 C 20 0, 40 24, 60 12 S 100 0, 120 12 160 24, 180 12 200 0, 200 12 L 200 24 L 0 24 Z"
        fill={tint ?? 'currentColor'}
      />
    </svg>
  );
}

/** Four-pointed sparkle (north-star shape). */
export function Sparkle({ size = 32, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M16 0 L18 14 L32 16 L18 18 L16 32 L14 18 L0 16 L14 14 Z"
        fill={tint ?? 'currentColor'}
      />
    </svg>
  );
}

/** Stylised leaf with center vein. */
export function Leaf({ size = 48, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M24 4 C 8 12, 4 28, 8 44 C 24 40, 40 28, 44 8 C 36 4, 30 4, 24 4 Z"
        fill={tint ?? 'currentColor'}
      />
      <path
        d="M10 42 L 38 12"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Lily pad disc with a notch. */
export function LilyPad({ size = 64, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M32 4 a 28 28 0 1 1 -28 28 L 32 32 Z"
        fill={tint ?? 'currentColor'}
      />
      <circle cx="22" cy="22" r="3" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}

/** Five-pointed star. */
export function Star({ size = 32, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M16 2 L 20 12 L 30 13 L 22 20 L 25 30 L 16 24 L 7 30 L 10 20 L 2 13 L 12 12 Z"
        fill={tint ?? 'currentColor'}
      />
    </svg>
  );
}

/** Soft round bubble with a highlight. */
export function Bubble({ size = 48, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill={tint ?? 'currentColor'} />
      <ellipse cx="17" cy="16" rx="6" ry="4" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

/** Dashed/dotted winding path — used to connect map nodes. */
export function PathLine({
  size = 300,
  tint,
  className = '',
  style,
  dashed = true,
  ...rest
}: ShapeProps & { dashed?: boolean }) {
  return (
    <svg
      viewBox="0 0 300 80"
      width={size}
      height={(typeof size === 'number' ? size : 300) * (80 / 300)}
      preserveAspectRatio="none"
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M0 60 C 50 10, 100 70, 150 40 S 250 10, 300 50"
        stroke={tint ?? 'currentColor'}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={dashed ? '2 12' : undefined}
        fill="none"
      />
    </svg>
  );
}

/** Cute flower with five petals. */
export function Flower({ size = 48, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="24"
          cy="12"
          rx="7"
          ry="10"
          fill={tint ?? 'currentColor'}
          transform={`rotate(${deg} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="5" fill="#F9D77E" />
    </svg>
  );
}

/** Paper-cut square with thick ink stroke — used as a designed alternative to ⬛ emoji. */
export function Square({ size = 56, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <rect
        x="6"
        y="6"
        width="44"
        height="44"
        rx="6"
        fill={tint ?? 'currentColor'}
        stroke="#2E3440"
        strokeWidth="3"
      />
    </svg>
  );
}

/** Paper-cut triangle with thick ink stroke — used as a designed alternative to 🔺 emoji. */
export function Triangle({ size = 56, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M28 6 L 50 48 L 6 48 Z"
        fill={tint ?? 'currentColor'}
        stroke="#2E3440"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Paper-cut circle with thick ink stroke — used as a designed alternative to ⚪ emoji. */
export function Circle({ size = 56, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <circle
        cx="28"
        cy="28"
        r="21"
        fill={tint ?? 'currentColor'}
        stroke="#2E3440"
        strokeWidth="3"
      />
    </svg>
  );
}

/** Rounded mushroom/dome — used as decorative trees/bushes. */
export function Mushroom({ size = 56, tint, className = '', style, ...rest }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role="img"
      aria-hidden
      className={className}
      style={style}
      {...rest}
    >
      <path d="M8 32 A 20 20 0 0 1 48 32 Z" fill={tint ?? 'currentColor'} />
      <rect x="22" y="32" width="12" height="18" rx="4" fill="#F4E8D6" />
      <circle cx="20" cy="24" r="3" fill="rgba(255,255,255,0.55)" />
      <circle cx="34" cy="20" r="2.4" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}
