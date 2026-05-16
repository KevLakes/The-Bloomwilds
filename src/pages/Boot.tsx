import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import { NarratedText } from '@/components/ui/NarratedText';

export function Boot() {
  const { t } = useTranslation('ui');
  const init = useProfileStore((s) => s.init);
  const ready = useProfileStore((s) => s.ready);
  const profiles = useProfileStore((s) => s.profiles);
  const active = useProfileStore((s) => s.active);
  const navigate = useNavigate();

  useEffect(() => {
    applyRegionTheme('home');
    void init();
  }, [init]);

  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => {
      if (active) navigate('/home', { replace: true });
      else if (profiles.length > 0) navigate('/profiles', { replace: true });
      else navigate('/profiles', { replace: true });
    }, 900);
    return () => clearTimeout(id);
  }, [ready, active, profiles, navigate]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-8 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="text-7xl">🌿</div>
        <h1 className="font-display text-6xl font-bold text-moss">{t('boot.welcome')}</h1>
        <NarratedText narrationKey="intro" className="max-w-xl text-xl text-ink/80" />
      </motion.div>
    </main>
  );
}

export default Boot;
