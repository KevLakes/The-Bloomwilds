import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useA11yStore } from '@/stores/a11yStore';
import { useProfileStore } from '@/stores/profileStore';
import { Button } from '@/components/ui/Button';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { Confetti } from '@/components/ui/Confetti';
import { Sparkle, Star } from '@/assets/illustrations/shapes';
import { RegionIllustration } from '@/assets/illustrations/regions';
import { StickerArt } from '@/assets/illustrations/stickers';
import { stickerById } from '@/content/stickers';
import { play as narrate } from '@/systems/narration/narrator';
import { playSfx } from '@/systems/audio/procedural';
import type { RegionId } from '@/types';

interface Props {
  region: RegionId;
  stars: 1 | 2 | 3;
  newTier: 0 | 1 | 2 | 3;
  /** Did the bloom tier just advance? Triggers the bigger "world wakes more" treatment. */
  tierIncreased: boolean;
  /** Sticker id newly earned on THIS completion (null if not first-time clear). */
  stickerJustEarned: string | null;
  onAgain: () => void;
  onMap: () => void;
}

/**
 * Cinematic bloom-tier ceremony. Replaces the old inline celebration.
 * Six choreographed phases over ~2.4s, each scaling automatically when motion
 * is reduced or off. Tap-to-skip not added (kids can read the buttons; the
 * sequence is short enough to wait through).
 */
