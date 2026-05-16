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
import { Button } from '@/components/ui/Button';
import { SparkAvatar } from '@/components/ui/SparkAvatar';
import { play as narrate } from '@/systems/narration/narrator';
import { audioBus } from '@/systems/audio/audioBus';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import { useProfileStore } from '@/stores/profileStore';
import { useProgressStore } from '@/stores/progressStore';
import { useA11yStore } from '@/stores/a11yStore';
import type { ChallengeResult, Lang } from '@/types';

function playSfx(name: 'sparkle' | 'bloom' | 'success' | 'gentle-error'): void {
  void audioBus.play(`/audio/sfx/${name}.mp3`, { channel: 'sfx' });
}

interface CelebrationProps {
  region: ChallengeDef['regionId'];
  onAgain: () => void;
  onMap: () => void;
}

function Celebration({ region, onAgain, onMap }: CelebrationProps) {
  const { t } = useTranslation('ui');
  const active = useProfileStore((s) => s.active);
  const calm = useA11yStore((s) => s.settings.calm);

  useEffect(() => {
    if (!calm) void narrate(`bloomTier.1`);
  }, [calm]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="text-7xl" aria-hidden>
        🌸
      </div>
      <h2 className="font-display text-4xl font-bold text-moss">{t('challengeShell.wellDone')}</h2>
      {active && <SparkAvatar look={active.spark} size={140} />}
      <p className="text-ink/70">{region}</p>
      <div className="flex gap-3">
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
    if (def) applyRegionTheme(def.regionId);
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
  } else {
    body = <p>—</p>;
  }

  return (
    <ChallengeShell
      title={t(`${def.id}.title`)}
      onUndo={undoRef.current}
      onSkip={() => navigate(`/map/${def.regionId}`)}
      onExit={() => navigate(`/map/${def.regionId}`)}
    >
      <AnimatePresence mode="wait">
        {done ? (
          <Celebration
            key="done"
            region={def.regionId}
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
