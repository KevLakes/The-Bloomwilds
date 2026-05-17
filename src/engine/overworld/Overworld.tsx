import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { regions } from '@/content/regions';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { NarratedText } from '@/components/ui/NarratedText';
import { PageShell } from '@/components/ui/PageShell';
import { MapNode } from '@/components/ui/MapNode';
import { BloomBackground } from '@/components/ui/BloomBackground';
import { PathLine } from '@/assets/illustrations/shapes';
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
        className="relative aspect-[16/10] w-full overflow-hidden rounded-bloom-lg shadow-bloom-lg"
        aria-label={t('regionMap.title')}
        style={{
          background:
            'radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--color-accent) 22%, transparent), transparent 60%), linear-gradient(180deg, var(--color-canvas-2) 0%, var(--color-canvas) 100%)',
        }}
      >
        <BloomBackground region="home" tier={3} fadeBottom={false} />

        {/* Winding path connecting nodes */}
        <div
          data-decorative
          aria-hidden
          className="pointer-events-none absolute inset-x-[6%] top-[28%] -z-10"
          style={{ color: 'var(--color-accent)', opacity: 0.5 }}
        >
          <PathLine size="100%" />
        </div>

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
              className="absolute"
              style={{ left: `${r.pos.x}%`, top: `${r.pos.y}%` }}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <MapNode
                label={tr(`${r.id}.name`)}
                glyph={r.glyph}
                state={state}
                onClick={() => r.available && navigate(`/map/${r.id}`)}
                disabled={!r.available}
                ariaLabel={`${tr(`${r.id}.name`)} — ${t(`regionMap.${stateKey}` as const)}`}
                subLabel={!r.available ? t('ageGroups.comingSoon') : undefined}
              />
            </motion.div>
          );
        })}
      </section>
    </PageShell>
  );
}

export default Overworld;