export function BloomCeremony({
  region,
  stars,
  newTier,
  tierIncreased,
  stickerJustEarned,
  onAgain,
  onMap,
}: Props) {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const motionLevel = useA11yStore((s) => s.settings.motion);
  const calm = useA11yStore((s) => s.settings.calm);
  const active = useProfileStore((s) => s.active);
  const animated = motionLevel === 'full' && !calm;
  const reduced = motionLevel === 'reduced' || calm;
  const off = motionLevel === 'off';

  // Whole-sequence timing scale: 1 = full cinematic, 0.5 = reduced, 0.15 = off.
  const T = animated ? 1 : reduced ? 0.5 : 0.15;

  // Phase-1 white flash
  const [flashOn, setFlashOn] = useState(animated);
  useEffect(() => {
    if (!animated) {
      setFlashOn(false);
      return;
    }
    const id = window.setTimeout(() => setFlashOn(false), 240);
    return () => clearTimeout(id);
  }, [animated]);

  // Audio cues
  useEffect(() => {
    playSfx('bloom');
    const id = window.setTimeout(
      () => {
        void narrate(tierIncreased ? `bloomTier.${newTier}` : 'success');
      },
      animated ? 900 : 200,
    );
    return () => clearTimeout(id);
  }, [animated, tierIncreased, newTier]);

  const sticker = useMemo(
    () => (stickerJustEarned ? stickerById(stickerJustEarned) : undefined),
    [stickerJustEarned],
  );
  const kidName = active?.name;

  // Stagger sparkle cascade — 8 outward sparkles
  const sparkles = useMemo(() => {
    const count = animated ? 10 : reduced ? 4 : 0;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const dist = 120 + Math.random() * 80;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 20,
        size: 14 + Math.round(Math.random() * 14),
        delay: 0.4 * T + i * 0.06 * T,
      };
    });
  }, [animated, reduced, T]);

  const heading = t('challengeShell.wellDone');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 * T }}
      className="relative flex w-full flex-col items-center gap-5"
    >
      {/* Phase 1 — flash. Briefly washes the screen white. */}
      {flashOn && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 bg-white"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
        />
      )}

      {/* Confetti behind everything */}
      {animated && <Confetti count={28} durationMs={2600} />}

      {/* Phase 2 — region scene zooms in showing the NEW bloom tier */}
      <motion.div
        initial={{ scale: animated ? 0.86 : 1, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          duration: 0.7 * T,
          delay: animated ? 0.08 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative aspect-[16/8] w-full max-w-md overflow-hidden rounded-bloom-xl shadow-bloom-lg"
        style={{
          filter: !off ? 'url(#bw-paper-edge)' : undefined,
          border: '3px solid color-mix(in srgb, var(--color-ink) 18%, transparent)',
        }}
      >
        <RegionIllustration region={region} tier={newTier} />

        {/* Inner sparkle cascade */}
        {sparkles.map((s) => (
          <motion.span
            key={s.id}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2"
            style={{ color: 'var(--color-accent-3)', transformOrigin: 'center' }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: s.x,
              y: s.y,
              scale: [0, 1, 0.6],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.4 * T,
              delay: s.delay,
              ease: 'easeOut',
            }}
          >
            <Sparkle size={s.size} />
          </motion.span>
        ))}

        {/* Soft radial glow burst — pulses once */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-glow) 60%, transparent) 0%, transparent 60%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: animated ? [0, 1, 0.6] : 0.5 }}
          transition={{ duration: 1.4 * T, delay: 0.2 * T }}
        />
      </motion.div>

      {/* Phase 3 — sticker drops in (only if newly earned) */}
      {sticker && (
        <motion.div
          initial={{ y: -120, rotate: -18, scale: 0.7, opacity: 0 }}
          animate={{ y: 0, rotate: 4, scale: 1, opacity: 1 }}
          transition={{
            delay: 0.95 * T,
            type: 'spring',
            stiffness: animated ? 260 : 600,
            damping: 18,
          }}
          className="relative -my-2 flex items-center gap-3"
        >
          <div
            className="relative rounded-bloom-lg border-[3px] bg-white p-3"
            style={{
              borderColor: 'var(--color-ink)',
              boxShadow: '6px 8px 0 0 var(--color-ink)',
            }}
          >
            <StickerArt id={sticker.id} size={72} />
            {animated && (
              <motion.span
                aria-hidden
                className="absolute -right-3 -top-3"
                style={{ color: 'var(--color-accent-3)' }}
                animate={{ scale: [0.7, 1.2, 0.7], rotate: [0, 18, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Sparkle size={28} />
              </motion.span>
            )}
          </div>
          <span className="font-display text-lg font-bold sm:text-xl">
            {t('stickers')}!
          </span>
        </motion.div>
      )}

      {/* Phase 4 — "Well done!" headline with per-character stagger */}
      <motion.h2
        className="font-display font-bold text-center text-fluid-2xl"
        style={{ color: 'var(--color-ink)' }}
        aria-label={heading}
      >
        {Array.from(heading).map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            aria-hidden
            className="inline-block"
            initial={{ y: 18, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              delay: 1.15 * T + i * 0.04 * T,
              type: 'spring',
              stiffness: 380,
              damping: 18,
            }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        ))}
      </motion.h2>

      {/* Phase 5 — Stars pop in one at a time */}
      <div
        className="flex items-center gap-2"
        aria-label={`${stars} stars`}
        role="img"
      >
        {[1, 2, 3].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -36, opacity: 0 }}
            animate={{
              scale: i <= stars ? 1 : 0.6,
              rotate: 0,
              opacity: i <= stars ? 1 : 0.4,
            }}
            transition={{
              delay: 1.45 * T + i * 0.15 * T,
              type: 'spring',
              stiffness: 320,
              damping: 16,
            }}
            style={{
              color:
                i <= stars
                  ? 'var(--color-accent-3)'
                  : 'color-mix(in srgb, var(--color-ink) 18%, transparent)',
            }}
          >
            <Star size={i <= stars ? 40 : 30} />
          </motion.span>
        ))}
      </div>

      {/* Phase 6 — Region label + Spark companion */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.7 * T, duration: 0.35 * T }}
      >
        {active && <SparkAvatar look={active.spark} size={84} />}
        <p className="font-display text-fluid-xl text-ink-soft">
          {kidName ? `${kidName} — ` : ''}
          {tr(`${region}.name`)}
        </p>
        <span aria-hidden style={{ color: 'var(--color-accent-3)' }}>
          <Sparkle size={26} />
        </span>
      </motion.div>

      {/* Phase 7 — CTAs */}
      <motion.div
        className="mt-2 flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9 * T, duration: 0.35 * T }}
      >
        <Button onClick={onAgain}>{t('challengeShell.again')}</Button>
        <Button variant="secondary" onClick={onMap}>
          ← {t('back', { ns: 'common' })}
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default BloomCeremony;
