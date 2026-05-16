import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TapTarget } from '@/components/ui/TapTarget';

interface Props {
  title: string;
  onUndo?: () => void;
  onSkip?: () => void;
  onExit: () => void;
  children: ReactNode;
}

export function ChallengeShell({ title, onUndo, onSkip, onExit, children }: Props) {
  const { t } = useTranslation('ui');
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="flex items-center justify-between border-b border-ink/10 bg-white/70 px-6 py-3">
        <TapTarget
          onClick={onExit}
          className="rounded-bloom px-3 py-2 text-base font-display font-bold text-ink/70 hover:bg-ink/5"
          aria-label={t('challengeShell.exit')}
        >
          ← {t('challengeShell.exit')}
        </TapTarget>
        <h1 className="font-display text-xl font-bold">{title}</h1>
        <div className="flex gap-2">
          {onUndo && (
            <TapTarget
              onClick={onUndo}
              className="rounded-bloom bg-white px-3 py-2 text-base font-display shadow-bloom"
              aria-label={t('challengeShell.undo')}
            >
              ↺ {t('challengeShell.undo')}
            </TapTarget>
          )}
          {onSkip && (
            <TapTarget
              onClick={onSkip}
              className="rounded-bloom bg-white px-3 py-2 text-base font-display shadow-bloom"
              aria-label={t('challengeShell.skip')}
            >
              › {t('challengeShell.skip')}
            </TapTarget>
          )}
        </div>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        {children}
      </section>
    </div>
  );
}
