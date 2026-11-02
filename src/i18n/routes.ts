/**
 * Chemins localisés : /about ↔ /fr/a-propos ↔ /de/ueber-uns ↔ /nl/over-ons. Fonctions pures (sans astro:content) :
 * utilisées par le gabarit (hreflang, sélecteur), le middleware de traduction et le sitemap (astro.config.mjs).
 */
import { DEFAULT_LANG, LANGS, isLang, type Lang, type LocalizedLang } from './config';
import { CHECKLIST_SEGMENTS, CITY_SLUGS, POST_SLUGS, SEGMENTS } from './slugs';

type SlugMap = Record<string, Partial<Record<LocalizedLang, string>>>;

/** Pages utilitaires jamais traduites (noindex, internes). */
/** /play : wireframe écrit en français (19/10/2026), pas encore de version anglaise ni de traduction. */
const EN_ONLY = ['/todo', '/styleguide', '/play', '/llms.txt', '/api'];

const reverse = (map: SlugMap, lang: LocalizedLang) => Object.fromEntries(Object.entries(map).map(([en, t]) => [t[lang] ?? en, en]));
const REVERSE = Object.fromEntries(
  LANGS.filter((l): l is LocalizedLang => l !== DEFAULT_LANG).map((lang) => [
    lang,
    { segments: reverse(SEGMENTS, lang), checklist: reverse(CHECKLIST_SEGMENTS, lang), cities: reverse(CITY_SLUGS, lang), posts: reverse(POST_SLUGS, lang) },
  ]),
) as Record<LocalizedLang, { segments: Record<string, string>; checklist: Record<string, string>; cities: Record<string, string>; posts: Record<string, string> }>;

function split(path: string) {
  const match = path.match(/^([^?#]*)(.*)$/)!;
  return { pathname: match[1] || '/', rest: match[2] };
}

/** Un chemin anglais a-t-il une version traduite ? (hors pages utilitaires, API et fichiers) */
export function isLocalizable(enPath: string): boolean {
  const { pathname } = split(enPath);
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return false;
  if (EN_ONLY.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  return !/\.[a-z0-9]+$/i.test(pathname);
}

/** /about → /fr/a-propos (conserve ?query et #hash). */
export function localizePath(enPath: string, lang: Lang): string {
  if (lang === DEFAULT_LANG || !isLocalizable(enPath)) return enPath;
  const { pathname, rest } = split(enPath);
  const parts = pathname.split('/').filter(Boolean);
  const out = parts.map((part, i) => {
    const parent = parts[i - 1];
    if (i === 1 && parent === '3dooh') return CITY_SLUGS[part]?.[lang] ?? part;
    if (i === 1 && parent === 'journal') return POST_SLUGS[part]?.[lang] ?? part;
    if (i === 1 && parent === 'checklist') return CHECKLIST_SEGMENTS[part]?.[lang] ?? part;
    if (i === 0) return SEGMENTS[part]?.[lang] ?? part;
    return part;
  });
  return `/${[lang, ...out].join('/')}${rest}`;
}

/** /fr/a-propos → { lang: 'fr', enPath: '/about' } ; un chemin anglais revient tel quel. */
export function delocalizePath(path: string): { lang: Lang; enPath: string } {
  const { pathname, rest } = split(path);
  const parts = pathname.split('/').filter(Boolean);
  const first = parts[0];
  if (!isLang(first) || first === DEFAULT_LANG) return { lang: DEFAULT_LANG, enPath: path };
  const r = REVERSE[first];
  const tail = parts.slice(1);
  const en: string[] = [];
  tail.forEach((part, i) => {
    const parent = en[i - 1];
    if (i === 0) en.push(r.segments[part] ?? part);
    else if (i === 1 && parent === '3dooh') en.push(r.cities[part] ?? part);
    else if (i === 1 && parent === 'journal') en.push(r.posts[part] ?? part);
    else if (i === 1 && parent === 'checklist') en.push(r.checklist[part] ?? part);
    else en.push(part);
  });
  return { lang: first, enPath: `/${en.join('/')}${rest}` };
}

/** Les quatre versions d'une page (null si la page n'est pas traduite). */
export function alternatesOf(path: string): { lang: Lang; path: string }[] | null {
  const { enPath } = delocalizePath(path);
  if (!isLocalizable(enPath)) return null;
  return LANGS.map((lang) => ({ lang, path: localizePath(enPath, lang) }));
}
