/**
 * SEO : constantes du site, JSON-LD Organization (deux entités), aides FAQ / fil d'Ariane / vidéo.
 */
import tokensCss from '../styles/tokens.css?raw';
import { services } from '../data/ai';

/** Date de la dernière mise à jour du site (dateModified du JSON-LD et lastmod du sitemap). */
export const LAST_UPDATED = '2026-11-02';

/** Lit un token dans tokens.css (seule source de valeurs brutes) : balises meta, attributs SVG numériques… */
export function tokenValue(name: string): string {
  const match = tokensCss.match(new RegExp(`--${name}:\\s*([^;]+);`));
  if (!match) throw new Error(`Token --${name} introuvable dans tokens.css`);
  return match[1].replace(/\/\*.*?\*\//g, '').trim();
}
export const tokenColor = tokenValue;

export const SITE = {
  name: 'KOSMO® AI',
  url: 'https://kosmo-ia.com', // domaine du site IA, même hôte que `site` dans astro.config.mjs
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

/** Auteur des articles du blog (E-E-A-T) : co-fondateur, lié à l'organisation. */
export const AUTHOR_ID = `${SITE.url}/#eugene-roux`;
export const authorJsonLd = {
  '@type': 'Person',
  '@id': AUTHOR_ID,
  name: 'Eugène Roux',
  jobTitle: 'Co-founder and CEO, KOSMO®',
  worksFor: { '@id': `${SITE.url}/#organization` },
  url: `${SITE.url}/blog`,
  knowsAbout: ['AI video production', 'AI commercials', 'Generative AI advertising', 'CGI', 'Mixed reality advertising'],
};

/** Organisation : KOSMO CGI SAS (fait confirmé). Adresse postale : à compléter (/todo). */
export const organizationJsonLd = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'KOSMO® AI',
  legalName: 'KOSMO CGI SAS',
  alternateName: ['KOSMO AI', 'KOSMO CGI', 'KOSMO®'],
  url: SITE.url,
  logo: `${SITE.url}/images/brand/logo-mark.svg`,
  sameAs: ['https://www.kosmocgi.com', ...SITE.social.map((s) => s.url)],
  email: SITE.email,
  telephone: SITE.phone,
  description:
    'KOSMO® AI is an AI creative agency and AI video production company. It produces AI commercials, AI fashion films, UGC ads, music videos, explainer videos and AI influencers for brands, with a CGI team that has made campaigns for Netflix, Zalando, Miele, Porsche and Renault.',
  founder: [
    { '@type': 'Person', '@id': `${SITE.url}/#eugene-roux`, name: 'Eugène Roux', jobTitle: 'Co-founder and CEO' },
    { '@type': 'Person', name: 'Mehdi Benkaci', jobTitle: 'Co-founder' },
  ],
  identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: '930375902' },
  knowsAbout: ['AI creative agency', 'AI video production', 'Generative AI advertising', 'AI commercials', 'TV commercial production', 'AI fashion campaigns', 'AI UGC ads', 'AI music videos', 'Explainer videos', 'AI influencers', 'CGI', 'Mixed reality advertising'],
  areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'AI production services',
    itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.label, description: s.blurb, url: `${SITE.url}/${s.slug}` } })),
  },
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
    dateModified: LAST_UPDATED,
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

export function serviceJsonLd(name: string, description: string, path: string, extra: Record<string, unknown> = {}) {
  return {
    '@type': 'Service',
    '@id': `${SITE.url}${path}#service`,
    name,
    description,
    url: `${SITE.url}${path}`,
    provider: { '@id': ORGANIZATION_ID },
    areaServed: [{ '@type': 'Country', name: 'United States' }, 'Worldwide'],
    audience: { '@type': 'BusinessAudience', audienceType: 'Brands, marketing teams and agencies' },
    serviceType: name,
    ...extra,
  };
}

export function videoJsonLd(video: { name: string; description: string; thumbnailUrl: string; contentUrl: string; uploadDate: string; duration?: string }) {
  const abs = (u: string) => (u.startsWith('http') ? u : `${SITE.url}${u}`);
  return { '@type': 'VideoObject', ...video, thumbnailUrl: abs(video.thumbnailUrl), contentUrl: abs(video.contentUrl) };
}

export function graph(...nodes: unknown[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
