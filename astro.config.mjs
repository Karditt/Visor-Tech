// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://vizortex.ru',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()]
  }
});