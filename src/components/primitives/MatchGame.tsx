import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MatchSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';

interface Props {
  spec: MatchSpec;
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

export function MatchGame({ spec, ctx, onComplete }: Props) {
  const [leftPick, setLeftPick] = useState<string | undefined>();
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongFlash, setWrongFlash] = useState<string | undefined>();
  const [attempts, setAttempts] = useState(0);
  const [shuffledRights, setShuffledRights] = useState(() => shuffle(spec.pairs));

  useEffect(() => {
    setShuffledRights(shuffle(spec.pairs));
  }, [spec.pairs]);

  const handleLeft = (id: string) => {
    if (matched.includes(id)) return;
    setLeftPick(id);
    const pair = spec.pairs.find((p) => p.id === id);
    if (pair) ctx.sfx('sparkle');
    // Optional: play sound for the picked left side if specified
  };

  const handleRight = async (id: string) => {
    if (!leftPick || matched.includes(leftPick)) return;
    setAttempts((a) => a + 1);
    if (id === leftPick) {
      const next = [...matched, id];
      setMatched(next);
      setLeftPick(undefined);
      ctx.sfx('sparkle');
      if (next.length >= spec.pairs.length) {
        ctx.sfx('success');
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 = attempts < spec.pairs.length + 1 ? 3 : attempts < spec.pairs.length + 3 ? 2 : 1;
        onComplete({ success: true, stars, attempts: attempts + 1 });
      }
    } else {
      ctx.sfx('gentle-error');
      setWrongFlash(id);
      void ctx.narrate('gentleError');
      window.setTimeout(() => {
        setWrongFlash(undefined);
        setLeftPick(undefined);
      }, 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-2xl font-display" lang={ctx.lang}>
        {spec.prompt}
      </p>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-3">
          {spec.pairs.map((p) => {
            const isMatched = matched.includes(p.id);
            const isPicked = leftPick === p.id;
            return (
              <TapTarget
                key={`L${p.id}`}
                onClick={() => handleLeft(p.id)}
                disabled={isMatched}
                aria-pressed={isPicked}
                aria-label={p.left}
                className={`min-w-[120px] rounded-bloom px-6 py-4 text-3xl font-display font-bold shadow-bloom ${
                  isMatched
                    ? 'bg-leaf/30 text-ink/60 line-through'
                    : isPicked
                      ? 'bg-sunbeam text-ink ring-4 ring-leaf'
                      : 'bg-white text-ink'
                }`}
              >
                {p.left}
              </TapTarget>
            );
          })}
        </div>
        <div className="flex flex-col gap-3">
          {shuffledRights.map((p) => {
            const isMatched = matched.includes(p.id);
            const isWrong = wrongFlash === p.id;
            return (
              <motion.div
                key={`R${p.id}`}
                animate={isWrong ? { x: [0, -8, 8, -4, 4, 0] } : undefined}
                transition={{ duration: 0.35 }}
              >
                <TapTarget
                  onClick={() => handleRight(p.id)}
                  disabled={isMatched}
                  aria-label={p.right}
                  className={`min-w-[120px] rounded-bloom px-6 py-4 text-2xl font-display font-bold shadow-bloom ${
                    isMatched
                      ? 'bg-leaf/30 text-ink/60'
                      : isWrong
                        ? 'bg-bloom/40 text-ink'
                        : 'bg-white text-ink'
                  }`}
                >
                  {p.right}
                </TapTarget>
              </motion.div>
            );
          })}
        </div>
      </div>
      <p className="text-sm text-ink/60">
        {matched.length} / {spec.pairs.length}
      </p>
    </div>
  );
}
