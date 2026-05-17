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
    <div
      className="flex min-h-screen-d flex-col"
      style={{
        background:
          'radial-gradient(circle at 12% 0%, var(--color-glow) 0%, transparent 38%), linear-gradient(180deg, var(--color-canvas-2) 0%, var(--color-canvas) 60%)',
      }}
    >
      <header
        className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 bg-white/70 backdrop-blur-sm px-safe pt-safe pb-3"
      >
        <TapTarget
          onClick={onExit}
          className="rounded-full px-3 py-2 text-sm sm:text-base font-display font-bold text-ink-soft hover:bg-ink/5"
          aria-label={t('challengeShell.exit')}
        >
          ← <span className="hidden sm:inline">{t('challengeShell.exit')}</span>
        </TapTarget>
        <h1 className="order-3 w-full text-center font-display text-lg font-bold sm:order-none sm:w-auto sm:text-xl">
          {title}
        </h1>
        <div className="flex gap-2">
          {onUndo && (
            <TapTarget
              onClick={onUndo}
              className="rounded-full bg-white px-3 py-2 text-sm sm:text-base font-display shadow-bloom"
              aria-label={t('challengeShell.undo')}
            >
              ↺ <span className="hidden sm:inline">{t('challengeShell.undo')}</span>
            </TapTarget>
          )}
          {onSkip && (
            <TapTarget
              onClick={onSkip}
              className="rounded-full bg-white px-3 py-2 text-sm sm:text-base font-display shadow-bloom"
              aria-label={t('challengeShell.skip')}
            >
              › <span className="hidden sm:inline">{t('challengeShell.skip')}</span>
            </TapTarget>
          )}
        </div>
      </header>
      <section className="flex flex-1 flex-col items-center justify-center px-safe py-safe">
        <div className="bw-content bw-stack">{children}</div>
      </section>
    </div>
  );
}
