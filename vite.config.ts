import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  publicDir: '/public',
  plugins: [
    svgr(),
    react(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css,html}'],
      },

      srcDir: 'src',
      filename: 'service-worker.js',
      strategies: 'injectManifest',
      injectRegister: false,
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
    viteCompression(),
  ],
});
