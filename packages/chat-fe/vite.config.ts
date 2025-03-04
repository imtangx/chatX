import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import viteCompression from 'vite-plugin-compression';
import AutoImport from 'unplugin-auto-import/vite';
import ViteRestart from 'vite-plugin-restart';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['ie 11'],
    }),
    viteCompression(),
    AutoImport({
      imports: ['react'],
    }),
    ViteRestart({
      restart: ['.env*', 'vite.config.ts'],
    })
  ],
  esbuild: {
    pure: ['console.log'], // 删除 console.log
  },
});
