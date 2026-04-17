/**
 * @file Dashboard.jsx
 * @description Premium editorial dashboard matching the Landing/About/Login aesthetic.
 *
 * Design direction (aligned with Landing.jsx):
 * - Warm cream/ivory background with ambient sage + butter blobs.
 * - `warm-pane` glass surfaces, rounded-[1.75rem]–[2rem] radii, Playfair + Crimson.
 * - Sage primary, hero-heading ink for numbers, hero-sub for body, deep-sage #5A7A4D for budget surfaces.
 * - Framer-motion FadeIn with stagger (30–80ms) and ease-out; respects `prefers-reduced-motion`.
 */

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CalendarDays,
  ChefHat,
  Flame,
  Target,
  Timer,
  ShoppingCart,
  TrendingDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import OnboardingCard from '../components/OnboardCard';
import Settings from '../components/Settings';
import SettingsOnboard from '../components/SettingsOnboard';
import Nav from '../components/Navbar';
import NewMealPlanShowcase from '../components/NewMealShowcase';
import LoadingScreen from './LoadingScreen';
import AmbientBackdrop from '../components/AmbientBackdrop';
import { VITE_API_URL } from '../config/env';

const ENABLE_CACHE = true;
const CACHE_KEY = 'dashboard_cache_data';
const CACHE_DURATION = 30 * 60 * 1000;

// Local fallbacks served from /public — used when an API-provided image URL fails to load.
const MEAL_FALLBACK = '/meal.jpg';
const GROCERY_FALLBACK = '/icons/groceryIcon.png';

const handleImgFallback = (fallback) => (e) => {
  if (e.currentTarget.src.endsWith(fallback)) return;
  e.currentTarget.src = fallback;
};

