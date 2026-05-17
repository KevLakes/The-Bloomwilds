import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfileStore } from '@/stores/profileStore';
import { PageShell } from '@/components/ui/PageShell';
import { BloomwildsWordmark } from '@/assets/illustrations/wordmark/Bloomwilds';
import { Cloud, Sparkle } from '@/assets/illustrations/shapes';
import { TapTarget } from '@/components/ui/TapTarget';
import { useA11yStore } from '@/stores/a11yStore';
import { playSfx } from '@/systems/audio/procedural';

/**
 * Tiny seed SVG used by the wake-up sequence. Two half-shells that part as the
 * Spark "hatches". Rendered in dark brown so it reads on the pale gradient.
 */
function Seed({
  size = 56,
  cracked = false,
}: {
  size?: number;
  cracked?: boolean;
}) {
  const split = cracked ? 6 : 0;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d="M32 8 C 14 8 8 22 8 36 C 8 50 18 60 32 60 L 32 32 Z"
        fill="#7A4F2E"
        stroke="#2E3440"
        strokeWidth="3"
        strokeLinejoin="round"
        animate={{ x: -split, rotate: cracked ? -12 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <motion.path
        d="M32 8 C 50 8 56 22 56 36 C 56 50 46 60 32 60 L 32 32 Z"
        fill="#A57A4B"
        stroke="#2E3440"
        strokeWidth="3"
        strokeLinejoin="round"
        animate={{ x: split, rotate: cracked ? 12 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
      <path d="M30 30 L 34 30" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
    </svg>
  );
}

/** Tiny Spark-blob (decoupled from SparkAvatar to avoid pulling profile state into Boot). */
function HatchedSpark({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-hidden>
      <circle cx="50" cy="50" r="44" fill="#FFE9A6" opacity="0.55" />
      <circle cx="50" cy="52" r="30" fill="#F9D77E" stroke="#2E3440" strokeWidth="2.5" />
      <circle cx="40" cy="50" r="3.2" fill="#2E3440" />
      <circle cx="60" cy="50" r="3.2" fill="#2E3440" />
      <path
        d="M42 62 Q50 70 58 62"
        stroke="#2E3440"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="36" cy="60" r="3" fill="#F4A6C0" opacity="0.7" />
      <circle cx="64" cy="60" r="3" fill="#F4A6C0" opacity="0.7" />
    </svg>
  );
}

export function Boot() {
  const { t } = useTranslation('ui');
  const init = useProfileStore((s) => s.init);
  const ready = useProfileStore((s) => s.ready);
  const profiles = useProfileStore((s) => s.profiles);
  const active = useProfileStore((s) => s.active);
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const navigate = useNavigate();
  const animated = motionLevel === 'full' && !calm;
  const reduced = motionLevel === 'reduced' && !calm;
  const off = motionLevel === 'off' || calm;

  /**
   * Sequence phases — each unlocks a chunk of visuals.
   *  0 = scene desaturated, seed about to appear
   *  1 = seed appears bottom-right
   *  2 = seed cracks + spark hatches
   *  3 = spark floats to center, colour floods, decorations drift in
   *  4 = wordmark draws/stagger-fades in
   *  5 = welcome paragraph fades in
   *  6 = done (auto-route shortly after)
   */
  const [phase, setPhase] = useState(off ? 6 : 0);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    void init();
  }, [init]);

  // Phase scheduler
  useEffect(() => {
    if (off || skipped) {
      setPhase(6);
      return;
    }
    const T = animated ? 1 : reduced ? 0.55 : 0.15;
    const schedule: { ms: number; to: number }[] = [
      { ms: 350 * T, to: 1 },
      { ms: 1150 * T, to: 2 },
      { ms: 1550 * T, to: 3 },
      { ms: 2200 * T, to: 4 },
      { ms: 2800 * T, to: 5 },
      { ms: 3800 * T, to: 6 },
    ];
    const ids = schedule.map(({ ms, to }) =>
      window.setTimeout(() => setPhase((p) => Math.max(p, to)), ms),
    );
    return () => ids.forEach(clearTimeout);
  }, [animated, reduced, off, skipped]);

  // Audio cues
  useEffect(() => {
    if (phase === 2) playSfx('sparkle');
    if (phase === 3) playSfx('bloom');
  }, [phase]);

  // Route once profile state is ready AND sequence has reached phase 6
  useEffect(() => {
    if (!ready || phase < 6) return;
    const id = window.setTimeout(() => {
      if (active) navigate('/home', { replace: true });
      else if (profiles.length > 0) navigate('/profiles', { replace: true });
      else navigate('/profiles', { replace: true });
    }, 600);
    return () => clearTimeout(id);
  }, [ready, phase, active, profiles, navigate]);

  const handleSkip = () => {
    if (!off && phase < 6) setSkipped(true);
  };

  // Convenience flags
  const showSeed = phase >= 1 && phase < 3;
  const seedCracked = phase >= 2;
  const sparkVisible = phase >= 2 && phase < 6;
  const sparkAtCenter = phase >= 3;
  const colorIn = phase >= 3;
  const wordmarkVisible = phase >= 4;
  const welcomeVisible = phase >= 5;

  return (
    <PageShell
      region="home"
      variant="bare"
      className="relative min-h-screen-d overflow-hidden"
    >
      {/* Tap-anywhere skip layer (under interactive content) */}
      <button
        type="button"
        onClick={handleSkip}
        aria-label="Skip intro"
        className="absolute inset-0 z-0 cursor-pointer bg-transparent"
        tabIndex={-1}
      />

      {/* Colour-flood mask — desaturates everything until phase 3, then releases */}
      <motion.div
        data-decorative
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 0%, rgba(244,232,214,0.5) 100%)',
          mixBlendMode: 'multiply',
        }}
        initial={{ opacity: animated ? 1 : 0, filter: 'grayscale(0.85)' }}
        animate={{
          opacity: colorIn ? 0 : 1,
          filter: colorIn ? 'grayscale(0)' : 'grayscale(0.85)',
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />

      {/* Background gradient atmosphere — desaturated until phase 3 */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{
          filter: colorIn ? 'saturate(1)' : 'saturate(0.25)',
        }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{
          background:
            'radial-gradient(circle at 12% 0%, var(--color-glow) 0%, transparent 38%), radial-gradient(circle at 90% 100%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 42%), linear-gradient(180deg, var(--color-canvas-2) 0%, var(--color-canvas) 60%)',
        }}
      />

      {/* Floating decorations — fade in once colour floods */}
      <motion.div
        data-decorative
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: colorIn ? 1 : 0 }}
        transition={{ duration: 1.2, delay: 0.1 }}
      >
        <span
          className="absolute left-[6%] top-[12%] animate-drift-x"
          style={{ color: 'color-mix(in srgb, var(--color-accent-2) 70%, transparent)' }}
        >
          <Cloud size={140} />
        </span>
        <span
          className="absolute right-[8%] top-[16%] animate-drift-x"
          style={{
            color: 'color-mix(in srgb, var(--color-accent-2) 55%, transparent)',
            animationDirection: 'reverse',
            animationDuration: '14s',
          }}
        >
          <Cloud size={100} />
        </span>
        <span
          className="absolute right-[14%] top-[34%] animate-sparkle"
          style={{ color: 'var(--color-accent-3)', animationDelay: '0.3s' }}
        >
          <Sparkle size={40} />
        </span>
        <span
          className="absolute left-[16%] top-[44%] animate-sparkle"
          style={{ color: 'var(--color-accent-2)', animationDelay: '0.9s' }}
        >
          <Sparkle size={28} />
        </span>
        <span
          className="absolute right-[24%] bottom-[26%] animate-sparkle"
          style={{ color: 'var(--color-accent-3)', animationDelay: '1.4s' }}
        >
          <Sparkle size={32} />
        </span>
      </motion.div>

      {/* Main content stack — centered */}
      <div className="relative z-20 flex min-h-screen-d flex-col items-center justify-center gap-6 px-safe py-safe text-center">
        {/* Wordmark — stays in place; fades + animates in at phase 4 */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{
            opacity: wordmarkVisible ? 1 : 0,
            y: wordmarkVisible ? 0 : 18,
            scale: wordmarkVisible ? 1 : 0.92,
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="animate-gentle-bob"
          style={{ color: 'var(--color-accent)' }}
        >
          <BloomwildsWordmark size={360} />
        </motion.div>

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: welcomeVisible ? 1 : 0, y: welcomeVisible ? 0 : 12 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center gap-3"
        >
          <p className="font-display text-fluid-xl text-moss">{t('boot.welcome')}</p>
          <p className="max-w-prose text-fluid-xl text-ink-soft">{t('boot.subtitle')}</p>
        </motion.div>
      </div>

      {/* Seed in bottom-right — visible from phase 1 to phase 3 */}
      <AnimatePresence>
        {showSeed && (
          <motion.div
            className="pointer-events-none absolute z-30"
            style={{ right: '12%', bottom: '14%' }}
            initial={{ opacity: 0, scale: 0.4, y: 30 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              rotate: seedCracked ? 0 : animated ? [0, -8, 8, -6, 6, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{
              duration: 0.5,
              rotate: { duration: 0.6, delay: 0.4, repeat: 0 },
            }}
          >
            <Seed size={64} cracked={seedCracked} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spark — emerges from seed in phase 2, floats to center in phase 3 */}
      <AnimatePresence>
        {sparkVisible && (
          <motion.div
            className="pointer-events-none absolute z-30"
            initial={{
              right: '13%',
              bottom: '14%',
              left: 'auto',
              top: 'auto',
              opacity: 0,
              scale: 0.4,
            }}
            animate={
              sparkAtCenter
                ? {
                    right: 'auto',
                    bottom: 'auto',
                    left: '50%',
                    top: '32%',
                    x: '-50%',
                    y: '-50%',
                    opacity: 1,
                    scale: animated ? [0.4, 1.15, 1] : 1,
                  }
                : {
                    right: '13%',
                    bottom: '14%',
                    left: 'auto',
                    top: 'auto',
                    opacity: 1,
                    scale: [0.4, 0.9, 0.8],
                  }
            }
            transition={{
              duration: sparkAtCenter ? 1.0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <HatchedSpark size={animated ? 80 : 64} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tap-to-skip hint (only while sequence is playing) */}
      {phase > 0 && phase < 6 && !off && (
        <TapTarget
          onClick={handleSkip}
          className="absolute bottom-6 right-6 z-40 rounded-full bg-white/70 px-3 py-1.5 text-xs font-display text-ink-soft shadow-bloom backdrop-blur-sm"
        >
          {t('challengeShell.skip')} ›
        </TapTarget>
      )}
    </PageShell>
  );
}

export default Boot;
