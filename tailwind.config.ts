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
        '7xl': 'calc(4.5rem * var(--font-scale, 1))',
      },
      colors: {
        canvas: 'var(--color-canvas, #FDF6E3)',
        'canvas-2': 'var(--color-canvas-2, #FFF8EA)',
        ink: 'var(--color-ink, #2E3440)',
        'ink-soft': 'var(--color-ink-soft, #4A5666)',
        accent: 'var(--color-accent, #7FB069)',
        'accent-2': 'var(--color-accent-2, #F4A6C0)',
        'accent-3': 'var(--color-accent-3, #F9D77E)',
        glow: 'var(--color-glow, #FFE9A3)',
        leaf: 'var(--color-leaf, #7FB069)',
        sky: 'var(--color-sky, #8DC9E5)',
        bloom: 'var(--color-bloom, #F4A6C0)',
        sunbeam: 'var(--color-sunbeam, #F9D77E)',
        moss: 'var(--color-moss, #3E5641)',
        coral: 'var(--color-coral, #F8825B)',
        lilac: 'var(--color-lilac, #B395E8)',
      },
      borderRadius: {
        bloom: '1rem',
        'bloom-lg': '1.5rem',
        'bloom-xl': '2rem',
      },
      boxShadow: {
        bloom: '0 10px 28px -12px rgba(46, 52, 64, 0.22)',
        'bloom-lg': '0 18px 40px -18px rgba(46, 52, 64, 0.28)',
        sticker: '6px 8px 0 0 rgba(46, 52, 64, 1)',
        'sticker-lg': '8px 10px 0 0 rgba(46, 52, 64, 1)',
        'sticker-pressed': '2px 3px 0 0 rgba(46, 52, 64, 1)',
        glow: '0 0 24px 0 var(--color-glow, #FFE9A3)',
      },
      spacing: {
        'screen-d': '100dvh',
        'screen-s': '100svh',
        'safe-t': 'var(--bw-safe-top)',
        'safe-b': 'var(--bw-safe-bottom)',
        'safe-l': 'var(--bw-safe-left)',
        'safe-r': 'var(--bw-safe-right)',
      },
      maxWidth: {
        content: 'var(--bw-content-max)',
        'content-narrow': 'var(--bw-content-max-narrow)',
      },
      keyframes: {
        'gentle-bob': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'soft-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.92' },
        },
        'drift-x': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(8px)' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'scale(1.1) rotate(20deg)', opacity: '1' },
        },
      },
      animation: {
        'gentle-bob': 'gentle-bob 3.2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2.4s ease-in-out infinite',
        'drift-x': 'drift-x 5s ease-in-out infinite',
        sparkle: 'sparkle 2.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
