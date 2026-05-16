import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { OrderSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';

interface Props {
  spec: OrderSpec;
  ctx: ChallengeContext;
  onComplete: (r: ChallengeResult) => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function OrderGame({ spec, ctx, onComplete }: Props) {
  const sorted = useMemo(() => [...spec.items].sort((a, b) => a.rank - b.rank), [spec.items]);
  const [pool, setPool] = useState(() => shuffle(spec.items));
  const [placed, setPlaced] = useState<typeof spec.items>([]);
  const [attempts, setAttempts] = useState(0);
  const [wrongShake, setWrongShake] = useState(false);

  const handlePick = async (id: string) => {
    const item = pool.find((i) => i.id === id);
    if (!item) return;
    const expected = sorted[placed.length];
    setAttempts((a) => a + 1);
    if (expected && item.id === expected.id) {
      const nextPlaced = [...placed, item];
      const nextPool = pool.filter((p) => p.id !== id);
      setPlaced(nextPlaced);
      setPool(nextPool);
      ctx.sfx('sparkle');
      if (nextPlaced.length >= sorted.length) {
        ctx.sfx('success');
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 = attempts < sorted.length + 1 ? 3 : attempts < sorted.length + 3 ? 2 : 1;
        onComplete({ success: true, stars, attempts: attempts + 1 });
      }
    } else {
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      setWrongShake(true);
      window.setTimeout(() => setWrongShake(false), 500);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-2xl font-display" lang={ctx.lang}>
        {spec.prompt}
      </p>

      {/* Placed sequence */}
      <motion.div
        animate={wrongShake ? { x: [0, -6, 6, -3, 3, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="flex flex-wrap items-center justify-center gap-2 rounded-bloom border-2 border-dashed border-leaf/50 bg-white/50 p-4"
        style={{ minHeight: 120, minWidth: '60%' }}
      >
        {placed.map((p, i) => (
          <div
            key={p.id}
            className="flex flex-col items-center rounded-bloom bg-leaf/20 px-4 py-2 font-display"
          >
            <span className="text-xs text-ink/60">{i + 1}</span>
            <span className="text-xl font-bold">{p.label}</span>
          </div>
        ))}
        {placed.length === 0 && <span className="text-ink/50">—</span>}
      </motion.div>

      {/* Pool */}
      <div className="flex flex-wrap justify-center gap-3">
        {pool.map((p) => (
          <TapTarget
            key={p.id}
            onClick={() => handlePick(p.id)}
            aria-label={p.label}
            className="rounded-bloom bg-white px-5 py-4 text-2xl font-display font-bold shadow-bloom"
          >
            {p.label}
          </TapTarget>
        ))}
      </div>
    </div>
  );
}
