/**
 * Moteur de traduction HTML (docs/PLAN-I18N.md). Une page traduite = la page anglaise rendue, dont on remplace :
 *  - les textes, par « segments » : une suite de textes et de balises de mise en forme (a, em, strong…) d'un même parent.
 *    Les balises deviennent des repères numérotés : « Read our <t1>guide</t1>. » → « Lisez notre <t1>guide</t1>. »
 *  - les attributs de texte (alt, title, aria-label, placeholder, data-label…), les meta SEO, le JSON-LD ;
 *  - les liens internes (href, data-success) vers la version de la même langue ;
 *  - le <head> : lang, canonical, og:url, og:locale.
 * Les modifications sont faites en place sur le HTML source (positions parse5) : le reste du document n'est pas re-sérialisé.
 * Module JavaScript pur : utilisé par le middleware Astro (build, dev) et par scripts/i18n.mjs (extraction, contrôles).
 */
import { parse, parseFragment } from 'parse5';

/** Balises de mise en forme qui restent dans un segment (si elles ne contiennent que du texte ou d'autres balises de ce type). */
const INLINE = new Set(['a', 'em', 'strong', 'b', 'i', 'u', 's', 'small', 'sup', 'sub', 'abbr', 'mark', 'q', 'cite', 'code', 'br']);
/** Contenus jamais traduits. */
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'textarea', 'video', 'audio', 'canvas', 'iframe']);
/** Attributs de texte traduits. */
const TEXT_ATTRS = new Set(['alt', 'title', 'aria-label', 'placeholder', 'data-label', 'data-step-label', 'data-default', 'data-error-required']);
/* data-msg-* : messages des formulaires. Jamais data-error-for (nom de champ, pas un texte). */
const TEXT_ATTR_PREFIX = ['data-msg-'];
/** Attributs de lien localisés. */
const LINK_ATTRS = new Set(['href', 'data-success']);
/** Meta traduites (name / property). */
const META_TEXT = new Set(['description', 'og:title', 'og:description', 'og:image:alt', 'twitter:title', 'twitter:description']);
/** Clés JSON-LD traduites. */
const LD_TEXT = new Set(['name', 'headline', 'description', 'text', 'serviceType', 'caption', 'alternativeHeadline', 'knowsAbout', 'jobTitle']);
const LD_URL = new Set(['url', 'item', 'mainEntityOfPage', '@id']);
const LD_KEEP_TYPES = new Set(['Organization', 'WebSite', 'Person', 'City', 'Country', 'Place']);

const HAS_LETTER = /\p{L}/u;
const collapse = (s) => s.replace(/\s+/g, ' ').trim();
const escapeText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;');
const escapeAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (el, name) => el.attrs?.find((a) => a.name === name)?.value;
const isText = (n) => n.nodeName === '#text';
const isEl = (n) => typeof n.tagName === 'string';

function isPureInline(node) {
  if (isText(node)) return true;
  if (!isEl(node) || !INLINE.has(node.tagName)) return false;
  if (attr(node, 'translate') === 'no') return false;
  return (node.childNodes ?? []).every(isPureInline);
}

/**
 * @typedef {{
 *   lang: string,
 *   lookup: (key: string) => string | undefined,
 *   onMissing?: (key: string, kind: string) => void,
 *   localizeUrl?: (href: string) => string | undefined,
 *   siteUrl: string,
 *   ogLocale?: string,
 *   ogLocaleEn?: string,
 * }} Options
 */

/**
 * Traduit une page HTML complète. Sans `lookup` qui réponde, la page reste identique (mode extraction : `onMissing` reçoit tout).
 * @param {string} html
 * @param {Options} opts
 */
