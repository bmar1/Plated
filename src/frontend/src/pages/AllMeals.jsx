/**
 * @file AllMeals.jsx
 * @description Library view of every saved meal. Fetches the list from the API
 * and renders it as an editorial cookbook — warm-pane cards in a responsive
 * grid, with a searchable header, category chips, and staggered entrance
 * animation. Shares the global `AmbientBackdrop` for visual continuity with
 * Dashboard / Recipe while using a distinct orb variant ("library").
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BookOpen, ChefHat, Flame, Leaf, Search, Sparkles } from 'lucide-react';

import Nav from '../components/Navbar';
import Settings from '../components/Settings';
import SettingsOnboard from '../components/SettingsOnboard';
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

export default function AllMeals() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [isNavVisible, setIsNavVisible] = useState(false);
  const [meals, setMeals] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${VITE_API_URL}/meals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMeals(data);
      }
    } catch (error) {
      console.error('Error parsing meals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = (recipeName) => {
    navigate('/recipe', { state: { name: recipeName } });
  };

  // Unique category list for the filter pills, ordered alphabetically.
  const categories = useMemo(() => {
    const set = new Set();
    meals.forEach((meal) => meal.category && set.add(meal.category));
    return ['All', ...Array.from(set).sort()];
  }, [meals]);

  // Filter pipeline: category chip + free-text search against name / category.
  const visibleMeals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return meals.filter((meal) => {
      const matchesCategory = activeCategory === 'All' || meal.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;
      return (
        (meal.name || '').toLowerCase().includes(q) ||
        (meal.category || '').toLowerCase().includes(q) ||
        (meal.area || '').toLowerCase().includes(q)
      );
    });
  }, [meals, query, activeCategory]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientBackdrop position="fixed" variant="library" />

      <Nav
        isNavVisible={isNavVisible}
        setIsNavVisible={setIsNavVisible}
        setShowSettings={setShowSettings}
        handleLogout={handleLogout}
      />
      {showSettings && (
        <Settings setShowSettings={setShowSettings} setShowPreferences={setShowPreferences} />
      )}
      {showPreferences && <SettingsOnboard setShowPreferences={setShowPreferences} />}

      <main
        className={`relative z-10 px-6 py-10 transition-all duration-300 lg:px-10 lg:py-14 ${
          isNavVisible ? 'lg:ml-60' : 'lg:ml-20'
        }`}
      >
        <div className="mx-auto max-w-7xl">
          {/* Header: editorial eyebrow + library heading + count + search */}
          <FadeIn>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 font-crimson text-xs uppercase tracking-[0.3em] text-primary">
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
                  <span>Your library</span>
                </div>
                <h1 className="mt-3 font-playfair text-5xl font-semibold leading-[1.05] text-hero-heading md:text-6xl">
                  <span className="text-gradient">All meals</span>
                </h1>
                <p className="mt-3 max-w-xl font-crimson text-base text-hero-sub">
                  A cookbook of everything you&apos;ve planned so far.{' '}
                  {meals.length > 0 && (
                    <span className="text-hero-heading/80">
                      {meals.length} {meals.length === 1 ? 'recipe' : 'recipes'} in the shelf.
                    </span>
                  )}
                </p>
              </div>

              <div className="warm-pane flex items-center gap-3 rounded-full px-5 py-3 lg:min-w-[22rem]">
                <Search className="h-4 w-4 text-hero-sub" strokeWidth={2} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder="Search by name, cuisine, category…"
                  aria-label="Search meals"
                  className="flex-1 border-0 bg-transparent font-crimson text-sm text-hero-heading placeholder:text-hero-sub focus:outline-none focus:ring-0"
                />
              </div>
            </div>
          </FadeIn>

          {/* Category pills */}
          {categories.length > 1 && (
            <FadeIn delay={0.1} className="mt-8">
              <div
                role="tablist"
                aria-label="Filter by category"
                className="flex flex-wrap gap-2"
              >
                {categories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveCategory(cat)}
                      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                      className={`rounded-full border px-4 py-1.5 font-crimson text-xs uppercase tracking-[0.22em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                          : 'border-primary/15 bg-white/60 text-hero-heading hover:border-primary/30 hover:bg-white/80'
                      }`}
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </FadeIn>
          )}

          {/* Grid */}
          <section className="mt-10">
            {isLoading ? (
              <LoadingGrid />
            ) : visibleMeals.length === 0 ? (
              <EmptyState hasQuery={query.length > 0 || activeCategory !== 'All'} />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleMeals.map((meal, index) => (
                  <MealCard
                    key={meal.id ?? `${meal.name}-${index}`}
                    meal={meal}
                    delay={Math.min(index * 0.04, 0.4)}
                    reduceMotion={reduceMotion}
                    onClick={() => handleRecipeClick(meal.name)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

/**
 * Editorial meal card. Large cover image with a Ken-Burns-style hover zoom,
 * calorie badge, category chip, Playfair title, and an accent tag row.
 */
function MealCard({ meal, delay, reduceMotion, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      className="warm-pane group flex w-full flex-col overflow-hidden rounded-[1.75rem] text-left shadow-lg shadow-primary/[0.05] transition-shadow duration-300 ease-out hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={meal.thumbnail || MEAL_FALLBACK}
          alt={meal.name}
          loading="lazy"
          onError={handleImgFallback}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-hero-heading/75 via-hero-heading/10 to-transparent opacity-90" />

        {meal.category && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/85 px-3 py-1 font-crimson text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur">
            <Leaf className="h-3 w-3" strokeWidth={2} />
            {meal.category}
          </span>
        )}
        {typeof meal.calories === 'number' && meal.calories > 0 && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-crimson text-[0.7rem] font-semibold text-primary-foreground shadow-md shadow-primary/20">
            <Flame className="h-3 w-3" strokeWidth={2} />
            {meal.calories} cal
          </span>
        )}

        <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 font-crimson text-[0.7rem] uppercase tracking-[0.25em] text-white/85">
          <Sparkles className="h-3 w-3" strokeWidth={2} />
          <span>Open recipe</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="line-clamp-2 font-playfair text-xl font-semibold leading-snug text-hero-heading transition-colors duration-200 group-hover:text-primary">
          {meal.name}
        </h2>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 font-crimson text-xs text-hero-sub">
          {meal.area && <span>{meal.area}</span>}
          {meal.area && meal.protein > 0 && <span aria-hidden>·</span>}
          {meal.protein > 0 && <span>{meal.protein}g protein</span>}
        </div>
      </div>
    </motion.button>
  );
}

/** Skeleton grid shown while the meals request is in flight. */
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="warm-pane h-[22rem] animate-pulse rounded-[1.75rem]"
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

/** Empty state for both "no meals at all" and "no matches for filter". */
function EmptyState({ hasQuery }) {
  return (
    <FadeIn>
      <div className="warm-pane mx-auto max-w-lg rounded-[2rem] p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ChefHat className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h2 className="mt-5 font-playfair text-2xl text-hero-heading">
          {hasQuery ? 'Nothing matches that filter' : 'Your shelf is empty'}
        </h2>
        <p className="mt-2 font-crimson text-hero-sub">
          {hasQuery
            ? 'Try a different search or switch back to All.'
            : 'Head to the dashboard to plan your first meals — they&apos;ll appear here.'}
        </p>
      </div>
    </FadeIn>
  );
}
