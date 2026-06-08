import { defineConfig } from 'vite';

export default defineConfig({
  base: '/glasses-test/',   // پوشه‌ای که روی هاست ساختی

  // The project root is the glasses-scroll folder itself.
  root: '.',

  // Assets (PNG frames) are served from the root.
  publicDir: false,   // PNGs are imported via import.meta.glob, not /public

  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,   // never inline PNGs as base64
  },

  server: {
    port: 5173,
    open: true,            // auto-open browser when you run `npm run dev`
  },

  // Vite needs to know about large asset sets
  assetsInclude: ['**/*.png'],
});