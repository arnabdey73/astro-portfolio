// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined
        }
      }
    }
  }
});