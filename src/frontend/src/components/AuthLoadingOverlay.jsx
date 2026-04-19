import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  ChefHat,
  Carrot,
  Apple,
  Cherry,
  Salad,
  Egg,
  Wheat,
  Citrus,
  Grape,
  Beef
} from 'lucide-react';

/**
 * Modal-style loading overlay shown while the auth backend is spinning up.
 * Sits over the dimmed login form, explains cold-start wait times, and keeps
 * the user engaged with a small "Tap the Ripe Veggie" mini-game.
 *
 * Props
 * ─────
 * open  boolean              Controls visibility (mounts/unmounts via AnimatePresence).
 * mode  'login' | 'signup'   Drives heading copy.
 */

const EASE_OUT = [0.23, 1, 0.32, 1];

const VEGGIES = [
  { Icon: Carrot, name: 'carrot' },
  { Icon: Apple, name: 'apple' },
  { Icon: Cherry, name: 'cherry' },
  { Icon: Salad, name: 'salad' },
  { Icon: Egg, name: 'egg' },
  { Icon: Wheat, name: 'wheat' },
  { Icon: Citrus, name: 'citrus' },
  { Icon: Grape, name: 'grape' },
  { Icon: Beef, name: 'beef' }
];

/** Supplementary lines that rotate—each reinforces cold-start + patience (no countdown). */
const COLD_START_MESSAGES = [
  'After quiet periods the hosted backend can be asleep. It is spinning back up now—this is a normal cold start, not a bug.',
  'Cold starts can take 30–60 seconds (sometimes a bit more on a free tier). Please stay on this screen—we will finish as soon as it is ready.',
  'Your request is queued while the server wakes. Thank you for being patient.',
  'Still starting up? That usually means the machine was idle. Hang tight—we are not ignoring you.'
];

