import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { listForRegion } from '@/engine/challenge/registry';
import { regionById } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { TapTarget } from '@/components/ui/TapTarget';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PageShell } from '@/components/ui/PageShell';
import { RegionIllustration } from '@/assets/illustrations/regions';
import { Sparkle, Leaf } from '@/assets/illustrations/shapes';
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
        className="relative aspect-[16/7] w-full overflow-hidden rounded-bloom-lg shadow-bloom-lg"
        aria-hidden
      >
        <RegionIllustration region={region.id} tier={tier as 0 | 1 | 2 | 3} />
      </div>

      {/* Challenge nodes */}
      <section className="bw-grid-cards" aria-label="Challenges">
        {challenges.map((c, i) => {
          const done = !!progress?.completed[c.id];
          return (
            <motion.div
              key={c.id}
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <TapTarget
                onClick={() => navigate(`/play/${encodeURIComponent(c.id)}`)}
                className={`bw-card flex h-full flex-col items-start gap-2 text-left transition hover:-translate-y-0.5 ${
                  done ? 'ring-2' : ''
                }`}
                style={done ? { boxShadow: '0 6px 0 0 var(--color-accent)' } : undefined}
              >
                <span
                  aria-hidden
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: done
                      ? 'var(--color-accent)'
                      : 'color-mix(in srgb, var(--color-accent) 25%, transparent)',
                    color: done ? 'white' : 'var(--color-accent)',
                  }}
                >
                  {done ? <Sparkle size={20} /> : <Leaf size={20} />}
                </span>
                <h3 className="font-display text-lg font-bold sm:text-xl">
                  {tc(`${c.id.split('.').pop()}.title`)}
                </h3>
                <p className="text-sm text-ink-soft">
                  {done
                    ? `★ ${progress?.completed[c.id].stars}`
                    : `~${Math.round(c.estSeconds / 60)} min`}
                </p>
              </TapTarget>
            </motion.div>
          );
        })}
      </section>
    </PageShell>
  );
}

export default RegionScene;
