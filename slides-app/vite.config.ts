import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    topLevelAwait({
      promiseExportName: "__tla_promise__",
      promiseImportName: (i) => `__tla_promise_${i}__`
    })
  ],
  build: {
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
});
