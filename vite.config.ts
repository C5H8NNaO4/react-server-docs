import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import svgr from 'vite-plugin-svgr';

const isProd = process.env.NODE_ENV === 'production';

// https://vitejs.dev/config/ssr-options.html#ssr-noexternal
const noExternal: string[] = [];
if (isProd) {
  noExternal.push(
    ...[
      // MUI needs to be pre-processed by Vite in production: https://github.com/brillout/vite-plugin-ssr/discussions/901
      '@mui/base',
      '@mui/icons-material',
      '@mui/material',
      '@mui/utils',
    ]
  );
}
// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: 'REACT_APP_',
  plugins: [
    svgr(),
    react(),
    viteCompression(),
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
  ],
  ssr: {
    noExternal,
  },
  build: {
    rollupOptions: {
      external: ['node_modules/jsonwebtoken/index.js'],
    },
  },
});
