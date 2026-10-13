import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import animate from 'tailwindcss-animate';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1200px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          soft: 'hsl(var(--primary-soft))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        // Green accent: used for "verified / positive" states and secondary CTAs.
        leaf: {
          DEFAULT: 'hsl(var(--leaf))',
          foreground: 'hsl(var(--leaf-foreground))',
          soft: 'hsl(var(--leaf-soft))',
        },
        // Amber: reserved for the legal disclaimer.
        notice: {
          DEFAULT: 'hsl(var(--notice))',
          foreground: 'hsl(var(--notice-foreground))',
          border: 'hsl(var(--notice-border))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        // Hind covers Latin + Devanagari in one family, so Hindi and English text match.
        sans: ['var(--font-sans)', ...fontFamily.sans],
        // Latin glyphs come from Noto Serif; Devanagari falls through to Noto Serif Devanagari.
        serif: ['var(--font-serif-latin)', 'var(--font-serif-deva)', ...fontFamily.serif],
      },
    },
  },
  plugins: [animate],
};

export default config;
