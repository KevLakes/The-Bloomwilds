import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useA11yStore } from '@/stores/a11yStore';

interface Props {
  children: ReactNode;
}

/**
 * Wraps the active route in an AnimatePresence keyed by pathname so route
 * changes animate in/out. Reduced-motion uses a quick fade; off-motion skips
 * the animation entirely. The keyed motion.div lives outside <main> so it
 * doesn't disturb page semantics.
 */
export function PageTransition({ children }: Props) {
  const location = useLocation();
  const motionLevel = useA11yStore((s) => s.settings.motion);

  if (motionLevel === 'off') {
    return <>{children}</>;
  }

  const isReduced = motionLevel === 'reduced';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={isReduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.985 }}
        animate={isReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.99 }}
        transition={{
          duration: isReduced ? 0.15 : 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ minHeight: '100dvh', width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
