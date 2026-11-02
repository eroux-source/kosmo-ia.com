/**
 * Traductions : inventaire et contrôle, sur le site construit (npm run build d'abord).
 *
 *   node scripts/i18n.mjs extract   → .i18n/missing-<langue>.json : textes anglais sans traduction (clé = texte, valeur = page)
 *   node scripts/i18n.mjs check     → échoue s'il manque une traduction, si un repère <tN> est perdu, ou si une page
 *                                     traduite a un défaut SEO (lang, canonical, hreflang, titre, description, doublons)
 *
 * Les dictionnaires vivent dans src/i18n/dict/<langue>/*.json ({ "texte anglais": "traduction" }).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { translateHtml, placeholdersOf, templateOf, makeLookup } from '../src/i18n/engine.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist/client');
const DICT = join(ROOT, 'src/i18n/dict');
const OUT = join(ROOT, '.i18n');
const LANGS = ['fr', 'de', 'nl'];
/** Pages jamais traduites (noindex) ; /play = wireframe écrit en français (19/10/2026), cf. src/i18n/routes.ts. */
const EN_ONLY = ['/todo', '/styleguide', '/play'];
const SITE = 'https://www.kosmocgi.com';
const mode = process.argv[2] ?? 'extract';

if (!existsSync(DIST)) {
  console.error('dist/client introuvable : lancer npm run build avant.');
  process.exit(1);
}

function pages(dir = DIST, base = '') {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return pages(full, `${base}/${name}`);
    return name === 'index.html' ? [{ path: base || '/', file: full }] : [];
  });
}
const all = pages();
const isLocalized = (p) => LANGS.some((l) => p === `/${l}` || p.startsWith(`/${l}/`));
const enPages = all.filter((p) => !isLocalized(p.path) && !EN_ONLY.some((x) => p.path === x || p.path.startsWith(`${x}/`)));
/* Ordre : pages principales d'abord (un texte partagé est rattaché à la première page où il apparaît). */
const rank = (p) => (p === '/' ? 0 : p.split('/').length - 1 === 1 ? 1 : p.startsWith('/3dooh/') ? 2 : p.startsWith('/work') ? 3 : 4);
enPages.sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path));

/** Segments de toutes les pages anglaises : texte → première page où il apparaît. */
const segments = new Map();
for (const page of enPages) {
  const html = readFileSync(page.file, 'utf8');
  translateHtml(html, {
    lang: 'en',
    siteUrl: SITE,
    lookup: () => undefined,
    onMissing: (text) => {
      const key = templateOf(text)?.template ?? text;
      if (!segments.has(key)) segments.set(key, page.path);
    },
  });
}

function loadDict(lang) {
  const dir = join(DICT, lang);
  const dict = new Map();
  const dupes = [];
  if (!existsSync(dir)) return { dict, dupes };
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const entries = JSON.parse(readFileSync(join(dir, file), 'utf8'));
    for (const [key, value] of Object.entries(entries)) {
      if (key.startsWith('//')) continue;
      if (dict.has(key) && dict.get(key) !== value) dupes.push(`${file}: ${key.slice(0, 80)}`);
      dict.set(key, value);
    }
  }
  return { dict, dupes };
}

let failed = false;
const report = [];
mkdirSync(OUT, { recursive: true });

for (const lang of LANGS) {
  const { dict, dupes } = loadDict(lang);
  const missing = Object.fromEntries([...segments].filter(([key]) => !dict.has(key)));
  const stale = [...dict.keys()].filter((key) => !segments.has(key));
  const broken = [...dict].filter(([key, value]) => segments.has(key) && placeholdersOf(key).join() !== placeholdersOf(value).join()).map(([key]) => key);
  writeFileSync(join(OUT, `missing-${lang}.json`), `${JSON.stringify(missing, null, 1)}\n`);
  writeFileSync(join(OUT, `stale-${lang}.json`), `${JSON.stringify(stale, null, 1)}\n`);
  const count = Object.keys(missing).length;
  report.push(`${lang}: ${segments.size - count}/${segments.size} textes traduits · ${count} manquants · ${stale.length} obsolètes · ${broken.length} repères cassés · ${dupes.length} doublons contradictoires`);
  if (mode === 'check' && (count || broken.length)) failed = true;
  broken.slice(0, 10).forEach((k) => report.push(`  repère cassé : ${k.slice(0, 100)}`));
  dupes.slice(0, 10).forEach((d) => report.push(`  doublon : ${d}`));
}

