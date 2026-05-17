import { useState } from 'react';
import { motion } from 'framer-motion';
import type { PickSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';
import { Confetti } from '@/components/ui/Confetti';
import { Sparkle } from '@/assets/illustrations/shapes';

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
  const [celebrate, setCelebrate] = useState(false);

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
        setCelebrate(true);
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 = attempts < need + 1 ? 3 : attempts < need + 3 ? 2 : 1;
        window.setTimeout(
          () => onComplete({ success: true, stars, attempts: attempts + 1 }),
          1400,
        );
      }
    } else if (!opt.isCorrect) {
      setWrongs((w) => [...w, id]);
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      window.setTimeout(() => setWrongs((w) => w.filter((x) => x !== id)), 700);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      {celebrate && <Confetti />}

      <p className="text-center font-display text-fluid-2xl" lang={ctx.lang}>
        {spec.prompt}
      </p>

      <div
        className="grid w-full justify-items-center gap-3 sm:gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 7rem), 1fr))' }}
      >
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
                    ? { scale: [1, 1.12, 1] }
                    : undefined
              }
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              <TapTarget
                onClick={() => handlePick(o.id)}
                disabled={isPicked}
                aria-pressed={isPicked}
                aria-label={o.label}
                className={`relative flex aspect-square w-full items-center justify-center rounded-bloom-lg border-[3px] font-display font-bold transition ${
                  isPicked
                    ? 'border-accent bg-accent/20 text-ink'
                    : isWrong
                      ? 'border-accent-2 bg-accent-2/30 text-ink'
                      : 'border-ink/15 bg-white text-ink shadow-bloom'
                }`}
                style={{ fontSize: 'clamp(1.5rem, 6vw, 2.5rem)' }}
              >
                {o.label}
                {isPicked && (
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2 animate-sparkle"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    <Sparkle size={22} />
                  </span>
                )}
                {isWrong && (
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2 text-xl font-bold"
                    style={{ color: 'var(--color-accent-2)' }}
                  >
                    ✕
                  </span>
                )}
              </TapTarget>
            </motion.div>
          );
        })}
      </div>

      <div className="w-full max-w-xs">
        <div className="mb-1 flex justify-between text-xs font-display font-bold text-ink-soft">
          <span>
            {picked.length} / {need}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(picked.length / need) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
