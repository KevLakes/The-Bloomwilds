import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-family, system-ui)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display, "Fredoka", "Quicksand", system-ui)', 'sans-serif'],
      },
      fontSize: {
        // All sizes scale with --font-scale
        xs: 'calc(0.75rem * var(--font-scale, 1))',
        sm: 'calc(0.875rem * var(--font-scale, 1))',
        base: 'calc(1rem * var(--font-scale, 1))',
        lg: 'calc(1.125rem * var(--font-scale, 1))',
        xl: 'calc(1.25rem * var(--font-scale, 1))',
        '2xl': 'calc(1.5rem * var(--font-scale, 1))',
        '3xl': 'calc(1.875rem * var(--font-scale, 1))',
        '4xl': 'calc(2.25rem * var(--font-scale, 1))',
        '5xl': 'calc(3rem * var(--font-scale, 1))',
        '6xl': 'calc(3.75rem * var(--font-scale, 1))',
      },
      colors: {
        // Bloomwilds palette
        canvas: 'var(--color-canvas, #FDF6E3)',
        ink: 'var(--color-ink, #2E3440)',
        leaf: 'var(--color-leaf, #7FB069)',
        sky: 'var(--color-sky, #8DC9E5)',
        bloom: 'var(--color-bloom, #F4A6C0)',
        sunbeam: 'var(--color-sunbeam, #F9D77E)',
        moss: 'var(--color-moss, #3E5641)',
      },
      borderRadius: {
        bloom: '1rem',
      },
      boxShadow: {
        bloom: '0 8px 24px -8px rgba(46, 52, 64, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