/** Contrôles SEO des pages traduites. */
if (mode === 'check') {
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  const get = (html, re) => {
    const value = html.match(re)?.[1];
    return value === undefined ? undefined : decode(value);
  };
  for (const lang of LANGS) {
    const titles = new Map();
    for (const page of all.filter((p) => p.path === `/${lang}` || p.path.startsWith(`/${lang}/`))) {
      const html = readFileSync(page.file, 'utf8');
      const where = `${page.path}`;
      const noindex = /<meta name="robots" content="noindex/.test(html);
      const problems = [];
      if (get(html, /<html lang="([^"]+)"/) !== lang) problems.push('lang');
      const canonical = get(html, /<link rel="canonical" href="([^"]+)"/);
      if (canonical !== `${SITE}${page.path}`) problems.push(`canonical ${canonical}`);
      const title = get(html, /<title>([^<]*)<\/title>/) ?? '';
      const description = get(html, /<meta name="description" content="([^"]*)"/) ?? '';
      if (!noindex) {
        const self = get(html, new RegExp(`<link rel="alternate" hreflang="${lang}" href="([^"]+)"`));
        if (self !== `${SITE}${page.path}`) problems.push(`hreflang ${self}`);
        if (title.length > 60) problems.push(`titre ${title.length} car.`);
        if (description.length > 160) problems.push(`description ${description.length} car.`);
        if (titles.has(title)) problems.push(`titre dupliqué avec ${titles.get(title)}`);
        titles.set(title, where);
      }
      if (problems.length) {
        failed = true;
        report.push(`  ${where} : ${problems.join(', ')}`);
      }
    }
  }
}

/*
 * Lots de traduction : node scripts/i18n.mjs batch → .i18n/batches/<groupe>.json ([{ id, en, page }]) à partir des
 * textes manquants en français (mêmes lots pour les trois langues tant qu'ils avancent ensemble). Le traducteur rend
 * { id: traduction } ; node scripts/i18n.mjs merge <langue> <fichier> <dictionnaire> l'ajoute à src/i18n/dict/<langue>/<dictionnaire>.json.
 */
if (mode === 'batch') {
  const lang = process.argv[3] ?? 'fr';
  const missing = JSON.parse(readFileSync(join(OUT, `missing-${lang}.json`), 'utf8'));
  const group = (page) => (page.startsWith('/journal/') ? 'journal' : page.startsWith('/work') ? 'work' : 'core');
  const batches = {};
  Object.entries(missing).forEach(([en, page]) => {
    const g = group(page);
    (batches[g] ??= []).push({ id: `${g[0]}${String(batches[g].length + 1).padStart(4, '0')}`, en, page });
  });
  mkdirSync(join(OUT, 'batches'), { recursive: true });
  for (const [g, items] of Object.entries(batches)) writeFileSync(join(OUT, 'batches', `${g}.json`), `${JSON.stringify(items, null, 1)}\n`);
  console.log(Object.entries(batches).map(([g, items]) => `${g}: ${items.length}`).join(' · '));
  process.exit(0);
}
if (mode === 'merge') {
  const [lang, file, target] = process.argv.slice(3);
  const byId = new Map(readdirSync(join(OUT, 'batches')).flatMap((f) => JSON.parse(readFileSync(join(OUT, 'batches', f), 'utf8'))).map((i) => [i.id, i.en]));
  const input = JSON.parse(readFileSync(file, 'utf8'));
  const dest = join(DICT, lang, `${target}.json`);
  mkdirSync(join(DICT, lang), { recursive: true });
  const dict = existsSync(dest) ? JSON.parse(readFileSync(dest, 'utf8')) : {};
  let added = 0;
  const unknown = [];
  for (const [id, value] of Object.entries(input)) {
    const en = byId.get(id);
    if (!en) unknown.push(id);
    else if (typeof value === 'string' && value.trim()) {
      dict[en] = value;
      added++;
    }
  }
  const sorted = Object.fromEntries(Object.entries(dict).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(dest, `${JSON.stringify(sorted, null, 1)}\n`);
  console.log(`${added} traductions ajoutées à ${relative(ROOT, dest)}${unknown.length ? ` · ids inconnus : ${unknown.join(', ')}` : ''}`);
  process.exit(0);
}

console.log(`${segments.size} textes dans ${enPages.length} pages anglaises (${relative(ROOT, OUT)}/ pour le détail)`);
console.log(report.join('\n'));
if (failed) {
  console.error('\ncheck:i18n a échoué.');
  process.exit(1);
}
