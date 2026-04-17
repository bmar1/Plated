import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Salad, CalendarDays, Wallet, ShoppingCart } from 'lucide-react';
import { VITE_API_URL } from '../config/env';

function FadeIn({ children, delay = 0, className = '' }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const PERKS = [
  { icon: CalendarDays, label: 'Plan a full week in minutes' },
  { icon: Wallet, label: 'See grocery cost as you plan' },
  { icon: ShoppingCart, label: 'One-click grocery list' }
];

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'signup';
    console.log('API URL:', VITE_API_URL);
    const res = await fetch(`${VITE_API_URL}/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('email', email);
      if (isLogin) localStorage.removeItem('onboarding');
      else localStorage.setItem('onboarding', true);
      navigate('/dashboard');
      setPasswordError(false);
    } else if (isLogin && res.status === 403) {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 3000);
    } else if (!isLogin && res.status === 400) {
      setAccountError(true);
      setTimeout(() => setAccountError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground overflow-hidden">
      {/* ── LEFT PANEL — brand + visual ──────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative flex-col justify-between overflow-hidden bg-gradient-to-b from-[#F2EDE0] via-[#EDE5D0] to-[#E5DAC5] p-10 xl:p-14">
        {/* Organic blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-primary/12 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#DDE6D5] blur-3xl" />
          <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-[#F1E7D2] blur-3xl" />
        </div>

        {/* Logo */}
        <FadeIn className="relative z-10">
          <button onClick={() => navigate('/landing')} className="flex items-center gap-3 group">
            <img
              src="/favicon-v1.png"
              alt="Plated"
              className="h-12 w-12 object-contain"
              style={{ filter: 'hue-rotate(55deg) saturate(3) brightness(0.65)' }}
            />
            <span className="font-playfair text-2xl font-bold text-hero-heading">Plated</span>
          </button>
        </FadeIn>

        {/* Centre content — hero image with text layered inside */}
        <div className="relative z-10 flex flex-col items-start">
          <FadeIn delay={0.1} className="w-full">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              style={{
                boxShadow: '0 24px 64px rgba(44,73,39,0.18), 0 4px 16px rgba(44,73,39,0.08)',
                border: '2px solid rgba(255,255,255,0.75)'
              }}
            >
              <img
                src="/hero.jpg"
                alt="Fresh ingredients"
                className="h-[26rem] w-full object-cover xl:h-[30rem]"
                style={{ objectPosition: 'center 20%' }}
              />

              {/* Dark gradient on lower half for text legibility */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 30%, rgba(20,30,15,0.55) 60%, rgba(20,30,15,0.82) 100%)'
                }}
              />

              {/* Text + perks overlaid on the image */}
              <div className="absolute bottom-0 left-0 right-0 p-7 xl:p-8">
                <h2 className="font-playfair text-3xl xl:text-4xl font-bold leading-[1.1] tracking-tight text-white">
                  Eat well.
                  <br />
                  <span style={{ color: '#a8d48a' }}>Spend less.</span>
                </h2>
                <p className="mt-3 max-w-xs text-base leading-relaxed text-white/75">
                  Plan real meals, track your grocery budget, and skip the daily "what's for
                  dinner?" spiral.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {PERKS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-white"
                        style={{ background: 'rgba(97,140,69,0.55)' }}
                      >
                        <Icon size={13} />
                      </div>
                      <span className="text-sm font-medium text-white/90">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </FadeIn>
        </div>

        {/* Bottom tagline */}
        <FadeIn delay={0.4} className="relative z-10">
          <p className="text-sm text-hero-sub/70">© 2026 Plated — Meal planning made simple.</p>
        </FadeIn>
      </div>

      {/* ── RIGHT PANEL — auth form ───────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 relative overflow-hidden">
        {/* Subtle background blobs on mobile / right side */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[28rem] w-[28rem] rounded-full bg-[#DDE6D5]/60 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/6 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-lg">
          {/* Mobile logo (hidden on lg+) */}
          <FadeIn className="mb-8 flex items-center gap-3 lg:hidden">
            <img
              src="/favicon-v1.png"
              alt="Plated"
              className="h-12 w-12 object-contain"
              style={{ filter: 'hue-rotate(55deg) saturate(3) brightness(0.65)' }}
            />
            <span className="font-playfair text-2xl font-bold text-hero-heading">Plated</span>
          </FadeIn>

          {/* Card */}
          <FadeIn delay={0.08}>
            <div
              className="rounded-[2rem] bg-white/80 p-10 sm:p-12 shadow-xl shadow-primary/[0.06]"
              style={{
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(97,140,69,0.12)',
                boxShadow: '0 4px 32px rgba(44,73,39,0.08), 0 1px 0 rgba(255,255,255,0.95) inset'
              }}
            >
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/6 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <Salad size={12} />
                  {isLogin ? 'Welcome back' : 'Get started free'}
                </div>
                <h1 className="mt-4 font-playfair text-4xl font-bold tracking-tight text-hero-heading sm:text-5xl">
                  {isLogin ? 'Log in' : 'Create account'}
                </h1>
                <p className="mt-2 text-lg text-hero-sub">
                  {isLogin
                    ? "Good to see you again — let's get planning."
                    : 'Takes 10 seconds, no credit card needed.'}
                </p>
              </div>

              {/* Alerts */}
              {message && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                  {message}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-hero-heading">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border-2 border-border/60 bg-white/70 px-5 py-3.5 text-base text-foreground placeholder-muted-foreground outline-none backdrop-blur-sm transition-all duration-200 focus:border-primary focus:shadow-[0_0_0_4px_rgba(97,140,69,0.08)]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-hero-heading">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl border-2 bg-white/70 px-5 py-3.5 pr-14 text-base text-foreground placeholder-muted-foreground outline-none backdrop-blur-sm transition-all duration-200 focus:shadow-[0_0_0_4px_rgba(97,140,69,0.08)] ${
                        passwordError
                          ? 'border-red-400 focus:border-red-400'
                          : 'border-border/60 focus:border-primary'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Error states */}
                  {passwordError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700"
                    >
                      Wrong email or password. Try again.
                    </motion.div>
                  )}
                  {accountError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700"
                    >
                      That email's already taken. Try logging in instead.
                    </motion.div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {isLogin ? 'Log in' : 'Create my account'}
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </form>

              {/* Toggle */}
              <p className="mt-7 text-center text-base text-hero-sub">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setPasswordError(false);
                    setAccountError(false);
                  }}
                  className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
                >
                  {isLogin ? 'Sign up free' : 'Log in'}
                </button>
              </p>
            </div>
          </FadeIn>

          {/* Back to landing */}
          <FadeIn delay={0.18}>
            <p className="mt-6 text-center text-sm text-hero-sub">
              <button
                onClick={() => navigate('/landing')}
                className="text-primary/70 transition-colors hover:text-primary"
              >
                ← Back to landing page
              </button>
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
