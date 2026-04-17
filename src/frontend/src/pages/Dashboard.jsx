/**
 * @file Dashboard.jsx
 * @description Redesigned dashboard with editorial magazine aesthetic
 * Aesthetic Direction: Editorial Luxury / Modern Kitchen Journal
 * - Warm brown/green palette matching Landing & Auth (caramel, golden tan, sage)
 * - Playfair Display + Crimson Text (consistency with Landing)
 * - Proper bento grid layout with balanced card sizes
 * - Paper-like textures and refined gradients
 * - Smooth animations and micro-interactions
 */

import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import OnboardingCard from '../components/OnboardCard';
import Settings from '../components/Settings';
import SettingsOnboard from '../components/SettingsOnboard';
import Nav from '../components/Navbar';
import NewMealPlanShowcase from '../components/NewMealShowcase';
import LoadingScreen from './LoadingScreen';
import { VITE_API_URL } from '../config/env';

// --- Caching Configuration ---
const ENABLE_CACHE = true;
const CACHE_KEY = 'dashboard_cache_data';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export default function Dashboard() {
  const navigate = useNavigate();

  // State variables
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

  // --- Navigation Handlers ---
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

  // --- Effects ---
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

  // --- Cache Helper Functions ---
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
      const itemToCache = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(itemToCache));
      console.log('Cache set successfully.');
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
      console.log('Cache cleared.');
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

  // --- Data Processing and State Update Helpers ---
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
      if (!item || !item.name || item.name.toLowerCase() === 'null') {
        return;
      }
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

  // --- Main Data Loading Function ---
  const loadDashboardData = async () => {
    setIsLoading(true);

    const cached = getCache();
    if (cached && !cached.isExpired) {
      console.log('Cache hit. Loading data instantly.');
      updateDashboardState(cached.data);
      setUsedCache(true);
      setIsLoading(false);
    } else {
      console.log('Cache miss or expired. Will show loading screen until API fetch is complete.');
    }
    try {
      console.log('Fetching from API in the background...');
      const response = await fetch(`${VITE_API_URL}/load`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
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
          console.log('Meal plan has changed. Invalidating cache and showing popup.');
          setShowNewMealPlan(true);
          updateDashboardState(newData);
        }
      } else {
        updateDashboardState(newData);
        if (!cached) {
          setShowNewMealPlan(true);
        }
      }

      setCache(newData);
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
        setTimeout(() => {
          setIsLoading(false);
        }, 600);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcf9] relative overflow-hidden">
      {/* Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Crimson+Text:wght@400;600;700&display=swap');
        
        html {
          scroll-behavior: smooth;
        }
        
        * {
          font-family: 'Crimson Text', serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }

        /* Paper texture overlay */
        .paper-texture {
          position: relative;
        }

        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperNoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperNoise)' opacity='0.02'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: multiply;
          border-radius: inherit;
        }

        /* Smooth card hover */
        .organic-card {
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), 
                      box-shadow 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .organic-card:hover {
          transform: translateY(-4px) scale(1.01);
        }

        /* Staggered animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        	.handwritten-accent {
          position: relative;
          display: inline-block;
        }

        .handwritten-accent::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: -4px;
          right: -4px;
          height: 12px;
          background: linear-gradient(to right, #d4a574 0%, #c9956d 100%);
          opacity: 0.3;
          transform: skewY(-1deg);
          border-radius: 2px;
          z-index: -1;
        }

        /* Smooth progress bar */
        .progress-bar {
          transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      {/* Subtle background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-[#d4a574]/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-[#618c45]/8 to-transparent rounded-full blur-3xl"></div>
      </div>

      {/* Overlay components */}
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
        className={`px-4 sm:px-6 py-8 sm:py-12 lg:px-12 lg:py-16 transition-all duration-500 ${isNavVisible ? 'ml-60' : 'ml-20'} relative z-10`}
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

        {/* Header */}
        <div
          className="max-w-[1600px] mx-auto mb-12 animate-fade-in-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#a38968] mb-3">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d2416] mb-2 leading-tight">
                Your Kitchen,
                <br />
                <span className="handwritten-accent">Today</span>
              </h1>
              <p className="text-base sm:text-lg text-[#6b5d4f] font-medium max-w-2xl mt-4">
                Fresh meals, smart planning, and savings you can taste
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Improved Bento Box Layout */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN - Featured Meal + Calorie Balance (spans 7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:gap-8">
            {/* Featured Meal Card - REDUCED HEIGHT */}
            {meals.length > 0 && (
              <div
                className="organic-card paper-texture bg-white rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(45,36,22,0.08)] group cursor-pointer animate-scale-in"
                style={{ animationDelay: '0.2s' }}
                onClick={() => handleRecipeClick(meals[currentIndex].name)}
              >
                {/* Image Container - REDUCED to h-[350px] */}
                <div className="relative h-[350px] sm:h-[400px] overflow-hidden">
                  <img
                    src={meals[currentIndex].thumbnail}
                    alt={meals[currentIndex].name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                    {/* Category Badge */}
                    <div className="inline-flex items-center gap-2 mb-3 self-start">
                      <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold tracking-wider uppercase text-[#2d2416]">
                        {meals[currentIndex].category || 'Featured'}
                      </span>
                    </div>

                    {/* Meal Name */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight max-w-2xl">
                      {meals[currentIndex].name}
                    </h2>

                    {/* Stats Row */}
                    <div className="flex flex-wrap items-center gap-4 text-white/90">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span className="text-sm font-bold">
                          {meals[currentIndex].calories} cal
                        </span>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
                          <span className="text-sm font-bold">View Recipe</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center gap-2 py-5 bg-gradient-to-b from-transparent to-[#fdfcf9]/50">
                  {meals.slice(0, 4).map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(i);
                      }}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        currentIndex === i
                          ? 'w-12 bg-[#d4a574]'
                          : 'w-2 bg-[#d4a574]/30 hover:bg-[#d4a574]/50 hover:w-6'
                      }`}
                      aria-label={`View meal ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Calorie Balance Card - MOVED HERE */}
            <div
              className="organic-card paper-texture bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(45,36,22,0.08)] animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                {/* Left: Info */}
                <div className="flex-1">
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#8B6F47] mb-3">
                    Daily Nutrition
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#2d2416] mb-3">
                    Calorie Balance
                  </h3>
                  <p className="text-sm text-[#6B5746] font-medium max-w-xl">
                    Track your daily intake and stay balanced with your nutrition goals
                  </p>
                </div>

                {/* Right: Stats Grid */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                  {/* Eaten */}
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#618c45] to-[#7ab05d] flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#2d2416] mb-1">{eaten}</p>
                    <p className="text-xs font-bold tracking-wider uppercase text-[#8B6F47]">
                      Eaten
                    </p>
                  </div>

                  {/* Target */}
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#d4a574] to-[#c9956d] flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#2d2416] mb-1">{target}</p>
                    <p className="text-xs font-bold tracking-wider uppercase text-[#8B6F47]">
                      Target
                    </p>
                  </div>

                  {/* Remaining */}
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#2d2416] to-[#3d3426] flex items-center justify-center shadow-lg">
                      <svg
                        className="w-7 h-7 sm:w-8 sm:h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-[#2d2416] mb-1">
                      {remaining}
                    </p>
                    <p className="text-xs font-bold tracking-wider uppercase text-[#8B6F47]">
                      Left
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8 pt-8 border-t border-[#2d2416]/5">
                <div className="flex justify-between text-sm font-bold text-[#6B5746] mb-3">
                  <span>Daily Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gradient-to-r from-[#f7f2e1] to-[#ede4c8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#618c45] to-[#7ab05d] rounded-full progress-bar shadow-lg"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Stacked Cards (spans 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8">
            {/* Grocery List Card */}
            <div
              onClick={handleGroceryClick}
              className="organic-card paper-texture bg-gradient-to-br from-[#618c45] to-[#7ab05d] rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(97,140,69,0.25)] cursor-pointer animate-scale-in"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Grocery List</h3>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span className="text-lg font-black text-white">{grocery.length}</span>
                </div>
              </div>

              {isGroceryLoading ? (
                <div className="py-8 text-center">
                  <div className="inline-block h-2 w-16 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-white animate-pulse"></div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {groceryPreview.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-300"
                      style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/20 flex-shrink-0">
                        <img
                          src={item.imageUrl || '/icons/groceryIcon.png'}
                          className="w-full h-full object-cover"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{item.name}</p>
                        <p className="text-lg font-black text-white/90 mt-1">
                          ${item.totalPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isGroceryLoading && grocery.length > 3 && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-sm text-white/80 text-center font-medium">
                    +{grocery.length - 3} more item{grocery.length - 3 !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>

            {/* Savings Card */}
            <div
              className="organic-card paper-texture bg-gradient-to-br from-[#d4a574] to-[#c9956d] rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(212,165,116,0.3)] animate-scale-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.15em] uppercase text-[#2d2416]/60 mb-2">
                    This Week
                  </p>
                  <h3 className="text-xl font-bold text-[#2d2416]">You Saved</h3>
                </div>
                <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#2d2416]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl sm:text-6xl font-black text-[#2d2416]">
                  ${95 - budget}
                </span>
                <span className="text-2xl text-[#2d2416]/70 font-bold">.00</span>
              </div>

              <p className="text-sm text-[#2d2416]/70 font-medium">
                Automatically tracked & calculated
              </p>
            </div>

            {/* Next Up Card */}
            <div
              onClick={handlePotential}
              className="organic-card paper-texture bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_32px_rgba(45,36,22,0.08)] cursor-pointer animate-scale-in"
              style={{ animationDelay: '0.5s' }}
            >
              <h3 className="text-2xl font-bold text-[#2d2416] mb-6">Coming Up Next</h3>

              {mealPreview.slice(0, 2).map((meal, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 mb-6 last:mb-0 p-4 rounded-2xl hover:bg-[#fdfcf9] transition-all duration-300"
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#f7f2e1]">
                    <img
                      src={meal.thumbnail}
                      className="w-full h-full object-cover"
                      alt={meal.name}
                    />
                  </div>

                  <div className="flex-1 pt-1">
                    <p className="font-bold text-[#2d2416] leading-tight mb-3 text-base">
                      {meal.name}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-[#618c45]/10 rounded-xl text-xs font-bold text-[#618c45]">
                        {meal.calories} cal
                      </span>
                      <span className="px-3 py-1.5 bg-[#2d2416]/5 rounded-xl text-xs font-bold text-[#6B5746]">
                        {meal.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {mealPreview.length > 2 && (
                <div className="mt-6 pt-6 border-t border-[#2d2416]/10">
                  <p className="text-sm text-[#6B5746] text-center font-medium">
                    +{mealPreview.length - 2} more meal{mealPreview.length - 2 !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Crimson+Text:wght@400;600;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
