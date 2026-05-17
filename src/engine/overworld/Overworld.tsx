import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { regions } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { TapTarget } from '@/components/ui/TapTarget';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { NarratedText } from '@/components/ui/NarratedText';
import { PageShell } from '@/components/ui/PageShell';
import { useProfileStore } from '@/stores/profileStore';

export function Overworld() {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const progress = useProgressStore((s) => s.progress);
  const loadFor = useProgressStore((s) => s.loadFor);

  useEffect(() => {
    if (active && !progress) void loadFor(active.id);
  }, [active, progress, loadFor]);

  return (
    <PageShell region="home">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">{t('regionMap.title')}</h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={() => navigate('/home')}>
            ← {t('back', { ns: 'common' })}
          </Button>
        </div>
      </header>

      <NarratedText
        narrationKey="regionPick"
        className="text-center text-fluid-xl text-ink-soft"
      />

      <section
        className="relative aspect-[16/10] w-full overflow-hidden rounded-bloom-lg border-2 border-accent/30 bg-white/40 shadow-bloom"
        aria-label={t('regionMap.title')}
      >
        {regions.map((r) => {
          const tier = progress?.bloomTier[r.id] ?? 0;
          const stateKey = tier === 0 ? 'asleep' : tier >= 3 ? 'bloomed' : 'blooming';
          const opacity = r.available ? 1 : 0.5;
          return (
            <motion.div
              key={r.id}
              className="absolute"
              style={{ left: `${r.pos.x}%`, top: `${r.pos.y}%`, opacity }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity }}
              transition={{ duration: 0.5 }}
            >
              <TapTarget
                onClick={() => r.available && navigate(`/map/${r.id}`)}
                disabled={!r.available}
                aria-label={`${tr(`${r.id}.name`)} — ${t(`regionMap.${stateKey}` as const)}`}
                className={`flex h-[clamp(5rem,12vw,8rem)] w-[clamp(5rem,12vw,8rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full shadow-bloom transition ${
                  r.available
                    ? tier === 0
                      ? 'bg-white grayscale'
                      : tier >= 3
                        ? 'bg-leaf text-white'
                        : 'bg-sunbeam'
                    : 'bg-white/60 grayscale'
                }`}
              >
                <span aria-hidden className="text-3xl">
                  {r.glyph}
                </span>
                <span className="text-center text-xs font-display font-bold leading-tight">
                  {tr(`${r.id}.name`)}
                </span>
                {!r.available && (
                  <span className="text-[9px] uppercase tracking-wide text-ink-soft">
                    {t('ageGroups.comingSoon')}
                  </span>
                )}
              </TapTarget>
            </motion.div>
          );
        })}
      </section>
    </PageShell>
  );
}

export default Overworld;
