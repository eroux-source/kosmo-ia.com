/**
 * Langues du site (docs/PLAN-I18N.md). L'anglais reste à la racine (URL inchangées, x-default) ; le français,
 * l'allemand et le néerlandais vivent sous /fr, /de, /nl. Ciblage par langue, pas par pays (hreflang "fr", pas "fr-FR").
 */
export const LANGS = ['en', 'fr', 'de', 'nl'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';
/** Langues traduites (préfixe d'URL). */
export const LOCALIZED = LANGS.filter((l): l is Exclude<Lang, 'en'> => l !== DEFAULT_LANG);
export type LocalizedLang = (typeof LOCALIZED)[number];

export const LOCALE_META: Record<Lang, { label: string; short: string; og: string; intl: string }> = {
  en: { label: 'English', short: 'EN', og: 'en_US', intl: 'en-GB' },
  fr: { label: 'Français', short: 'FR', og: 'fr_FR', intl: 'fr-FR' },
  de: { label: 'Deutsch', short: 'DE', og: 'de_DE', intl: 'de-DE' },
  nl: { label: 'Nederlands', short: 'NL', og: 'nl_NL', intl: 'nl-NL' },
};

export const isLang = (value: unknown): value is Lang => typeof value === 'string' && (LANGS as readonly string[]).includes(value);

/**
 * Pays → langues proposées, dans l'ordre de préférence (la première sert quand le navigateur ne départage pas).
 * Lu par la redirection automatique (scripts/vercel-i18n-middleware.mjs). Pays absents = anglais, sauf navigateur
 * réglé en fr/de/nl (ex. un Allemand à Dubaï).
 */
export const COUNTRY_LANGS: Record<string, Lang[]> = {
  // Français
  FR: ['fr'], MC: ['fr'], LU: ['fr', 'de'], BE: ['fr', 'nl'], CH: ['de', 'fr'],
  RE: ['fr'], GP: ['fr'], MQ: ['fr'], GF: ['fr'], YT: ['fr'], PM: ['fr'], BL: ['fr'], MF: ['fr'], NC: ['fr'], PF: ['fr'], WF: ['fr'],
  SN: ['fr'], CI: ['fr'], CM: ['fr'], ML: ['fr'], BF: ['fr'], NE: ['fr'], TG: ['fr'], BJ: ['fr'], GA: ['fr'], CG: ['fr'], CD: ['fr'],
  GN: ['fr'], MG: ['fr'], DJ: ['fr'], TD: ['fr'], CF: ['fr'], BI: ['fr'], KM: ['fr'], HT: ['fr'], MA: ['fr'], TN: ['fr'], DZ: ['fr'],
  // Allemand
  DE: ['de'], AT: ['de'], LI: ['de'],
  // Néerlandais
  NL: ['nl'], SR: ['nl'], AW: ['nl'], CW: ['nl'], SX: ['nl'], BQ: ['nl'],
};

/** Cookie posé par le sélecteur de langue : le choix du visiteur passe avant la détection automatique. */
export const LANG_COOKIE = 'kosmo_lang';
