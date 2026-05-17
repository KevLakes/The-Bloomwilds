import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { NarratedText } from '@/components/ui/NarratedText';
import { PageShell } from '@/components/ui/PageShell';
import { BloomBackground } from '@/components/ui/BloomBackground';
import { BloomwildsWordmark } from '@/assets/illustrations/wordmark/Bloomwilds';
import { Cloud, Sparkle } from '@/assets/illustrations/shapes';

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
    <PageShell
      region="home"
      width="narrow"
      className="relative"
      contentClassName="items-center justify-center min-h-[80dvh] text-center relative"
    >
      <BloomBackground region="home" tier={3} />

      {/* Floating decorations */}
      <div data-decorative aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="absolute left-[8%] top-[12%] text-accent-2/60 animate-drift-x">
          <Cloud size={120} />
        </span>
        <span
          className="absolute right-[10%] top-[20%] text-accent-3 animate-sparkle"
          style={{ animationDelay: '0.4s' }}
        >
          <Sparkle size={36} />
        </span>
        <span
          className="absolute right-[18%] bottom-[18%] text-accent-2 animate-sparkle"
          style={{ animationDelay: '1.1s' }}
        >
          <Sparkle size={24} />
        </span>
      </div>

      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="animate-gentle-bob" style={{ color: 'var(--color-accent)' }}>
          <BloomwildsWordmark size={360} />
        </div>
        <p className="font-display text-fluid-xl text-moss">{t('boot.welcome')}</p>
        <NarratedText narrationKey="intro" className="max-w-prose text-fluid-xl text-ink-soft" />
      </motion.div>
    </PageShell>
  );
}

export default Boot;
