import { Cloud, Hill, Wave, Sparkle, Leaf, LilyPad, Star, Flower, Mushroom } from '../shapes';
import type { RegionId } from '@/types';

interface RegionIllustrationProps {
  region: RegionId | 'home';
  /** 0 = asleep, 1 = awakening, 2 = blooming, 3 = bloomed */
  tier?: 0 | 1 | 2 | 3;
  className?: string;
}

/**
 * Full-bleed SVG scene for a region. Uses viewBox 0 0 400 200, preserveAspectRatio="none"
 * so it stretches to fill any container. Tier 0 = monochrome silhouette; each tier adds
 * colour, creatures, and sparkles. Designed to sit *behind* content as a backdrop.
 */
export function RegionIllustration({ region, tier = 3, className = '' }: RegionIllustrationProps) {
  const asleep = tier === 0;
  const scene = SCENES[region];

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden
      className={className}
      style={{
        width: '100%',
        height: '100%',
        filter: asleep ? 'grayscale(0.85)' : 'none',
        transition: 'filter 800ms ease',
      }}
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id={`sky-${region}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-canvas-2)" />
          <stop offset="100%" stopColor="var(--color-canvas)" />
        </linearGradient>
        <radialGradient id={`glow-${region}`} cx="0.2" cy="0.1" r="0.6">
          <stop offset="0%" stopColor="var(--color-glow)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--color-glow)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#sky-${region})`} />
      <rect width="400" height="200" fill={`url(#glow-${region})`} />
      {/* Paper-edge filter applied to the whole scene group — every shape inside
          gets the same gentle wobble, which is cheaper than per-shape filtering. */}
      <g filter="url(#bw-paper-edge)">{scene(tier)}</g>
    </svg>
  );
}

type Scene = (tier: 0 | 1 | 2 | 3) => React.ReactElement;

