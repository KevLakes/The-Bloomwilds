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
import { useProfileStore } from '@/stores/profileStore';
import { applyRegionTheme } from '@/systems/theming/regionTheme';

export function Overworld() {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const progress = useProgressStore((s) => s.progress);
  const loadFor = useProgressStore((s) => s.loadFor);

  useEffect(() => {
    applyRegionTheme('home');
    if (active && !progress) void loadFor(active.id);
  }, [active, progress, loadFor]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas">
      {/* Decorative background (hidden in calm mode) */}
      <div
        data-decorative
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(60% 50% at 50% 30%, rgba(141,201,229,0.25), transparent 70%), radial-gradient(40% 40% at 80% 80%, rgba(244,166,192,0.25), transparent 70%)',
        }}
      />

      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <h1 className="font-display text-4xl font-bold text-moss">{t('regionMap.title')}</h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="secondary" onClick={() => navigate('/home')}>
            ← {t('back', { ns: 'common' })}
          </Button>
        </div>
      </header>

      <NarratedText
        narrationKey="regionPick"
        className="relative z-10 mx-auto max-w-3xl px-6 text-center text-lg text-ink/70"
      />

      <section
        className="relative z-10 mx-auto mt-6 aspect-[16/10] w-full max-w-6xl px-6"
        aria-label={t('regionMap.title')}
      >
        <div className="relative h-full w-full rounded-bloom border-2 border-leaf/30 bg-white/40">
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
                  className={`flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full shadow-bloom transition ${
                    r.available
                      ? tier === 0
                        ? 'bg-white grayscale'
                        : tier >= 3
                          ? 'bg-leaf text-white'
                          : 'bg-sunbeam'
                      : 'bg-white/60 grayscale'
                  }`}
                >
                  <span aria-hidden className="text-4xl">
                    {r.glyph}
                  </span>
                  <span className="text-center text-sm font-display font-bold leading-tight">
                    {tr(`${r.id}.name`)}
                  </span>
                  {!r.available && (
                    <span className="text-[10px] uppercase tracking-wide text-ink/60">
                      {t('ageGroups.comingSoon')}
                    </span>
                  )}
                </TapTarget>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default Overworld;
