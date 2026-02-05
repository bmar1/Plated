/**
 * @file Landing.js
 * @description This component is the main landing page for the application.
 * It provides an overview of the app's features, showcases popular meal plans,
 * and includes calls-to-action for users to log in or create a plan.
 * It is designed to be visually appealing and informative for new visitors.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  // Navigates the user to the login page.
  const handleNavigation = () => {
    navigate('/Login');
  };

  const steps = [
    {
      id: '01',
      title: 'Create your plan',
      description: "Login and create a new meal plan, let us do the work and you're ready.",
      cardContent: <div className=""></div>
    },
    {
      id: '02',
      title: 'Meal Plan',
      description: 'Take a look at your new meals, let us generate new meals for you daily.',
      cardContent: <div className=""></div>
    },
    {
      id: '03',
      title: 'Groceries',
      description:
        'Shop new groceries weekly, on a tight or flexible budget, directly from local vendors.',
      cardContent: <div className=""></div>
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcf9] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Crimson+Text:wght@400;600;700&display=swap');
        
        
        * {
          font-family: 'Crimson Text', serif;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Playfair Display', serif;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .organic-blob {
          position: absolute;
          filter: blur(100px);
          opacity: 0.15;
          animation: float 8s ease-in-out infinite;
        }

        .text-gradient {
          background: linear-gradient(135deg, #618c45 0%, #7ab05d 50%, #5A7A4D 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(97, 140, 69, 0.1);
          box-shadow: 0 8px 32px rgba(97, 140, 69, 0.08);
        }

        .nav-glass {
          background: rgba(97, 140, 69, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="nav-glass shadow-lg px-4 sm:px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/favicon-v1.png" className="w-auto h-12 sm:h-14 drop-shadow-md" alt="Logo" />
            <h2
              className="text-white text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Plated
            </h2>
          </motion.div>
          <motion.button
            onClick={() => navigate('/About')}
            className="bg-white/90 text-[#5A7A4D] hover:bg-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hidden md:block tracking-wide text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            About Us
          </motion.button>
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'Process', 'Pricing'].map((item, idx) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-white/90 hover:text-white transition-colors font-semibold text-base tracking-wide relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.1 }}
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={handleNavigation}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm text-sm tracking-wide"
            >
              Login
            </motion.button>
            <motion.button
              onClick={handleNavigation}
              className="bg-white text-[#618c45] hover:bg-[#f5f9f3] px-8 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm tracking-wide"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Build Plan
            </motion.button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden bg-[#5A7A4D]/95 backdrop-blur-lg text-center py-6 shadow-xl"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <button
            onClick={() => {
              navigate('/About');
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            About Us
          </button>
          <a
            href="#features"
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Features
          </a>
          <a
            href="#process"
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Process
          </a>
          <a
            href="#pricing"
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Pricing
          </a>
          <button
            onClick={() => {
              handleNavigation();
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              handleNavigation();
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Build Plan
          </button>
        </motion.div>
      )}

      {/* Hero Section - GREEN - FIXED FOR MOBILE */}
      <div className="relative flex items-center justify-center min-h-[80vh] sm:min-h-[92vh] px-4 overflow-hidden py-6 sm:py-0">
        <div
          className="organic-blob w-[600px] h-[600px] bg-[#618c45] top-[-200px] left-[-100px] rounded-full"
          style={{ animationDelay: '0s' }}
        ></div>
        <div
          className="organic-blob w-[500px] h-[500px] bg-[#7ab05d] bottom-[-150px] right-[-100px] rounded-full"
          style={{ animationDelay: '3s' }}
        ></div>
        <motion.div
  initial={{ opacity: 0, y: 60 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
  className="relative h-[70vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] w-full max-w-[110rem] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
>
  <img 
    src="/hero.jpg" 
    alt="Hero" 
    className="absolute inset-0 w-full h-full object-cover object-center md:object-[center_40%]" 
  />
  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent"></div>
  <div className="relative h-full flex flex-col items-start justify-center px-5 sm:px-12 md:px-16 lg:px-24 max-w-5xl py-6 sm:py-0">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 sm:mb-6 md:mb-8"
    >
      <span className="inline-block bg-white/20 backdrop-blur-md text-white px-3 sm:px-5 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold tracking-widest border border-white/30">
        WELLNESS MADE SIMPLE
      </span>
    </motion.div>
    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 md:mt-10 lg:mb-10 text-white leading-[1.1] tracking-tight"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      Meal planning and budget tracking,{' '}
      <span className="italic text-[#c8e6b8]">made easy</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mt-10 md:mt-2 lg:mb-14 max-w-3xl text-white/95 font-light leading-relaxed"
    >
      Plated is your meal planner and budget maintainer all in one — letting you focus on
      growing instead of tracking.
    </motion.p>
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleNavigation}
      className="bg-white text-[#618c45] hover:bg-[#f5f9f3] px-6 mt-7 md:mt-2 sm:px-12 py-3.5 sm:py-5 rounded-full font-bold text-base sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 lg:mt-4"
    >
      Build Plan →
    </motion.button>
  </div>
</motion.div>
      </div>
      {/* Features Section - BROWN */}
      <motion.div
        id="features"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 relative bg-gradient-to-b from-[#fdfcf9] via-[#f9f6f1] to-[#f7f2e1]"
      >
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#c9956d]/10 rounded-full blur-3xl"></div>

        <div className="text-center mb-20 px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg">
              WHY PLATED
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2d2416] mb-6 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Everything you need in one place
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-[#6B5746] max-w-3xl mx-auto font-light"
          >
            Simple tools that transform how you eat, shop, and save
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 relative z-10">
          {[
            {
              img: '/icons/recipes.png',
              title: 'Personalized Plans',
              desc: 'Tailored meal suggestions that match your tastes and budget.'
            },
            {
              img: '/icons/benefit.png',
              title: 'Budget Conscious',
              desc: 'Track spending effortlessly with smart cost estimates.'
            },
            {
              img: '/icons/input.png',
              title: 'Time Saver',
              desc: 'Pre-made grocery lists so you spend less time planning.'
            },
            {
              img: '/icons/result.png',
              title: 'End Result',
              desc: 'Live well with balanced meals and zero stress — all for free.'
            }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="bg-white/70 backdrop-blur-xl border border-[#d4a574]/20 shadow-lg p-8 rounded-3xl flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
            >
              <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#d4a574]/10 to-[#c9956d]/10 group-hover:from-[#d4a574]/20 group-hover:to-[#c9956d]/20 transition-all duration-500">
                <img src={card.img} className="w-12 h-12 object-contain" alt={card.title} />
              </div>
              <h3
                className="text-2xl font-bold mb-3 text-[#2d2416]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {card.title}
              </h3>
              <p className="text-lg text-[#6B5746] leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* About Bento Grid Section - GREEN & BROWN MIX - FIXED FOR MOBILE */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 relative bg-gradient-to-b from-[#f7f2e1] via-white to-[#fdfcf9] overflow-hidden"
      >
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#618c45]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#d4a574]/8 rounded-full blur-3xl"></div>

        <div className="text-center mb-20 relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <span className="bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg">
              CORE FEATURES
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <span className="text-[#618c45]">Powerful tools,</span>
            <span className="block mt-2 text-[#8B6F47]">beautifully simple</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl sm:text-2xl text-[#5A7A4D] max-w-3xl mx-auto leading-relaxed font-light"
          >
            Everything you need to plan meals, manage budgets, and shop smarter
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-12 gap-6 auto-rows-[280px]">
            {/* Meal Planning Card - GREEN - FIXED IMAGE SIZE ON MOBILE */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="col-span-12 lg:col-span-7 row-span-2 bg-gradient-to-br from-[#618c45] to-[#7ab05d] rounded-3xl p-8 lg:p-10 shadow-2xl hover:shadow-[0_25px_70px_rgba(97,140,69,0.35)] transition-all duration-500 flex flex-col group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
              </div>

              <div className="relative z-10">
                <h3
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-5 text-white"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Meal Planning
                </h3>
                <p className="text-white/95 text-base sm:text-lg lg:text-xl leading-relaxed max-w-lg">
                  Instantly create delicious, easy to cook meals. Create new plans weekly, that all
                  fit in any grocery budget.
                </p>
              </div>

              <div className="mt-4 lg:mt-6 pb-6 flex-1 flex items-center justify-center relative z-10">
                <img
                  src="/menu.png"
                  alt="Menu example"
                  className="w-full max-w-xl h-auto rounded-2xl drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 object-contain"
                />
              </div>
            </motion.div>

            {/* Cooking Help Card - BROWN */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="col-span-12 lg:col-span-5 row-span-2 bg-gradient-to-br from-[#d4a574] to-[#c9956d] rounded-3xl p-10 shadow-2xl hover:shadow-[0_25px_70px_rgba(212,165,116,0.35)] transition-all duration-500 flex flex-col group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className="absolute inset-0 opacity-10">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                  }}
                ></div>
              </div>

              <div className="relative z-10">
                <h3
                  className="text-4xl sm:text-5xl font-bold mb-5 text-white"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Cooking Help
                </h3>
                <p className="text-white/95 text-lg leading-relaxed">
                  Prepare and plan unique meals from around the world, featuring rich ingredients,
                  sourced by quality vendors, in an easy to use way!
                </p>
              </div>

              <div className="mt-6 flex-1 flex items-end justify-center relative z-10">
                <img
                  src="/meal.jpg"
                  alt="Meal example"
                  className="max-h-72 rounded-2xl object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>

            {/* Grocery Planning Card - Cream/Tan */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="col-span-12 lg:col-span-8 row-span-1 bg-gradient-to-r from-[#f7f2e1] to-[#ede4c8] rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group border border-[#d4c9a8] relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className="relative z-10">
                <h3
                  className="text-[#2d2416] text-3xl sm:text-4xl font-bold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Grocery Planning
                </h3>
                <p className="text-[#6B5746] text-lg sm:text-xl leading-relaxed">
                  Automatically generate a grocery list, sourced from local vendors, right alongside
                  your meal plan fitting perfectly within your budget.
                </p>
              </div>
            </motion.div>

            {/* Analytics Card - Dark Green */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="col-span-12 lg:col-span-4 row-span-1 bg-[#1a2e05] rounded-3xl p-8 shadow-2xl hover:shadow-[0_25px_70px_rgba(26,46,5,0.5)] transition-all duration-500 group relative overflow-hidden"
              whileHover={{ scale: 1.02, y: -8 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#7ab05d]/20 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3
                  className="text-3xl sm:text-4xl text-white font-bold mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Analytics
                </h3>
                <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                  Always know how much you've saved, spent, or eaten in calories daily — at any
                  time.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Process Section - GREEN - COMPLETELY REDESIGNED FOR MOBILE */}
      <div id="process" className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#618c45]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7ab05d]/5 rounded-full blur-3xl"></div>

        <div className="text-center mb-20 relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6"
          >
            <span className="bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg">
              THE PROCESS
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2d4a28] tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Up and running in minutes
          </motion.h1>
        </div>

        {/* Desktop Timeline View */}
        <div className="hidden md:block max-w-6xl mx-auto py-20 px-4 relative z-10">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#618c45]/20 via-[#618c45]/40 to-[#618c45]/20" />

          <div className="space-y-32">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="relative flex flex-row items-center justify-between w-full"
                >
                  <div className={`w-[45%] flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                    {isEven ? (
                      <div className="glass-card p-8 rounded-3xl max-w-md text-right">
                        <h2
                          className="text-3xl font-bold mb-4 text-[#2d4a28]"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {step.title}
                        </h2>
                        <p className="text-lg text-[#5A7A4D] leading-relaxed">{step.description}</p>
                      </div>
                    ) : (
                      <div>{step.cardContent}</div>
                    )}
                  </div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#618c45] to-[#7ab05d] rounded-2xl flex items-center justify-center shadow-xl border-4 border-white rotate-45">
                      <div className="w-6 h-6 bg-white/90 rounded-sm -rotate-45"></div>
                    </div>
                    <span className="text-sm font-bold text-[#618c45] bg-white px-4 py-1.5 rounded-full shadow-md tracking-wider">
                      {step.id}
                    </span>
                  </div>

                  <div className={`w-[45%] flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    {isEven ? (
                      <div>{step.cardContent}</div>
                    ) : (
                      <div className="glass-card p-8 rounded-3xl max-w-md text-left">
                        <h2
                          className="text-3xl font-bold mb-4 text-[#2d4a28]"
                          style={{ fontFamily: 'Playfair Display, serif' }}
                        >
                          {step.title}
                        </h2>
                        <p className="text-lg text-[#5A7A4D] leading-relaxed">{step.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Vertical Timeline View */}
        <div className="md:hidden max-w-2xl mx-auto px-4 relative z-10">
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative pl-16"
              >
                {/* Timeline line */}
                {index !== steps.length - 1 && (
                  <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-[#618c45]/40 to-[#618c45]/20"></div>
                )}

                {/* Step number circle */}
                <div className="absolute left-0 top-0 flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#618c45] to-[#7ab05d] rounded-2xl flex items-center justify-center shadow-xl border-4 border-white rotate-45">
                    <div className="w-5 h-5 bg-white/90 rounded-sm -rotate-45"></div>
                  </div>
                  <span className="text-xs font-bold text-[#618c45] bg-white px-3 py-1 rounded-full shadow-md tracking-wider">
                    {step.id}
                  </span>
                </div>

                {/* Content card */}
                <div className="glass-card p-6 rounded-2xl">
                  <h2
                    className="text-2xl font-bold mb-3 text-[#2d4a28]"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {step.title}
                  </h2>
                  <p className="text-base text-[#5A7A4D] leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mid-page CTA - BROWN */}
      <div className="py-32 relative text-center bg-gradient-to-br from-[#d4a574] via-[#c9956d] to-[#8B6F47] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4"
        >
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight max-w-4xl mx-auto leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Start Saving on Groceries Today — <span className="italic">For Free</span>
          </h2>

          <p className="text-xl sm:text-2xl text-white/95 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Build your personalized meal plan in under one minute.
          </p>

          <button
            onClick={handleNavigation}
            className="bg-white text-[#8B6F47] hover:bg-[#f9f6f1] px-14 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            Build My Plan →
          </button>
        </motion.div>
      </div>

      {/* Popular Meal Plans - GREEN */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 relative bg-gradient-to-b from-white via-[#fdfcf9] to-white"
      >
        <div className="text-center mb-20 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2d4a28] mb-6 tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Popular meal plans
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl sm:text-2xl text-[#5A7A4D] max-w-3xl mx-auto font-light"
          >
            Discover delicious, budget-friendly recipes loved by our community
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-4 relative z-10">
          {[
            {
              img: '/pancakes.jpg',
              title: 'Fluffy Pancakes',
              info: 'Prep Time: 15 mins | Est. Cost: $3',
              desc: 'Start your day with these delicious, easy-to-make pancakes.',
              overlay:
                'Imagine waking up to warm, fluffy pancakes — a comforting start to your day.'
            },
            {
              img: '/icons/salad.jpg',
              title: 'Quinoa Salad',
              info: 'Prep Time: 20 mins | Est. Cost: $5',
              desc: 'A refreshing salad packed with protein and fiber.',
              overlay: 'Bright, refreshing Mediterranean flavors in one bowl.'
            },
            {
              img: '/icons/stirfry.jpg',
              title: 'Chicken Stir-Fry',
              info: 'Prep Time: 25 mins | Est. Cost: $7',
              desc: 'Quick, flavorful stir-fry with chicken and veggies.',
              overlay: 'A bold, delicious stir-fry full of color and flavor.'
            }
          ].map((meal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="relative rounded-3xl overflow-hidden glass-card group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden h-72">
                <img
                  src={meal.img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={meal.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </div>

              <div className="p-8">
                <h3
                  className="text-3xl font-bold mb-3 text-[#2d4a28]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {meal.title}
                </h3>
                <p className="text-base font-semibold text-[#618c45] mb-2">{meal.info}</p>
                <p className="text-lg text-[#5A7A4D]/80 leading-relaxed">{meal.desc}</p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-[#618c45]/95 to-[#7ab05d]/95 backdrop-blur-sm flex items-center justify-center px-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-xl font-semibold text-white text-center leading-relaxed">
                  {meal.overlay}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Pricing Section - BROWN/GREEN MIX */}
      <motion.div
        id="pricing"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-32 relative bg-gradient-to-br from-[#f7f2e1] via-[#fdfcf9] to-white overflow-hidden"
      >
        <div className="absolute top-20 left-0 w-96 h-96 bg-[#618c45]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg mb-8">
              PRICING
            </span>
            <h2
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className="text-[#618c45]">Always free.</span>
              <span className="block mt-2 text-[#8B6F47] italic">
                Built by a student, for students.
              </span>
            </h2>
            <p className="text-xl sm:text-2xl text-[#5A7A4D] max-w-3xl mx-auto leading-relaxed font-light">
              I know the struggle. That's why Plated will always be free — no premium tiers, no
              hidden costs, no credit card required.
            </p>
          </motion.div>

          {/* Why Free Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-[#d4a574]/20 to-[#c9956d]/20 backdrop-blur-sm rounded-3xl p-10 border border-[#d4a574]/30"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-[#618c45] to-[#7ab05d] rounded-2xl flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3
                  className="text-2xl sm:text-3xl font-bold text-[#2d2416] mb-3"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Why it's free
                </h3>
                <p className="text-lg text-[#6B5746] leading-relaxed">
                  I built Plated because I was tired of watching my bank account drain on takeout.
                  If this helps even one other student stop stressing about money and food, it's
                  worth it, because we all deserve to eat well.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12"
          >
            <button
              onClick={handleNavigation}
              className="bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white hover:from-[#7ab05d] hover:to-[#618c45] px-14 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Get Started — It's Free →
            </button>
            <p className="text-sm text-[#6B5746] mt-4 font-light">
              No credit card. No trial period. Just sign up and start saving.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer isLandingPage={true} />
    </div>
  );
}
