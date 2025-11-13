import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  server: {
    host: '0.0.0.0',
    port: 3000
  }
});
