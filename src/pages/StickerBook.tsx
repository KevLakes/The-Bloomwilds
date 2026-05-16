import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { stickers as allStickers } from '@/content/stickers';

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
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-4xl font-bold text-moss">{t('stickers')}</h1>
        <Button variant="secondary" onClick={() => navigate('/home')}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </header>

      <div className="mx-auto max-w-5xl space-y-8">
        {Object.entries(byRegion).map(([regionId, list]) => (
          <section key={regionId}>
            <h2 className="mb-3 font-display text-2xl font-bold">{tr(`${regionId}.name`)}</h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {list.map((s) => {
                const have = ownedSet.has(s.id);
                return (
                  <motion.div
                    key={s.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`bw-card flex aspect-square flex-col items-center justify-center gap-1 ${
                      have ? '' : 'opacity-40 grayscale'
                    }`}
                  >
                    <span aria-hidden className="text-4xl">{s.glyph}</span>
                    <span className="text-[10px] uppercase tracking-wide text-ink/60">
                      {have ? '★' : '?'}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

export default StickerBook;
