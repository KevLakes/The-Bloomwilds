import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { SortSpec, ChallengeContext } from '@/engine/challenge/types';
import type { ChallengeResult } from '@/types';
import { TapTarget } from '@/components/ui/TapTarget';

interface Props {
  spec: SortSpec;
  ctx: ChallengeContext;
  onComplete: (r: ChallengeResult) => void;
}

export function SortGame({ spec, ctx, onComplete }: Props) {
  const [active, setActive] = useState<string | undefined>();
  const [placed, setPlaced] = useState<Record<string, string>>({}); // itemId -> binId
  const [wrong, setWrong] = useState<string | undefined>();
  const [attempts, setAttempts] = useState(0);

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
        await ctx.narrate('success');
        const total = spec.items.length;
        const stars: 1 | 2 | 3 = attempts < total + 1 ? 3 : attempts < total + 3 ? 2 : 1;
        onComplete({ success: true, stars, attempts: attempts + 1 });
      }
    } else {
      ctx.sfx('gentle-error');
      void ctx.narrate('gentleError');
      setWrong(binId);
      window.setTimeout(() => setWrong(undefined), 700);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-center text-2xl font-display" lang={ctx.lang}>
        {spec.prompt}
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {remaining.map((item) => (
          <TapTarget
            key={item.id}
            onClick={() => setActive(item.id)}
            aria-pressed={active === item.id}
            aria-label={item.label}
            className={`rounded-bloom px-5 py-4 text-2xl font-display font-bold shadow-bloom ${
              active === item.id ? 'bg-sunbeam ring-4 ring-leaf' : 'bg-white'
            }`}
          >
            {item.label}
          </TapTarget>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {spec.bins.map((bin) => {
          const inBin = Object.entries(placed)
            .filter(([, b]) => b === bin.id)
            .map(([itemId]) => spec.items.find((i) => i.id === itemId)?.label ?? '');
          return (
            <motion.div
              key={bin.id}
              animate={wrong === bin.id ? { x: [0, -8, 8, -4, 4, 0] } : undefined}
              transition={{ duration: 0.35 }}
            >
              <TapTarget
                onClick={() => handleBin(bin.id)}
                aria-label={bin.label}
                className="flex min-h-[160px] min-w-[180px] flex-col items-center justify-center gap-2 rounded-bloom border-2 border-dashed border-leaf/60 bg-white/60 p-4"
              >
                {bin.icon && <span aria-hidden className="text-4xl">{bin.icon}</span>}
                <span className="font-display text-xl font-bold">{bin.label}</span>
                {inBin.length > 0 && (
                  <span className="text-sm text-ink/70">{inBin.join(', ')}</span>
                )}
              </TapTarget>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
