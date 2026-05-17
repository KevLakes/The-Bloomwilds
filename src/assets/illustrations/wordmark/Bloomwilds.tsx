import type { SVGProps } from 'react';

interface Props extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number | string;
}

/**
 * The Bloomwilds wordmark — playful, slightly hand-drawn, accessible.
 * Letters use currentColor; decorative leaf/flower use theme accents.
 */
export function BloomwildsWordmark({ size = 320, className = '', ...rest }: Props) {
  return (
    <svg
      viewBox="0 0 320 96"
      width={size}
      height={(typeof size === 'number' ? size : 320) * (96 / 320)}
      role="img"
      aria-label="Bloomwilds"
      className={className}
      style={{ maxWidth: '100%', height: 'auto' }}
      {...rest}
    >
      <defs>
        <linearGradient id="bw-word-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--color-ink)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <text
        x="160"
        y="62"
        textAnchor="middle"
        fontFamily="'Fredoka', 'Quicksand', system-ui, sans-serif"
        fontWeight="700"
        fontSize="56"
        fill="url(#bw-word-fill)"
        style={{ paintOrder: 'stroke', stroke: 'var(--color-canvas-2)', strokeWidth: 6, strokeLinejoin: 'round' }}
      >
        Bloomwilds
      </text>
      {/* Decorative leaf left of the B */}
      <g transform="translate(8 38) rotate(-18)">
        <path d="M0 14 C 6 0 18 0 24 6 C 18 16 6 22 0 14 Z" fill="var(--color-accent)" />
        <path d="M2 12 L 20 4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      {/* Decorative flower right of the s */}
      <g transform="translate(296 30)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="0"
            cy="-10"
            rx="6"
            ry="9"
            fill="var(--color-accent-2)"
            transform={`rotate(${deg})`}
          />
        ))}
        <circle cx="0" cy="0" r="4" fill="var(--color-accent-3)" />
      </g>
    </svg>
  );
}

export default BloomwildsWordmark;
