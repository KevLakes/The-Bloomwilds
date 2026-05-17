import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { SortSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';
import { Confetti } from '@/components/ui/Confetti';
import { Sparkle } from '@/assets/illustrations/shapes';

interface Props {
  spec: SortSpec;
  ctx: ChallengeContext;
  onComplete: (r: ChallengeResult) => void;
}

export function SortGame({ spec, ctx, onComplete }: Props) {
  const [active, setActive] = useState<string | undefined>();
  const [placed, setPlaced] = useState<Record<string, string>>({});
  const [wrong, setWrong] = useState<string | undefined>();
  const [attempts, setAttempts] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const remaining = useMemo(
    () => spec.items.filter((i) => !placed[i.id]),
    [spec.items, placed],
  );

  const handleBin = async (binId: string) => {
    if (!active) return;
    const item = spec.items.find((i) => i.id === active);
    if (!item) return;
    setAttempts((a) => a + 1);
    if (item.binId === binId) {
      const next = { ...placed, [item.id]: binId };
      setPlaced(next);
      setActive(undefined);
      ctx.sfx('sparkle');
      if (Object.keys(next).length >= spec.items.length) {
        ctx.sfx('success');
        setCelebrate(true);
        await ctx.narrate('success');
        const total = spec.items.length;
        const stars: 1 | 2 | 3 = attempts < total + 1 ? 3 : attempts < total + 3 ? 2 : 1;
        window.setTimeout(
          () => onComplete({ success: true, stars, attempts: attempts + 1 }),
          1400,
        );
      }
    } else {
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      setWrong(binId);
      window.setTimeout(() => setWrong(undefined), 700);
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      {celebrate && <Confetti />}

      <p className="text-center font-display text-fluid-2xl" lang={ctx.lang}>
        {spec.prompt}
      </p>

      {/* Available items */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {remaining.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
          >
            <TapTarget
              onClick={() => setActive(item.id)}
              aria-pressed={active === item.id}
              aria-label={item.label}
              className={`rounded-bloom-lg border-[3px] px-4 py-3 text-lg font-display font-bold transition sm:text-2xl ${
                active === item.id
                  ? 'border-accent bg-accent-3 text-ink shadow-sticker'
                  : 'border-ink/15 bg-white text-ink shadow-bloom'
              }`}
            >
              {item.label}
            </TapTarget>
          </motion.div>
        ))}
      </div>

      {/* Bins */}
      <div
        className="grid w-full gap-3 sm:gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 12rem), 1fr))' }}
      >
        {spec.bins.map((bin) => {
          const inBin = Object.entries(placed)
            .filter(([, b]) => b === bin.id)
            .map(([itemId]) => spec.items.find((i) => i.id === itemId)?.label ?? '');
          const fillRatio = inBin.length / Math.max(1, spec.items.filter((i) => i.binId === bin.id).length);
          return (
            <motion.div
              key={bin.id}
              animate={wrong === bin.id ? { x: [0, -8, 8, -4, 4, 0] } : undefined}
              transition={{ duration: 0.35 }}
            >
              <TapTarget
                onClick={() => handleBin(bin.id)}
                aria-label={bin.label}
                disabled={!active}
                className="relative flex h-full min-h-[10rem] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-bloom-lg border-[3px] border-dashed bg-white p-4 transition"
                style={{ borderColor: 'var(--color-accent)' }}
              >
                {/* Fill progress (color-coded accent at low alpha) */}
                <span
                  aria-hidden
                  className="absolute inset-0 -z-0 transition-all"
                  style={{
                    background: 'var(--color-accent)',
                    opacity: 0.12 + fillRatio * 0.2,
                  }}
                />
                {bin.icon && (
                  <span aria-hidden className="text-3xl sm:text-4xl">
                    {bin.icon}
                  </span>
                )}
                <span className="relative font-display text-base font-bold sm:text-lg">{bin.label}</span>
                {inBin.length > 0 && (
                  <span className="relative max-w-full text-center text-xs text-ink-soft">
                    {inBin.join(' · ')}
                  </span>
                )}
                {fillRatio >= 1 && (
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-2 animate-sparkle"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    <Sparkle size={22} />
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
            {Object.keys(placed).length} / {spec.items.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(Object.keys(placed).length / spec.items.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}
