import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { regions } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { PageShell } from '@/components/ui/PageShell';
import { MapIsland } from '@/components/ui/MapIsland';
import { WorldMap } from '@/assets/illustrations/regions/WorldMap';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { startAmbient } from '@/systems/audio/ambient';
import { playSfx } from '@/systems/audio/procedural';
import { useProfileStore } from '@/stores/profileStore';
import { useA11yStore } from '@/stores/a11yStore';
import type { RegionId } from '@/types';

export function Overworld() {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const progress = useProgressStore((s) => s.progress);
  const loadFor = useProgressStore((s) => s.loadFor);
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const animated = motionLevel !== 'off' && !calm;
  const [zoomingTo, setZoomingTo] = useState<RegionId | null>(null);

  useEffect(() => {
    if (active && !progress) void loadFor(active.id);
    startAmbient('home');
  }, [active, progress, loadFor]);

  const handleRegionTap = (regionId: RegionId) => {
    if (zoomingTo) return;
    playSfx('page-transition');
    if (!animated) {
      navigate(`/map/${regionId}`);
      return;
    }
    setZoomingTo(regionId);
    window.setTimeout(() => navigate(`/map/${regionId}`), 520);
  };

  return (
    <PageShell variant="bare" className="relative min-h-screen-d overflow-hidden">
      {/* Top chrome — floats above the world */}
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-center justify-between gap-2 px-safe pt-safe"
        style={{ paddingBottom: '0.75rem' }}
      >
        <h1
          className="pointer-events-auto rounded-bloom-lg bg-white/70 px-4 py-2 font-display font-bold text-moss text-fluid-2xl shadow-bloom backdrop-blur-sm"
          style={{ border: '3px solid color-mix(in srgb, var(--color-ink) 18%, transparent)' }}
        >
          {t('regionMap.title')}
        </h1>
        <div className="pointer-events-auto flex flex-wrap items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={() => navigate('/home')}>
            ← {t('back', { ns: 'common' })}
          </Button>
        </div>
      </header>

      {/* The world — fills the page; islands are positioned over it */}
      <motion.section
        className="absolute inset-0 z-0"
        aria-label={t('regionMap.title')}
        animate={zoomingTo ? { scale: animated ? 1.08 : 1, filter: 'brightness(1.05)' } : { scale: 1, filter: 'brightness(1)' }}
        transition={{ duration: animated ? 0.55 : 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'center' }}
      >
        <WorldMap />

        {/* Region islands */}
        {regions.map((r) => {
          const tier = (progress?.bloomTier[r.id] ?? 0) as 0 | 1 | 2 | 3;
          const stateKey = tier === 0 ? 'asleep' : tier >= 3 ? 'bloomed' : 'blooming';
          const state: 0 | 1 | 2 | 3 = !r.available
            ? 0
            : tier >= 3
              ? 3
              : tier >= 1
                ? 2
                : 1;
          return (
            <motion.div
              key={r.id}
              className="absolute z-10"
              style={{ left: `${r.pos.x}%`, top: `${r.pos.y}%` }}
              initial={{ opacity: 0, y: 18, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.06 * regions.indexOf(r), ease: 'easeOut' }}
            >
              <MapIsland
                regionId={r.id}
                label={tr(`${r.id}.name`)}
                state={state}
                onClick={() => r.available && handleRegionTap(r.id)}
                disabled={!r.available}
                ariaLabel={`${tr(`${r.id}.name`)} — ${t(`regionMap.${stateKey}` as const)}`}
                subLabel={!r.available ? t('ageGroups.comingSoon') : undefined}
                zooming={zoomingTo === r.id}
                someoneElseZooming={!!zoomingTo && zoomingTo !== r.id}
              />
            </motion.div>
          );
        })}

        {/* Spark companion idling in a corner */}
        {active && animated && !zoomingTo && (
          <motion.div
            data-decorative
            className="pointer-events-none absolute z-10"
            style={{ left: '8%', bottom: '12%' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: [0, -6, 0] }}
            transition={{ y: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.6, delay: 0.4 } }}
          >
            <SparkAvatar look={active.spark} size={64} bounce={false} />
          </motion.div>
        )}
      </motion.section>

      {/* Bottom instruction pill — floats above world */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-safe pb-safe">
        <motion.p
          className="pointer-events-auto rounded-full bg-white/85 px-5 py-2.5 font-display text-sm shadow-bloom backdrop-blur-sm sm:text-base"
          style={{
            border: '3px solid color-mix(in srgb, var(--color-ink) 18%, transparent)',
            color: 'var(--color-ink)',
            marginBottom: '0.5rem',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {t('regionMap.pickPlace')}
        </motion.p>
      </div>
    </PageShell>
  );
}

export default Overworld;