export function translateHtml(html, opts) {
  const doc = parse(html, { sourceCodeLocationInfo: true });
  /** @type {{ start: number, end: number, text: string }[]} */
  const edits = [];
  const t = (key, kind) => {
    const value = opts.lookup(key);
    if (value === undefined) opts.onMissing?.(key, kind);
    return value;
  };
  const localize = (href) => (opts.localizeUrl ? opts.localizeUrl(href) : undefined);
  const absLocalize = (url) => {
    if (!url.startsWith(opts.siteUrl)) return undefined;
    const rest = url.slice(opts.siteUrl.length) || '/';
    if (!rest.startsWith('/')) return undefined;
    const local = localize(rest);
    return local && local !== rest ? `${opts.siteUrl}${local}` : undefined;
  };

  /** Liens avec texte prérempli (WhatsApp, sujet d'email) : le texte suit la langue. */
  const translatePrefilled = (href) => {
    const match = href.match(/^(https:\/\/wa\.me\/[^?]*\?text=|mailto:[^?]*\?subject=)([^&#]*)(.*)$/);
    if (!match) return undefined;
    const text = decodeURIComponent(match[2]);
    const translated = t(text, 'prefill');
    return translated === undefined ? undefined : `${match[1]}${encodeURIComponent(translated)}${match[3]}`;
  };

  /** Nouvelle valeur d'un attribut, ou undefined. */
  const attrValue = (el, a) => {
    const name = a.name;
    if (LINK_ATTRS.has(name)) {
      if (attr(el, 'hreflang') !== undefined || attr(el, 'data-i18n') === 'keep') return undefined;
      if (a.value.startsWith('/')) return localize(a.value);
      if (name === 'href') return translatePrefilled(a.value);
      return undefined;
    }
    if (TEXT_ATTRS.has(name) || TEXT_ATTR_PREFIX.some((p) => name.startsWith(p))) {
      const key = collapse(a.value);
      if (!HAS_LETTER.test(key)) return undefined;
      return t(key, `attr:${name}`);
    }
    return undefined;
  };

  /** Réécrit les attributs d'une balise ouvrante (source brute) : utilisé pour les balises dans un segment. */
  const rewriteStartTag = (el) => {
    const loc = el.sourceCodeLocation;
    const start = loc.startTag.startOffset;
    let tag = html.slice(start, loc.startTag.endOffset);
    const changes = [];
    for (const a of el.attrs) {
      const value = attrValue(el, a);
      const aloc = loc.attrs?.[a.name];
      if (value !== undefined && aloc) changes.push({ s: aloc.startOffset - start, e: aloc.endOffset - start, v: `${a.name}="${escapeAttr(value)}"` });
    }
    changes.sort((x, y) => y.s - x.s).forEach((c) => (tag = tag.slice(0, c.s) + c.v + tag.slice(c.e)));
    return tag;
  };

  const editAttrs = (el) => {
    const loc = el.sourceCodeLocation;
    if (!loc?.attrs) return;
    for (const a of el.attrs) {
      const value = attrValue(el, a);
      const aloc = loc.attrs[a.name];
      if (value !== undefined && aloc) edits.push({ start: aloc.startOffset, end: aloc.endOffset, text: `${a.name}="${escapeAttr(value)}"` });
    }
  };

  const setAttr = (el, name, value) => {
    const aloc = el.sourceCodeLocation?.attrs?.[name];
    if (aloc) edits.push({ start: aloc.startOffset, end: aloc.endOffset, text: `${name}="${escapeAttr(value)}"` });
  };

  /** Segment : clé avec repères <tN>, et fonction de reconstruction. */
  const flushRun = (run) => {
    if (!run.length) return;
    /* Une seule balise autour de tout le texte (<a>Contact</a>) : elle reste hors du segment. */
    const significant = run.filter((n) => !(isText(n) && !n.value.trim()));
    if (significant.length === 1 && isEl(significant[0]) && significant[0].tagName !== 'br' && significant[0].childNodes?.length) {
      editAttrs(significant[0]);
      return flushRun(significant[0].childNodes);
    }
    const hasWords = run.some(function words(n) {
      return isText(n) ? HAS_LETTER.test(n.value) : (n.childNodes ?? []).some(words);
    });
    if (!hasWords) {
      run.filter(isEl).forEach(function deep(el) {
        editAttrs(el);
        (el.childNodes ?? []).filter(isEl).forEach(deep);
      });
      return;
    }
    const tags = [];
    let counter = 0;
    const serialize = (nodes) =>
      nodes
        .map((n) => {
          if (isText(n)) return n.value;
          const id = ++counter;
          if (n.tagName === 'br') {
            tags[id] = { open: html.slice(n.sourceCodeLocation.startOffset, n.sourceCodeLocation.endOffset) };
            return `<t${id}/>`;
          }
          tags[id] = { open: rewriteStartTag(n), close: `</${n.tagName}>` };
          return `<t${id}>${serialize(n.childNodes ?? [])}</t${id}>`;
        })
        .join('');
    const raw = serialize(run);
    const key = collapse(raw);
    const translated = t(key, 'text');
    const start = run[0].sourceCodeLocation.startOffset;
    const last = run[run.length - 1].sourceCodeLocation;
    const end = last.endOffset;
    const source = html.slice(start, end);
    const lead = source.match(/^\s*/)[0];
    const trail = source.match(/\s*$/)[0];
    const body = translated ?? key;
    if (translated === undefined && !tags.some((x) => x && /(href|title|data-success)=/.test(x.open))) return;
    const out = body.replace(/<t(\d+)(\/?)>|<\/t(\d+)>|([^<]+|<)/g, (m, open, self, close, text) => {
      if (open) return self ? (tags[open]?.open ?? '') : (tags[open]?.open ?? '');
      if (close) return tags[close]?.close ?? '';
      return escapeText(text);
    });
    edits.push({ start, end, text: `${lead}${out}${trail}` });
  };

  const walk = (node) => {
    if (isEl(node)) {
      if (node.tagName === 'script' && attr(node, 'type') === 'application/ld+json') return jsonLd(node);
      if (SKIP.has(node.tagName)) {
        // Contenu non traduit, mais les attributs (placeholder d'un textarea, aria-label d'un svg) le sont.
        if (!['script', 'style', 'template'].includes(node.tagName)) editAttrs(node);
        return;
      }
      if (attr(node, 'translate') === 'no') {
        editAttrs(node);
        return;
      }
      if (node.tagName === 'html') setAttr(node, 'lang', opts.lang);
      else if (node.tagName === 'meta') return meta(node);
      else if (node.tagName === 'link') return link(node);
      else editAttrs(node);
    }
    const children = node.tagName === 'template' ? node.content.childNodes : (node.childNodes ?? []);
    let run = [];
    for (const child of children) {
      if (child.nodeName === '#comment') continue;
      if (isPureInline(child)) run.push(child);
      else {
        flushRun(run);
        run = [];
        walk(child);
      }
    }
    flushRun(run);
  };

  const meta = (el) => {
    const key = attr(el, 'name') ?? attr(el, 'property');
    const content = attr(el, 'content');
    if (!key || content === undefined) return;
    if (META_TEXT.has(key) && HAS_LETTER.test(content)) {
      const v = t(collapse(content), `meta:${key}`);
      if (v !== undefined) setAttr(el, 'content', v);
    } else if (key === 'og:url') {
      const v = absLocalize(content);
      if (v) setAttr(el, 'content', v);
    } else if (key === 'og:locale' && opts.ogLocale) setAttr(el, 'content', opts.ogLocale);
    else if (key === 'og:locale:alternate' && opts.ogLocale && content === opts.ogLocale && opts.ogLocaleEn) setAttr(el, 'content', opts.ogLocaleEn);
  };

  const link = (el) => {
    if (attr(el, 'rel') === 'canonical') {
      const v = absLocalize(attr(el, 'href') ?? '');
      if (v) setAttr(el, 'href', v);
    }
  };

  const jsonLd = (el) => {
    const textNode = el.childNodes?.[0];
    if (!textNode) return;
    let data;
    try {
      data = JSON.parse(textNode.value);
    } catch {
      return;
    }
    const visit = (value, key, keep) => {
      if (typeof value === 'string') {
        if (key === 'inLanguage') return opts.lang;
        if (LD_TEXT.has(key) && HAS_LETTER.test(value)) return t(collapse(value), `ld:${key}`) ?? value;
        if (!keep && LD_URL.has(key)) {
          if (key === '@id' && !value.includes('#webpage')) return value;
          const [base, hash] = value.split('#');
          const v = absLocalize(base);
          return v ? `${v}${hash !== undefined ? `#${hash}` : ''}` : value;
        }
        return value;
      }
      if (Array.isArray(value)) return value.map((v) => visit(v, key, keep));
      if (value && typeof value === 'object') {
        const type = value['@type'];
        const k = keep || (typeof type === 'string' && LD_KEEP_TYPES.has(type));
        return Object.fromEntries(Object.entries(value).map(([kk, vv]) => [kk, visit(vv, kk, k)]));
      }
      return value;
    };
    const out = JSON.stringify(visit(data, '', false)).replace(/</g, '\\u003c');
    const loc = textNode.sourceCodeLocation;
    edits.push({ start: loc.startOffset, end: loc.endOffset, text: out });
  };

  walk(doc);
  edits.sort((a, b) => b.start - a.start);
  let result = html;
  let floor = Infinity;
  for (const e of edits) {
    if (e.end > floor) continue; // chevauchement (ne devrait pas arriver) : on garde la première modification
    result = result.slice(0, e.start) + e.text + result.slice(e.end);
    floor = e.start;
  }
  return result;
}

/*
 * Modèles : un texte qui contient un compteur, une année ou un mois (« all work (64) », « Film 2 · March 2025 »,
 * « 7 min read ») est traduit par modèle, pour ne pas casser à chaque nouveau projet : les nombres deviennent {0}, {1}…
 * (réordonnables), le mois {M} (long) ou {Ms} (court), rendus dans la langue cible.
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const MONTH_RE = new RegExp(`\\b(${MONTHS.join('|')}|${MONTHS_SHORT.join('|')}|Sep)\\b`, 'g');
const NUMBER_RE = /(?<![\w.$€£])\d+(?:[.,]\d+)*(?![\dA-Za-z])/g;
const VOLATILE = [/\(\d+\)/, /\b(19|20)\d{2}\b/, /\b\d+ min read\b/, /\bFilm \d+\b/, /\b\d+ (films|people)\b/, /\b(January|February|March|April|June|July|August|September|October|November|December)\b/];

/** Modèle d'un texte volatil, ou null. */
export function templateOf(key) {
  if (!VOLATILE.some((re) => re.test(key))) return null;
  const nums = [];
  const months = [];
  let template = key.replace(MONTH_RE, (m) => {
    const long = MONTHS.indexOf(m);
    months.push(long >= 0 ? { index: long, short: false } : { index: m === 'Sep' ? 8 : MONTHS_SHORT.indexOf(m), short: true });
    return long >= 0 ? '{M}' : '{Ms}';
  });
  template = template.replace(NUMBER_RE, (n) => `{${nums.push(n) - 1}}`);
  return { template, nums, months };
}

/** Recherche : texte exact, sinon modèle. `locale` sert aux noms de mois. */
export function makeLookup(dict, locale) {
  const monthName = (index, short) => {
    const name = new Intl.DateTimeFormat(locale, { month: short ? 'short' : 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, index, 15)));
    return short ? name : name;
  };
  /* Un nombre anglais à séparateurs (« 36.3 », « 15,000 ») est réécrit au format de la langue (« 36,3 », « 15 000 »).
     Les nombres sans séparateur (années, compteurs) restent tels quels. */
  const formatNumber = (raw) => {
    if (!/[.,]/.test(raw)) return raw;
    const decimals = raw.match(/\.(\d+)$/)?.[1].length ?? 0;
    const value = Number(raw.replace(/,/g, ''));
    if (!Number.isFinite(value)) return raw;
    return new Intl.NumberFormat(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value);
  };
  return (key) => {
    const exact = dict.get(key);
    if (exact !== undefined) return exact;
    const t = templateOf(key);
    if (!t) return undefined;
    const translated = dict.get(t.template);
    if (translated === undefined) return undefined;
    let m = 0;
    return translated.replace(/\{(\d+)\}|\{Ms?\}/g, (token, i) => {
      if (i !== undefined) return t.nums[Number(i)] === undefined ? token : formatNumber(t.nums[Number(i)]);
      const month = t.months[m++];
      return month ? monthName(month.index, token === '{Ms}') : token;
    });
  };
}

/** Vérifie qu'une traduction garde les mêmes repères que la source (utilisé par scripts/i18n.mjs). */
export function placeholdersOf(text) {
  return [...text.matchAll(/<\/?t(\d+)\/?>/g)].map((m) => m[0]).sort();
}

export { parseFragment };
