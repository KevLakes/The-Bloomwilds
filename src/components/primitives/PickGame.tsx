import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PickSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';

interface Props {
  spec: PickSpec;
  ctx: ChallengeContext;
  onComplete: (r: ChallengeResult) => void;
}

export function PickGame({ spec, ctx, onComplete }: Props) {
  const need = spec.pickCount ?? spec.options.filter((o) => o.isCorrect).length;
  const [picked, setPicked] = useState<string[]>([]);
  const [wrongs, setWrongs] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);

  const handlePick = async (id: string) => {
    const opt = spec.options.find((o) => o.id === id);
    if (!opt) return;
    setAttempts((a) => a + 1);
    if (opt.isCorrect && !picked.includes(id)) {
      const next = [...picked, id];
      setPicked(next);
      ctx.sfx('sparkle');
      if (next.length >= need) {
        ctx.sfx('success');
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 = attempts < need + 1 ? 3 : attempts < need + 3 ? 2 : 1;
        onComplete({ success: true, stars, attempts: attempts + 1 });
      }
    } else if (!opt.isCorrect) {
      setWrongs((w) => [...w, id]);
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      window.setTimeout(() => setWrongs((w) => w.filter((x) => x !== id)), 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-2xl font-display" lang={ctx.lang}>
        {spec.prompt}
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        {spec.options.map((o) => {
          const isPicked = picked.includes(o.id);
          const isWrong = wrongs.includes(o.id);
          return (
            <motion.div
              key={o.id}
              animate={
                isWrong
                  ? { x: [0, -8, 8, -4, 4, 0] }
                  : isPicked
                    ? { scale: [1, 1.15, 1] }
                    : undefined
              }
              transition={{ duration: 0.35 }}
            >
              <TapTarget
                onClick={() => handlePick(o.id)}
                disabled={isPicked}
                aria-pressed={isPicked}
                aria-label={o.label}
                className={`relative flex h-28 w-28 items-center justify-center rounded-bloom text-5xl font-display font-bold shadow-bloom transition ${
                  isPicked
                    ? 'bg-leaf text-white'
                    : isWrong
                      ? 'bg-bloom/40 text-ink'
                      : 'bg-white text-ink'
                }`}
              >
                {o.label}
                {isPicked && (
                  <span aria-hidden className="absolute -right-2 -top-2 text-2xl">
                    ✓
                  </span>
                )}
                {isWrong && (
                  <span aria-hidden className="absolute -right-2 -top-2 text-2xl">
                    ✕
                  </span>
                )}
              </TapTarget>
            </motion.div>
          );
        })}
      </div>
      <p className="text-sm text-ink/60">
        {picked.length} / {need}
      </p>
    </div>
  );
}
