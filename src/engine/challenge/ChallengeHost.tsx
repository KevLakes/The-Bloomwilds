import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeShell } from './ChallengeShell';
import type { ChallengeContext, ChallengeDef } from './types';
import { getChallenge } from './registry';
import { PickGame } from '@/components/primitives/PickGame';
import { MatchGame } from '@/components/primitives/MatchGame';
import { SortGame } from '@/components/primitives/SortGame';
import { OrderGame } from '@/components/primitives/OrderGame';
import { Button } from '@/components/ui/Button';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { Confetti } from '@/components/ui/Confetti';
import { RegionIllustration } from '@/assets/illustrations/regions';
import { Sparkle, Star } from '@/assets/illustrations/shapes';
import { play as narrate } from '@/systems/narration/narrator';
import { playSfx } from '@/systems/audio/procedural';
import { startAmbient } from '@/systems/audio/ambient';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import { useProfileStore } from '@/stores/profileStore';
import { useProgressStore } from '@/stores/progressStore';
import { useA11yStore } from '@/stores/a11yStore';
import type { ChallengeResult, Lang } from '@/types';

// Sfx now go through procedural Web Audio — no asset files required.
// The ctx.sfx() callsite in primitives feeds directly into playSfx() below.

interface CelebrationProps {
  region: ChallengeDef['regionId'];
  stars: 1 | 2 | 3;
  onAgain: () => void;
  onMap: () => void;
}

function Celebration({ region, stars, onAgain, onMap }: CelebrationProps) {
  const { t } = useTranslation('ui');
  const { t: tr } = useTranslation('regions');
  const active = useProfileStore((s) => s.active);
  const calm = useA11yStore((s) => s.settings.calm);
  const motionLevel = useA11yStore((s) => s.settings.motion);

  useEffect(() => {
    if (!calm) void narrate(`bloomTier.1`);
  }, [calm]);

  const isAnimated = motionLevel === 'full' && !calm;
  const fullDuration = isAnimated ? 0.5 : 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: fullDuration, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex w-full flex-col items-center gap-5"
    >
      <Confetti count={24} durationMs={2400} />

      {/* Bloomed region tile */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: fullDuration, delay: 0.1, type: 'spring', stiffness: 220, damping: 22 }}
        className="relative aspect-[16/8] w-full max-w-md overflow-hidden rounded-bloom-xl shadow-bloom-lg"
        style={{
          filter: motionLevel !== 'off' ? 'url(#bw-paper-edge)' : undefined,
        }}
      >
        <RegionIllustration region={region} tier={3} />
        {/* Glow burst */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--color-glow) 60%, transparent) 0%, transparent 55%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6] }}
          transition={{ duration: 1.4, delay: 0.2 }}
        />
      </motion.div>

      {/* Header */}
      <motion.h2
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="font-display font-bold text-center text-fluid-2xl"
        style={{ color: 'var(--color-ink)' }}
      >
        {t('challengeShell.wellDone')}
      </motion.h2>

      {/* Stars */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.55, type: 'spring', stiffness: 300, damping: 18 }}
        className="flex items-center gap-2"
        aria-label={`${stars} stars`}
      >
        {[1, 2, 3].map((i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: i <= stars ? 1 : 0.6, rotate: 0 }}
            transition={{ delay: 0.55 + i * 0.12, type: 'spring', stiffness: 280, damping: 18 }}
            style={{
              color:
                i <= stars
                  ? 'var(--color-accent-3)'
                  : 'color-mix(in srgb, var(--color-ink) 18%, transparent)',
            }}
          >
            <Star size={i <= stars ? 36 : 28} />
          </motion.span>
        ))}
      </motion.div>

      {/* Region label + Spark */}
      <div className="flex items-center gap-3">
        {active && <SparkAvatar look={active.spark} size={92} />}
        <p className="font-display text-fluid-xl text-ink-soft">{tr(`${region}.name`)}</p>
        <span aria-hidden style={{ color: 'var(--color-accent-3)' }} className="animate-sparkle">
          <Sparkle size={28} />
        </span>
      </div>

      {/* CTAs */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button variant="secondary" onClick={onAgain}>
          {t('challengeShell.again')}
        </Button>
        <Button onClick={onMap}>← {t('back', { ns: 'common' })}</Button>
      </div>
    </motion.div>
  );
}

export function ChallengeRoute() {
  const { challengeId = '' } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('challenges');
  const lang = (i18n.language as Lang) ?? 'sv';

  const def = useMemo(() => getChallenge(challengeId), [challengeId]);
  const [done, setDone] = useState<ChallengeResult | undefined>();
  const undoRef = useRef<(() => void) | undefined>(undefined);
  const recordCompletion = useProgressStore((s) => s.recordCompletion);

  useEffect(() => {
    if (def) {
      applyRegionTheme(def.regionId);
      startAmbient(def.regionId);
    }
  }, [def]);

  useEffect(() => {
    if (def) void narrate(def.narrationKey);
  }, [def]);

  if (!def) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-canvas">
        <p>Not found</p>
      </main>
    );
  }

  const ctx: ChallengeContext = {
    lang,
    t: (k, opts) => i18n.t(k, opts) as string,
    narrate: (k, opts) => narrate(k, opts),
    sfx: playSfx,
    registerUndo: (fn) => {
      undoRef.current = fn;
    },
  };

  const handleComplete = async (result: ChallengeResult) => {
    setDone(result);
    await recordCompletion({
      regionId: def.regionId,
      challengeId: def.id,
      stars: result.stars ?? 1,
      seedsAwarded: def.seedsAwarded ?? 2,
      stickerAwarded: def.stickerOnFirstClear,
    });
  };

  const restart = () => {
    setDone(undefined);
    // Trigger remount by navigating to same route
    navigate(0);
  };

  let body;
  const spec = def.spec?.[lang] ?? def.spec?.[lang === 'sv' ? 'en' : 'sv'];
  if (def.component) {
    const Lazy = lazy(def.component);
    body = (
      <Suspense fallback={<p>...</p>}>
        <Lazy ctx={ctx} onComplete={handleComplete} onExit={() => navigate(`/map/${def.regionId}`)} />
      </Suspense>
    );
  } else if (spec?.kind === 'match') {
    body = <MatchGame spec={spec} ctx={ctx} onComplete={handleComplete} />;
  } else if (spec?.kind === 'pick') {
    body = <PickGame spec={spec} ctx={ctx} onComplete={handleComplete} />;
  } else if (spec?.kind === 'sort') {
    body = <SortGame spec={spec} ctx={ctx} onComplete={handleComplete} />;
  } else if (spec?.kind === 'order') {
    body = <OrderGame spec={spec} ctx={ctx} onComplete={handleComplete} />;
  } else {
    body = <p>—</p>;
  }

  return (
    <ChallengeShell
      title={t(def.titleKey)}
      onUndo={undoRef.current}
      onExit={() => navigate(`/map/${def.regionId}`)}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <Celebration
            key="done"
            region={def.regionId}
            stars={done.stars ?? 1}
            onAgain={restart}
            onMap={() => navigate(`/map/${def.regionId}`)}
          />
        ) : (
          <motion.div
            key="play"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-3xl"
          >
            {body}
          </motion.div>
        )}
      </AnimatePresence>
    </ChallengeShell>
  );
}

export default ChallengeRoute;
