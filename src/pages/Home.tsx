import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { applyRegionTheme } from '@/systems/theming/regionTheme';

export function Home() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const loadProgress = useProgressStore((s) => s.loadFor);
  const progress = useProgressStore((s) => s.progress);

  useEffect(() => {
    applyRegionTheme('home');
    if (active) void loadProgress(active.id);
  }, [active, loadProgress]);

  useEffect(() => {
    if (!active) navigate('/profiles', { replace: true });
  }, [active, navigate]);

  if (!active) return null;

  return (
    <main className="min-h-screen bg-canvas px-6 py-10">
      <header className="mx-auto mb-8 flex max-w-5xl items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-moss">
          {t('home.greeting', { name: active.name })}
        </h1>
        <LanguageToggle />
      </header>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <SparkAvatar look={active.spark} size={180} />
        </motion.div>

        <div className="flex items-center gap-4 text-lg">
          <span>🌱 {progress?.seeds ?? 0} {t('seeds')}</span>
          <span>⭐ {progress?.inventory.stickers.length ?? 0} {t('stickers')}</span>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button onClick={() => navigate('/map')}>{t('home.play')}</Button>
          <Button variant="secondary" onClick={() => navigate('/stickers')}>
            {t('home.stickers')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/settings')}>
            {t('home.settings')}
          </Button>
        </div>

        <button
          onClick={async () => {
            const profileStore = useProfileStore.getState();
            await profileStore.setActive(undefined);
            navigate('/profiles');
          }}
          className="mt-6 text-sm text-ink/60 underline"
        >
          {t('home.switchProfile')}
        </button>
      </section>
    </main>
  );
}

export default Home;
