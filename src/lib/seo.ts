/**
 * SEO : constantes du site, JSON-LD Organization (deux entités), aides FAQ / fil d'Ariane / vidéo.
 */
import tokensCss from '../styles/tokens.css?raw';

/** Lit un token dans tokens.css (seule source de valeurs brutes) : balises meta, attributs SVG numériques… */
export function tokenValue(name: string): string {
  const match = tokensCss.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Token --${name} introuvable dans tokens.css`);
  return match[1].replace(/\/\*.*?\*\//g, '').trim();
}
export const tokenColor = tokenValue;

export const SITE = {
  name: 'KOSMO®',
  url: 'https://ai.kosmocgi.com', // domaine provisoire du site IA, même hôte que `site` dans astro.config.mjs
  email: 'contact@kosmocgi.com',
  phone: '+971526713890',
  defaultImage: '/og/default.jpg',
  locale: 'en',
  /** Profils officiels (fournis par KOSMO® le 27/09/2026) : `Organization.sameAs`, llms.txt. */
  social: [
    { name: 'Instagram', url: 'https://www.instagram.com/kosmocgi/', icon: 'brand-instagram' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/101133355', icon: 'brand-linkedin' },
    { name: 'TikTok', url: 'https://www.tiktok.com/@kosmocgi', icon: 'brand-tiktok' },
    { name: 'YouTube', url: 'https://www.youtube.com/@KosmoCGI', icon: 'brand-youtube' },
  ],
};

export const ORGANIZATION_ID = `${SITE.url}/#organization`;

/** Organisation : KOSMO CGI SAS (fait confirmé). Adresse postale : à compléter (/todo). */
export const organizationJsonLd = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'KOSMO®',
  legalName: 'KOSMO CGI SAS',
  alternateName: 'KOSMO CGI',
  url: SITE.url,
  logo: `${SITE.url}/images/brand/logo-mark.svg`,
  sameAs: SITE.social.map((s) => s.url),
  email: SITE.email,
  telephone: SITE.phone,
  description: 'AI creative agency and AI video production studio by KOSMO®: AI commercials, TV spots, UGC ads, music videos, photoshoots and campaigns for brands, made by the CGI team behind work for Netflix, Zalando and Miele.',
  identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: '930375902' },
  knowsAbout: ['AI video production', 'Generative AI advertising', 'AI commercials', 'TV commercial production', 'AI UGC ads', 'AI music videos', 'AI photoshoots', 'CGI', 'Mixed reality advertising'],
  areaServed: 'Worldwide',
  contactPoint: [{ '@type': 'ContactPoint', contactType: 'sales', email: SITE.email, telephone: SITE.phone, availableLanguage: ['en', 'fr'] }],
};

export const websiteJsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.name,
  publisher: { '@id': ORGANIZATION_ID },
  inLanguage: SITE.locale,
};

export function webPageJsonLd(path: string, title: string, description?: string) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE.url}${path}#webpage`,
    url: `${SITE.url}${path}`,
    name: title,
    description,
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': ORGANIZATION_ID },
    inLanguage: SITE.locale,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    '@type': 'Service',
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: 'Worldwide',
    serviceType: name,
  };
}

export function videoJsonLd(video: { name: string; description: string; thumbnailUrl: string; contentUrl: string; uploadDate: string; duration?: string }) {
  const abs = (u: string) => (u.startsWith('http') ? u : `${SITE.url}${u}`);
  return { '@type': 'VideoObject', ...video, thumbnailUrl: abs(video.thumbnailUrl), contentUrl: abs(video.contentUrl) };
}

export function graph(...nodes: unknown[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
