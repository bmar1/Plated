# Plated — Landing Page Master Prompt

Create a warm, editorial SaaS landing page for **Plated** — a meal planning and grocery budget platform built for students and young adults. The design uses a **"warm pane"** aesthetic with a cream-and-white light background, translucent frosted-glass surfaces tinted with natural green, and a forest-green accent color. The page is built with React, Vite, TypeScript, Tailwind CSS, shadcn/ui, and hls.js for video streaming.

---

## GLOBAL DESIGN SYSTEM

**Fonts:** Playfair Display for all headings, Crimson Text for body and UI. Install `@fontsource/playfair-display` (weights 400, 600, 700, 800) and `@fontsource/crimson-text` (weights 400, 600, 700). Apply via:

```css
body { font-family: 'Crimson Text', 'Georgia', serif; }
h1, h2, h3, h4, h5, h6 { font-family: 'Playfair Display', 'Georgia', serif; }
```

**Color Palette (HSL, CSS variables in `:root`):**

```css
--background:        44 33% 97%    /* warm cream — #fdfcf9 */
--foreground:        28 22% 15%    /* dark warm brown — #2d2416 */
--primary:           99 32% 42%    /* forest green — #618c45 */
--primary-foreground:44 33% 97%    /* cream on green */
--secondary:         44 22% 93%    /* light cream — #f5f2ea */
--border:            44 18% 87%    /* warm parchment border */
--hero-heading:      28 28% 12%    /* near-black warm brown for big headings */
--hero-sub:          28 14% 44%    /* muted warm brown for subtext */
--card:               0  0% 100%   /* pure white cards */
--muted:             44 22% 93%
--muted-foreground:  30 10% 54%    /* warm gray */
--accent:           100 30% 88%    /* very light sage — hover tints */
--accent-foreground: 99 32% 30%
--radius:            1rem
```

Map all colors in `tailwind.config.ts` as `hsl(var(--token))`. Add `hero.heading` and `hero.sub` as custom colors. Also add `cream` as alias for `background` and `forest` as alias for `primary`.

**"Warm Pane" utility class** (in `index.css` under `@layer utilities`):

```css
.warm-pane {
  background: rgba(255, 253, 249, 0.76);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(97, 140, 69, 0.16);
  box-shadow:
    0 2px 32px rgba(44, 73, 39, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  position: relative;
  overflow: hidden;
}
.warm-pane::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    160deg,
    rgba(255,255,255,0.90) 0%,
    rgba(255,255,255,0.40) 25%,
    rgba(97,140,69,0.08) 50%,
    rgba(255,255,255,0.40) 75%,
    rgba(255,255,255,0.90) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
```

**Organic blob decoration** (reusable background element):
```css
.organic-blob {
  position: absolute;
  filter: blur(90px);
  opacity: 0.12;
  border-radius: 9999px;
  animation: float 9s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50%       { transform: translateY(-18px) scale(1.03); }
}
```