function VeggieGame({ reduceMotion }) {
  const [ripeIndex, setRipeIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = parseInt(window.localStorage.getItem('auth-game-best') || '0', 10);
    return Number.isFinite(stored) ? stored : 0;
  });
  const ripenTimerRef = useRef(null);
  const fadeTimerRef = useRef(null);

  // Persist best score whenever it grows.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('auth-game-best', String(best));
  }, [best]);

  // Drive ripening interval. Skip entirely under reduced motion.
  useEffect(() => {
    if (reduceMotion) return undefined;

    const ripen = () => {
      setRipeIndex((prev) => {
        let next = Math.floor(Math.random() * 9);
        // Avoid landing on the same tile twice in a row.
        if (next === prev) next = (next + 1) % 9;
        return next;
      });
      // Auto-fade after 700ms if not tapped.
      window.clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = window.setTimeout(() => {
        setRipeIndex(-1);
      }, 700);
    };

    ripen();
    ripenTimerRef.current = window.setInterval(ripen, 900);

    return () => {
      window.clearInterval(ripenTimerRef.current);
      window.clearTimeout(fadeTimerRef.current);
    };
  }, [reduceMotion]);

  const handleTap = (index) => {
    if (reduceMotion) return;
    if (index !== ripeIndex) return;
    const nextScore = score + 1;
    setScore(nextScore);
    setBest((b) => Math.max(b, nextScore));
    setRipeIndex(-1);
    window.clearTimeout(fadeTimerRef.current);
  };

  const tiles = useMemo(
    () => Array.from({ length: 9 }, (_, i) => VEGGIES[i % VEGGIES.length]),
    []
  );

  return (
    <div
      className="rounded-2xl border border-primary/10 bg-[hsl(40_33%_96%)]/80 p-4"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 0 rgba(44,73,39,0.04)'
      }}
    >
      {/* Score row */}
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em]">
        <span className="text-primary/70">
          Score <span className="ml-1 font-bold tabular-nums text-primary">{score}</span>
        </span>
        <span className="text-[hsl(28_20%_35%)]/60">
          Best <span className="ml-1 font-bold tabular-nums text-[hsl(28_20%_25%)]">{best}</span>
        </span>
      </div>

      {/* 3x3 grid */}
      <div className="grid grid-cols-3 gap-2">
        {tiles.map(({ Icon, name }, i) => {
          const isRipe = !reduceMotion && i === ripeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              aria-label={`Tile ${i + 1}${isRipe ? `, ripe ${name}` : ''}`}
              className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-white/70 outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.94]"
              style={{
                boxShadow: isRipe
                  ? '0 0 0 2px hsl(99 32% 42% / 0.55), 0 6px 20px hsl(99 32% 42% / 0.18)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            >
              {/* Sage halo when ripe */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background: isRipe
                    ? 'radial-gradient(circle at 50% 55%, hsl(99 32% 42% / 0.18) 0%, transparent 70%)'
                    : 'transparent',
                  transition: 'background 180ms cubic-bezier(0.23, 1, 0.32, 1)'
                }}
              />
              <Icon
                size={26}
                strokeWidth={1.6}
                className="relative z-10"
                style={{
                  color: isRipe ? 'hsl(8 65% 50%)' : 'hsl(99 18% 55% / 0.55)',
                  transform: isRipe ? 'scale(1.12)' : 'scale(1)',
                  transition:
                    'transform 180ms cubic-bezier(0.23, 1, 0.32, 1), color 180ms ease-out'
                }}
              />
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-center font-['Crimson_Text',serif] text-sm italic text-[hsl(28_18%_38%)]">
        {reduceMotion ? 'Take a breath, we’re almost ready.' : 'Tap the ripe veggie!'}
      </p>
    </div>
  );
}

export default function AuthLoadingOverlay({ open, mode = 'login' }) {
  const reduceMotion = useReducedMotion();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setMsgIndex(0);
      return undefined;
    }
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % COLD_START_MESSAGES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [open]);

  const heading = mode === 'signup' ? 'Setting your table' : 'Welcome back';
  const headingId = 'auth-loading-heading';
  const statusId = 'auth-loading-status';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="auth-loading-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          aria-describedby={statusId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: EASE_OUT }}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        >
          {/* Cream-tinted backdrop with blur over the form */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 120% 80% at 50% 60%, hsl(99 32% 42% / 0.10) 0%, transparent 70%), ' +
                'linear-gradient(160deg, hsl(40 33% 92% / 0.85) 0%, hsl(99 20% 90% / 0.85) 50%, hsl(40 28% 88% / 0.85) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          {/* Soft orbs for warmth */}
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: '12%',
              left: '18%',
              width: 360,
              height: 360,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(99 32% 42% / 0.14) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: '8%',
              right: '12%',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(40 33% 70% / 0.20) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />

          {/* Card */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="relative z-10 w-full max-w-md rounded-[2rem] border border-primary/15 bg-white/85 px-7 py-8 shadow-2xl shadow-primary/[0.08] backdrop-blur-xl"
            style={{
              boxShadow:
                '0 24px 64px rgba(44,73,39,0.14), 0 4px 16px rgba(44,73,39,0.06), inset 0 1px 0 rgba(255,255,255,0.95)'
            }}
          >
            {/* Icon */}
            <div className="mb-5 flex justify-center">
              <motion.div
                animate={reduceMotion ? {} : { scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner"
              >
                <ChefHat size={26} strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Brand + heading */}
            <p className="mb-1 text-center font-['Playfair_Display',serif] text-[11px] font-semibold uppercase tracking-[0.24em] text-primary/60">
              Plated
            </p>
            <h2
              id={headingId}
              className="text-center font-['Playfair_Display',serif] text-2xl font-bold leading-snug text-[hsl(28_28%_12%)]"
            >
              {heading}
            </h2>

            {/* Primary cold-start explainer (always visible) */}
            <p
              id={statusId}
              className="mx-auto mt-4 max-w-[22rem] text-center font-['Crimson_Text',serif] text-[15px] leading-relaxed text-[hsl(28_14%_34%)]"
            >
              The backend may be waking from a <span className="font-semibold text-[hsl(28_22%_22%)]">cold start</span>
              —the server was idle and is spinning back up. Please be patient; your login or signup will complete once
              it is ready.
            </p>

            {/* Rotating supplementary copy (no timer) */}
            <div className="mx-auto mt-4 min-h-[4.25rem] max-w-[22rem]" aria-live="polite" aria-atomic="true">
              <AnimatePresence mode="wait">
                <motion.p
                  key={msgIndex}
                  initial={reduceMotion ? {} : { opacity: 0, y: 6 }}
                  animate={reduceMotion ? {} : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.32, ease: EASE_OUT }}
                  className="text-center font-['Crimson_Text',serif] text-sm italic leading-relaxed text-[hsl(28_14%_40%)]"
                >
                  {COLD_START_MESSAGES[msgIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Mini-game */}
            <div className="mt-2">
              <VeggieGame reduceMotion={reduceMotion} />
            </div>

            {/* Indeterminate shimmer — activity only, no clock */}
            <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-primary/10">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
                }
                className="absolute inset-y-0 w-1/2 rounded-full bg-primary/60"
                style={{ boxShadow: '0 0 12px hsl(99 32% 42% / 0.5)' }}
              />
            </div>
            <p className="mt-3 text-center text-xs font-medium uppercase tracking-[0.18em] text-[hsl(28_14%_44%)]/70">
              Backend starting
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
