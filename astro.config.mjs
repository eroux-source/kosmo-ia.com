// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

/** Domaine provisoire du site IA (à confirmer). Garder identique à SITE.url dans src/lib/seo.ts. */
const SITE_URL = 'https://ai.kosmocgi.com';
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
