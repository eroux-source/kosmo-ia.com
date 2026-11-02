/**
 * Collecte tout ce qui reste à fournir : contenus DÉMO (objets `demo: true` des fichiers data
 * et des collections), placeholders visuels, décisions en attente, variables d'environnement.
 */
import * as site from '../data/site';
import * as page3dooh from '../data/3dooh';
import * as faq from '../data/faq';
import * as legal from '../data/legal';
import * as stats from '../data/stats';
import * as testimonials from '../data/testimonials';
import * as formats from '../data/formats';
import * as deck from '../data/deck';
import * as services from '../data/services';
import * as cities from '../data/cities';
import * as partners from '../data/partners';
import * as about from '../data/about';
import * as home from '../data/home';
import * as careers from '../data/careers';
import checklist from '../data/checklist.json';
import { getCollection } from 'astro:content';
import { assetsNeeded } from '../data/assets-needed';
import { decisions } from '../data/decisions';
import { envRegistry } from '../data/env-registry';
import { foohProjects, restrictedFooh } from './fooh';

export interface DemoItem {
  file: string;
  path: string;
  preview: string;
}

const modules: Record<string, unknown> = {
  'src/data/site.ts': site,
  'src/data/3dooh.ts': page3dooh,
  'src/data/faq.ts': faq,
  'src/data/legal.ts': legal,
  'src/data/stats.ts': stats,
  'src/data/testimonials.ts': testimonials,
  'src/data/formats.ts': formats,
  'src/data/deck.ts': deck,
  'src/data/services.ts': services,
  'src/data/cities.ts': cities,
  'src/data/partners.ts': partners,
  'src/data/about.ts': about,
  'src/data/home.ts': home,
  'src/data/careers.ts': careers,
  'src/data/checklist.json': { checklist },
};

const PREVIEW_KEYS = ['title', 'heading', 'question', 'name', 'label', 'quote', 'text', 'value', 'intro', 'choice'];

function preview(value: Record<string, unknown>): string {
  for (const key of PREVIEW_KEYS) {
    const v = value[key];
    if (typeof v === 'string') return v.length > 90 ? `${v.slice(0, 90)}…` : v;
    if (Array.isArray(v) && typeof v[0] === 'string') return String(v[0]);
  }
  return Object.keys(value).slice(0, 4).join(', ');
}

function walk(value: unknown, path: string, file: string, out: DemoItem[]) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => walk(item, `${path}[${i}]`, file, out));
    return;
  }
  const record = value as Record<string, unknown>;
  if (record.demo === true) {
    out.push({ file, path, preview: preview(record) });
    return;
  }
  for (const [key, child] of Object.entries(record)) walk(child, path ? `${path}.${key}` : key, file, out);
}

export function collectDemoFromData(): DemoItem[] {
  const out: DemoItem[] = [];
  for (const [file, mod] of Object.entries(modules)) {
    for (const [name, value] of Object.entries(mod as Record<string, unknown>)) walk(value, name, file, out);
  }
  return out;
}

/** Entrées de collections marquées demo (cas, articles) et informations manquantes des pages villes (`missing`). */
export async function collectDemoFromCollections(): Promise<DemoItem[]> {
  const cases = await getCollection('cases', ({ data }) => data.demo);
  const posts = await getCollection('posts', ({ data }) => data.demo).catch(() => []);
  const cities = await getCollection('cities', ({ data }) => data.missing.length > 0);
  return [
    ...cases.map((c) => ({ file: `src/content/cases/${c.id}.md`, path: 'demo', preview: `${c.data.client} — ${c.data.title}` })),
    ...posts.map((p) => ({ file: `src/content/posts/${p.id}.md`, path: 'demo', preview: p.data.title })),
    ...cities.flatMap((c) => c.data.missing.map((gap, i) => ({ file: `src/content/cities/${c.id}.md`, path: `missing[${i}]`, preview: gap }))),
  ];
}

export function collectAssets() {
  return Object.entries(assetsNeeded).map(([id, entry]) => ({ id, ...entry }));
}

export function collectDecisions() {
  return decisions;
}

export function collectEnv() {
  return envRegistry.map((entry) => ({
    ...entry,
    /** Seules les variables publiques sont lisibles au build. */
    set: entry.isPublic ? Boolean((import.meta.env as Record<string, string | undefined>)[entry.key]) : undefined,
  }));
}

/** Projets FOOH : marques signalées « accord à obtenir » dans l'export (publiées quand même) et points à vérifier. */
export function collectFooh() {
  return {
    restricted: restrictedFooh.map((p) => ({ slug: p.slug, client: p.clientName, title: p.title })),
    toCheck: foohProjects.filter((p) => p.toCheck.length).map((p) => ({ slug: p.slug, client: p.clientName, items: p.toCheck })),
  };
}
