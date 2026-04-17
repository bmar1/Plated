import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  Wallet,
  ShoppingCart,
  CalendarDays,
  Layers3,
  Receipt,
} from 'lucide-react';
import MarketingNavBar from '../components/MarketingNavBar';
import { VITE_API_URL } from '../config/env';

if (import.meta.env.DEV && !VITE_API_URL) {
  console.warn('VITE_API_URL is not set; check frontend/.env');
}

const NAV_LINKS = [
  { label: 'Origin', id: 'origin' },
  { label: 'Real cost', id: 'real-cost' },
  { label: 'Principles', id: 'principles' },
  { label: 'Roadmap', id: 'roadmap' },
];

const PRINCIPLES = [
  {
    icon: Wallet,
    title: 'Budget visibility first',
    body: 'See cost while you plan, not only after you have spent.',
  },
  {
    icon: CalendarDays,
    title: 'Weekly planning that stays practical',
    body: 'Built around a simple weekly loop: pick meals, review, then shop.',
  },
  {
    icon: ShoppingCart,
    title: 'Grocery tied to the plan',
    body: 'Meals and groceries stay in one flow so the list matches what you actually intend to cook.',
  },
];

const ROADMAP = [
  {
    step: '01',
    title: 'Start from the gap',
    body: 'Early Plated focused on one problem: meals, groceries, and money were tracked in different places.',
  },
  {
    step: '02',
    title: 'Ship the core loop',
    body: 'Choose meals for the week, review, then turn that into a grocery-oriented view you can act on.',
  },
  {
    step: '03',
    title: 'Polish and clarify',
    body: 'Iteration goes toward clearer UI, steadier planning flows, and fewer rough edges.',
  },
];

const VALUE_CARDS = [
  {
    title: 'One place for the week',
    body: 'Plan meals and groceries together so you are not bouncing between notes, apps, and your bank app.',
  },
  {
    title: 'Honest scope',
    body: 'Plated does not promise perfect nutrition or magic savings. It helps you plan and see cost in context.',
  },
];

