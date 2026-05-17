interface Props {
  id: string;
  size?: number;
  className?: string;
}

const INK = '#2E3440';

/**
 * Designed paper-cut sticker illustrations.
 * Each sticker has its own SVG so the StickerBook never falls back to emoji.
 * 3px ink stroke + saturated fills for the sticker-album feel.
 *
 * Stickers map 1:1 to ids in `src/content/stickers.ts`.
 */
export function StickerArt({ id, size = 64, className }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 80 80',
    role: 'img' as const,
    'aria-hidden': true,
    className,
  };

  switch (id) {
    case 'letterglade-acorn':
      return (
        <svg {...common}>
          <ellipse cx="40" cy="50" rx="18" ry="22" fill="#B07A4F" stroke={INK} strokeWidth="3" />
          <path d="M22 30 Q 40 18 58 30 Q 58 40 40 40 Q 22 40 22 30 Z" fill="#7A4F2E" stroke={INK} strokeWidth="3" />
          <path d="M40 16 L 40 26" stroke={INK} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="34" cy="48" rx="3" ry="5" fill="rgba(255,255,255,0.4)" />
        </svg>
      );
    case 'letterglade-mushroom':
      return (
        <svg {...common}>
          <path d="M14 42 A 26 26 0 0 1 66 42 Z" fill="#D9504F" stroke={INK} strokeWidth="3" />
          <circle cx="28" cy="32" r="4" fill="white" stroke={INK} strokeWidth="2" />
          <circle cx="46" cy="28" r="3" fill="white" stroke={INK} strokeWidth="2" />
          <circle cx="54" cy="36" r="3.5" fill="white" stroke={INK} strokeWidth="2" />
          <rect x="32" y="42" width="16" height="22" rx="3" fill="#F4E8D6" stroke={INK} strokeWidth="3" />
        </svg>
      );
    case 'letterglade-leaf':
      return (
        <svg {...common}>
          <path d="M40 12 C 12 24 8 50 14 68 C 40 60 64 40 68 14 C 60 10 50 10 40 12 Z" fill="#7FB069" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M16 64 L 60 18" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'numberbrook-lily':
      return (
        <svg {...common}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse key={deg} cx="40" cy="22" rx="10" ry="16" fill="#F4A6C0" stroke={INK} strokeWidth="3" transform={`rotate(${deg} 40 40)`} />
          ))}
          <circle cx="40" cy="40" r="8" fill="#F9D77E" stroke={INK} strokeWidth="3" />
        </svg>
      );
    case 'numberbrook-frog':
      return (
        <svg {...common}>
          <circle cx="40" cy="44" r="26" fill="#7FB069" stroke={INK} strokeWidth="3" />
          <circle cx="26" cy="26" r="9" fill="#7FB069" stroke={INK} strokeWidth="3" />
          <circle cx="54" cy="26" r="9" fill="#7FB069" stroke={INK} strokeWidth="3" />
          <circle cx="26" cy="26" r="4" fill="white" stroke={INK} strokeWidth="2" />
          <circle cx="54" cy="26" r="4" fill="white" stroke={INK} strokeWidth="2" />
          <circle cx="26" cy="26" r="2" fill={INK} />
          <circle cx="54" cy="26" r="2" fill={INK} />
          <path d="M28 50 Q 40 60 52 50" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="32" cy="52" r="2.5" fill="#F4A6C0" opacity="0.6" />
          <circle cx="48" cy="52" r="2.5" fill="#F4A6C0" opacity="0.6" />
        </svg>
      );
    case 'numberbrook-pebble':
      return (
        <svg {...common}>
          <ellipse cx="40" cy="44" rx="28" ry="18" fill="#9CA3AF" stroke={INK} strokeWidth="3" />
          <path d="M14 44 Q 28 30 50 32" stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="40" r="2" fill="rgba(0,0,0,0.18)" />
        </svg>
      );
    case 'cove-shell':
      return (
        <svg {...common}>
          <path d="M40 8 C 16 12 8 38 18 60 L 62 60 C 72 38 64 12 40 8 Z" fill="#F4D2B0" stroke={INK} strokeWidth="3" />
          <path d="M40 12 Q 26 28 28 56" stroke={INK} strokeWidth="2.5" fill="none" />
          <path d="M40 12 Q 40 32 36 56" stroke={INK} strokeWidth="2.5" fill="none" />
          <path d="M40 12 Q 54 28 52 56" stroke={INK} strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'cove-butterfly':
      return (
        <svg {...common}>
          <ellipse cx="22" cy="32" rx="14" ry="16" fill="#F4A6C0" stroke={INK} strokeWidth="3" />
          <ellipse cx="58" cy="32" rx="14" ry="16" fill="#F4A6C0" stroke={INK} strokeWidth="3" />
          <ellipse cx="22" cy="52" rx="12" ry="12" fill="#C9A4D5" stroke={INK} strokeWidth="3" />
          <ellipse cx="58" cy="52" rx="12" ry="12" fill="#C9A4D5" stroke={INK} strokeWidth="3" />
          <ellipse cx="40" cy="42" rx="4" ry="20" fill={INK} />
          <circle cx="22" cy="32" r="3" fill="white" />
          <circle cx="58" cy="32" r="3" fill="white" />
        </svg>
      );
    case 'cove-fish':
      return (
        <svg {...common}>
          <path d="M8 40 L 22 24 Q 50 14 64 40 Q 50 66 22 56 Z" fill="#F4906B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M64 40 L 76 26 L 72 40 L 76 54 Z" fill="#F9D77E" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="26" cy="36" r="3.5" fill="white" stroke={INK} strokeWidth="2" />
          <circle cx="26" cy="36" r="1.8" fill={INK} />
          <path d="M32 30 L 56 30 M 32 40 L 56 40 M 32 50 L 56 50" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
        </svg>
      );
    case 'hills-circle':
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="28" fill="#C9A4D5" stroke={INK} strokeWidth="3" />
          <circle cx="32" cy="32" r="6" fill="rgba(255,255,255,0.55)" />
        </svg>
      );
    case 'hills-triangle':
      return (
        <svg {...common}>
          <path d="M40 8 L 70 64 L 10 64 Z" fill="#F4906B" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M34 28 L 46 28" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'hills-rainbow':
      return (
        <svg {...common}>
          <path d="M10 60 a 30 30 0 0 1 60 0" fill="none" stroke="#F4906B" strokeWidth="6" strokeLinecap="round" />
          <path d="M18 60 a 22 22 0 0 1 44 0" fill="none" stroke="#F9D77E" strokeWidth="6" strokeLinecap="round" />
          <path d="M26 60 a 14 14 0 0 1 28 0" fill="none" stroke="#7FB069" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="14" cy="62" rx="6" ry="4" fill="white" stroke={INK} strokeWidth="2" />
          <ellipse cx="66" cy="62" rx="6" ry="4" fill="white" stroke={INK} strokeWidth="2" />
        </svg>
      );
    case 'meadow-smile':
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="28" fill="#F9D77E" stroke={INK} strokeWidth="3" />
          <circle cx="30" cy="36" r="3" fill={INK} />
          <circle cx="50" cy="36" r="3" fill={INK} />
          <path d="M28 48 Q 40 60 52 48" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="46" r="3" fill="#F4A6C0" opacity="0.7" />
          <circle cx="58" cy="46" r="3" fill="#F4A6C0" opacity="0.7" />
        </svg>
      );
    case 'meadow-cloud':
      return (
        <svg {...common}>
          <path
            d="M16 50 c -7 0 -12 -5 -12 -12 s 5 -12 12 -12 c 1 0 3 0.3 4 0.8 c 2 -5 8 -9 14 -9 c 8 0 15 6 16 13 c 1 0 2 -0.1 3 -0.1 c 7 0 12 5 12 12 s -5 12 -12 12 H 16 z"
            fill="white"
            stroke={INK}
            strokeWidth="3"
          />
          <circle cx="28" cy="40" r="2.5" fill={INK} />
          <circle cx="44" cy="40" r="2.5" fill={INK} />
          <path d="M28 46 Q 36 50 44 46" stroke={INK} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'meadow-heart':
      return (
        <svg {...common}>
          <path
            d="M40 64 C 20 50 8 38 8 24 C 8 14 18 8 26 12 C 32 14 36 18 40 24 C 44 18 48 14 54 12 C 62 8 72 14 72 24 C 72 38 60 50 40 64 Z"
            fill="#7FB069"
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse cx="28" cy="28" rx="6" ry="9" fill="rgba(255,255,255,0.4)" transform="rotate(-20 28 28)" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="40" cy="40" r="28" fill="#E5E7EB" stroke={INK} strokeWidth="3" />
          <text x="40" y="48" textAnchor="middle" fontSize="28" fill={INK}>?</text>
        </svg>
      );
  }
}

export default StickerArt;
