import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useA11yStore } from '@/stores/a11yStore';
import { Sparkle, Star, Leaf, Flower } from '@/assets/illustrations/shapes';

interface Props {
  /** Number of pieces. Calm/reduced motion will scale this down internally. */
  count?: number;
  /** ms before this auto-unmounts. */
  durationMs?: number;
  className?: string;
}

const SHAPES = [Sparkle, Star, Leaf, Flower];
const TINTS = [
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
  'var(--color-glow)',
];

/**
 * Celebration burst for challenge completion. Respects motion settings:
 *   - off    → renders nothing
 *   - reduced → small static spray that fades in/out
 *   - full    → animated drift downward + rotation
 */
export function Confetti({ count = 18, durationMs = 2200, className = '' }: Props) {
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(id);
  }, [durationMs]);

  const pieces = useMemo(() => {
    const n = motionLevel === 'reduced' || calm ? Math.min(8, count) : count;
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      Shape: SHAPES[i % SHAPES.length],
      tint: TINTS[i % TINTS.length],
      x: Math.random() * 100,
      delay: Math.random() * 0.4,
      rotate: Math.random() * 360 - 180,
      size: 16 + Math.random() * 18,
    }));
  }, [count, motionLevel, calm]);

  if (motionLevel === 'off' || !visible) return null;

  const isAnimated = motionLevel === 'full' && !calm;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: '-10%', color: p.tint }}
          initial={{ y: 0, opacity: 0, rotate: 0 }}
          animate={
            isAnimated
              ? { y: '110vh', opacity: [0, 1, 1, 0], rotate: p.rotate }
              : { y: '20vh', opacity: [0, 1, 0], rotate: p.rotate / 4 }
          }
          transition={{
            duration: isAnimated ? 2 : 1.4,
            delay: p.delay,
            ease: 'easeOut',
          }}
        >
          <p.Shape size={p.size} />
        </motion.span>
      ))}
    </div>
  );
}

export default Confetti;