function FadeIn({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function BrandLogo({ dark = false, className = 'h-10 w-10' }) {
  return (
    <img
      src="/favicon-v1.png"
      alt="Plated logo"
      className={`${className} ${dark ? 'brightness-0 invert' : ''} object-contain`}
    />
  );
}

function AboutPreviewCard() {
  return (
    <div className="warm-pane rounded-[2rem] p-4 sm:p-5 shadow-xl shadow-primary/[0.06]">
      <div className="relative z-10 rounded-[1.5rem] bg-white p-5">
        <div className="flex items-center justify-between border-b border-border/70 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
              At a glance
            </p>
            <h3 className="mt-2 text-2xl font-bold text-hero-heading">
              Plan, shop, stay aware
            </h3>
          </div>
          <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Plated
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border/70 bg-secondary/40 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-hero-heading">
              <Layers3 size={16} className="text-primary" />
              Core experience
            </div>
            <div className="space-y-2.5">
              {[
                'Weekly meal planning',
                'Budget-aware decisions',
                'Simpler grocery organization',
              ].map((row) => (
                <div
                  key={row}
                  className="rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground/80"
                >
                  {row}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-[#5A7A4D] p-4 text-white">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Compass size={16} />
              Product direction
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Priority
                </p>
                <p className="mt-1 text-lg font-semibold">Useful over noisy</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  Approach
                </p>
                <p className="mt-1 text-lg font-semibold">Simple, focused, clear</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const navigate = useNavigate();

  const goHome = () => navigate('/landing');
  const goLogin = () => navigate('/login');

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="overflow-x-hidden bg-background text-foreground">
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EA] via-background to-background px-4 pb-20 pt-6 sm:px-8 sm:pb-24">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-[26rem] w-[26rem] rounded-full bg-[#DDE6D5] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F1E7D2] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <MarketingNavBar
            navLinks={NAV_LINKS}
            trailingNavItem={{ label: 'Home', onClick: goHome }}
            onLogoClick={goHome}
            ctaLabel="Build Plan"
            onCtaClick={goLogin}
          />

          <div className="grid items-center gap-14 pb-10 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:pt-20">
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm">
                  <Compass size={14} />
                  The product story
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.03] tracking-tight text-hero-heading sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                  Why Plated exists
                  <br />
                  <span className="text-gradient">and what it is for.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-sub sm:text-xl">
                  A student-built tool to keep weekly meals, groceries, and food
                  spending in one calm flow—so planning is easier than reacting
                  after money is already gone.
                </p>
              </FadeIn>

              <FadeIn delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={goLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Try Plated
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => scrollTo('origin')}
                    className="inline-flex items-center justify-center rounded-full border border-primary/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Read the Story
                  </button>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.12}>
              <AboutPreviewCard />
            </FadeIn>
          </div>
        </div>
      </section>

      <section id="origin" className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                Origin
              </div>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                Food planning was scattered.
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-hero-sub">
                Recipes, lists, and bank alerts lived in different places. Plated
                exists to pull the weekly loop into one place so cost stays visible.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {VALUE_CARDS.map((card, index) => (
              <FadeIn key={card.title} delay={0.08 * index}>
                <div className="warm-pane h-full rounded-[1.75rem] p-7 shadow-lg shadow-primary/[0.04]">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-hero-heading">{card.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-hero-sub">
                      {card.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section
        id="real-cost"
        className="border-y border-border/60 bg-secondary/25 px-4 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Receipt size={18} className="shrink-0" />
              The real cost of defaults
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-hero-heading sm:text-4xl">
              When Uber Eats and delivery are the easy out
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-hero-sub">
              Busy weeks make Uber Eats, DoorDash, and similar apps the path of
              least resistance: quick, no dishes, no plan. The cost stacks quietly—
              fees, small orders, repeat nights—before it shows up clearly in your
              spending. Plated is not anti-delivery; it is for making groceries and
              home cooking the easier default when you want food spend to stay
              visible before the month closes.
            </p>
          </FadeIn>
        </div>
      </section>

      <section
        id="principles"
        className="bg-gradient-to-b from-background via-secondary/35 to-background px-4 py-24 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                Principles
              </h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-hero-sub">
                Focused on planning and groceries—not every feature at once.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {PRINCIPLES.map((item, index) => (
              <FadeIn key={item.title} delay={0.08 * index}>
                <div className="warm-pane h-full rounded-[1.75rem] p-7">
                  <div className="relative z-10">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon size={22} />
                    </div>
                    <h3 className="text-2xl font-bold text-hero-heading">{item.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-hero-sub">
                      {item.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <FadeIn>
              <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                Roadmap in broad strokes
              </h2>
            </FadeIn>
            <FadeIn delay={0.08}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-hero-sub">
                Iteration toward a steadier planning experience.
              </p>
            </FadeIn>
          </div>

          <div className="relative mt-14">
            <div className="absolute left-5 top-0 hidden h-full w-px bg-primary/15 md:block" />
            <div className="space-y-5">
              {ROADMAP.map((item, index) => (
                <FadeIn key={item.step} delay={0.08 * index}>
                  <div className="warm-pane rounded-[1.75rem] p-6 sm:p-7">
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-start">
                      <div className="flex items-center gap-4 md:w-[220px] md:flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                          {item.step}
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
                          Stage {item.step}
                        </p>
                      </div>
                      <div className="md:max-w-3xl">
                        <h3 className="text-2xl font-bold text-hero-heading">
                          {item.title}
                        </h3>
                        <p className="mt-3 text-lg leading-relaxed text-hero-sub">
                          {item.body}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="warm-pane rounded-[2rem] p-10 text-center shadow-xl shadow-primary/[0.05] sm:p-16">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                  Try the planning flow
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-hero-sub sm:text-xl">
                  Build a week, open the grocery view, and keep food spend in view.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={goLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Build My First Plan
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={goHome}
                    className="inline-flex items-center justify-center rounded-full border border-primary/12 bg-white/70 px-8 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Back to Landing Page
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <footer className="bg-[#5A7A4D] pt-16 pb-8 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-5">
            <div className="col-span-2">
              <div className="mb-4 flex items-center gap-3">
                <BrandLogo dark className="h-10 w-10" />
                <span className="font-playfair text-xl font-bold">Plated</span>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-white/80">
                Meal planning and budget tracking, made simple.
              </p>
              <a
                href="https://github.com/bmar1/plated.git"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-white transition-colors duration-200 hover:text-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                GitHub →
              </a>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Product
              </h4>
              <ul className="space-y-2.5">
                {['Meal Plans', 'Budget Tracker', 'Grocery Lists', 'Nutrition'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/80 transition-colors duration-200 hover:text-white">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Company
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="/about" className="text-sm text-white/80 transition-colors duration-200 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white/80 transition-colors duration-200 hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-white/80 transition-colors duration-200 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Links
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => scrollTo('origin')}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Origin
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('real-cost')}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Real cost
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('principles')}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Principles
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollTo('roadmap')}
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    Roadmap
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
            <p className="text-xs text-white/70">© 2026 Plated. All rights reserved.</p>
            <div className="flex gap-5">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-white/70 transition-colors duration-200 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
