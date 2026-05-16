import { useEffect, useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useA11yStore } from '@/stores/a11yStore';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  minSize?: number;
  children: ReactNode;
}

/**
 * Every clickable in the game should be a TapTarget — guarantees 64px+ hit area
 * and supports dwell-click (hover/focus and hold to activate) when enabled.
 */
export function TapTarget({ minSize = 64, children, onClick, style, ...rest }: Props) {
  const dwellMs = useA11yStore((s) => s.settings.dwellMs);
  const ref = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!dwellMs || dwellMs <= 0) return;
    const el = ref.current;
    if (!el) return;

    const start = (e: Event) => {
      timer.current = window.setTimeout(() => {
        (e.target as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }, dwellMs);
    };
    const cancel = () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = undefined;
      }
    };

    el.addEventListener('pointerenter', start);
    el.addEventListener('focus', start);
    el.addEventListener('pointerleave', cancel);
    el.addEventListener('blur', cancel);
    el.addEventListener('click', cancel);

    return () => {
      cancel();
      el.removeEventListener('pointerenter', start);
      el.removeEventListener('focus', start);
      el.removeEventListener('pointerleave', cancel);
      el.removeEventListener('blur', cancel);
      el.removeEventListener('click', cancel);
    };
  }, [dwellMs]);

  return (
    <button
      ref={ref}
      onClick={onClick}
      style={{ minWidth: minSize, minHeight: minSize, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
}
