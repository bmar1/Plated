import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const APP_SCROLL_ID = 'app-scroll';

const desktopNavLinkClass =
  'rounded-full border border-transparent px-3 py-2 text-sm font-semibold tracking-wide text-white/90 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40';

const shellClass =
  'rounded-[1.75rem] border border-white/10 bg-[#5A7A4D] px-4 py-3 shadow-[0_18px_50px_rgba(44,73,39,0.22)] backdrop-blur-xl ring-1 ring-black/10 sm:px-5';

/**
 * Marketing site header: brand-green bar + optional sticky duplicate when user scrolls.
 * Listens to #app-scroll (see App.jsx) because the app uses an inner scroll container, not window.
 */
export default function MarketingNavBar({
  navLinks,
  trailingNavItem,
  onLogoClick,
  ctaLabel,
  stickyCtaLabel,
  onCtaClick,
}) {
  const reduceMotion = useReducedMotion();
  const [showNav, setShowNav] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const stickyLabel = stickyCtaLabel ?? ctaLabel;

  useEffect(() => {
    const el = document.getElementById(APP_SCROLL_ID);
    if (!el) return undefined;

    const handler = () => setShowNav(el.scrollTop > 180);
    handler();
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const NavShell = ({ children, className = '' }) => (
    <div className={`${shellClass} ${className}`.trim()}>{children}</div>
  );

  const LogoMark = ({ compact }) => (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-black/15 shadow-sm ring-1 ring-white/15 ${
        compact ? 'h-11 w-11' : 'h-12 w-12'
      }`}
    >
      <img
        src="/favicon-v1.png"
        alt="Plated logo"
        className={`object-contain brightness-0 invert ${compact ? 'h-9 w-9' : 'h-11 w-11'}`}
      />
    </span>
  );

  const barInner = (opts) => {
    const { compactLogo, ctaText } = opts;
    return (
      <div className="relative z-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 rounded-full pr-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <LogoMark compact={compactLogo} />
          <span
            className={`font-playfair font-bold text-white ${compactLogo ? 'text-lg' : 'text-xl sm:text-2xl'}`}
          >
            Plated
          </span>
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {navLinks.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={desktopNavLinkClass}
            >
              {item.label}
            </button>
          ))}
          <button type="button" onClick={trailingNavItem.onClick} className={desktopNavLinkClass}>
            {trailingNavItem.label}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCtaClick}
            className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#4E6B42] transition-colors duration-200 hover:bg-[#F5F0E4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 sm:inline-flex"
          >
            {ctaText}
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm transition-colors duration-200 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showNav && (
          <motion.nav
            initial={reduceMotion ? false : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed left-4 right-4 top-3 z-50 mx-auto max-w-5xl"
          >
            <NavShell>
              {barInner({ compactLogo: true, ctaText: stickyLabel })}
            </NavShell>
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-background/95 px-6 pb-8 pt-24 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex max-w-sm flex-col gap-4">
              {navLinks.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="warm-pane rounded-2xl px-5 py-4 text-left text-xl font-playfair font-semibold text-hero-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <span className="relative z-10">{item.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  trailingNavItem.onClick();
                  setMobileOpen(false);
                }}
                className="warm-pane rounded-2xl px-5 py-4 text-left text-xl font-playfair font-semibold text-hero-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="relative z-10">{trailingNavItem.label}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onCtaClick();
                  setMobileOpen(false);
                }}
                className="mt-2 rounded-full bg-primary px-5 py-4 text-base font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                Get Started Free
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <NavShell>{barInner({ compactLogo: false, ctaText: ctaLabel })}</NavShell>
    </>
  );
}
