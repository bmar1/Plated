import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ChevronRight,
  Salad,
  Wallet,
  ShoppingCart,
  CalendarDays,
  CheckCircle2,
  Clock,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import MarketingNavBar from '../components/MarketingNavBar';

const NAV_LINKS = [
  { label: 'Features', id: 'features' },
  { label: 'How It Works', id: 'how-it-works' },
];

const FEATURE_CHIPS = [
  'Meal planning',
  'Weekly grocery lists',
  'Budget-aware meals',
  'Built for real routines',
  'Spring Boot + React',
  'Production-ready workflow',
];

const FEATURES = [
  {
    icon: CalendarDays,
    title: 'Plan your whole week in minutes',
    body: 'Stop the daily "what\'s for dinner?" spiral. Build a full week of meals at once and actually stick to it.',
    why: 'Saves you 30+ minutes of daily decision-making'
  },
  {
    icon: Wallet,
    title: 'See exactly where your money goes',
    body: 'Pick meals and watch your weekly grocery cost update live. No more blowing your budget by accident.',
    why: 'Students save an average of $40/week vs. eating out'
  },
  {
    icon: ShoppingCart,
    title: 'One click to a ready grocery list',
    body: 'Your meal plan becomes a sorted, organized shopping list automatically. Get in and out of the store fast.',
    why: 'No more wandering aisles or forgetting ingredients'
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Pick your meals',
    body: 'Choose what you want to eat for the week — browse by budget, time, or whatever sounds good.',
  },
  {
    step: '02',
    title: 'Check your plan',
    body: 'See the whole week laid out, swap things around, and make sure it actually fits your life.',
  },
  {
    step: '03',
    title: 'Grab your list and go',
    body: 'Hit the store with a clean, organized grocery list built straight from your plan.',
  },
];

