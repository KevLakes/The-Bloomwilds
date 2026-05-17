import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { listForRegion } from '@/engine/challenge/registry';
import { regionById } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PageShell } from '@/components/ui/PageShell';
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

  if (!region) {
    return (
      <PageShell region="home" contentClassName="items-center justify-center min-h-[60dvh]">
        <Button onClick={() => navigate('/map')}>← {t('back', { ns: 'common' })}</Button>
      </PageShell>
    );
  }

  const tier = progress?.bloomTier[region.id] ?? 0;
  const bloomPct = (tier / 3) * 100;

  return (
    <PageShell region={region.id}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-fluid-2xl" style={{ color: 'var(--color-ink)' }}>
            {tr(`${region.id}.name`)}
          </h1>
          <p className="text-ink-soft text-fluid-xl">{tr(`${region.id}.tagline`)}</p>
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={() => navigate('/map')}>
            ← {t('back', { ns: 'common' })}
          </Button>
        </div>
      </header>

      {/* Bloom meter */}
      <div>
        <div className="flex items-center justify-between text-sm text-ink-soft">
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
        className="flex aspect-[16/7] w-full items-center justify-center overflow-hidden rounded-bloom-lg shadow-bloom"
        style={{
          background:
            tier === 0
              ? 'linear-gradient(180deg, #E8E8E8 0%, #D0D0D0 100%)'
              : 'linear-gradient(180deg, var(--color-canvas-2) 0%, var(--color-accent) 100%)',
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
              className="mx-2 text-fluid-3xl"
            >
              🌳
            </motion.span>
          )}
          {tier >= 2 && (
            <motion.span
              key="bloom2"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-2 text-fluid-3xl"
            >
              🌼
            </motion.span>
          )}
          {tier >= 3 && (
            <motion.span
              key="bloom3"
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="mx-2 text-fluid-3xl"
            >
              🦋
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Challenge nodes */}
      <section className="bw-grid-cards" aria-label="Challenges">
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
              <p className="text-sm text-ink-soft">
                {done ? `★ ${progress?.completed[c.id].stars}` : `~${Math.round(c.estSeconds / 60)} min`}
              </p>
            </TapTarget>
          );
        })}
      </section>
    </PageShell>
  );
}

export default RegionScene;
