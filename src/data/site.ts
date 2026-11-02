/**
 * Textes communs (nav, footer, contact). Base : /reference.
 * Tout objet `demo: true` est un texte écrit pour la démo → badge DÉMO, listé sur /todo.
 * Ton : on parle à des responsables marque, communication et marketing. Pas de jargon, pas de tirets.
 */
import { services, featuredServices, serviceBySlug, serviceHref } from './ai';
import { foohBySlug, poster } from '../lib/fooh';

const SERVICE_ICONS: Record<string, string> = {
  'ai-animated-commercials': 'sparkles',
  'ai-fashion-beauty': 'eye',
  'ai-ugc-agency': 'users',
  'ai-music-videos': 'volume',
  'ai-entertainment': 'play',
  'ai-automotive-video-production': 'cube',
  'ai-explainer-videos': 'device-screen',
  'ai-influencers': 'heart',
};

/** CTA principal du site : la page contact (décision main-cta-contact, 01/10/2026). */
export const ctaLabel = 'contact';
export const ctaHref = '/contact';
/** Concept gratuit : CTA secondaire, gardé là où il sert (pages 3DOOH avec le formulaire d'offre, bloc concept). */
export const conceptLabel = 'get a free concept';
export const bookLabel = 'book a call';

export const nav = {
  links: [
    { label: 'Services', dropdown: true as const },
    { label: 'Work', href: '/work' },
    { label: 'Contact', href: '/contact' },
  ],
  /** Menu Services : les quatre services en vedette en bandes avec image (affiche du film du hero), puis les autres. */
  anamorphic: {
    title: 'AI production',
    all: 'All services',
    href: '/#services',
    items: featuredServices.map((slug) => {
      const s = serviceBySlug(slug)!;
      const p = foohBySlug(s.hero.project);
      return { title: s.label, description: s.blurb, href: serviceHref(s), image: (p && poster(p)) ?? '' };
    }),
  },
  services: services
    .filter((s) => !featuredServices.includes(s.slug))
    .map((s) => ({ icon: SERVICE_ICONS[s.slug] ?? 'sparkles', title: s.label, href: serviceHref(s) })),
};

/** Lien du footer ; `sub` = sous-page de la ligne au-dessus (décalée, couleur atténuée). */
export interface FooterLink {
  label: string;
  href: string;
  sub?: boolean;
}

export const footer: {
  groups: { title: string; columns?: number; links: FooterLink[] }[];
  cta: { demo: boolean; original: string; text: string; soft?: string };
  legalOwners: string[];
  legalSuffix: string;
  legalLinks: FooterLink[];
} = {
  groups: [
    {
      title: 'Services',
      links: services.slice(0, 6).map((x) => ({ label: x.label, href: serviceHref(x) })),
    },
    {
      title: 'More services',
      links: services.slice(6).map((x) => ({ label: x.label, href: serviceHref(x) })),
    },
    {
      title: 'Company',
      links: [
        { label: 'Our Work', href: '/work' },
        { label: 'Contact', href: '/contact' },
        { label: 'Book a call', href: '/book' },
        { label: 'KOSMO® studio', href: 'https://www.kosmocgi.com' },
      ],
    },
  ],
  cta: {
    demo: true,
    original: "Let's build something great together",
    text: "Let's make the film a camera can't.",
    /** Second ton du titre (DESIGN-SYSTEM.md, titres en deux tons) */
    soft: "a camera can't.",
  },
  /** Pas d'entité juridique hors mentions légales (05/10) : la marque seulement. */
  legalOwners: ['KOSMO®'],
  legalSuffix: 'All Rights Reserved.',
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Legal notice', href: '/legal' },
  ],
};

export const contact = {
  heading: ['Got an idea?', "Let's build it right."],
  email: 'contact@kosmocgi.com',
  phone: '(+971) 5 26 71 38 90',
  phoneHref: 'tel:+971526713890',
  channels: {
    demo: true,
    items: [
      { icon: 'calendar', title: 'Book a call', text: 'The best next step. Twenty minutes to look at your brief together and tell you what AI can do for it.', cta: bookLabel, href: '/book' },
      { icon: 'brand-whatsapp', title: 'WhatsApp', text: 'The fastest way to reach us. Send your brief, a reference or a product link and we take it from there.', cta: 'open whatsapp', href: 'whatsapp' },
      { icon: 'mail', title: 'Email', text: 'Send a brief or a question. We reply within one working day.', cta: 'write to us', href: 'mailto:contact@kosmocgi.com' },
    ],
  },
};

/** Libellés du formulaire. */
export const form = {
  email: { label: 'Work email', placeholder: 'you@company.com' },
  company: { label: 'Company', placeholder: 'Your company' },
  name: { label: 'Your name', placeholder: 'First and last name' },
  campaignDate: { label: 'When does the campaign run?' },
  market: { label: 'City or market', placeholder: 'Paris, Dubai, London…' },
  budget: { label: 'Media budget' },
  brief: {
    label: 'Tell us about the campaign',
    placeholder: 'The product, what you need (a TV spot, ads, a photoshoot…), the channels and the timing. A few lines are enough.',
  },
  submit: 'Send Message',
  wait: 'Please wait...',
  success: 'Thank you! Your submission has been received!',
  error: 'Oops! Something went wrong while submitting the form.',
  serverError: 'Something went wrong. Email us at contact@kosmocgi.com.',
  /** Messages de validation affichés par src/scripts/lead-form.ts (lus dans les data-msg-* du formulaire, donc traduits). */
  required: 'This field is required',
  invalidEmail: 'Enter a valid email address',
  invalidUrl: 'Paste a link starting with http',
  /** Captcha (Cloudflare Turnstile) absent, expiré ou refusé. */
  captcha: 'Please complete the security check, then try again.',
};

/**
 * Appel discret « parler à Mehdi » (TalkCta.astro) : sous le dossier de la home et sous les chiffres des autres pages.
 * Photo : recadrage de public/images/about/mehdi.jpg (décision home-talk-photo).
 */
export const talk = {
  image: { src: '/images/home/mehdi-face.jpg', alt: 'Mehdi Benkaci, co-founder of KOSMO®' },
  who: 'Mehdi · Co-founder',
  text: 'Let’s build your next campaign together.',
};

export const logos = {
  overline: 'Trusted by 30+ businesses and teams',
};

/**
 * Marques avec lesquelles KOSMO® a travaillé (liste fournie le 27/09). Le logo officiel est lu dans
 * src/assets/logos/brands/<slug>.svg s'il existe, sinon le nom est affiché en lettres (BrandLogo.astro).
 */
export const brands = ['Netflix', 'Zalando', 'Miele', 'Renault', 'Uber Eats', 'Pringles'];
