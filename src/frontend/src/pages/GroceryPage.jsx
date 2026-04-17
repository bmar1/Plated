/**
 * @file GroceryPage.jsx
 * @description Market / shopping view: a list of every grocery item derived
 * from the planned meals, with quick-buy links and a sticky total summary.
 * Styled with the shared warm editorial palette (warm-pane rows, Playfair
 * headings, primary green accents) and uses the `AmbientBackdrop` "market"
 * variant so it feels distinct from Dashboard / AllMeals but clearly a
 * sibling of the same app.
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowLeft,
  Check,
  ExternalLink,
  Filter,
  Package,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Sparkles
} from 'lucide-react';

import AmbientBackdrop from '../components/AmbientBackdrop';
import { VITE_API_URL } from '../config/env';

const EASE_OUT = [0.23, 1, 0.32, 1];
const GROCERY_FALLBACK = '/icons/groceryIcon.png';

const handleImgFallback = (e) => {
  if (e.currentTarget.src.endsWith(GROCERY_FALLBACK)) return;
  e.currentTarget.src = GROCERY_FALLBACK;
};

function FadeIn({ children, delay = 0, className = '', y = 16 }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const GroceryListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const [groceryList, setGroceryList] = useState(() => location.state?.grocery || []);
  const [, setIsLoading] = useState(() => !location.state?.grocery);
  const [checked, setChecked] = useState(() => new Set());
  const [hideChecked, setHideChecked] = useState(false);

  const openNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  /**
   * Collapse near-duplicate grocery items returned by the backend using a
   * simple word-overlap heuristic. Two items whose normalised word sets share
   * >= 50% overlap are treated as the same product.
   */
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
    return matches / Math.max(words1.length, words2.length);
  };

  const deduplicateItems = (items) => {
    const filteredList = [];
    const seenItems = [];
    items.forEach((item) => {
      if (!item || !item.name || item.name.toLowerCase() === 'null') return;
      const normalizedName = item.name.toLowerCase().trim();
      const isSimilar = seenItems.some(
        (seenItem) => getSimilarityScore(normalizedName, seenItem.name) >= 0.5
      );
      if (!isSimilar) {
        filteredList.push(item);
        seenItems.push({ name: normalizedName, original: item });
      }
    });
    return filteredList;
  };

  const loadGrocery = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${VITE_API_URL}/meals/groceryList`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGroceryList(deduplicateItems(data));
      } else {
        console.error('Failed to load grocery list:', response.status);
        setGroceryList([]);
      }
    } catch (error) {
      console.error('Grocery load failed:', error);
      setGroceryList([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groceryList === null) {
      navigate('/LoadingScreen', { state: { page: 'grocery' } });
    }
  }, [groceryList, navigate]);

  useEffect(() => {
    if (!location.state?.grocery && (!groceryList || groceryList.length === 0)) {
      loadGrocery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.grocery]);

  const toggleChecked = (index) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  /**
   * Build a single Walmart "add to cart" URL containing every item that
   * exposes a parseable product id. Mirrors the behaviour of the original
   * implementation.
   */
  const handleBuyAll = () => {
    const baseUrl = 'https://affil.walmart.com/cart/addToCart?items=';
    const itemsParams = groceryList
      .map((item) => {
        if (!item.productUrl) return null;
        const idMatch = item.productUrl.match(/items(?:=|%3D)(\d+)/);
        return idMatch && idMatch[1] ? `${idMatch[1]}|1` : null;
      })
      .filter(Boolean)
      .join(',');

    if (itemsParams) {
      openNewTab(`${baseUrl}${itemsParams}`);
    } else {
      alert('Could not find any valid items to add.');
    }
  };

  const visibleItems = useMemo(
    () =>
      hideChecked ? groceryList.filter((_, i) => !checked.has(i)) : groceryList,
    [hideChecked, groceryList, checked]
  );

  const totalPrice = groceryList.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  const remainingPrice = groceryList.reduce(
    (sum, item, i) => sum + (checked.has(i) ? 0 : item.totalPrice || 0),
    0
  );
  const itemCount = groceryList.length;
  const checkedCount = checked.size;

  // --- Empty state --------------------------------------------------------
  if (!groceryList || groceryList.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
        <AmbientBackdrop position="fixed" variant="market" />
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
          <FadeIn className="warm-pane max-w-md rounded-[2rem] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-playfair text-2xl text-hero-heading">
              Your basket is empty
            </h2>
            <p className="mt-2 font-crimson text-hero-sub">
              Plan a few meals and we&apos;ll build your grocery list automatically.
            </p>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-crimson text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-xl hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back to dashboard
            </button>
          </FadeIn>
        </div>
      </div>
    );
  }

  // --- Main view ----------------------------------------------------------
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AmbientBackdrop position="fixed" variant="market" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 lg:py-14">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <motion.button
              type="button"
              onClick={() => navigate('/dashboard')}
              whileHover={reduceMotion ? undefined : { x: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
              className="warm-pane group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-crimson text-sm font-semibold text-hero-heading transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <ArrowLeft
                className="h-4 w-4 text-primary transition-transform duration-300 group-hover:-translate-x-0.5"
                strokeWidth={2}
              />
              Back
            </motion.button>

            <div className="warm-pane flex items-center gap-3 rounded-full px-5 py-2.5">
              <Package className="h-4 w-4 text-primary" strokeWidth={2} />
              <div className="leading-tight">
                <p className="font-crimson text-[0.68rem] uppercase tracking-[0.28em] text-hero-sub">
                  Basket
                </p>
                <p className="font-playfair text-sm text-hero-heading">
                  {checkedCount}/{itemCount} gathered
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Eyebrow + heading */}
        <FadeIn delay={0.05} className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 font-crimson text-xs uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            <span>Ready to shop</span>
          </div>
          <h1 className="mt-3 font-playfair text-5xl font-semibold leading-[1.05] text-hero-heading md:text-6xl">
            Your <span className="text-gradient">grocery list</span>
          </h1>
          <p className="mt-3 max-w-xl font-crimson text-base text-hero-sub">
            Everything you need for this week&apos;s plan, pre-sourced from Walmart. Tick items as
            you pick them up, or send the whole basket to checkout in one click.
          </p>
        </FadeIn>

        {/* Body grid: items list + sticky summary rail */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          {/* Items */}
          <section>
            <FadeIn delay={0.1}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-crimson text-xs uppercase tracking-[0.3em] text-hero-sub">
                    Shopping items
                  </p>
                  <h2 className="mt-1 font-playfair text-2xl text-hero-heading">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </h2>
                </div>
                <motion.button
                  type="button"
                  onClick={() => setHideChecked((v) => !v)}
                  whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-crimson text-xs uppercase tracking-[0.22em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    hideChecked
                      ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'border-primary/15 bg-white/60 text-hero-heading hover:border-primary/30 hover:bg-white/80'
                  }`}
                  aria-pressed={hideChecked}
                >
                  <Filter className="h-3.5 w-3.5" strokeWidth={2} />
                  {hideChecked ? 'Showing remaining' : 'Hide gathered'}
                </motion.button>
              </div>
            </FadeIn>

            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {visibleItems.map((item) => {
                  const globalIndex = groceryList.indexOf(item);
                  const isChecked = checked.has(globalIndex);
                  return (
                    <motion.li
                      key={`${item.name}-${globalIndex}`}
                      layout={!reduceMotion}
                      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                      <GroceryRow
                        item={item}
                        isChecked={isChecked}
                        onToggle={() => toggleChecked(globalIndex)}
                        onOpen={() => item.productUrl && openNewTab(item.productUrl)}
                        reduceMotion={reduceMotion}
                      />
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>

            {visibleItems.length === 0 && (
              <FadeIn>
                <div className="warm-pane mt-2 rounded-[1.75rem] p-8 text-center">
                  <p className="font-playfair text-lg text-hero-heading">
                    All gathered — nothing left to buy
                  </p>
                  <p className="mt-1 font-crimson text-sm text-hero-sub">
                    Toggle &quot;Hide gathered&quot; off to see the full list again.
                  </p>
                </div>
              </FadeIn>
            )}
          </section>

          {/* Sticky summary rail */}
          <FadeIn delay={0.15}>
            <aside className="lg:sticky lg:top-8">
              <div className="warm-pane overflow-hidden rounded-[1.75rem]">
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Receipt className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div>
                      <p className="font-crimson text-[0.7rem] uppercase tracking-[0.28em] text-hero-sub">
                        Estimated total
                      </p>
                      <p className="font-playfair text-3xl font-semibold text-hero-heading">
                        ${totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-5 space-y-2.5 border-t border-primary/10 pt-5 font-crimson text-sm">
                    <div className="flex items-center justify-between text-hero-sub">
                      <dt>Gathered</dt>
                      <dd className="tabular-nums text-hero-heading">
                        ${(totalPrice - remainingPrice).toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-hero-sub">
                      <dt>Remaining</dt>
                      <dd className="tabular-nums text-primary">
                        ${remainingPrice.toFixed(2)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between text-hero-sub">
                      <dt>Items</dt>
                      <dd className="tabular-nums text-hero-heading">
                        {checkedCount} / {itemCount}
                      </dd>
                    </div>
                  </dl>

                  <motion.button
                    type="button"
                    onClick={handleBuyAll}
                    whileHover={reduceMotion ? undefined : { y: -1 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-crimson text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                  >
                    <ShoppingCart className="h-4 w-4" strokeWidth={2} />
                    Checkout full basket
                  </motion.button>
                  <p className="mt-3 text-center font-crimson text-[0.7rem] text-hero-sub">
                    Opens Walmart in a new tab with every item pre-loaded.
                  </p>
                </div>

                <div className="relative border-t border-primary/10 bg-primary/5 px-6 py-5">
                  <p className="font-crimson text-[0.7rem] uppercase tracking-[0.28em] text-primary">
                    Tip
                  </p>
                  <p className="mt-1 font-playfair text-sm text-hero-heading">
                    Tick items as you shop in-store — the total updates instantly.
                  </p>
                </div>
              </div>
            </aside>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

/**
 * Single shopping-list row. Left: interactive check circle with a framer-motion
 * check-mark reveal. Middle: product image + name + serving. Right: price and
 * an external link to the vendor product page.
 */
function GroceryRow({ item, isChecked, onToggle, onOpen, reduceMotion }) {
  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -2 }}
      className={`warm-pane flex items-center gap-4 rounded-[1.5rem] p-4 pr-5 transition-all duration-300 ${
        isChecked ? 'opacity-75' : ''
      }`}
    >
      {/* Check circle */}
      <motion.button
        type="button"
        onClick={onToggle}
        whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        aria-pressed={isChecked}
        aria-label={isChecked ? `Mark ${item.name} as not gathered` : `Mark ${item.name} as gathered`}
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          isChecked
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-primary/25 bg-white/70 text-transparent hover:border-primary/50'
        }`}
      >
        <AnimatePresence initial={false}>
          {isChecked && (
            <motion.span
              key="check"
              initial={reduceMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              <Check className="h-4 w-4" strokeWidth={2.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Image */}
      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl border border-primary/10 bg-secondary">
        <img
          src={item.imageUrl || GROCERY_FALLBACK}
          alt={item.name}
          loading="lazy"
          onError={handleImgFallback}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3
          className={`truncate font-playfair text-lg font-semibold ${
            isChecked ? 'text-hero-heading/70 line-through decoration-primary/60' : 'text-hero-heading'
          }`}
        >
          {item.name || 'Unnamed item'}
        </h3>
        {item.servingsPerContainer && (
          <p className="mt-0.5 font-crimson text-xs text-hero-sub">
            {item.servingsPerContainer}
          </p>
        )}
      </div>

      {/* Price + buy */}
      <div className="flex flex-shrink-0 items-center gap-3">
        <div className="text-right">
          <p className="font-playfair text-xl font-semibold tabular-nums text-hero-heading">
            ${(item.totalPrice || 0).toFixed(2)}
          </p>
        </div>
        {item.productUrl && (
          <motion.button
            type="button"
            onClick={onOpen}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            aria-label={`Buy ${item.name} on Walmart`}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/70 px-3 py-1.5 font-crimson text-xs font-semibold text-primary transition-all duration-200 hover:border-primary/40 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            Buy
            <ExternalLink className="h-3 w-3" strokeWidth={2} />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

export default GroceryListPage;
