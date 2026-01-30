import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';

const About = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

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

        .paper-texture {
          position: relative;
        }

        .paper-texture::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.015'/%3E%3C/svg%3E");
          pointer-events: none;
          border-radius: inherit;
          mix-blend-mode: overlay;
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
            onClick={() => handleNavigation('/')}
            className="bg-white/90 text-[#5A7A4D] hover:bg-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hidden md:block tracking-wide text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Home
          </motion.button>
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-8">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              onClick={() => handleNavigation('/Login')}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2.5 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm text-sm tracking-wide"
            >
              Login
            </motion.button>
            <motion.button
              onClick={() => handleNavigation('/Login')}
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
              handleNavigation('/');
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => {
              handleNavigation('/Login');
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              handleNavigation('/Login');
              setIsMenuOpen(false);
            }}
            className="block w-full py-3 text-white hover:bg-white/10 font-semibold transition-colors"
          >
            Build Plan
          </button>
        </motion.div>
      )}

      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <img
            src="/hero.jpg"
            alt="Healthy food"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-[#8B6F47]/40"></div>
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mb-6"
          >
            <span className="inline-block bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest border border-white/30">
              THE STORY
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight tracking-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Built by a student,
            <span className="block mt-2 italic text-[#f7f2e1]">for students</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="text-xl sm:text-2xl text-white/95 max-w-2xl font-light"
          >
            One broke college kid's solution to expensive eating habits
          </motion.p>
        </div>
      </div>

      {/* The Problem Section - BROWN */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 px-4 relative bg-gradient-to-b from-[#fdfcf9] via-[#f9f6f1] to-[#f7f2e1]"
      >
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#d4a574]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#c9956d]/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-gradient-to-r from-[#8B6F47] to-[#c9956d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg mb-6">
              THE PROBLEM
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d2416] mb-6 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              $300 a month on takeout
            </h2>
            <p className="text-xl sm:text-2xl text-[#6B5746] max-w-3xl mx-auto leading-relaxed font-light">
              Like most students, I didn't realize how much money was slipping away
            </p>
          </motion.div>

          {/* Story Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="paper-texture bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#d4a574]/20"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4a574]/20 to-[#c9956d]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#8B6F47]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-4 text-[#2d2416]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Too Convenient
              </h3>
              <p className="text-lg text-[#6B5746] leading-relaxed">
                Between classes and assignments, ordering food was easier than cooking. But those
                $12 lunches and $15 dinners added up fast — way faster than I realized.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="paper-texture bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#d4a574]/20"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#d4a574]/20 to-[#c9956d]/20 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-[#8B6F47]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold mb-4 text-[#2d2416]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                The Wake-Up Call
              </h3>
              <p className="text-lg text-[#6B5746] leading-relaxed">
                When I checked my bank statement one month, I was shocked. I'd spent more on food
                delivery than on my rent. Something had to change, but I needed a system to actually
                stick to it.
              </p>
            </motion.div>
          </div>

          {/* Pull Quote */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center py-12"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-6xl text-[#d4a574]/20 mb-4">"</div>
              <p
                className="text-3xl sm:text-4xl font-light text-[#2d2416] italic leading-relaxed mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                If I was struggling with this, other students probably were too
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#d4a574] to-transparent mx-auto"></div>
              <div className="text-6xl text-[#d4a574]/20 mt-4">"</div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* The Solution Section - GREEN */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 px-4 relative bg-gradient-to-b from-[#f7f2e1] via-white to-[#fdfcf9]"
      >
        <div className="absolute top-20 left-0 w-96 h-96 bg-[#618c45]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-[#7ab05d]/8 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-gradient-to-r from-[#618c45] to-[#7ab05d] text-white px-8 py-3 rounded-full text-sm font-bold tracking-widest shadow-lg mb-6">
              THE SOLUTION
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d4a28] mb-6 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Built during finals week
            </h2>
            <p className="text-xl sm:text-2xl text-[#5A7A4D] max-w-3xl mx-auto leading-relaxed font-light">
              Because apparently, I handle stress by building apps
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Budget First',
                desc: 'Set a weekly budget and Plated builds meal plans around it. No more accidentally spending your textbook money on DoorDash.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                )
              },
              {
                title: 'Simple Recipes',
                desc: 'Every recipe is designed for people who arent chefs. Easy to follow, quick to make.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                )
              },
              {
                title: 'Auto Shopping List',
                desc: 'Generate a grocery list instantly. Shop once, eat all week. Revolutionary for someone who used to go to the store daily.',
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                )
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="paper-texture bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-[#618c45]/10 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#618c45]/10 to-[#7ab05d]/10 rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8 text-[#618c45]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {feature.icon}
                  </svg>
                </div>
                <h3
                  className="text-2xl font-bold mb-4 text-[#2d4a28]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {feature.title}
                </h3>
                <p className="text-lg text-[#5A7A4D] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* The Impact Section - BROWN */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 px-4 relative bg-gradient-to-br from-[#d4a574] via-[#c9956d] to-[#8B6F47]"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              From $300 to $80 a month
            </h2>
            <p className="text-xl sm:text-2xl text-white/95 mb-12 font-light leading-relaxed">
              That's an extra $220 every month. For a broke student, that's huge. That's textbooks.
              That's rent. That's actually having savings for once.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                { number: '73%', label: 'Less on food' },
                { number: '$2,640', label: 'Saved per year' }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="paper-texture bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30"
                >
                  <div
                    className="text-5xl sm:text-6xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {stat.number}
                  </div>
                  <div className="text-lg text-white/90 font-semibold">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={() => handleNavigation('/Login')}
              className="bg-white text-[#8B6F47] hover:bg-[#f9f6f1] px-14 py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
              Start Saving Like I Did →
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* The Why Section - GREEN */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1 }}
        className="py-28 px-4 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2d4a28] mb-6 tracking-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Why it's free
            </h2>
            <p className="text-xl sm:text-2xl text-[#5A7A4D] leading-relaxed font-light">
              I built Plated because I needed it. You shouldn't have to pay to stop wasting money.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="paper-texture bg-gradient-to-br from-[#f7f2e1] to-[#ede4c8] rounded-3xl p-12 border border-[#d4c9a8] shadow-lg"
          >
            <p className="text-xl text-[#2d2416] leading-relaxed">
              I was tired of spending money I didn't have on food I didn't need. Turns out, other
              people had the same problem. So here we are. Plated is my gift to every student who's
              ever eaten ramen for a week straight because they blew their budget on takeout. Been
              there, done that. Let's not do it again.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default About;
