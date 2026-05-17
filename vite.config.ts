/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

const base = process.env.VITE_BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'art/**/*', 'audio/**/*'],
      manifest: {
        name: 'Bloomwilds',
        short_name: 'Bloomwilds',
        description:
          'A playful learning adventure for kids. Ett lekfullt lärande äventyr för barn.',
        theme_color: '#7FB069',
        background_color: '#FDF6E3',
        display: 'standalone',
        orientation: 'any',
        start_url: base,
        scope: base,
        icons: [
          {
            src: `${base}art/ui/icon-192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}art/ui/icon-512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,mp3,woff2}'],
        navigateFallback: `${base}index.html`,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
  },
});
