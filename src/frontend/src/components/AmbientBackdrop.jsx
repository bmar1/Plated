/**
 * @file AmbientBackdrop.jsx
 * @description Shared ambient layer used across the authenticated pages
 * (Dashboard, Recipe, AllMeals, Grocery). Renders a warm sage-and-cream
 * mesh gradient, a set of blurred primary-green orbs, faint SVG grain,
 * and soft top/bottom vignettes so the editorial content panes float
 * over a cohesive green backdrop instead of flat white.
 *
 * Accepts optional props so individual pages can nudge the palette
 * without drifting from the shared recipe.
 */

const NOISE_SVG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.35  0 0 0 0 0.2  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/**
 * @param {object} props
 * @param {'fixed' | 'absolute'} [props.position='fixed'] - positioning mode. Use `fixed`
 *   for scroll-locked backdrops (Dashboard, Grocery, AllMeals). Use `absolute` when the
 *   parent element itself scrolls (Recipe).
 * @param {'default' | 'market' | 'library'} [props.variant='default'] - lets each page
 *   subtly shift the orb layout so they don't feel identical.
 */
export default function AmbientBackdrop({ position = 'fixed', variant = 'default' }) {
  const positionClass = position === 'fixed' ? 'fixed' : 'absolute';

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${positionClass} inset-0 z-0 overflow-hidden`}
    >
      {/* Mesh base: stacked radial gradients + soft cream-to-sage vertical wash */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(60rem 40rem at 8% -10%, hsl(99 32% 42% / 0.22), transparent 60%)',
            'radial-gradient(52rem 36rem at 100% 12%, hsl(100 30% 78% / 0.55), transparent 55%)',
            'radial-gradient(48rem 40rem at 105% 90%, hsl(99 32% 42% / 0.18), transparent 55%)',
            'radial-gradient(40rem 32rem at -8% 95%, hsl(44 60% 88% / 0.8), transparent 60%)',
            'radial-gradient(70rem 50rem at 50% 40%, hsl(100 24% 92% / 0.45), transparent 70%)',
            'linear-gradient(180deg, hsl(44 33% 97%) 0%, hsl(96 22% 94%) 60%, hsl(100 20% 92%) 100%)'
          ].join(',')
        }}
      />

      {/* Variant-specific orb cluster — each page gets a distinct constellation
          so the backdrop doesn't feel copy-pasted when navigating between them. */}
      {variant === 'default' && (
        <>
          <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute right-[-6rem] top-[32%] h-[26rem] w-[26rem] rounded-full bg-[hsl(99_32%_42%_/_0.22)] blur-[130px]" />
          <div className="absolute bottom-[-4rem] left-[28%] h-[22rem] w-[22rem] rounded-full bg-[hsl(100_30%_70%_/_0.35)] blur-[110px]" />
          <div className="absolute bottom-[18%] right-[12%] h-64 w-64 rounded-full bg-[hsl(44_60%_82%_/_0.55)] blur-[100px]" />
        </>
      )}
      {variant === 'library' && (
        <>
          <div className="absolute -top-32 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/18 blur-[140px]" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-[24rem] w-[24rem] rounded-full bg-[hsl(100_30%_72%_/_0.3)] blur-[120px]" />
          <div className="absolute bottom-[-2rem] right-[-4rem] h-[22rem] w-[22rem] rounded-full bg-[hsl(44_60%_84%_/_0.5)] blur-[110px]" />
        </>
      )}
      {variant === 'market' && (
        <>
          <div className="absolute left-[-5rem] top-[10%] h-[22rem] w-[22rem] rounded-full bg-primary/22 blur-[130px]" />
          <div className="absolute right-[-3rem] top-[55%] h-[26rem] w-[26rem] rounded-full bg-[hsl(100_30%_70%_/_0.35)] blur-[120px]" />
          <div className="absolute bottom-[-6rem] left-[35%] h-[24rem] w-[24rem] rounded-full bg-[hsl(44_55%_82%_/_0.6)] blur-[110px]" />
          <div className="absolute top-[28%] right-[20%] h-56 w-56 rounded-full bg-[hsl(99_32%_42%_/_0.16)] blur-[100px]" />
        </>
      )}

      {/* Paper grain for editorial texture — inline SVG so no network asset required */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE_SVG }}
      />

      {/* Top + bottom vignettes tie the pane edges into the sage wash */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[hsl(99_32%_42%_/_0.08)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-[hsl(99_32%_42%_/_0.10)] to-transparent" />
    </div>
  );
}
