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

function Icon({ id, size = 22 }: { id: string; size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <use href={`#${id}`} />
    </svg>
  );
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
        className="flex flex-wrap items-center justify-between gap-2 border-b backdrop-blur-sm px-safe pt-safe pb-3"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in srgb, var(--color-accent) 14%, white) 0%, color-mix(in srgb, var(--color-accent) 6%, white) 100%)',
          borderColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)',
        }}
      >
        <TapTarget
          onClick={onExit}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-display font-bold text-ink-soft hover:bg-ink/5 sm:text-base"
          aria-label={t('challengeShell.exit')}
        >
          <Icon id="bw-arrow-back" />
          <span className="hidden sm:inline">{t('challengeShell.exit')}</span>
        </TapTarget>
        <h1 className="order-3 w-full text-center font-display text-base font-bold sm:order-none sm:w-auto sm:text-xl">
          {title}
        </h1>
        <div className="flex gap-2">
          {onUndo && (
            <TapTarget
              onClick={onUndo}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-display font-bold text-ink-soft shadow-bloom sm:text-base"
              aria-label={t('challengeShell.undo')}
              style={{ color: 'var(--color-accent)' }}
            >
              <Icon id="bw-undo" />
              <span className="hidden sm:inline">{t('challengeShell.undo')}</span>
            </TapTarget>
          )}
          {onSkip && (
            <TapTarget
              onClick={onSkip}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-sm font-display font-bold text-ink-soft shadow-bloom sm:text-base"
              aria-label={t('challengeShell.skip')}
            >
              <Icon id="bw-arrow-skip" />
              <span className="hidden sm:inline">{t('challengeShell.skip')}</span>
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
