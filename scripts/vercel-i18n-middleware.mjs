/**
 * Redirection automatique vers la langue du visiteur (docs/PLAN-I18N.md §2), en Routing Middleware Vercel
 * (Build Output API : fonction edge + route `middlewarePath`), devant les pages statiques.
 *
 * Généré après `astro build` par l'intégration i18n d'astro.config.mjs :
 *  - la carte des pages vient des balises hreflang des pages anglaises construites (source de vérité) ;
 *  - la fonction ne tourne que sur les URL anglaises traduites (jamais sur /fr, /de, /nl, les fichiers ou /api).
 *
 * Règles : robots et aperçus de liens jamais redirigés ; cookie kosmo_lang (choix du sélecteur) prioritaire ;
 * navigation interne (Referer du site) jamais redirigée ; `?lang=en` force l'anglais ; pays → langue avec départage
 * par la langue du navigateur ; 307 non mis en cache ; paramètres (UTM, ?company=) conservés.
 */
import { readFileSync, readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

export const FUNCTION_NAME = '_i18n-redirect';

function htmlFiles(dir, base = '') {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return /^(fr|de|nl|_astro|images|video|downloads)$/.test(name) && !base ? [] : htmlFiles(full, `${base}/${name}`);
    return name === 'index.html' ? [{ path: base || '/', file: full }] : [];
  });
}

/** Carte { cheminAnglais: { fr, de, nl } } lue dans les hreflang des pages anglaises. */
export function buildMap(staticDir, siteUrl) {
  const map = {};
  for (const page of htmlFiles(staticDir)) {
    const html = readFileSync(page.file, 'utf8');
    const targets = {};
    for (const match of html.matchAll(/<link rel="alternate" hreflang="(fr|de|nl)" href="([^"]+)"/g)) targets[match[1]] = match[2].replace(siteUrl, '');
    if (Object.keys(targets).length) map[page.path] = targets;
  }
  return map;
}

/** Code de la fonction edge (autonome, sans import). */
export function edgeSource(map, countryLangs, cookieName) {
  return `// Généré par scripts/vercel-i18n-middleware.mjs : ne pas modifier à la main.
const MAP = ${JSON.stringify(map)};
const COUNTRY = ${JSON.stringify(countryLangs)};
const COOKIE = ${JSON.stringify(cookieName)};
const LANGS = ['en', 'fr', 'de', 'nl'];
const BOT = /bot|crawl|spider|slurp|archiver|facebookexternalhit|facebookcatalog|embedly|quora link|pinterest|whatsapp|telegram|discord|skype|slack|vkshare|w3c_validator|lighthouse|pagespeed|headless|preview|google|bing|yandex|baidu|duckduck|applebot|ahrefs|semrush|mj12|dotbot|petalbot|seznam|gpt|chatgpt|oai-|claude|anthropic|perplexity|cohere|bytespider|ccbot|amazonbot|meta-external|diffbot|you\\.com/i;

const next = () => new Response(null, { headers: { 'x-middleware-next': '1' } });

function browserLangs(header) {
  return (header || '')
    .split(',')
    .map((part) => {
      const [tag, q] = part.trim().split(';q=');
      return { lang: tag.toLowerCase().split('-')[0], q: q === undefined ? 1 : Number(q) };
    })
    .filter((x) => x.lang && x.q > 0)
    .sort((a, b) => b.q - a.q)
    .map((x) => x.lang);
}

export function detect(country, acceptLanguage) {
  const langs = browserLangs(acceptLanguage);
  const candidates = COUNTRY[country] || [];
  if (candidates.length) {
    const match = langs.find((l) => candidates.includes(l));
    if (match) return match;
    // Navigateur réglé en anglais dans un pays francophone, germanophone ou néerlandophone : on respecte l'anglais.
    if (langs[0] === 'en') return 'en';
    return candidates[0];
  }
  return ['fr', 'de', 'nl'].includes(langs[0]) ? langs[0] : 'en';
}

export default function middleware(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return next();
  const url = new URL(request.url);
  const path = url.pathname === '/' ? '/' : url.pathname.replace(/\\/$/, '');
  const targets = MAP[path];
  if (!targets) return next();
  const ua = request.headers.get('user-agent') || '';
  if (!ua || BOT.test(ua)) return next();
  if (url.searchParams.get('lang') === 'en') return next();
  const cookie = (request.headers.get('cookie') || '').match(new RegExp('(?:^|;\\\\s*)' + COOKIE + '=([a-z]{2})'));
  let lang;
  if (cookie && LANGS.includes(cookie[1])) lang = cookie[1];
  else {
    const referer = request.headers.get('referer');
    try {
      if (referer && new URL(referer).host === url.host) return next();
    } catch {}
    lang = detect(request.headers.get('x-vercel-ip-country') || '', request.headers.get('accept-language'));
  }
  const target = lang && lang !== 'en' ? targets[lang] : undefined;
  if (!target) return next();
  return new Response(null, {
    status: 307,
    headers: { Location: target + url.search, 'Cache-Control': 'private, no-store', Vary: 'Cookie, Accept-Language' },
  });
}
`;
}

/** Écrit la fonction et insère sa route avant le système de fichiers dans .vercel/output/config.json. */
export function writeVercelMiddleware({ root, clientDir, siteUrl, countryLangs, cookieName, logger = console }) {
  const output = join(root, '.vercel/output');
  const staticDir = clientDir ?? join(output, 'static');
  const configFile = join(output, 'config.json');
  if (!existsSync(staticDir) || !existsSync(configFile)) {
    logger.warn?.('i18n : sortie Vercel absente, redirection automatique non générée.');
    return;
  }
  const map = buildMap(staticDir, siteUrl);
  const dir = join(output, 'functions', `${FUNCTION_NAME}.func`);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.js'), edgeSource(map, countryLangs, cookieName));
  writeFileSync(join(dir, '.vc-config.json'), `${JSON.stringify({ runtime: 'edge', entrypoint: 'index.js' }, null, 2)}\n`);

  const config = JSON.parse(readFileSync(configFile, 'utf8'));
  config.routes = (config.routes ?? []).filter((r) => r.middlewarePath !== FUNCTION_NAME);
  const escape = (p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const paths = Object.keys(map);
  const route = {
    src: `^(?:${paths.map((p) => (p === '/' ? '' : escape(p))).join('|')})/?$`,
    middlewarePath: FUNCTION_NAME,
    continue: true,
  };
  const at = config.routes.findIndex((r) => r.handle);
  config.routes.splice(at === -1 ? config.routes.length : at, 0, route);
  writeFileSync(configFile, `${JSON.stringify(config, null, '\t')}\n`);
  logger.info?.(`i18n : redirection automatique générée pour ${paths.length} pages anglaises.`);
}