**Gradient text utility:**
```css
.text-gradient {
  background: linear-gradient(135deg, #618c45 0%, #7ab05d 50%, #5A7A4D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Button Variants** (in shadcn `button.tsx`):
- `hero`: `bg-primary text-primary-foreground rounded-full px-7 py-3.5 text-base font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 transition-all`
- `heroSecondary`: `warm-pane text-foreground rounded-full px-7 py-3.5 text-base font-normal hover:bg-white/80 transition-all`

**Marquee animation** (`tailwind.config.ts` keyframes):
```
marquee: { "0%": { transform: "translateX(0%)" }, "100%": { transform: "translateX(-50%)" } }
```
Animation: `marquee 28s linear infinite`

---

## SECTION 1: HERO

Full-viewport hero with a **background food/cooking video** playing behind all content.

**Video URL:** `[YOUR_HERO_FOOD_VIDEO_MP4_URL]`
Use a standard `<video>` tag with `<source>`. Attributes: `autoPlay loop muted playsInline`. Positioned `absolute inset-0 w-full h-full object-cover`.

**Gradient overlay** (absolute, pointer-events-none):
```
linear-gradient(to bottom,
  rgba(253,252,249,0.20) 0%,
  rgba(253,252,249,0.10) 30%,
  rgba(253,252,249,0.35) 55%,
  rgba(253,252,249,0.72) 75%,
  hsl(44 33% 97%) 95%
)
```

**Content** (relative z-10, flex column, min-h-screen):

**Navbar** — centered, `warm-pane rounded-3xl` container (`max-w-[900px]`) containing:
- Logo: small `<img src="/favicon-v1.png" />` in a `w-8 h-8` rounded-lg + **"Plated"** text (`text-xl font-semibold font-playfair text-foreground`)
- Nav items: "Features" (dropdown chevron), "How It Works", "Pricing", "About" — plain text buttons in `text-foreground/70 hover:text-foreground`
- CTA: `<Button variant="hero" size="sm">Get Started Free</Button>`

**Announcement Badge** — `warm-pane rounded-full` pill: `🌿 Now free for students!` + nested `"See plans"` badge with `ChevronRight` icon

**Heading** — `text-hero-heading font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight max-w-4xl`:
```
Eat Well.
Spend Less.
Zero Stress.
```
The word **"Well."** uses `.text-gradient`.

**Subheading** — `text-hero-sub font-crimson text-xl max-w-lg mt-5 leading-relaxed`:
"Plated is your AI-powered meal planner and grocery budget tracker — purpose-built for students who want to eat better without overspending."

**CTA Buttons** — `flex gap-4 mt-8`:
- "Build My Plan" (`hero` variant)
- "See How It Works" (`heroSecondary` variant)

**Social Proof Bar** — at bottom of hero. Left text: `"Trusted by students at 40+ universities"` (text-foreground/50 text-sm). Right: infinite marquee scrolling 6 university/food brand names (`Berkeley Eats`, `Dorm Kitchen`, `Campus Plate`, `Meal Depot`, `Budget Bites`, `Nourish Co.`) — each with a `warm-pane w-6 h-6 rounded-md` icon showing the first letter. Array duplicated for seamless loop. Uses `animate-marquee`.

---

## SECTION 2: FEATURES (3-Column Cards with Background Video)

**Background HLS Video:** `[YOUR_FEATURES_COOKING_VIDEO_HLS_URL]`
Use hls.js for playback. Video is `absolute inset-0 object-cover` behind the section.

**Gradient overlays on top of video:**
- Top: `bg-gradient-to-b from-background via-background/85 to-transparent` (height 45%)
- Bottom: `bg-gradient-to-t from-background via-background/85 to-transparent` (height 45%)
- Overall lightening: `bg-background/50`

**Section header:**
- Badge: `warm-pane rounded-full` pill — `"Core Features"` + `"Overview"` with `ChevronRight`
- Heading: `text-hero-heading font-playfair text-3xl sm:text-5xl font-bold`:
  ```
  Built for Busy People
  Who Actually Want to Cook
  ```
- Sub: `"Three pillars that keep your meals and budget running smoothly — all week long."`

**3 Feature Cards** (`grid md:grid-cols-3 gap-6`), each `warm-pane rounded-3xl p-8`:

1. **Smart Meal Plans** — "Tell us your tastes, budget, and skill level. Plated builds a full week of personalized meals in seconds." Stat: `"5 min"` / `"to a full week of meals"`

2. **Budget Control** — "Set your weekly grocery budget and Plated builds meals around it — tracking spending to the dollar with zero effort." Stat: `"38%"` / `"avg. grocery savings"`

3. **Instant Grocery Lists** — "Every meal generates a ready-to-shop, sorted grocery list with real prices from local stores near you." Stat: `"1 click"` / `"from plan to cart"`

Each card has a `border-t border-border/50` divider above the stat. Hover: `hover:bg-white/80`.

---

## SECTION 3: MEAL SUGGESTIONS SECTION (Video Left, Content Right)

`py-32 px-4`, `max-w-6xl`, `grid lg:grid-cols-2 gap-20 items-center`.

**Left — Video:**
`warm-pane rounded-3xl aspect-[4/3] overflow-hidden`
HLS video: `[YOUR_MEAL_SUGGESTIONS_VIDEO_HLS_URL]`

**Right — Content:**
- Badge: `"AI Meal Engine"` + `"Smart"`
- Heading (font-playfair):
  ```
  Every Meal Fits
  Your Day Perfectly
  ```
- Body: "Our AI reads your pantry, your budget, and your schedule — then suggests meals that actually work. No more staring at an empty fridge wondering what to cook."
- Bullet list (3 items with `w-1.5 h-1.5 rounded-full bg-primary` dots):
  - "Personalized by taste and dietary needs"
  - "Adapts to your remaining weekly budget"
  - "Learns from meals you love and skip"
- Buttons: "Try It Now" (`hero`) + "See the Magic" (`heroSecondary`)

---

## SECTION 4: REVERSE SECTION — GROCERY BUDGET TRACKER (Content Left, Video Right)

Same layout as Section 3 but reversed with `order-` classes for mobile-first.

**Left — Content** (`order-2 lg:order-1`):
- Badge: `"Budget Studio"` + `"Live"`
- Heading (font-playfair):
  ```
  Know Exactly Where
  Every Dollar Goes
  ```
- Body: "Drag meals in and out of your week while watching your grocery total update live. See which swaps save money and which meals blow the budget before you ever shop."
- 4 stat cards in `grid grid-cols-2 gap-4`, each `warm-pane rounded-2xl p-4`:
  - `"$47"` / `"avg. weekly spend"`
  - `"12 min"` / `"weekly planning time"`
  - `"3.2x"` / `"more home-cooked meals"`
  - `"94%"` / `"stay on-budget rate"`
- Button: "Track My Budget" (`hero`)

**Right — Video** (`order-1 lg:order-2`):
`warm-pane rounded-3xl aspect-[4/3]`
HLS video: `[YOUR_GROCERY_BUDGET_VIDEO_HLS_URL]`

---

## SECTION 5: NUMBERS SECTION (Full-Width Background Video)

**Background HLS Video:** `[YOUR_NUMBERS_FOOD_VIDEO_HLS_URL]`

**Gradient overlay:**
```
linear-gradient(to top,
  hsl(44 33% 97%) 0%,
  hsl(44 33% 97% / 0.90) 15%,
  hsl(44 33% 97% / 0.45) 40%,
  hsl(44 33% 97% / 0.20) 60%,
  hsl(44 33% 97% / 0.35) 100%
)
```

**Content** (relative z-10, `py-32`):

**Hero metric** (centered): `$2.1M` in `text-7xl sm:text-[8rem] lg:text-[10rem] font-bold font-playfair tracking-tighter text-gradient` + label `"Saved by students this year"` + description `"The average Plated user saves $47/week versus meal delivery — that's over $2,400 a year back in your pocket."` `mb-24`.

**Bottom two metrics** in a `warm-pane rounded-3xl p-12 grid md:grid-cols-2` with a vertical `md:border-r border-border/50` divider:
- `"280K+"` / `"Meals planned monthly"`
- `"4.9 / 5"` / `"Average user rating"`

---

## SECTION 6: TESTIMONIALS

`py-32`, centered header + 3-column card grid.

**Header (font-playfair):**
```
Real Students.
Real Savings. Real Meals.
```
Sub: `"From dorm rooms to first apartments — here's what our users are saying."`

**3 Testimonial cards** (`warm-pane rounded-3xl p-8`), middle card offset with `md:-translate-y-6`:

1. **Maya Chen**, Nutrition Sciences, UC Davis (initials `"MC"`) — *"I used to spend $90 a week on takeout. Plated got me eating home-cooked meals for $44. I genuinely look forward to cooking now."*

2. **Jordan Wells**, Computer Science, UT Austin (initials `"JW"`) — *"The grocery list feature is insane. I open Plated, hit 'generate list,' and I'm in and out of the store in 20 minutes."*

3. **Priya Nair**, Pre-Med, Johns Hopkins (initials `"PN"`) — *"Between studying and labs I have zero time. Plated plans my whole week in five minutes and I never exceed my $50 budget."*

Each card: quoted text + divider + avatar circle (`w-10 h-10 rounded-full bg-accent`) with forest-green initials + name/role.

---

## SECTION 7: CTA + FOOTER WRAPPER (Background Video)

Wrapper component with shared background HLS video behind both CTA and Footer.

**HLS Video:** `[YOUR_CTA_AMBIENT_FOOD_VIDEO_HLS_URL]`

**Gradient overlay:**
```
linear-gradient(to bottom,
  hsl(44 33% 97%) 0%,
  hsl(44 33% 97% / 0.90) 15%,
  hsl(44 33% 97% / 0.45) 40%,
  hsl(44 33% 97% / 0.20) 60%,
  hsl(44 33% 97% / 0.35) 100%
)
```

**CTA Section** (relative z-10):
`warm-pane rounded-[2rem] p-12 sm:p-20` centered card

Heading (font-playfair):
```
Ready to Eat Well
Without Breaking the Bank?
```

Sub: `"Join 48,000+ students already cooking smarter with Plated. Free forever — no credit card needed."`

Buttons: `"Build My First Plan"` (`hero`) + `"Learn More"` (`heroSecondary`)

**Footer** (relative z-10):
5-column grid: Brand (2-col span with `/favicon-v1.png` logo + tagline `"Meal planning and budget tracking, made simple."`) + `"Product"` (Meal Plans, Budget Tracker, Grocery Lists, Nutrition, Changelog) + `"Company"` (About, Blog, Careers, Press) + `"Resources"` (Docs, Community, Support, Status)

Bottom bar: `"© 2026 Plated"` + Privacy / Terms / Cookies links
Borders: `border-t border-border/30`

---

## KEY DEPENDENCIES

```
hls.js
@fontsource/playfair-display
@fontsource/crimson-text
lucide-react
class-variance-authority
tailwindcss-animate
@radix-ui/react-slot
shadcn/ui components
react-router-dom
@tanstack/react-query
framer-motion
```

---

## VIDEO CONTENT GUIDE

Each HLS/MP4 slot should use ambient food or lifestyle footage:

| Section | Content Type |
|---------|-------------|
| Hero (MP4) | Bright, airy kitchen prep — chopping vegetables, golden light |
| Features (HLS) | Slow overhead shot of a colorful meal being plated |
| Meal Suggestions (HLS) | Someone browsing a food app, fresh ingredients on counter |
| Budget Tracker (HLS) | Farmers market walkthrough, produce selection, cart filling |
| Numbers (HLS) | Time-lapse of a healthy meal being assembled |
| CTA/Footer (HLS) | Cozy kitchen, warm steam rising from a bowl, candle-lit table |

---

## PAGE STRUCTURE (`Index.tsx`)

```tsx
<HeroSection />
<FeaturesSection />
<MealSuggestionsSection />       {/* chess */}
<BudgetTrackerSection />         {/* reverse chess */}
<NumbersSection />
<TestimonialsSection />
<CTAFooterWrapper />             {/* contains CTASection + FooterSection */}
```
