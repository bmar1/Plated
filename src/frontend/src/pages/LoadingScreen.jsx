import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChefHat } from 'lucide-react';

/**
 * Full-screen loading overlay that matches the warm editorial design.
 *
 * Props
 * ─────
 * isOnboarding  boolean  When true, cycles through onboarding-specific status
 *                        messages (plan building can take 20-40 s).
 */

const GENERIC_MESSAGES = [
  'Loading your dashboard…',
  'Fetching todays meals…',
  'Checking your progress…',
];

const ONBOARDING_MESSAGES = [
  'Searching for recipes that match your taste…',
  'Calculating nutritional targets…',
  'Pricing your grocery list…',
  'Building your weekly meal plan…',
  'Finalising your shopping list…',
  'Almost there — polishing your plan…',
];

export default function LoadingScreen({ isOnboarding = false }) {
  const reduceMotion = useReducedMotion();
  const messages = isOnboarding ? ONBOARDING_MESSAGES : GENERIC_MESSAGES;
  const [msgIndex, setMsgIndex] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(
      () => setMsgIndex((i) => Math.min(i + 1, messages.length - 1)),
      isOnboarding ? 5500 : 2000,
    );
    return () => clearInterval(interval);
  }, [isOnboarding, messages.length]);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => setDotCount((d) => (d % 3) + 1), 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={reduceMotion ? {} : { opacity: 0 }}
      animate={reduceMotion ? {} : { opacity: 1 }}
      exit={reduceMotion ? {} : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-label="Loading, please wait"
    >
      {/* Backdrop — warm cream tinted with sage */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 60%, hsl(99 32% 42% / 0.12) 0%, transparent 70%), ' +
            'linear-gradient(160deg, hsl(40 33% 92%) 0%, hsl(99 20% 90%) 50%, hsl(40 28% 88%) 100%)',
        }}
      />

      {/* Soft orb 1 */}
      <div
        className="pointer-events-none absolute"
        style={{
          top: '15%',
          left: '20%',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(99 32% 42% / 0.14) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      {/* Soft orb 2 */}
      <div
        className="pointer-events-none absolute"
        style={{
          bottom: '10%',
          right: '15%',
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, hsl(40 33% 70% / 0.18) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Card */}
      <motion.div
        initial={reduceMotion ? {} : { y: 24, opacity: 0 }}
        animate={reduceMotion ? {} : { y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
        className="relative z-10 mx-4 w-full max-w-sm rounded-[2rem] border border-white/60 bg-white/70 px-8 py-10 shadow-2xl shadow-primary/[0.08] backdrop-blur-xl"
      >
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <motion.div
            animate={reduceMotion ? {} : { scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
            className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-primary/10 text-primary shadow-inner"
          >
            <ChefHat size={28} strokeWidth={1.5} />
          </motion.div>
        </div>

        {/* Brand */}
        <p className="mb-1 text-center font-['Playfair_Display',serif] text-xs font-semibold uppercase tracking-[0.22em] text-primary/60">
          Plated
        </p>
        <h1 className="text-center font-['Playfair_Display',serif] text-2xl font-bold leading-snug text-[hsl(99_22%_18%)]">
          {isOnboarding ? 'Building your plan' : 'Loading'}
          <span className="inline-block w-7 text-left">{'·'.repeat(dotCount)}</span>
        </h1>

        {/* Cycling status message */}
        <div className="mt-4 h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={reduceMotion ? {} : { opacity: 0, y: 10 }}
              animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="text-center font-['Crimson_Text',serif] text-base leading-relaxed text-[hsl(99_22%_30%)]"
            >
              {messages[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress track */}
        <div className="relative mt-8 h-1.5 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={
              reduceMotion
                ? {}
                : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
            }
            className="absolute inset-y-0 w-1/2 rounded-full bg-primary/60"
            style={{
              boxShadow: '0 0 12px hsl(99 32% 42% / 0.5)',
            }}
          />
        </div>

        {/* Step dots — only for onboarding */}
        {isOnboarding && (
          <div className="mt-6 flex justify-center gap-2">
            {ONBOARDING_MESSAGES.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i <= msgIndex ? (i === msgIndex ? 20 : 6) : 6,
                  background:
                    i <= msgIndex
                      ? 'hsl(99 32% 42%)'
                      : 'hsl(99 32% 42% / 0.2)',
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
