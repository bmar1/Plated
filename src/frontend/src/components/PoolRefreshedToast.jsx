/**
 * @file PoolRefreshedToast.jsx
 * @description Small corner toast that appears when the backend has auto-regenerated the
 * user's weekly meal pool. Auto-dismisses after 5 seconds. Styled to match the
 * warm-cream / sage editorial palette used across the rest of the app.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Salad, X } from 'lucide-react';

const DURATION_MS = 5000;
const EASE_OUT = [0.23, 1, 0.32, 1];

export default function PoolRefreshedToast({ onClose }) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  const dismiss = () => {
    setVisible(false);
    // Give exit animation time to finish before unmounting
    setTimeout(() => onClose?.(), 300);
  };

  useEffect(() => {
    timerRef.current = setTimeout(dismiss, DURATION_MS);
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="pool-toast"
          role="status"
          aria-live="polite"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 80 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 80 }}
          transition={{ duration: 0.32, ease: EASE_OUT }}
          className="fixed bottom-6 right-6 z-[60] w-[17rem] overflow-hidden rounded-2xl shadow-xl shadow-primary/[0.15]"
          style={{
            background: 'rgba(255,253,248,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(90,122,77,0.18)',
          }}
        >
          {/* Content */}
          <div className="flex items-start gap-3 px-4 pt-4 pb-3">
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Salad size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-playfair text-sm font-bold leading-snug text-hero-heading">
                Weekly pool refreshed
              </p>
              <p className="mt-0.5 font-crimson text-xs leading-relaxed text-hero-sub">
                Fresh meals have been picked for you.
              </p>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              className="mt-0.5 flex-shrink-0 rounded-full p-1 text-hero-sub transition-colors duration-150 hover:bg-primary/10 hover:text-hero-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X size={13} />
            </button>
          </div>

          {/* Draining progress bar */}
          <div className="h-0.5 w-full bg-primary/10">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: DURATION_MS / 1000, ease: 'linear' }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
