import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { PageShell } from '@/components/ui/PageShell';
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
              className="grid gap-3"
              style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 6rem), 1fr))' }}
            >
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
                    <span className="text-[10px] uppercase tracking-wide text-ink-soft">
                      {have ? '★' : '?'}
                    </span>
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
