import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { OrderSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';
import { Confetti } from '@/components/ui/Confetti';
import { Sparkle } from '@/assets/illustrations/shapes';

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
  const [celebrate, setCelebrate] = useState(false);

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
        setCelebrate(true);
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 = attempts < sorted.length + 1 ? 3 : attempts < sorted.length + 3 ? 2 : 1;
        window.setTimeout(
          () => onComplete({ success: true, stars, attempts: attempts + 1 }),
          1400,
        );
      }
    } else {
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      setWrongShake(true);
      window.setTimeout(() => setWrongShake(false), 500);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      {celebrate && <Confetti />}

      <p className="text-center font-display text-fluid-2xl" lang={ctx.lang}>
        {spec.prompt}
      </p>

      {/* Placed sequence (the rail) */}
      <motion.div
        animate={wrongShake ? { x: [0, -6, 6, -3, 3, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="relative w-full overflow-x-auto rounded-bloom-lg border-[3px] border-dashed bg-white/70 p-3 sm:p-4"
        style={{ borderColor: 'var(--color-accent)', minHeight: '7rem' }}
      >
        <div className="flex min-w-full items-center justify-center gap-2 sm:gap-3">
          {sorted.map((_target, i) => {
            const p = placed[i];
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-xs font-display font-bold text-ink-soft">{i + 1}</span>
                {p ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                    className="relative flex h-14 w-14 items-center justify-center rounded-bloom border-[3px] sm:h-16 sm:w-16"
                    style={{
                      borderColor: 'var(--color-accent)',
                      background: 'color-mix(in srgb, var(--color-accent) 20%, white)',
                      boxShadow: '4px 5px 0 0 color-mix(in srgb, var(--color-ink) 22%, transparent)',
                    }}
                  >
                    <span className="font-display text-lg font-bold sm:text-xl">{p.label}</span>
                  </motion.div>
                ) : (
                  <div
                    className="h-14 w-14 rounded-bloom border-2 border-dashed sm:h-16 sm:w-16"
                    style={{ borderColor: 'color-mix(in srgb, var(--color-ink) 25%, transparent)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Pool */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {pool.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
          >
            <TapTarget
              onClick={() => handlePick(p.id)}
              aria-label={p.label}
              className="rounded-bloom-lg border-[3px] border-ink/15 bg-white px-4 py-3 text-lg font-display font-bold text-ink shadow-bloom sm:text-2xl"
            >
              {p.label}
            </TapTarget>
          </motion.div>
        ))}
      </div>

      {placed.length === sorted.length && (
        <div className="flex items-center gap-2" style={{ color: 'var(--color-accent)' }}>
          <Sparkle size={20} />
          <span className="font-display font-bold">In order!</span>
          <Sparkle size={20} />
        </div>
      )}
    </div>
  );
}
