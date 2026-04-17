/**
 * @file NewMealShowcase.jsx
 * @description Modal that celebrates a newly generated meal plan.
 * Styled to match the Landing/About/Login premium editorial aesthetic:
 * warm cream background, `warm-pane` glass surface, Playfair headings,
 * sage primary, and smooth framer-motion enter/exit.
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Flame, Salad, Sparkles, X } from 'lucide-react';

const EASE_OUT = [0.23, 1, 0.32, 1];
const MEAL_FALLBACK = '/meal.jpg';

const handleImgFallback = (e) => {
  if (e.currentTarget.src.endsWith(MEAL_FALLBACK)) return;
  e.currentTarget.src = MEAL_FALLBACK;
};

function MealCard({ meal, index, onClick, delay, reduceMotion }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: EASE_OUT }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      className="group warm-pane flex w-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] text-left shadow-lg shadow-primary/[0.05] transition-shadow duration-300 ease-out hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="relative h-44 overflow-hidden">
          <img
            src={meal.thumbnail || MEAL_FALLBACK}
            alt={meal.name}
            loading="lazy"
            onError={handleImgFallback}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(24,36,18,0.45) 0%, rgba(24,36,18,0.08) 45%, transparent 70%)',
            }}
          />
          <div className="absolute left-3 top-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-primary shadow-sm"
              style={{ backdropFilter: 'blur(10px)' }}
            >
              <Sparkles size={10} />
              #{index + 1}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-hero-heading transition-colors duration-200 ease-out group-hover:text-primary">
            {meal.name}
          </h3>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {meal.calories != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <Flame size={11} />
                {meal.calories} cal
              </span>
            )}
            {meal.category && (
              <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-hero-sub">
                {meal.category}
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
            View recipe
            <ArrowRight
              size={14}
              className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default function NewMealPlanShowcase({ meals, onClose }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const displayMeals = (meals || []).slice(0, 3);

  const onMealClick = (recipeName) => {
    navigate('/recipe', { state: { name: recipeName } });
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const gridClass =
    displayMeals.length === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : displayMeals.length === 1
      ? 'grid-cols-1'
      : 'grid-cols-1 md:grid-cols-3';

  return (
    <AnimatePresence>
      <motion.div
        key="meal-showcase-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: EASE_OUT }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="meal-showcase-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        style={{
          background: 'rgba(28, 36, 24, 0.48)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      >
        <motion.div
          key="meal-showcase-panel"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 12 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 }}
          transition={{ duration: 0.28, ease: EASE_OUT }}
          onClick={(e) => e.stopPropagation()}
          className="warm-pane relative w-full max-w-4xl overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-primary/[0.18] sm:p-10"
        >
          <div className="relative z-10">
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/12 bg-white/70 text-hero-sub transition-colors duration-200 ease-out hover:bg-white hover:text-hero-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-8 text-center sm:mb-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <Salad size={12} />
                New meal plan
              </div>
              <h2
                id="meal-showcase-title"
                className="mt-5 text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl"
              >
                Your fresh selections
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-hero-sub sm:text-lg">
                Three meals, picked for your week. Tap any to see the full recipe.
              </p>
            </div>

            {/* Meals grid */}
            {displayMeals.length > 0 ? (
              <div className={`mx-auto grid gap-4 sm:gap-6 ${gridClass}`}>
                {displayMeals.map((meal, index) => (
                  <MealCard
                    key={meal.id ?? `${meal.name}-${index}`}
                    meal={meal}
                    index={index}
                    delay={0.1 + index * 0.06}
                    onClick={() => onMealClick(meal.name)}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-md rounded-[1.5rem] border border-border/60 bg-white/70 p-6 text-center text-hero-sub">
                No meals ready yet — try again in a moment.
              </div>
            )}

            {/* Footer CTA */}
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 ease-out hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Start cooking
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/12 bg-white/70 px-7 py-3 text-base font-semibold text-hero-heading transition-colors duration-200 ease-out hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
