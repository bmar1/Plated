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
 * Wide glass card, centered in the viewport (slightly below optical center). Two-column on md+.
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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('auth-game-best', String(best));
  }, [best]);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const ripen = () => {
      setRipeIndex((prev) => {
        let next = Math.floor(Math.random() * 9);
        if (next === prev) next = (next + 1) % 9;
        return next;
      });
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
      className="rounded-2xl border border-primary/10 bg-[hsl(40_33%_96%)]/85 p-5 sm:p-6"
      style={{
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85), 0 1px 0 rgba(44,73,39,0.04)'
      }}
    >
      <div className="mb-4 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.16em]">
        <span className="text-primary/70">
          Score <span className="ml-1 font-bold tabular-nums text-primary">{score}</span>
        </span>
        <span className="text-[hsl(28_20%_35%)]/60">
          Best <span className="ml-1 font-bold tabular-nums text-[hsl(28_20%_25%)]">{best}</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {tiles.map(({ Icon, name }, i) => {
          const isRipe = !reduceMotion && i === ripeIndex;
          return (
            <button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              aria-label={`Tile ${i + 1}${isRipe ? `, ripe ${name}` : ''}`}
              className="group relative flex aspect-square min-h-0 items-center justify-center overflow-hidden rounded-xl border border-primary/10 bg-white/70 outline-none transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-[0.94]"
              style={{
                boxShadow: isRipe
                  ? '0 0 0 2px hsl(99 32% 42% / 0.55), 0 6px 20px hsl(99 32% 42% / 0.18)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.9)'
              }}
            >
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
                size={28}
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

      <p className="mt-4 text-center font-['Crimson_Text',serif] text-base italic leading-snug text-[hsl(28_18%_38%)]">
        {reduceMotion ? 'Almost there.' : 'Tap the ripe veggie!'}
      </p>
    </div>
  );
}

export default function AuthLoadingOverlay({ open, mode = 'login' }) {
  const reduceMotion = useReducedMotion();
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
          transition={{ duration: reduceMotion ? 0.08 : 0.16, ease: EASE_OUT }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto px-4 py-10 sm:px-6 sm:py-12"
        >
          {/* Backdrop — warm cream + sage (original recipe) */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 120% 80% at 50% 60%, hsl(99 32% 42% / 0.12) 0%, transparent 70%), ' +
                'linear-gradient(160deg, hsl(40 33% 92% / 0.88) 0%, hsl(99 20% 90% / 0.88) 50%, hsl(40 28% 88% / 0.88) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              top: '15%',
              left: '20%',
              width: 420,
              height: 420,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(99 32% 42% / 0.14) 0%, transparent 70%)',
              filter: 'blur(60px)'
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              bottom: '10%',
              right: '15%',
              width: 320,
              height: 320,
              borderRadius: '50%',
              background: 'radial-gradient(circle, hsl(40 33% 70% / 0.18) 0%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />

          {/* Wide card — centered, nudged slightly below middle of the screen */}
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.28, ease: EASE_OUT }}
            className="relative z-10 w-full max-w-[min(96vw,900px)] translate-y-[min(6vh,3rem)]"
          >
            <div
              className="flex max-h-[min(88vh,620px)] flex-col gap-8 overflow-y-auto rounded-[2.25rem] border border-primary/15 bg-white/85 px-8 py-8 shadow-2xl shadow-primary/[0.08] backdrop-blur-xl sm:px-10 sm:py-10 md:flex-row md:items-stretch md:gap-12"
              style={{
                boxShadow:
                  '0 24px 64px rgba(44,73,39,0.14), 0 4px 16px rgba(44,73,39,0.06), inset 0 1px 0 rgba(255,255,255,0.95)'
              }}
            >
              {/* Left: brand + copy + bar */}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col md:max-w-[54%]">
                <div className="mb-5 flex justify-center md:justify-start">
                  <motion.div
                    animate={reduceMotion ? {} : { scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                    className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-primary/10 text-primary shadow-inner"
                  >
                    <ChefHat size={30} strokeWidth={1.5} />
                  </motion.div>
                </div>

                <p className="mb-1.5 text-center font-['Playfair_Display',serif] text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/60 md:text-left">
                  Plated
                </p>
                <h2
                  id={headingId}
                  className="text-center font-['Playfair_Display',serif] text-3xl font-bold leading-snug text-[hsl(28_28%_12%)] sm:text-[2rem] md:text-left"
                >
                  {heading}
                </h2>

                <p
                  id={statusId}
                  className="mx-auto mt-4 max-w-xl text-center font-['Crimson_Text',serif] text-base leading-relaxed text-[hsl(28_14%_38%)] md:mx-0 md:text-left"
                >
                  <span className="font-medium text-[hsl(28_22%_22%)]">Thanks for your patience</span>
                  {' '}
                  while we connect—the first request after idle can be a touch slower.
                </p>

                <div className="relative mt-6 h-2 shrink-0 overflow-hidden rounded-full bg-primary/10">
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
              </div>

              {/* Right: game — horizontal breathing room on md+ */}
              <div className="flex min-h-0 min-w-0 shrink-0 flex-col justify-center md:w-[min(100%,380px)] md:flex-initial md:border-l md:border-primary/10 md:pl-12">
                <VeggieGame reduceMotion={reduceMotion} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
