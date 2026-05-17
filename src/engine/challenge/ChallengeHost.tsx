import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChallengeShell } from './ChallengeShell';
import type { ChallengeContext } from './types';
import { getChallenge } from './registry';
import { PickGame } from '@/components/primitives/PickGame';
import { MatchGame } from '@/components/primitives/MatchGame';
import { SortGame } from '@/components/primitives/SortGame';
import { OrderGame } from '@/components/primitives/OrderGame';
import { BloomCeremony } from '@/components/ui/BloomCeremony';
import { play as narrate } from '@/systems/narration/narrator';
import { playSfx } from '@/systems/audio/procedural';
import { startAmbient } from '@/systems/audio/ambient';
import { applyRegionTheme } from '@/systems/theming/regionTheme';
import { useProgressStore } from '@/stores/progressStore';
import type { BloomTier, ChallengeResult, Lang } from '@/types';

interface CeremonyState {
  stars: 1 | 2 | 3;
  newTier: BloomTier;
  tierIncreased: boolean;
  stickerJustEarned: string | null;
}

export function ChallengeRoute() {
  const { challengeId = '' } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation('challenges');
  const lang = (i18n.language as Lang) ?? 'sv';

  const def = useMemo(() => getChallenge(challengeId), [challengeId]);
  const [ceremony, setCeremony] = useState<CeremonyState | undefined>();
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
    // Snapshot whether the sticker was already owned BEFORE recording — so we
    // can tell the ceremony to play the first-time reveal animation.
    const beforeStickers = new Set(
      useProgressStore.getState().progress?.inventory.stickers ?? [],
    );

    const { newTier, tierIncreased } = await recordCompletion({
      regionId: def.regionId,
      challengeId: def.id,
      stars: result.stars ?? 1,
      seedsAwarded: def.seedsAwarded ?? 2,
      stickerAwarded: def.stickerOnFirstClear,
    });

    const stickerJustEarned =
      def.stickerOnFirstClear && !beforeStickers.has(def.stickerOnFirstClear)
        ? def.stickerOnFirstClear
        : null;

    setCeremony({
      stars: result.stars ?? 1,
      newTier,
      tierIncreased,
      stickerJustEarned,
    });
  };

  const restart = () => {
    setCeremony(undefined);
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
        {ceremony ? (
          <BloomCeremony
            key="done"
            region={def.regionId}
            stars={ceremony.stars}
            newTier={ceremony.newTier}
            tierIncreased={ceremony.tierIncreased}
            stickerJustEarned={ceremony.stickerJustEarned}
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
