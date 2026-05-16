import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useA11yStore } from '@/stores/a11yStore';
import { play } from '@/systems/narration/narrator';

interface Props {
  narrationKey: string;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div';
  className?: string;
  children?: ReactNode;
  autoNarrate?: boolean;
}

/**
 * Renders text and lets the narrator read it on focus/hover-once.
 * Uses narration JSON; falls back to children if the key is missing.
 */
export function NarratedText({
  narrationKey,
  as: Tag = 'p',
  className = '',
  children,
  autoNarrate = true,
}: Props) {
  const { t, i18n } = useTranslation('narration');
  const simple = useA11yStore((s) => s.settings.simpleLanguage);
  const readToMe = useA11yStore((s) => s.settings.readToMe);
  const playedRef = useRef(false);

  const fromI18n = t(`${narrationKey}.${simple ? 'simple' : 'text'}`, { defaultValue: '' });
  const text = fromI18n || (typeof children === 'string' ? children : '');

  const trigger = () => {
    if (!readToMe || playedRef.current) return;
    playedRef.current = true;
    void play(narrationKey, { simple });
  };

  return (
    <Tag
      className={className}
      lang={i18n.language}
      tabIndex={autoNarrate ? 0 : undefined}
      onMouseEnter={autoNarrate ? trigger : undefined}
      onFocus={autoNarrate ? trigger : undefined}
    >
      {text || children}
    </Tag>
  );
}
