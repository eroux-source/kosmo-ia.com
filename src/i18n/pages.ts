/**
 * Inventaire des pages anglaises traduites : pages statiques de src/pages (hors pages utilitaires) + pages générées
 * (villes, articles, cas, projets FOOH). Source de la route /[lang]/[...path] et de la réécriture des liens.
 */
import { getCollection } from 'astro:content';
import { cities } from '../data/cities';
import { foohProjects, foohHref } from '../lib/fooh';
import { getPublishedCases } from '../lib/cases';
import { isLocalizable } from './routes';

const files = Object.keys(import.meta.glob('../pages/**/*.astro'));
const STATIC = files
  .filter((f) => !f.includes('['))
  .map((f) => f.replace('../pages', '').replace(/\.astro$/, '').replace(/\/index$/, '') || '/')
  .filter(isLocalizable);

let cache: Promise<string[]> | undefined;

export function getEnPaths(): Promise<string[]> {
  cache ??= (async () => {
    const posts = await getCollection('posts', ({ data }) => data.published);
    const cases = await getPublishedCases();
    return [
      ...STATIC,
      ...cities.map((c) => `/3dooh/${c.slug}`),
      ...posts.map((p) => `/journal/${p.id}`),
      ...cases.map((c) => `/work/${c.id}`),
      ...foohProjects.map(foohHref),
    ];
  })();
  return cache;
}
