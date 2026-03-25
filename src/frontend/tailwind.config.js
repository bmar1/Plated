/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: 'hsl(var(--secondary))',
        border: 'hsl(var(--border))',
        card: 'hsl(var(--card))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        cream: 'hsl(var(--background))',
        forest: 'hsl(var(--primary))',
        hero: {
          heading: 'hsl(var(--hero-heading))',
          sub: 'hsl(var(--hero-sub))',
        },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        crimson: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-18px) scale(1.03)' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(-1.5%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 9s ease-in-out infinite',
        'ken-burns': 'kenBurns 25s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
