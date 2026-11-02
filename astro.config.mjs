// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

/** Domaine du site IA (nom du repo, 02/11/2026). Garder identique à SITE.url dans src/lib/seo.ts. */
const SITE_URL = 'https://kosmo-ia.com';
const PRIVATE_PATHS = ['/thank-you', '/book'];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { inlineStylesheets: 'always' },
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !PRIVATE_PATHS.includes(new URL(page).pathname.replace(/(.)\/$/, '$1')),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
