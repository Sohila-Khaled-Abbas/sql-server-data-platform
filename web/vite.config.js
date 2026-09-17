import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    target: 'esnext'
  },
  server: {
    port: 5173,
    open: false
  },
  optimizeDeps: {
    exclude: ['sql.js']
  }
});
