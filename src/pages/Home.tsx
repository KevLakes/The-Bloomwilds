import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { useProgressStore } from '@/stores/progressStore';
import { Button } from '@/components/ui/Button';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { PageShell } from '@/components/ui/PageShell';
import { BloomBackground } from '@/components/ui/BloomBackground';
import { IconBadge } from '@/components/ui/IconBadge';
import { startAmbient } from '@/systems/audio/ambient';

export function Home() {
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const active = useProfileStore((s) => s.active);
  const loadProgress = useProgressStore((s) => s.loadFor);
  const progress = useProgressStore((s) => s.progress);

  useEffect(() => {
    if (active) void loadProgress(active.id);
    startAmbient('home');
  }, [active, loadProgress]);

  useEffect(() => {
    if (!active) navigate('/profiles', { replace: true });
  }, [active, navigate]);

  if (!active) return null;

  return (
    <PageShell region="home" className="relative">
      <BloomBackground region="home" tier={3} />

      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-bold text-moss text-fluid-2xl">
          {t('home.greeting', { name: active.name })}
        </h1>
        <LanguageToggle />
      </header>

      <section className="bw-stack items-center text-center">
        <motion.div initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
          <SparkAvatar look={active.spark} size={180} />
        </motion.div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <IconBadge icon="🌱" value={progress?.seeds ?? 0} label={t('seeds')} />
          <IconBadge
            icon="⭐"
            value={progress?.inventory.stickers.length ?? 0}
            label={t('stickers')}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => navigate('/map')}>{t('home.play')}</Button>
          <Button variant="secondary" onClick={() => navigate('/stickers')}>
            {t('home.stickers')}
          </Button>
          <Button variant="secondary" onClick={() => navigate('/spark')}>
            {t('home.spark')}
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
          className="bw-tap mt-4 text-sm text-ink-soft underline-offset-4 hover:underline"
        >
          {t('home.switchProfile')}
        </button>
      </section>
    </PageShell>
  );
}

export default Home;