const SCENES: Record<RegionId | 'home', Scene> = {
  home: (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-2)', opacity: 0.4 }}>
        <Cloud size={120} x={30} y={20} />
        <Cloud size={90} x={260} y={36} />
      </g>
      <g transform="translate(0 130)" style={{ color: 'var(--color-accent)' }}>
        <Hill size={400} />
      </g>
      {tier >= 1 && (
        <g transform="translate(60 150)" style={{ color: 'var(--color-accent-2)' }}>
          <Flower size={28} />
          <g transform="translate(220 0)">
            <Flower size={24} />
          </g>
        </g>
      )}
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Sparkle size={20} x={310} y={60} className="animate-sparkle" />
          <Sparkle size={14} x={70} y={50} className="animate-sparkle" />
        </g>
      )}
    </>
  ),

  letterglade: (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-3)', opacity: 0.45 }}>
        <Cloud size={110} x={20} y={18} />
        <Cloud size={80} x={280} y={30} />
      </g>
      <g transform="translate(0 110)" style={{ color: 'var(--color-accent)', opacity: 0.55 }}>
        <Hill size={400} />
      </g>
      <g transform="translate(0 140)" style={{ color: 'var(--color-accent)' }}>
        <Hill size={400} />
      </g>
      {tier >= 1 && (
        <g style={{ color: 'var(--color-accent)' }}>
          <Mushroom size={70} x={50} y={120} />
          <Mushroom size={56} x={300} y={130} />
        </g>
      )}
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-2)' }}>
          <Leaf size={28} x={130} y={138} />
          <Leaf size={22} x={260} y={144} />
        </g>
      )}
      {tier >= 3 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Sparkle size={18} x={90} y={60} className="animate-sparkle" />
          <Sparkle size={14} x={330} y={80} className="animate-sparkle" />
          <Star size={22} x={200} y={40} className="animate-soft-pulse" />
        </g>
      )}
    </>
  ),

  numberbrook: (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-3)', opacity: 0.4 }}>
        <Cloud size={100} x={40} y={20} />
        <Cloud size={70} x={300} y={36} />
      </g>
      <g transform="translate(0 140)" style={{ color: 'var(--color-accent)', opacity: 0.5 }}>
        <Wave size={400} />
      </g>
      <g transform="translate(0 160)" style={{ color: 'var(--color-accent)' }}>
        <Wave size={400} />
      </g>
      {tier >= 1 && (
        <g style={{ color: 'var(--color-accent-2)' }}>
          <LilyPad size={50} x={60} y={150} />
          <LilyPad size={40} x={180} y={160} />
          <LilyPad size={56} x={300} y={150} />
        </g>
      )}
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Flower size={22} x={70} y={142} />
          <Flower size={18} x={310} y={140} />
        </g>
      )}
      {tier >= 3 && (
        <g style={{ color: 'var(--color-accent-2)' }}>
          <Sparkle size={18} x={120} y={70} className="animate-sparkle" />
          <Sparkle size={14} x={260} y={50} className="animate-sparkle" />
        </g>
      )}
    </>
  ),

  'critter-cove': (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-3)', opacity: 0.45 }}>
        <Cloud size={110} x={30} y={20} />
        <Cloud size={80} x={280} y={28} />
      </g>
      <g transform="translate(0 120)" style={{ color: 'var(--color-accent)', opacity: 0.5 }}>
        <Hill size={400} />
      </g>
      <g transform="translate(0 150)" style={{ color: 'var(--color-accent-2)' }}>
        <Wave size={400} />
      </g>
      {tier >= 1 && (
        <g style={{ color: 'var(--color-accent)' }}>
          <Bubble50 x={60} y={150} />
          <Bubble40 x={320} y={160} />
        </g>
      )}
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Star size={20} x={200} y={140} />
        </g>
      )}
      {tier >= 3 && (
        <g style={{ color: 'var(--color-accent-2)' }}>
          <Sparkle size={18} x={120} y={70} className="animate-sparkle" />
          <Sparkle size={14} x={290} y={55} className="animate-sparkle" />
        </g>
      )}
    </>
  ),

  'hue-hills': (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-3)', opacity: 0.45 }}>
        <Cloud size={110} x={20} y={20} />
        <Cloud size={80} x={290} y={34} />
      </g>
      <g transform="translate(0 90)" style={{ color: 'var(--color-accent-3)', opacity: 0.55 }}>
        <Hill size={400} />
      </g>
      <g transform="translate(0 120)" style={{ color: 'var(--color-accent-2)', opacity: 0.7 }}>
        <Hill size={400} />
      </g>
      <g transform="translate(0 150)" style={{ color: 'var(--color-accent)' }}>
        <Hill size={400} />
      </g>
      {tier >= 1 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Flower size={28} x={60} y={150} />
          <Flower size={22} x={260} y={158} />
        </g>
      )}
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-2)' }}>
          <Star size={22} x={200} y={50} />
        </g>
      )}
      {tier >= 3 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Sparkle size={20} x={100} y={70} className="animate-sparkle" />
          <Sparkle size={14} x={310} y={60} className="animate-sparkle" />
        </g>
      )}
    </>
  ),

  'feelings-meadow': (tier) => (
    <>
      <g style={{ color: 'var(--color-accent-2)', opacity: 0.5 }}>
        <Cloud size={120} x={20} y={20} />
        <Cloud size={90} x={250} y={32} />
        {tier >= 1 && <Cloud size={70} x={150} y={50} />}
      </g>
      <g transform="translate(0 140)" style={{ color: 'var(--color-accent)', opacity: 0.55 }}>
        <Hill size={400} />
      </g>
      <g transform="translate(0 160)" style={{ color: 'var(--color-accent)' }}>
        <Hill size={400} />
      </g>
      {tier >= 2 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Flower size={26} x={70} y={160} />
          <Flower size={20} x={300} y={170} />
        </g>
      )}
      {tier >= 3 && (
        <g style={{ color: 'var(--color-accent-3)' }}>
          <Sparkle size={18} x={130} y={70} className="animate-sparkle" />
          <Sparkle size={14} x={280} y={50} className="animate-sparkle" />
        </g>
      )}
    </>
  ),
};

/* Inline bubble helpers used inside critter-cove scene (positioned via x/y attrs on outer <g>) */
function Bubble50({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="25" cy="25" r="22" fill="currentColor" opacity="0.7" />
      <ellipse cx="18" cy="17" rx="6" ry="4" fill="rgba(255,255,255,0.55)" />
    </g>
  );
}
function Bubble40({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.7" />
      <ellipse cx="15" cy="14" rx="5" ry="3" fill="rgba(255,255,255,0.55)" />
    </g>
  );
}

export default RegionIllustration;
