// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://ai-ja3l.onrender.com',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        rewrite: (path) => path, // ✅ Keep `/api` prefix intact
      },
    },
  },
});
