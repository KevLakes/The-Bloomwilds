import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/ui/PageShell';
import { Sparkle } from '@/assets/illustrations/shapes';
import { stickers as allStickers } from '@/content/stickers';

/** Deterministic small tilt per id so layout is stable across renders. */
function tiltFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((h % 9) - 4) * 0.9; // -3.6° to +3.6°
}

export function StickerBook() {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const navigate = useNavigate();
  const owned = useProgressStore((s) => s.progress?.inventory.stickers ?? []);
  const ownedSet = useMemo(() => new Set(owned), [owned]);

  const byRegion = useMemo(() => {
    const groups: Record<string, typeof allStickers> = {};
    for (const s of allStickers) {
      (groups[s.regionId] ||= []).push(s);
    }
    return groups;
  }, []);

  return (
    <PageShell region="home">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('stickers')}</h1>
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </header>

      <div className="bw-stack">
        {Object.entries(byRegion).map(([regionId, list]) => (
          <section key={regionId} className="bw-stack">
            <h2 className="font-display font-bold text-fluid-xl">{tr(`${regionId}.name`)}</h2>
            <div
              className="grid gap-3 sm:gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 6rem), 1fr))' }}
            >
              {list.map((s) => {
                const have = ownedSet.has(s.id);
                const tilt = tiltFor(s.id);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ scale: 0.7, opacity: 0, rotate: tilt - 6 }}
                    animate={{ scale: 1, opacity: 1, rotate: tilt }}
                    whileHover={have ? { rotate: 0, scale: 1.06, y: -3 } : undefined}
                    transition={{ type: 'spring', stiffness: 280, damping: 20 }}
                    className={`relative aspect-square ${have ? '' : ''}`}
                  >
                    {have ? (
                      <div
                        className="relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-bloom-lg border-[3px] bg-white p-2"
                        style={{
                          borderColor: 'var(--color-ink)',
                          boxShadow: '5px 6px 0 0 var(--color-ink)',
                        }}
                      >
                        <span aria-hidden className="text-3xl sm:text-4xl">
                          {s.glyph}
                        </span>
                        <span
                          className="absolute -right-2 -top-2 animate-sparkle"
                          aria-hidden
                          style={{ color: 'var(--color-accent-3)' }}
                        >
                          <Sparkle size={20} />
                        </span>
                      </div>
                    ) : (
                      <div
                        className="flex h-full w-full flex-col items-center justify-center rounded-bloom-lg border-2 border-dashed bg-white/40"
                        style={{ borderColor: 'color-mix(in srgb, var(--color-ink) 22%, transparent)' }}
                      >
                        <span
                          aria-hidden
                          className="text-2xl text-ink-soft opacity-50 sm:text-3xl"
                        >
                          ?
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}

export default StickerBook;
