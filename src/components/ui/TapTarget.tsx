import { useEffect, useRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { useA11yStore } from '@/stores/a11yStore';

interface Props extends HTMLMotionProps<'button'> {
  minSize?: number;
  children: ReactNode;
  /** Skip the spring-physics press animation. Use for non-tactile chrome like the language toggle. */
  noPressFx?: boolean;
}

/**
 * Every clickable in the game is a TapTarget. Guarantees:
 *  - 48px+ hit area (defaults to 48 to match WCAG; pass `minSize` to enforce more)
 *  - Spring-physics press feedback gated on a11y motion setting
 *  - Dwell-click (hover/focus + hold to activate) when `dwellMs > 0`
 */
export function TapTarget({
  minSize = 48,
  children,
  onClick,
  style,
  noPressFx,
  ...rest
}: Props) {
  const dwellMs = useA11yStore((s) => s.settings.dwellMs);
  const motionLevel = useA11yStore((s) => s.settings.motion);
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

  const wantsMotion = !noPressFx && motionLevel !== 'off';
  const tapAnim = wantsMotion
    ? motionLevel === 'reduced'
      ? { scale: 0.98 }
      : { scale: 0.94, y: 2 }
    : undefined;

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      style={{ minWidth: minSize, minHeight: minSize, ...style }}
      whileTap={tapAnim}
      transition={{ type: 'spring', stiffness: 600, damping: 22, mass: 0.4 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