const POPULAR_MEALS = [
  {
    image: '/pancakes.jpg',
    title: 'Fluffy Blueberry Pancakes',
    tags: ['Breakfast', '20 min'],
    cost: '$3.50 / serving',
  },
  {
    image: '/icons/salad.jpg',
    title: 'Greek Quinoa Salad',
    tags: ['Lunch', '15 min'],
    cost: '$4.20 / serving',
  },
  {
    image: '/icons/stirfry.jpg',
    title: 'Veggie Stir-Fry Bowl',
    tags: ['Dinner', '25 min'],
    cost: '$3.80 / serving',
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

function MockDashboard() {
  return (
    <div className="warm-pane rounded-[2rem] p-4 sm:p-5 shadow-xl shadow-primary/[0.06]">
      <div className="relative z-10 rounded-[1.5rem] bg-white p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/75">
              This Week
            </p>
            <h3 className="mt-2 text-2xl font-bold text-hero-heading">Your meal plan</h3>
          </div>
          <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            On budget ✓
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-border/70 bg-secondary/40 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-hero-heading">
              <CalendarDays size={16} className="text-primary" />
              Meal outline
            </div>
            <div className="space-y-2.5">
              {['Monday: Pasta + salad', 'Tuesday: Stir fry bowl', 'Wednesday: Soup night'].map(
                (row) => (
                  <div
                    key={row}
                    className="rounded-2xl border border-border/60 bg-white px-3 py-2 text-sm text-foreground/80"
                  >
                    {row}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-border/70 bg-[#5A7A4D] p-4 text-white">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
              <Wallet size={16} />
              Budget
            </div>
            <div className="space-y-3">
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Weekly goal</p>
                <p className="mt-1 text-lg font-semibold">$60</p>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Spent so far</p>
                <p className="mt-1 text-lg font-semibold">$38.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "Is Plated actually free?",
    a: "Yes — completely free to use. No credit card, no trial period, no surprise paywalls. We built this for students, so keeping it free was non-negotiable.",
  },
  {
    q: "Do I need to sign up to try it?",
    a: "You'll need a quick account to save your meal plans, but it takes about 10 seconds and all we ask for is an email and password.",
  },
  {
    q: "How does the grocery budget tracking work?",
    a: "As you pick meals for the week, Plated shows you a running grocery cost estimate. You can swap meals in and out and watch the total update in real time — no manual entry required.",
  },
  {
    q: "Can I use Plated if I have dietary restrictions?",
    a: "You can browse and plan meals manually right now. Dietary filter support is on the roadmap and coming soon.",
  },
  {
    q: "What's the difference between the meal plan and the grocery list?",
    a: "The meal plan is your week laid out day by day. The grocery list is automatically generated from those meals — sorted by category so you can move through the store fast.",
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div
      className="warm-pane rounded-[1.5rem] overflow-hidden cursor-pointer"
      onClick={onToggle}
    >
      <div className="relative z-10 flex items-center justify-between gap-4 px-6 py-5">
        <h3 className="text-lg font-semibold text-hero-heading">{item.q}</h3>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300"
          style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="relative z-10 px-6 pb-6 text-base leading-relaxed text-hero-sub">
          {item.a}
        </p>
      </motion.div>
    </div>
  );
}

function FAQ() {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section className="px-4 py-24 sm:px-8 sm:py-28 bg-gradient-to-b from-background via-secondary/30 to-background">
      <div className="mx-auto max-w-3xl">
        <FadeIn className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary mb-5">
            Got questions?
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
            Probably answered here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-hero-sub">
            If something's still unclear, feel free to reach out.
          </p>
        </FadeIn>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeIn key={item.q} delay={0.05 * i}>
              <FAQItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const goLogin = () => navigate('/login');

  return (
    <div className="overflow-x-hidden bg-background text-foreground">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F7F3EA] via-background to-background px-4 pb-20 pt-6 sm:px-8 sm:pb-24">
        <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-[26rem] w-[26rem] rounded-full bg-[#DDE6D5] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#F1E7D2] blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <MarketingNavBar
            navLinks={NAV_LINKS}
            trailingNavItem={{ label: 'About', onClick: () => navigate('/about') }}
            onLogoClick={() => {
              const el = document.getElementById('app-scroll');
              if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            ctaLabel="Build Plan"
            stickyCtaLabel="Get Started"
            onCtaClick={goLogin}
          />

          <div className="grid items-center gap-14 pb-10 pt-12 lg:grid-cols-[1.02fr_0.98fr] lg:pt-20">

            {/* Left — copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm">
                  <Salad size={14} />
                  Meal planning &amp; grocery budgeting
                </div>
              </FadeIn>

              <FadeIn delay={0.08}>
                <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.03] tracking-tight text-hero-heading sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
                  A simpler way
                  <br />
                  to plan meals and
                  <br />
                  <span className="text-gradient">watch your budget.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.16}>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-hero-sub sm:text-xl">
                  Plated helps you plan a week of real meals, keep your grocery bill in check, and
                  get to the store without the guesswork — all in one place.
                </p>
              </FadeIn>

              <FadeIn delay={0.24}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={goLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Build My Plan
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => scrollTo('features')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/15 bg-white/70 px-8 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    See What It Does
                    <ChevronRight size={18} className="text-primary" />
                  </button>
                </div>
              </FadeIn>
            </div>

            {/* Right — hero image + floating dashboard */}
            <FadeIn delay={0.12}>
              <div className="relative mx-auto max-w-lg">

                {/* Hero food image — clean editorial card */}
                <motion.div
                  animate={reduceMotion ? {} : { y: [0, -8, 0] }}
                  transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl"
                  style={{
                    boxShadow: '0 24px 64px rgba(44,73,39,0.18), 0 4px 16px rgba(44,73,39,0.08)',
                    border: '2px solid rgba(255,255,255,0.8)',
                  }}
                >
                  <img
                    src="/hero.jpg"
                    alt="Fresh ingredients for meal planning"
                    className="h-96 w-full object-cover sm:h-[26rem]"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  {/* Bottom fade — lighter so card can overlap cleanly */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to bottom, transparent 40%, rgba(253,252,249,0.25) 70%, rgba(253,252,249,0.7) 100%)',
                    }}
                  />
                  {/* Floating tag on image */}
                  <div className="absolute left-4 top-4">
                    <div className="warm-pane inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-primary shadow-sm" style={{ backdropFilter: 'blur(12px)' }}>
                      <Sparkles size={11} />
                      Fresh this week
                    </div>
                  </div>
                  {/* Cost badge */}
                  <div className="absolute right-4 top-4">
                    <div
                      className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5 text-xs font-semibold text-white shadow-md"
                      style={{ background: 'rgba(90,122,77,0.92)', backdropFilter: 'blur(10px)' }}
                    >
                      <TrendingDown size={11} />
                      ~$45 / week
                    </div>
                  </div>
                </motion.div>

                {/* MockDashboard — pulled up into the image so it overlaps the bottom portion */}
                <motion.div
                  animate={reduceMotion ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                  className="-mt-72 px-3 sm:px-5"
                  style={{ position: 'relative', zIndex: 10 }}
                >
                  <MockDashboard />
                </motion.div>
              </div>
            </FadeIn>
          </div>

          {/* Marquee chip bar */}
          <FadeIn delay={0.28}>
            <div className="mt-6 overflow-hidden rounded-full border border-primary/10 bg-white/65 px-4 py-3 shadow-sm backdrop-blur-sm">
              <div className="flex gap-8 whitespace-nowrap animate-marquee">
                {[...FEATURE_CHIPS, ...FEATURE_CHIPS].map((item, index) => (
                  <div key={`${item}-${index}`} className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <CheckCircle2 size={14} />
                    </span>
                    <span className="text-sm font-medium text-foreground/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                Why Plated works
                <ChevronRight size={14} />
              </div>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                Everything you need,
                <br />
                nothing you don't.
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-hero-sub">
                Three things that actually make meal planning easier — and why they make a real difference.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <FadeIn key={feature.title} delay={0.08 * index}>
                <div className="warm-pane h-full rounded-[1.75rem] p-7 shadow-lg shadow-primary/[0.04]">
                  <div className="relative z-10">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <feature.icon size={22} />
                    </div>
                    <h3 className="text-2xl font-bold text-hero-heading">{feature.title}</h3>
                    <p className="mt-3 text-lg leading-relaxed text-hero-sub">{feature.body}</p>
                    <div className="mt-5 flex items-center gap-2 border-t border-border/50 pt-4">
                      <CheckCircle2 size={14} className="shrink-0 text-primary" />
                      <p className="text-sm font-semibold text-primary/80">{feature.why}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR MEAL PLANS ───────────────────────────────── */}
      <section className="bg-gradient-to-b from-background via-secondary/40 to-background px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                <Salad size={14} />
                Popular this week
              </div>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h2 className="mt-6 text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                Meals students
                <br />
                actually love making.
              </h2>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-hero-sub">
                Real recipes that fit a student budget and a student schedule. Browse, add to your plan, done.
              </p>
            </FadeIn>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {POPULAR_MEALS.map((meal, index) => (
              <FadeIn key={meal.title} delay={0.08 * index}>
                <div className="warm-pane h-full overflow-hidden rounded-[1.75rem] shadow-lg shadow-primary/[0.05] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={meal.image}
                      alt={meal.title}
                      className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(44,73,39,0.25) 0%, transparent 50%)',
                      }}
                    />
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {meal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-2.5 py-1 text-xs font-semibold text-white"
                          style={{ background: 'rgba(90,122,77,0.88)', backdropFilter: 'blur(8px)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative z-10 p-5">
                    <h3 className="text-xl font-bold text-hero-heading">{meal.title}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <TrendingDown size={14} />
                        {meal.cost}
                      </div>
                      <button
                        onClick={goLogin}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        Add to plan <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.32}>
            <div className="mt-10 text-center">
              <button
                onClick={goLogin}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90"
              >
                Browse all recipes
                <ArrowRight size={18} />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="px-4 py-24 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-6xl text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/12 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm">
              How it works
            </div>
          </FadeIn>
          <FadeIn delay={0.06}>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
              Three steps and you're done.
            </h2>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-hero-sub">
              No complicated setup. Just pick your meals, confirm the plan, and take a ready list to the store.
            </p>
          </FadeIn>
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute left-5 top-3 bottom-3 w-px bg-primary/25" aria-hidden />
          <div className="space-y-0">
            {STEPS.map((item, index) => (
              <FadeIn key={`timeline-${item.step}`} delay={0.08 * index}>
                <div
                  className={`relative flex gap-5 sm:gap-8 ${index < STEPS.length - 1 ? 'pb-12 sm:pb-14' : ''
                    }`}
                >
                  <div className="relative z-10 flex shrink-0 justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-4 ring-background">
                      {item.step}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/70">
                      Step {item.step}
                    </p>
                    <div className="warm-pane mt-3 rounded-[1.75rem] p-6 sm:p-7">
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-hero-heading">{item.title}</h3>
                        <p className="mt-3 text-lg leading-relaxed text-hero-sub">{item.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.3}>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={goLogin}
              className="rounded-full bg-primary px-7 py-3 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Start planning for free
            </button>
            <button
              onClick={() => navigate('/about')}
              className="rounded-full border border-primary/12 bg-white/70 px-7 py-3 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              Learn About Plated
            </button>
          </div>
        </FadeIn>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="px-4 py-24 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <div className="warm-pane rounded-[2rem] p-10 text-center shadow-xl shadow-primary/[0.05] sm:p-16">
              <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                  Ready to eat better
                  <br />
                  without the stress?
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-hero-sub sm:text-xl">
                  Plated brings meal planning, grocery organization, and budget tracking into one clean flow.
                  It's free to try — no signup friction.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <button
                    onClick={goLogin}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Let's go
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => scrollTo('features')}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/12 bg-white/70 px-8 py-3.5 text-base font-semibold text-foreground transition-colors duration-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    See the features
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <FAQ />

      {/* ── FOOTER ───────────────────────────────────────────── */}

      <footer className="bg-[#5A7A4D] pt-16 pb-8 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-8">
          <div className="mb-12 grid grid-cols-2 gap-8 md:grid-cols-4">
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
                    <a
                      href="#"
                      className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                    >
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
                  <a
                    href="/about"
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-white/80 transition-colors duration-200 hover:text-white"
                  >
                    Contact
                  </a>
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
