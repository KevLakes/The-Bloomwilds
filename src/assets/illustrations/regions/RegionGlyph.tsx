import type { RegionId } from '@/types';

interface Props {
  region: RegionId;
  size?: number;
  className?: string;
}

const INK = '#2E3440';

/**
 * Designed paper-cut SVG glyph for each region, used in MapNode + small contexts.
 * Each glyph uses its own colour palette (independent of region theme) so it's
 * legible regardless of which page theme is active. 3px ink stroke for the
 * shared paper-craft language.
 */
export function RegionGlyph({ region, size = 56, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 64 64',
    role: 'img' as const,
    'aria-hidden': true,
    className,
  };

  switch (region) {
    case 'letterglade':
      return (
        <svg {...common}>
          {/* trunk */}
          <rect x="28" y="38" width="8" height="18" rx="2" fill="#A57A4B" stroke={INK} strokeWidth="2.5" />
          {/* canopy */}
          <circle cx="32" cy="28" r="18" fill="#7FB069" stroke={INK} strokeWidth="2.5" />
          <circle cx="22" cy="30" r="10" fill="#9CC97E" stroke={INK} strokeWidth="2" />
          <circle cx="42" cy="32" r="9" fill="#9CC97E" stroke={INK} strokeWidth="2" />
          {/* tiny leaf sparkle */}
          <circle cx="38" cy="22" r="2" fill="#F9D77E" />
        </svg>
      );
    case 'numberbrook':
      return (
        <svg {...common}>
          {/* water arc */}
          <path d="M4 50 Q 16 44 32 50 T 60 50 L 60 60 L 4 60 Z" fill="#8DC9E5" stroke={INK} strokeWidth="2.5" />
          {/* lily pad */}
          <path d="M40 38 a 14 14 0 1 1 -14 14 L 40 52 Z" fill="#7FB069" stroke={INK} strokeWidth="2.5" />
          {/* frog */}
          <circle cx="22" cy="32" r="10" fill="#7FB069" stroke={INK} strokeWidth="2.5" />
          <circle cx="18" cy="26" r="3" fill="white" stroke={INK} strokeWidth="1.5" />
          <circle cx="26" cy="26" r="3" fill="white" stroke={INK} strokeWidth="1.5" />
          <circle cx="18" cy="26" r="1.2" fill={INK} />
          <circle cx="26" cy="26" r="1.2" fill={INK} />
        </svg>
      );
    case 'critter-cove':
      return (
        <svg {...common}>
          {/* sand/water */}
          <path d="M4 50 Q 16 44 32 50 T 60 50 L 60 60 L 4 60 Z" fill="#8DC9E5" stroke={INK} strokeWidth="2.5" />
          {/* crab body */}
          <ellipse cx="32" cy="38" rx="16" ry="10" fill="#F4906B" stroke={INK} strokeWidth="2.5" />
          {/* eyes */}
          <circle cx="26" cy="34" r="2.5" fill="white" stroke={INK} strokeWidth="1.5" />
          <circle cx="38" cy="34" r="2.5" fill="white" stroke={INK} strokeWidth="1.5" />
          <circle cx="26" cy="34" r="1" fill={INK} />
          <circle cx="38" cy="34" r="1" fill={INK} />
          {/* claws */}
          <path d="M14 38 Q 8 34 12 30 Q 8 28 14 26" stroke={INK} strokeWidth="2.5" fill="#F4906B" />
          <path d="M50 38 Q 56 34 52 30 Q 56 28 50 26" stroke={INK} strokeWidth="2.5" fill="#F4906B" />
        </svg>
      );
    case 'hue-hills':
      return (
        <svg {...common}>
          {/* hill base */}
          <path d="M0 56 Q 20 40 32 48 Q 44 56 64 44 L 64 64 L 0 64 Z" fill="#C9A4D5" stroke={INK} strokeWidth="2.5" />
          {/* rainbow */}
          <path d="M10 46 a 22 22 0 0 1 44 0" fill="none" stroke="#F4906B" strokeWidth="4" strokeLinecap="round" />
          <path d="M16 46 a 16 16 0 0 1 32 0" fill="none" stroke="#F9D77E" strokeWidth="4" strokeLinecap="round" />
          <path d="M22 46 a 10 10 0 0 1 20 0" fill="none" stroke="#7FB069" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'feelings-meadow':
      return (
        <svg {...common}>
          {/* hill */}
          <path d="M0 54 Q 16 48 32 52 Q 48 56 64 50 L 64 64 L 0 64 Z" fill="#B5D5A5" stroke={INK} strokeWidth="2.5" />
          {/* cloud with face */}
          <path
            d="M14 32 c -6 0 -10 -4 -10 -10 s 4 -10 10 -10 c 1 0 3 0.3 4 0.8 c 2 -4 7 -8 13 -8 c 7 0 13 5 14 11 c 1 0 2 -0.1 2 -0.1 c 6 0 10 4 10 10 s -4 10 -10 10 H 14 z"
            transform="translate(0 4)"
            fill="white"
            stroke={INK}
            strokeWidth="2.5"
          />
          <circle cx="24" cy="28" r="2" fill={INK} />
          <circle cx="38" cy="28" r="2" fill={INK} />
          <path d="M24 34 Q 31 39 38 34" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
  }
}

export default RegionGlyph;