function FadeIn({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [meals, setMeals] = useState([]);
  const [showNewMealPlan, setShowNewMealPlan] = useState(false);
  const [mealPreview, setMealPreview] = useState([]);
  const [grocery, setGrocery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usedCache, setUsedCache] = useState(false);
  const [groceryPreview, setGroceryPreview] = useState([]);
  const [isGroceryLoading, setIsGroceryLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [eaten, setEaten] = useState(0);
  const [target, setTarget] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const [budget, setBudget] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleLogout = () => {
    clearAuth();
    clearCache();
    navigate('/');
  };

  const handleRecipeClick = (recipeName) => {
    navigate('/recipe', { state: { name: recipeName } });
  };

  const handlePotential = () => {
    navigate('/all-meals');
  };

  const handleGroceryClick = () => {
    if (grocery.length > 0) {
      setShouldNavigate(true);
    }
  };

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('onboarding');
    if (onboardingStatus === 'true') {
      setShowOnboarding(true);
      setIsLoading(false);
      setIsInitialLoad(false);
    } else if (isInitialLoad) {
      loadDashboardData();
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (!showOnboarding && !isLoading && grocery.length === 0 && meals.length === 0) {
      loadDashboardData();
    }
  }, [showOnboarding, isLoading]);

  useEffect(() => {
    if (shouldNavigate && grocery) {
      navigate('/grocery', { state: { grocery: grocery } });
      setShouldNavigate(false);
    }
  }, [grocery, shouldNavigate, navigate]);

  const getCache = () => {
    try {
      const cachedItem = localStorage.getItem(CACHE_KEY);
      if (!cachedItem) return null;
      const { timestamp, data } = JSON.parse(cachedItem);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;
      return { data, isExpired };
    } catch (error) {
      console.error('Error getting cache:', error);
      return null;
    }
  };

  const setCache = (data) => {
    try {
      const itemToCache = { timestamp: Date.now(), data };
      localStorage.setItem(CACHE_KEY, JSON.stringify(itemToCache));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  };

  const getNormalizedWords = (name) => {
    if (!name) return [];
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2)
      .map((word) => word.replace(/s$/, '').replace(/es$/, ''));
  };

  const getSimilarityScore = (name1, name2) => {
    const words1 = getNormalizedWords(name1);
    const words2 = getNormalizedWords(name2);
    if (words1.length === 0 || words2.length === 0) return 0;
    const matches = words1.filter((word) => words2.includes(word)).length;
    const totalWords = Math.max(words1.length, words2.length);
    return matches / totalWords;
  };

  const filterGroceryList = (list) => {
    const filteredList = [];
    const seenItems = [];
    list.forEach((item) => {
      if (!item || !item.name || item.name.toLowerCase() === 'null') return;
      const normalizedName = item.name.toLowerCase().trim();
      const isSimilar = seenItems.some((seenItem) => {
        const similarity = getSimilarityScore(normalizedName, seenItem.name);
        return similarity >= 0.5;
      });
      if (!isSimilar) {
        filteredList.push(item);
        seenItems.push({ name: normalizedName, original: item });
      }
    });
    return filteredList;
  };

  const updateDashboardState = (data) => {
    const filteredGrocery = filterGroceryList(data.groceryList);
    setMeals(data.selectedMeals);
    setRemaining(data.remaining);
    setBudget(data.budget);
    setTarget(data.target);
    setEaten(data.eaten);
    setProgress(data.progress);
    setMealPreview(data.randomMeals);
    setGrocery(filteredGrocery);
    setGroceryPreview(filteredGrocery.slice(0, 3));
    setIsGroceryLoading(false);
  };

  const loadDashboardData = async () => {
    setIsLoading(true);

    const cached = getCache();
    if (cached && !cached.isExpired) {
      updateDashboardState(cached.data);
      setUsedCache(true);
      setIsLoading(false);
    }

    try {
      const response = await fetch(`${VITE_API_URL}/load`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newData = await response.json();

      if (cached && !cached.isExpired) {
        const oldMealIds = cached.data.selectedMeals.map((m) => m.id).sort();
        const newMealIds = newData.selectedMeals.map((m) => m.id).sort();
        const hasDifference = JSON.stringify(oldMealIds) !== JSON.stringify(newMealIds);

        if (hasDifference) {
          setShowNewMealPlan(true);
          updateDashboardState(newData);
        }
      } else {
        updateDashboardState(newData);
        if (!cached) setShowNewMealPlan(true);
      }

      if (ENABLE_CACHE) setCache(newData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      clearCache();
      setMeals([]);
      setMealPreview([]);
      setProgress(0);
      setGrocery([]);
      setGroceryPreview([]);
    } finally {
      if (!usedCache) {
        setTimeout(() => setIsLoading(false), 600);
      }
    }
  };

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const featured = meals[currentIndex];
  const savings = Math.max(95 - budget, 0);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientBackdrop position="fixed" variant="default" />

      {isLoading && <LoadingScreen />}
      <Nav
        isNavVisible={isNavVisible}
        setIsNavVisible={setIsNavVisible}
        setShowSettings={setShowSettings}
        handleLogout={handleLogout}
        progress={progress}
        caloriesEaten={eaten}
        caloriesTarget={target}
        caloriesRemaining={remaining}
      />

      <main
        className={`relative z-10 px-4 py-8 transition-[margin] duration-500 ease-out sm:px-6 sm:py-12 lg:px-12 lg:py-16 ${
          isNavVisible ? 'ml-60' : 'ml-20'
        }`}
      >
        {showNewMealPlan && (
          <NewMealPlanShowcase meals={meals} onClose={() => setShowNewMealPlan(false)} />
        )}
        {showOnboarding && (
          <OnboardingCard setShowOnboarding={setShowOnboarding} setShowLoading={setIsLoading} />
        )}
        {showSettings && (
          <Settings setShowSettings={setShowSettings} setShowPreferences={setShowPreferences} />
        )}
        {showPreferences && <SettingsOnboard setShowPreferences={setShowPreferences} />}

        {/* ── HEADER ───────────────────────────────────────────── */}
        <div className="mx-auto mb-12 max-w-[1600px]">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm">
              <CalendarDays size={14} />
              {todayLabel}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-hero-heading sm:text-5xl lg:text-6xl">
              Your kitchen,
              <br />
              <span className="text-gradient">today.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.16}>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-hero-sub">
              Fresh meals, smart planning, and savings you can taste — all in one calm view.
            </p>
          </FadeIn>
        </div>

        {/* ── BENTO GRID ───────────────────────────────────────── */}
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* LEFT COLUMN — Featured meal + Calorie balance */}
          <div className="flex flex-col gap-6 lg:col-span-7 lg:gap-8">
            {/* Featured meal */}
            {featured && (
              <FadeIn delay={0.2}>
                <motion.div
                  whileHover={reduceMotion ? undefined : { y: -4 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  onClick={() => handleRecipeClick(featured.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleRecipeClick(featured.name);
                  }}
                  className="warm-pane group cursor-pointer overflow-hidden rounded-[2rem] shadow-xl shadow-primary/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="relative z-10 overflow-hidden rounded-[calc(2rem-4px)] m-1">
                    <div className="relative h-[360px] overflow-hidden sm:h-[420px]">
                      <img
                        src={featured.thumbnail || MEAL_FALLBACK}
                        alt={featured.name}
                        loading="lazy"
                        onError={handleImgFallback(MEAL_FALLBACK)}
                        className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(24,36,18,0.78) 0%, rgba(24,36,18,0.25) 45%, transparent 75%)',
                        }}
                      />

                      {/* Top-left featured chip */}
                      <div className="absolute left-5 top-5">
                        <div
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary shadow-sm"
                          style={{ backdropFilter: 'blur(10px)' }}
                        >
                          <Sparkles size={11} />
                          Tonight's pick
                        </div>
                      </div>

                      {/* Top-right category */}
                      <div className="absolute right-5 top-5">
                        <div
                          className="rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow-md"
                          style={{ background: 'rgba(90,122,77,0.92)', backdropFilter: 'blur(10px)' }}
                        >
                          {featured.category || 'Featured'}
                        </div>
                      </div>

                      {/* Bottom overlay copy */}
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                        <h2 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                          {featured.name}
                        </h2>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                            <Flame size={12} />
                            {featured.calories} cal
                          </span>
                          <span
                            className="inline-flex translate-x-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                          >
                            View recipe
                            <ArrowRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dots nav */}
                    <div className="flex items-center justify-center gap-2 py-4">
                      {meals.slice(0, 4).map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentIndex(i);
                          }}
                          aria-label={`Show meal ${i + 1}`}
                          className={`h-2 cursor-pointer rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            currentIndex === i
                              ? 'w-10 bg-primary'
                              : 'w-2 bg-primary/25 hover:w-6 hover:bg-primary/45'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            )}

            {/* Calorie balance */}
            <FadeIn delay={0.28}>
              <div className="warm-pane rounded-[2rem] p-6 shadow-lg shadow-primary/[0.05] sm:p-8">
                <div className="relative z-10">
                  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
                        Daily nutrition
                      </p>
                      <h3 className="mt-2 text-2xl font-bold text-hero-heading sm:text-3xl">
                        Calorie balance
                      </h3>
                      <p className="mt-2 max-w-xl text-base leading-relaxed text-hero-sub">
                        Track your intake and stay aligned with today's goal — no guesswork.
                      </p>
                    </div>

                    <div className="grid flex-shrink-0 grid-cols-3 gap-4 sm:gap-6">
                      <StatTile
                        icon={<Flame size={18} />}
                        value={eaten}
                        label="Eaten"
                        tone="primary"
                      />
                      <StatTile
                        icon={<Target size={18} />}
                        value={target}
                        label="Target"
                        tone="accent"
                      />
                      <StatTile
                        icon={<Timer size={18} />}
                        value={remaining}
                        label="Left"
                        tone="ink"
                      />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-8 border-t border-border/60 pt-6">
                    <div className="mb-3 flex items-center justify-between text-sm">
                      <span className="font-semibold text-hero-heading">Daily progress</span>
                      <span className="font-semibold text-primary">
                        {Math.round(clampedProgress)}%
                      </span>
                    </div>
                    <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${clampedProgress}%` }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.9,
                          ease: [0.23, 1, 0.32, 1],
                          delay: 0.1,
                        }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* RIGHT COLUMN — Grocery, Savings, Coming-up-next */}
          <div className="flex flex-col gap-6 lg:col-span-5 lg:gap-8">
            {/* Grocery list — deep sage (matches Landing MockDashboard budget card) */}
            <FadeIn delay={0.24}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                onClick={handleGroceryClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleGroceryClick();
                }}
                className="relative cursor-pointer overflow-hidden rounded-[2rem] bg-[#5A7A4D] p-6 text-white shadow-xl shadow-primary/[0.18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-8"
              >
                {/* Soft inner highlight */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      'radial-gradient(circle at 20% 0%, rgba(255,255,255,0.16), transparent 55%)',
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
                      This week's list
                    </p>
                    <h3 className="mt-1.5 text-2xl font-bold">Grocery</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 backdrop-blur-sm">
                    <ShoppingCart size={18} />
                  </div>
                </div>

                {isGroceryLoading ? (
                  <div className="relative z-10 mt-6 py-8 text-center">
                    <div className="inline-block h-1.5 w-20 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-white/70" />
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 mt-6 space-y-3">
                    {groceryPreview.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-2xl bg-white/10 p-3 backdrop-blur-sm transition-colors duration-200 ease-out hover:bg-white/15"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-white/15">
                          <img
                            src={item.imageUrl || GROCERY_FALLBACK}
                            alt={item.name}
                            loading="lazy"
                            onError={handleImgFallback(GROCERY_FALLBACK)}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                          <p className="mt-0.5 text-base font-bold text-white/95">
                            ${item.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isGroceryLoading && grocery.length > 3 && (
                  <div className="relative z-10 mt-5 flex items-center justify-between border-t border-white/15 pt-4">
                    <p className="text-sm text-white/80">
                      +{grocery.length - 3} more item{grocery.length - 3 !== 1 ? 's' : ''}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition-transform duration-200 ease-out group-hover:translate-x-1">
                      Open list
                      <ArrowRight size={14} />
                    </span>
                  </div>
                )}

                {!isGroceryLoading && grocery.length === 0 && (
                  <div className="relative z-10 mt-6 rounded-2xl bg-white/10 p-5 text-sm text-white/85">
                    Your list is empty — add meals to generate one.
                  </div>
                )}
              </motion.div>
            </FadeIn>

            {/* Savings */}
            <FadeIn delay={0.32}>
              <div className="warm-pane rounded-[2rem] p-6 shadow-lg shadow-primary/[0.05] sm:p-8">
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
                        This week
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-hero-heading">You saved</h3>
                    </div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <TrendingDown size={18} />
                    </div>
                  </div>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-5xl font-bold leading-none tracking-tight text-hero-heading sm:text-6xl">
                      ${savings}
                    </span>
                    <span className="text-2xl font-bold text-hero-heading/60">.00</span>
                  </div>

                  <p className="mt-3 text-sm text-hero-sub">
                    Calculated from your meal plan vs. eating out average.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Coming up next */}
            <FadeIn delay={0.4}>
              <motion.div
                whileHover={reduceMotion ? undefined : { y: -3 }}
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                onClick={handlePotential}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handlePotential();
                }}
                className="warm-pane cursor-pointer rounded-[2rem] p-6 shadow-lg shadow-primary/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:p-8"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
                        Coming up
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-hero-heading">Next meals</h3>
                    </div>
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                      <ChefHat size={18} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {mealPreview.slice(0, 2).map((meal, index) => (
                      <div
                        key={meal.id ?? index}
                        className="flex items-start gap-4 rounded-2xl border border-border/40 bg-white/55 p-3 transition-colors duration-200 ease-out hover:bg-white"
                      >
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl bg-secondary">
                          <img
                            src={meal.thumbnail || MEAL_FALLBACK}
                            alt={meal.name}
                            loading="lazy"
                            onError={handleImgFallback(MEAL_FALLBACK)}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <p className="truncate text-base font-semibold text-hero-heading">
                            {meal.name}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {meal.calories} cal
                            </span>
                            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-hero-sub">
                              {meal.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {mealPreview.length > 2 && (
                    <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                      <p className="text-sm text-hero-sub">
                        +{mealPreview.length - 2} more meal
                        {mealPreview.length - 2 !== 1 ? 's' : ''}
                      </p>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                        Browse all
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Small stat tile used inside the Calorie balance card.
 * Tones map to the Landing palette:
 *   - primary: sage (eaten)
 *   - accent: warm cream (target)
 *   - ink: hero-heading (remaining)
 */
function StatTile({ icon, value, label, tone = 'primary' }) {
  const toneClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent text-accent-foreground',
    ink: 'bg-hero-heading/10 text-hero-heading',
  };
  return (
    <div className="text-center">
      <div
        className={`mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl sm:h-14 sm:w-14 ${toneClasses[tone]}`}
      >
        {icon}
      </div>
      <p className="text-xl font-bold tracking-tight text-hero-heading sm:text-2xl">{value}</p>
      <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-hero-sub sm:text-xs">
        {label}
      </p>
    </div>
  );
}
