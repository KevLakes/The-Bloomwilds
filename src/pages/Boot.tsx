import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { NarratedText } from '@/components/ui/NarratedText';
import { PageShell } from '@/components/ui/PageShell';

export function Boot() {
  const { t } = useTranslation('ui');
  const init = useProfileStore((s) => s.init);
  const ready = useProfileStore((s) => s.ready);
  const profiles = useProfileStore((s) => s.profiles);
  const active = useProfileStore((s) => s.active);
  const navigate = useNavigate();

  useEffect(() => {
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
    <PageShell region="home" width="narrow" contentClassName="items-center justify-center min-h-[80dvh] text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <div className="text-fluid-hero animate-gentle-bob" aria-hidden>
          🌿
        </div>
        <h1 className="font-display font-bold text-moss text-fluid-hero">{t('boot.welcome')}</h1>
        <NarratedText narrationKey="intro" className="max-w-prose text-fluid-xl text-ink-soft" />
      </motion.div>
    </PageShell>
  );
}

export default Boot;
