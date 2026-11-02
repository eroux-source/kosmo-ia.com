/**
 * Traduction des pages rendues (appelée par src/middleware.ts) : dictionnaires src/i18n/dict/<langue>/*.json
 * (clé = texte anglais, valeur = traduction), liens internes vers la même langue, SEO du <head>.
 */
import { makeLookup, translateHtml } from './engine.mjs';
import { LOCALE_META, type LocalizedLang } from './config';
import { localizePath, delocalizePath } from './routes';
import { getEnPaths } from './pages';
import { SITE } from '../lib/seo';

const files = import.meta.glob<Record<string, string>>('./dict/*/*.json', { eager: true, import: 'default' });

const dictionaries = new Map<string, Map<string, string>>();
for (const [file, entries] of Object.entries(files)) {
  const lang = file.split('/')[2];
  const dict = dictionaries.get(lang) ?? new Map<string, string>();
  for (const [key, value] of Object.entries(entries)) if (typeof value === 'string' && !key.startsWith('//')) dict.set(key, value);
  dictionaries.set(lang, dict);
}

export async function translatePage(html: string, lang: LocalizedLang): Promise<string> {
  const dict = dictionaries.get(lang) ?? new Map<string, string>();
  const known = new Set(await getEnPaths());
  const localizeUrl = (href: string) => {
    const match = href.match(/^([^?#]*)(.*)$/)!;
    const pathname = match[1] === '' ? '/' : match[1].replace(/(.)\/$/, '$1');
    // Un lien déjà localisé (ex. sélecteur) ou vers une page non traduite reste tel quel.
    if (delocalizePath(pathname).lang !== 'en' || !known.has(pathname)) return undefined;
    return localizePath(`${pathname}${match[2]}`, lang);
  };
  return translateHtml(html, {
    lang,
    lookup: makeLookup(dict, LOCALE_META[lang].intl),
    localizeUrl,
    siteUrl: SITE.url,
    ogLocale: LOCALE_META[lang].og,
    ogLocaleEn: LOCALE_META.en.og,
  });
}
