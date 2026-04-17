/**
 * @file RecipePage.jsx
 * @description Editorial cook-along page: hero art, ingredient list, step-by-step
 * instructions with progress tracking, and a video tutorial. Marks meals as
 * eaten once all steps are completed. Styling mirrors the warm editorial
 * palette used by Landing / Dashboard (warm-pane, Playfair headings, primary
 * green accents) and uses framer-motion for entrance + interaction animation.
 */
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Beef,
  CalendarDays,
  Check,
  CheckCircle2,
  ChefHat,
  Clock,
  Droplet,
  Flame,
  Leaf,
  ListChecks,
  MapPin,
  Play,
  Sparkles,
  Wheat
} from 'lucide-react';
import AmbientBackdrop from '../components/AmbientBackdrop';
import { VITE_API_URL } from '../config/env';

const EASE_OUT = [0.23, 1, 0.32, 1];
const MEAL_FALLBACK = '/meal.jpg';

const handleImgFallback = (e) => {
  if (e.currentTarget.src.endsWith(MEAL_FALLBACK)) return;
  e.currentTarget.src = MEAL_FALLBACK;
};

function FadeIn({ children, delay = 0, className = '', y = 16 }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function NutritionTile({ icon: Icon, label, value, unit, delay, reduceMotion }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE_OUT }}
      className="warm-pane rounded-[1.5rem] p-5"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
        <span className="font-crimson text-xs uppercase tracking-[0.28em] text-hero-sub">
          {label}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-1">
        <span className="font-playfair text-3xl font-semibold text-hero-heading">{value}</span>
        <span className="font-crimson text-sm text-hero-sub">{unit}</span>
      </div>
    </motion.div>
  );
}

const RecipePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { name } = location.state || {};

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stepCompleted, setStepCompleted] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [mealEaten, setMealEaten] = useState(false);

  const markMealAsEaten = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `${VITE_API_URL}/meals/updateMeal?name=${encodeURIComponent(name)}`;
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to mark meal as eaten:', error);
    }
  };

  const handleBack = () => navigate('/dashboard');

  useEffect(() => {
    const loadMeal = async () => {
      if (!name) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const encodedName = encodeURIComponent(name);
        const response = await fetch(`${VITE_API_URL}/meal?name=${encodedName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setRecipe(Array.isArray(data) ? data[0] : data);
        } else {
          setRecipe(null);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setRecipe(null);
      } finally {
        setLoading(false);
      }
    };

    loadMeal();
  }, [name]);

  // Split instructions into discrete steps, tolerating both literal `\n` and
  // escaped sequences the backend occasionally returns.
  const steps = useMemo(() => {
    if (!recipe?.instructions) return [];
    return recipe.instructions
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .split(/\n+/)
      .filter((step) => step.trim() !== '');
  }, [recipe?.instructions]);

  const completedCount = stepCompleted.filter(Boolean).length;
  const completionPercentage =
    steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;
  const allStepsCompleted = steps.length > 0 && completedCount === steps.length;

  useEffect(() => {
    if (steps && steps.length > 0) {
      setStepCompleted(new Array(steps.length).fill(false));
    }
  }, [steps]);

  useEffect(() => {
    if (stepCompleted.length > 0 && steps.length > 0) {
      const allCompleted = stepCompleted.every(Boolean);
      if (allCompleted && !mealEaten) {
        setShowPopup(true);
        setMealEaten(true);
        const timer = setTimeout(() => setShowPopup(false), 4000);
        return () => clearTimeout(timer);
      }
    }
  }, [stepCompleted, steps.length, mealEaten]);

  useEffect(() => {
    if (mealEaten && name) markMealAsEaten();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealEaten, name]);

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const videoId = url.split('v=')[1];
    if (!videoId) return null;
    const ampersandPosition = videoId.indexOf('&');
    if (ampersandPosition !== -1) {
      return `https://www.youtube.com/embed/${videoId.substring(0, ampersandPosition)}`;
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const embedUrl = getYouTubeEmbedUrl(recipe?.youtube);

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AmbientBackdrop position="absolute" />
        <div className="relative flex min-h-screen items-center justify-center px-6">
          <FadeIn className="warm-pane flex items-center gap-3 rounded-full px-6 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="font-playfair text-lg text-hero-heading">Plating your recipe…</span>
          </FadeIn>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background">
        <AmbientBackdrop position="absolute" />
        <div className="relative flex min-h-screen items-center justify-center px-6">
          <FadeIn className="warm-pane max-w-md rounded-[2rem] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ChefHat className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-playfair text-2xl text-hero-heading">
              Recipe not found
            </h2>
            <p className="mt-2 font-crimson text-hero-sub">
              We couldn&apos;t pull this one up. Head back to the dashboard and pick another.
            </p>
            <button
              type="button"
              onClick={handleBack}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-crimson text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back to dashboard
            </button>
          </FadeIn>
        </div>
      </div>
    );
  }

  const hasNutrition =
    recipe.calories > 0 || recipe.protein > 0 || recipe.carbohydrate > 0 || recipe.fat > 0;

  const eyebrowDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AmbientBackdrop position="absolute" />

      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="celebration"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2"
            role="status"
            aria-live="polite"
          >
            <div className="warm-pane flex items-center gap-3 rounded-full px-6 py-4 shadow-xl shadow-primary/15">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
              </span>
              <div>
                <p className="font-playfair text-base text-hero-heading">
                  Meal complete
                </p>
                <p className="font-crimson text-xs text-hero-sub">
                  Nicely done — logged to today&apos;s plan.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-6xl px-6 py-10 lg:py-14">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.button
              type="button"
              onClick={handleBack}
              whileHover={reduceMotion ? undefined : { x: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="warm-pane group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-crimson text-sm font-semibold text-hero-heading transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-x-0.5"
                strokeWidth={2}
              />
              Back to dashboard
            </motion.button>

            {steps.length > 0 && (
              <div className="warm-pane flex items-center gap-3 rounded-full px-5 py-2.5">
                <ProgressRing percent={completionPercentage} />
                <div>
                  <p className="font-crimson text-[0.7rem] uppercase tracking-[0.28em] text-hero-sub">
                    Progress
                  </p>
                  <p className="font-playfair text-sm text-hero-heading">
                    {completedCount}/{steps.length} steps
                  </p>
                </div>
              </div>
            )}
          </div>
        </FadeIn>

        {/* Eyebrow */}
        <FadeIn delay={0.05} className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 font-crimson text-xs uppercase tracking-[0.3em] text-primary">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
            <span>{eyebrowDate}</span>
          </div>
        </FadeIn>

        {/* Hero */}
        {recipe.thumbnail ? (
          <FadeIn delay={0.1} className="mt-4">
            <div className="warm-pane group relative overflow-hidden rounded-[2.25rem]">
              <div className="relative h-[22rem] overflow-hidden md:h-[28rem]">
                <img
                  src={recipe.thumbnail}
                  alt={recipe.name}
                  loading="eager"
                  onError={handleImgFallback}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hero-heading/80 via-hero-heading/25 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                  <div className="flex items-center gap-2 font-crimson text-xs uppercase tracking-[0.32em] text-white/80">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Today&apos;s cook-along</span>
                  </div>
                  <h1 className="mt-3 font-playfair text-4xl font-semibold leading-tight text-white drop-shadow-sm md:text-5xl">
                    {recipe.name}
                  </h1>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {recipe.category && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 font-crimson text-xs text-white backdrop-blur">
                        <Leaf className="h-3 w-3" strokeWidth={2} />
                        {recipe.category}
                      </span>
                    )}
                    {recipe.area && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 font-crimson text-xs text-white backdrop-blur">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {recipe.area}
                      </span>
                    )}
                    {steps.length > 0 && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 font-crimson text-xs text-white backdrop-blur">
                        <Clock className="h-3 w-3" strokeWidth={2} />
                        {steps.length} steps
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1} className="mt-4">
            <div className="warm-pane rounded-[2.25rem] p-10">
              <h1 className="font-playfair text-4xl font-semibold leading-tight text-hero-heading md:text-5xl">
                {recipe.name}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.category && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-crimson text-xs text-primary">
                    <Leaf className="h-3 w-3" strokeWidth={2} />
                    {recipe.category}
                  </span>
                )}
                {recipe.area && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-crimson text-xs text-primary">
                    <MapPin className="h-3 w-3" strokeWidth={2} />
                    {recipe.area}
                  </span>
                )}
              </div>
            </div>
          </FadeIn>
        )}

        {/* Nutrition */}
        {hasNutrition && (
          <section className="mt-10">
            <FadeIn delay={0.1}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="font-crimson text-xs uppercase tracking-[0.3em] text-hero-sub">
                    Per serving
                  </p>
                  <h2 className="mt-1 font-playfair text-3xl text-hero-heading">
                    Nutrition facts
                  </h2>
                </div>
              </div>
            </FadeIn>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {recipe.calories > 0 && (
                <NutritionTile
                  icon={Flame}
                  label="Calories"
                  value={recipe.calories}
                  unit="kcal"
                  delay={0.15}
                  reduceMotion={reduceMotion}
                />
              )}
              {recipe.protein > 0 && (
                <NutritionTile
                  icon={Beef}
                  label="Protein"
                  value={recipe.protein}
                  unit="g"
                  delay={0.2}
                  reduceMotion={reduceMotion}
                />
              )}
              {recipe.carbohydrate > 0 && (
                <NutritionTile
                  icon={Wheat}
                  label="Carbs"
                  value={recipe.carbohydrate}
                  unit="g"
                  delay={0.25}
                  reduceMotion={reduceMotion}
                />
              )}
              {recipe.fat > 0 && (
                <NutritionTile
                  icon={Droplet}
                  label="Fat"
                  value={recipe.fat}
                  unit="g"
                  delay={0.3}
                  reduceMotion={reduceMotion}
                />
              )}
            </div>
          </section>
        )}

        {/* Ingredients + Steps */}
        <section className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Ingredients */}
          <FadeIn delay={0.15} className="lg:col-span-1">
            <div className="warm-pane flex h-full flex-col rounded-[2rem] p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Leaf className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-crimson text-xs uppercase tracking-[0.28em] text-hero-sub">
                    Gather
                  </p>
                  <h2 className="font-playfair text-2xl text-hero-heading">Ingredients</h2>
                </div>
              </div>

              <ul className="mt-6 space-y-2.5">
                {recipe.ingredients &&
                  Object.entries(recipe.ingredients).map(([ingredient, measure], index) => (
                    <motion.li
                      key={ingredient}
                      initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + index * 0.03,
                        ease: EASE_OUT
                      }}
                      className="flex items-start gap-3 rounded-2xl border border-primary/8 bg-white/60 px-4 py-3 transition-colors duration-200 hover:bg-white/90"
                    >
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-crimson text-[0.7rem] font-semibold text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1 font-crimson text-sm text-hero-heading">
                        <span className="font-semibold text-primary">{measure}</span>
                        <span className="mx-1.5 text-hero-sub">·</span>
                        <span>{ingredient}</span>
                      </div>
                    </motion.li>
                  ))}
              </ul>
            </div>
          </FadeIn>

          {/* Steps */}
          <FadeIn delay={0.2} className="lg:col-span-2">
            <div className="warm-pane rounded-[2rem] p-7">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ListChecks className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="font-crimson text-xs uppercase tracking-[0.28em] text-hero-sub">
                      Cook along
                    </p>
                    <h2 className="font-playfair text-2xl text-hero-heading">Method</h2>
                  </div>
                </div>
                {steps.length > 0 && (
                  <span className="hidden rounded-full bg-primary/10 px-3 py-1 font-crimson text-xs text-primary sm:inline-block">
                    {completedCount}/{steps.length}
                  </span>
                )}
              </div>

              <ol className="mt-6 space-y-3">
                {steps.map((step, index) => {
                  const isDone = stepCompleted[index];
                  const toggleStep = () => {
                    const next = [...stepCompleted];
                    next[index] = !next[index];
                    setStepCompleted(next);
                    if (!stepCompleted[index] && next.filter(Boolean).length === steps.length) {
                      setShowPopup(true);
                      setTimeout(() => setShowPopup(false), 4000);
                    }
                  };
                  return (
                    <motion.li
                      key={index}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.25 + index * 0.03,
                        ease: EASE_OUT
                      }}
                    >
                      <motion.button
                        type="button"
                        onClick={toggleStep}
                        whileHover={reduceMotion ? undefined : { y: -2 }}
                        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
                        aria-pressed={isDone}
                        className={`group flex w-full items-start gap-4 rounded-[1.5rem] border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          isDone
                            ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'border-primary/10 bg-white/65 hover:border-primary/30 hover:bg-white/90 hover:shadow-md'
                        }`}
                      >
                        <span
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-playfair text-base font-semibold transition-all duration-300 ${
                            isDone
                              ? 'bg-white/95 text-primary'
                              : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                          }`}
                        >
                          {isDone ? <Check className="h-4 w-4" strokeWidth={2.5} /> : index + 1}
                        </span>
                        <p
                          className={`font-crimson text-base leading-relaxed ${
                            isDone
                              ? 'text-primary-foreground/95 line-through decoration-white/50'
                              : 'text-hero-heading'
                          }`}
                        >
                          {step}
                        </p>
                      </motion.button>
                    </motion.li>
                  );
                })}
              </ol>

              {!allStepsCompleted && steps.length > 0 && (
                <motion.button
                  type="button"
                  onClick={() => {
                    setStepCompleted(steps.map(() => true));
                    setShowPopup(true);
                    setTimeout(() => setShowPopup(false), 4000);
                  }}
                  whileHover={reduceMotion ? undefined : { y: -1 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-crimson text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                  Mark all steps complete
                </motion.button>
              )}
            </div>
          </FadeIn>
        </section>

        {/* Video */}
        {embedUrl && (
          <FadeIn delay={0.25} className="mt-10">
            <div className="warm-pane rounded-[2rem] p-7">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Play className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="font-crimson text-xs uppercase tracking-[0.28em] text-hero-sub">
                    Watch
                  </p>
                  <h2 className="font-playfair text-2xl text-hero-heading">Video tutorial</h2>
                </div>
              </div>

              <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-primary/10 shadow-md shadow-primary/5">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title={`${recipe.name} video tutorial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                </div>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

/**
 * Circular progress indicator sized for the header pill.
 * Uses two layered SVG circles with stroke-dashoffset for the fill.
 */
function ProgressRing({ percent }) {
  const size = 34;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary) / 0.18)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 400ms cubic-bezier(0.23,1,0.32,1)' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-playfair text-[0.65rem] font-semibold text-hero-heading">
        {percent}%
      </span>
    </div>
  );
}

export default RecipePage;
