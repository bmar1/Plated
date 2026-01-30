/**
 * @file Navbar.jsx
 * @description Refined sidebar navigation with subtle UX improvements
 * Keeps original green color scheme (#628d45) with enhanced polish and micro-interactions
 * No calorie counter, minimal changes, just better UX
 */

import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Nav({
  isNavVisible,
  setIsNavVisible,
  setShowSettings,
  handleLogout,
  progress,
  caloriesEaten,
  caloriesRemaining,
  caloriesTarget
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const showBar = () => {
    setIsNavVisible(!isNavVisible);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div>
      {/* Sidebar Navbar */}
      <AnimatePresence>
        {isNavVisible && (
          <motion.nav
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-screen w-60 bg-[#628d45] text-white flex flex-col p-4 z-40 shadow-lg"
          >
            {/* Toggle button */}
            <div className="flex justify-end w-full">
              <button
                className="p-3 rounded-lg hover:bg-[#A8C995] active:scale-95 transition-all duration-200 flex items-center justify-center"
                onClick={showBar}
              >
                <img
                  src="/icons/bar.jpg"
                  alt="Menu"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
              </button>
            </div>

            {/* Logo section */}
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex flex-col items-start w-full">
                <img
                  src="/favicon-v1.png"
                  alt="Plated Logo"
                  className="w-[8rem] h-[6.5rem] object-contain drop-shadow-md"
                />
                <h1 className="text-3xl font-semibold text-white tracking-wide mt-2 ml-4">
                  Plated
                </h1>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col space-y-2 flex-grow">
              <Link
                to="/dashboard"
                className={`flex items-center gap-3 p-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-[#94bf7f] shadow-md scale-[1.02]'
                    : 'hover:bg-[#94bf7f] active:scale-95'
                }`}
              >
                <img
                  src="/icons/home.png"
                  alt="Home"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Home
              </Link>

              <Link
                to="/all-meals"
                className={`flex items-center gap-3 p-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/all-meals')
                    ? 'bg-[#94bf7f] shadow-md scale-[1.02]'
                    : 'hover:bg-[#94bf7f] active:scale-95'
                }`}
              >
                <img
                  src="/icons/recipes.png"
                  alt="Recipes"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Your Recipes
              </Link>

              <Link
                to="/grocery"
                className={`flex items-center gap-3 p-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/grocery')
                    ? 'bg-[#94bf7f] shadow-md scale-[1.02]'
                    : 'hover:bg-[#94bf7f] active:scale-95'
                }`}
              >
                <img
                  src="/icons/groceryIcon.png"
                  alt="Grocery"
                  className="w-6 h-6"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Grocery List
              </Link>

              <Link
                to="/analytics"
                className={`flex items-center gap-3 p-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive('/analytics')
                    ? 'bg-[#94bf7f] shadow-md scale-[1.02]'
                    : 'hover:bg-[#94bf7f] active:scale-95'
                }`}
              >
                <img
                  src="/icons/result.png"
                  alt="Analytics"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Analytics
              </Link>
            </div>

            {/* Bottom actions */}
            <div className="mt-auto space-y-2">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-3 hover:bg-[#94bf7f] active:scale-95 p-2 rounded-lg font-medium w-full text-left transition-all duration-200"
              >
                <img
                  src="/icons/settings.png"
                  alt="Settings"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 hover:bg-[#94bf7f] active:scale-95 p-2 rounded-lg font-medium w-full text-left transition-all duration-200"
              >
                <img
                  src="/icons/logout.png"
                  alt="Logout"
                  className="w-5 h-5"
                  style={{ filter: 'invert(1) brightness(2)' }}
                />
                Log out
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Collapsed sidebar */}
      {!isNavVisible && (
        <nav className="fixed top-0 left-0 h-screen w-14 bg-[#628d45] text-white flex flex-col p-2 z-40 shadow-lg items-center justify-between">
          <button
            onClick={showBar}
            className="p-2 bg-[#628d45] rounded-lg hover:bg-[#5A7A4D] active:scale-95 mt-2 transition-all duration-200"
          >
            <img
              src="/icons/bar.jpg"
              alt="Menu"
              className="w-7 h-7"
              style={{ filter: 'invert(1) brightness(2)' }}
            />
          </button>

          <div className="flex flex-col space-y-3 mb-auto mt-8">
            <Link
              to="/dashboard"
              className={`p-2 rounded-lg transition-all duration-200 relative group ${
                isActive('/dashboard')
                  ? 'bg-[#5A7A4D] shadow-md'
                  : 'hover:bg-[#5A7A4D] active:scale-95'
              }`}
            >
              <img
                src="/icons/home.png"
                alt="Home"
                className="w-7 h-7"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Home
              </div>
            </Link>

            <Link
              to="/all-meals"
              className={`p-2 rounded-lg transition-all duration-200 relative group ${
                isActive('/all-meals')
                  ? 'bg-[#5A7A4D] shadow-md'
                  : 'hover:bg-[#5A7A4D] active:scale-95'
              }`}
            >
              <img
                src="/icons/recipes.png"
                alt="Recipes"
                className="w-7 h-7"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Your Recipes
              </div>
            </Link>

            <Link
              to="/grocery"
              className={`p-2 rounded-lg transition-all duration-200 relative group ${
                isActive('/grocery')
                  ? 'bg-[#5A7A4D] shadow-md'
                  : 'hover:bg-[#5A7A4D] active:scale-95'
              }`}
            >
              <img
                src="/icons/groceryIcon.png"
                alt="Grocery"
                className="w-7 h-7"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Grocery List
              </div>
            </Link>

            <Link
              to="/analytics"
              className={`p-2 rounded-lg transition-all duration-200 relative group ${
                isActive('/analytics')
                  ? 'bg-[#5A7A4D] shadow-md'
                  : 'hover:bg-[#5A7A4D] active:scale-95'
              }`}
            >
              <img
                src="/icons/result.png"
                alt="Analytics"
                className="w-7 h-7"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Analytics
              </div>
            </Link>
          </div>

          <div className="mb-2">
            <button
              onClick={handleLogout}
              className="hover:bg-[#5A7A4D] active:scale-95 p-2 rounded-lg transition-all duration-200 relative group"
            >
              <img
                src="/icons/logout.png"
                alt="Logout"
                className="w-7 h-7"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Log out
              </div>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
