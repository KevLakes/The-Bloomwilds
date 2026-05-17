import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MatchSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';
import { Confetti } from '@/components/ui/Confetti';
import { Sparkle } from '@/assets/illustrations/shapes';

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
  const [celebrate, setCelebrate] = useState(false);
  const [shuffledRights, setShuffledRights] = useState(() => shuffle(spec.pairs));

  useEffect(() => {
    setShuffledRights(shuffle(spec.pairs));
  }, [spec.pairs]);

  const handleLeft = (id: string) => {
    if (matched.includes(id)) return;
    setLeftPick(id);
    const pair = spec.pairs.find((p) => p.id === id);
    if (pair) ctx.sfx('sparkle');
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
        setCelebrate(true);
        await ctx.narrate('success');
        const stars: 1 | 2 | 3 =
          attempts < spec.pairs.length + 1 ? 3 : attempts < spec.pairs.length + 3 ? 2 : 1;
        window.setTimeout(
          () => onComplete({ success: true, stars, attempts: attempts + 1 }),
          1400,
        );
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
    <div className="relative flex w-full flex-col items-center gap-6">
      {celebrate && <Confetti />}

      <p className="text-center font-display text-fluid-2xl" lang={ctx.lang}>
        {spec.prompt}
      </p>

      <div
        className="grid w-full gap-3 sm:gap-6"
        style={{ gridTemplateColumns: '1fr auto 1fr', alignItems: 'start' }}
      >
        {/* Left column */}
        <div className="flex flex-col gap-2 sm:gap-3">
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
                className={`relative flex items-center justify-center rounded-bloom-lg border-[3px] px-3 py-3 text-xl font-display font-bold transition sm:px-6 sm:py-4 sm:text-2xl ${
                  isMatched
                    ? 'border-accent/30 bg-accent/15 text-ink-soft'
                    : isPicked
                      ? 'border-accent bg-accent-3 text-ink shadow-sticker'
                      : 'border-ink/15 bg-white text-ink shadow-bloom'
                }`}
              >
                {isMatched && (
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    <Sparkle size={20} />
                  </span>
                )}
                <span>{p.left}</span>
              </TapTarget>
            );
          })}
        </div>

        {/* Connector / count column */}
        <div className="flex items-center justify-center pt-3">
          <div
            className="hidden h-full w-px sm:block"
            style={{
              background:
                'repeating-linear-gradient(180deg, var(--color-ink-soft) 0 4px, transparent 4px 10px)',
              opacity: 0.4,
            }}
          />
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-2 sm:gap-3">
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
                  className={`w-full rounded-bloom-lg border-[3px] px-3 py-3 text-lg font-display font-bold transition sm:px-6 sm:py-4 sm:text-xl ${
                    isMatched
                      ? 'border-accent/30 bg-accent/15 text-ink-soft'
                      : isWrong
                        ? 'border-accent-2 bg-accent-2/30 text-ink'
                        : 'border-ink/15 bg-white text-ink shadow-bloom'
                  }`}
                >
                  {p.right}
                </TapTarget>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs">
        <div className="mb-1 flex justify-between text-xs font-display font-bold text-ink-soft">
          <span>
            {matched.length} / {spec.pairs.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(matched.length / spec.pairs.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
