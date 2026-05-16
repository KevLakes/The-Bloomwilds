import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { listForRegion } from '@/engine/challenge/registry';
import { regionById } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import type { RegionId } from '@/types';

export function RegionScene() {
  const { regionId } = useParams<{ regionId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const { t: tc } = useTranslation('challenges');
  const progress = useProgressStore((s) => s.progress);

  const region = regionId ? regionById(regionId as RegionId) : undefined;
  const challenges = useMemo(
    () => (region ? listForRegion(region.id) : []),
    [region],
  );

  useEffect(() => {
    if (region) applyRegionTheme(region.id);
  }, [region]);

  if (!region) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <Button onClick={() => navigate('/map')}>← {t('back', { ns: 'common' })}</Button>
      </main>
    );
  }

  const tier = progress?.bloomTier[region.id] ?? 0;
  const bloomPct = (tier / 3) * 100;

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-6 flex max-w-5xl items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold" style={{ color: 'var(--color-ink)' }}>
            {tr(`${region.id}.name`)}
          </h1>
          <p className="text-ink/60">{tr(`${region.id}.tagline`)}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={() => navigate('/map')}>
            ← {t('back', { ns: 'common' })}
          </Button>
        </div>
      </header>

      {/* Bloom meter */}
      <div className="mx-auto mb-8 max-w-5xl">
        <div className="flex items-center justify-between text-sm text-ink/70">
          <span>{tier === 0 ? t('regionMap.asleep') : tier >= 3 ? t('regionMap.bloomed') : t('regionMap.blooming')}</span>
          <span>{tier}/3</span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-white">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--color-accent)' }}
            initial={{ width: 0 }}
            animate={{ width: `${bloomPct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            data-testid="bloom-meter-fill"
          />
        </div>
      </div>

      {/* Scene illustration */}
      <div
        className="mx-auto mb-8 flex aspect-[16/6] w-full max-w-5xl items-center justify-center rounded-bloom shadow-bloom"
        style={{
          background: tier === 0
            ? 'linear-gradient(180deg, #E8E8E8 0%, #D0D0D0 100%)'
            : 'linear-gradient(180deg, var(--color-canvas) 0%, var(--color-accent) 100%)',
          filter: tier === 0 ? 'grayscale(1)' : 'none',
          transition: 'filter 800ms ease, background 800ms ease',
        }}
        aria-hidden
      >
        <AnimatePresence>
          {tier >= 1 && (
            <motion.span
              key="bloom1"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-2 text-6xl"
            >
              🌳
            </motion.span>
          )}
          {tier >= 2 && (
            <motion.span
              key="bloom2"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-2 text-6xl"
            >
              🌼
            </motion.span>
          )}
          {tier >= 3 && (
            <motion.span
              key="bloom3"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-2 text-6xl"
            >
              🦋
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Challenge nodes */}
      <section
        className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Challenges"
      >
        {challenges.map((c) => {
          const done = !!progress?.completed[c.id];
          return (
            <TapTarget
              key={c.id}
              onClick={() => navigate(`/play/${encodeURIComponent(c.id)}`)}
              className="bw-card flex flex-col items-start gap-2 text-left"
            >
              <span aria-hidden className="text-3xl">{done ? '✨' : '🌱'}</span>
              <h3 className="font-display text-xl font-bold">{tc(`${c.id.split('.').pop()}.title`)}</h3>
              <p className="text-sm text-ink/60">
                {done ? `★ ${progress?.completed[c.id].stars}` : `~${Math.round(c.estSeconds / 60)} min`}
              </p>
            </TapTarget>
          );
        })}
      </section>
    </main>
  );
}

export default RegionScene;
