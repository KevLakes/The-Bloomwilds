import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { subscribeCaptions, type CaptionEvent } from '@/systems/narration/narrator';
import { useA11yStore } from '@/stores/a11yStore';

const HIDE_AFTER_MS = 5000;

export function CaptionBar() {
  const captionsOn = useA11yStore((s) => s.settings.captions);
  const [caption, setCaption] = useState<CaptionEvent | undefined>();

  useEffect(() => {
    let timer: number | undefined;
    const unsubscribe = subscribeCaptions((e) => {
      setCaption(e);
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => setCaption(undefined), HIDE_AFTER_MS);
    });
    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  if (!captionsOn) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <AnimatePresence>
        {caption && (
          <motion.div
            key={caption.key + caption.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            role="status"
            aria-live="polite"
            lang={caption.lang}
            className="max-w-3xl rounded-bloom bg-ink/90 px-6 py-3 text-center text-lg text-white shadow-bloom"
          >
            {caption.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
