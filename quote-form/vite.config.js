import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build configuration tuned for embedding into the WordPress theme.
// outDir points to ../assets/quote-form/ so the built files land directly
// inside the WP theme's assets/ directory (which is included in the deploy zip).
//
// Output filenames are stable (no content hash) so functions.php can enqueue
// them by a fixed name without reading a manifest:
//   assets/quote-form/quote-form.js
//   assets/quote-form/quote-form.css

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../assets/quote-form',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'quote-form.js',
        chunkFileNames: 'quote-form-[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'quote-form.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
})
