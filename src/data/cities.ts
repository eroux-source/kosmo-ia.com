/**
 * Index des pages villes /3dooh/[city] (SEO local, docs/SEO-LOCAL-ARCHITECTURE.md). Le contenu de chaque page
 * (SEO, hero, guide local sourcé, FAQ) vit dans src/content/cities/<slug>.md ; ici, ce qui sert ailleurs sans
 * charger la collection : nom, pays, langue principale, villes voisines, image. Toutes les villes sont listées dans le footer.
 * Vague 1 validée par Mehdi le 22/10/2026 (21 villes) ; Tokyo et Séoul restent en ligne hors vague.
 */
export type CityLang = 'en' | 'fr' | 'de' | 'nl';

export interface City {
  slug: string;
  /** Nom anglais (traduit par le dictionnaire quand il diffère : Munich → München). */
  name: string;
  country: string;
  /** Langue des décideurs du marché : la version qui reçoit le copywriting principal et les mots-clés locaux. */
  lang: CityLang;
  /** Villes liées en bas de page (même pays ou même région), par slug. */
  nearby: string[];
  /** Image de la section locale ; sans image, couverture animée (ShaderCover). Illustrations : jamais présentées comme un projet réel. */
  image?: { src: string; alt: string };
  /** Photo de header : public/images/cities/<slug>-hero-v2{-1200,,-3200}.webp (Nano Banana Pro, 23/10/2026, docs/exports/city-covers v03).
   *  Sans photo, le header garde le visuel par défaut du site. */
  hero?: boolean;
}

export const cities: City[] = [
  {
    slug: 'new-york',
    hero: true,
    name: 'New York',
    country: 'United States',
    lang: 'en',
    nearby: ['miami', 'chicago', 'los-angeles'],
    image: { src: '/images/posters/new-york.jpg', alt: 'Illustration: an anamorphic 3D render on a corner screen' },
  },
  {
    slug: 'los-angeles',
    hero: true,
    name: 'Los Angeles',
    country: 'United States',
    lang: 'en',
    nearby: ['las-vegas', 'new-york', 'miami'],
    image: { src: '/images/journal/big-mistakes-billboard.jpg', alt: 'The Netflix Big Mistakes billboard on Sunset Boulevard at night, a diamond necklace spelling 4.9.26' },
  },
  { slug: 'las-vegas', hero: true, name: 'Las Vegas', country: 'United States', lang: 'en', nearby: ['los-angeles', 'new-york'] },
  { slug: 'miami', hero: true, name: 'Miami', country: 'United States', lang: 'en', nearby: ['new-york', 'chicago'] },
  { slug: 'chicago', hero: true, name: 'Chicago', country: 'United States', lang: 'en', nearby: ['new-york', 'miami'] },
  {
    slug: 'london',
    hero: true,
    name: 'London',
    country: 'United Kingdom',
    lang: 'en',
    nearby: ['manchester', 'birmingham', 'paris'],
    image: { src: '/images/posters/london.jpg', alt: 'Illustration: an anamorphic 3D render on a landmark screen' },
  },
  { slug: 'manchester', hero: true, name: 'Manchester', country: 'United Kingdom', lang: 'en', nearby: ['london', 'birmingham'] },
  { slug: 'birmingham', hero: true, name: 'Birmingham', country: 'United Kingdom', lang: 'en', nearby: ['london', 'manchester'] },
  {
    slug: 'paris',
    hero: true,
    name: 'Paris',
    country: 'France',
    lang: 'fr',
    nearby: ['lyon', 'london'],
    image: { src: '/images/posters/paris.jpg', alt: 'Illustration: an anamorphic 3D render on a corner screen' },
  },
  { slug: 'lyon', hero: true, name: 'Lyon', country: 'France', lang: 'fr', nearby: ['paris', 'milan'] },
  {
    slug: 'berlin',
    hero: true,
    name: 'Berlin',
    country: 'Germany',
    lang: 'de',
    nearby: ['hamburg', 'munich', 'cologne'],
    image: { src: '/images/posters/berlin.jpg', alt: 'Illustration: an anamorphic 3D render on a station screen' },
  },
  { slug: 'hamburg', hero: true, name: 'Hamburg', country: 'Germany', lang: 'de', nearby: ['berlin', 'cologne'] },
  { slug: 'munich', hero: true, name: 'Munich', country: 'Germany', lang: 'de', nearby: ['berlin', 'milan'] },
  { slug: 'cologne', hero: true, name: 'Cologne', country: 'Germany', lang: 'de', nearby: ['berlin', 'amsterdam'] },
  { slug: 'amsterdam', hero: true, name: 'Amsterdam', country: 'Netherlands', lang: 'nl', nearby: ['rotterdam', 'cologne'] },
  { slug: 'rotterdam', hero: true, name: 'Rotterdam', country: 'Netherlands', lang: 'nl', nearby: ['amsterdam', 'london'] },
  { slug: 'madrid', hero: true, name: 'Madrid', country: 'Spain', lang: 'en', nearby: ['paris', 'milan'] },
  {
    slug: 'milan',
    hero: true,
    name: 'Milan',
    country: 'Italy',
    lang: 'en',
    nearby: ['munich', 'paris'],
    image: { src: '/images/fooh/maisons-du-monde-v.jpg', alt: 'A FOOH film shot in front of the Duomo in Milan' },
  },
  {
    slug: 'dubai',
    hero: true,
    name: 'Dubai',
    country: 'United Arab Emirates',
    lang: 'en',
    nearby: ['abu-dhabi', 'riyadh'],
    image: { src: '/images/posters/dubai.jpg', alt: 'Illustration: an anamorphic 3D render on a corner screen' },
  },
  { slug: 'abu-dhabi', hero: true, name: 'Abu Dhabi', country: 'United Arab Emirates', lang: 'en', nearby: ['dubai', 'riyadh'] },
  { slug: 'riyadh', hero: true, name: 'Riyadh', country: 'Saudi Arabia', lang: 'en', nearby: ['dubai', 'abu-dhabi'] },
  {
    slug: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    lang: 'en',
    nearby: ['seoul'],
    image: { src: '/images/posters/tokyo.jpg', alt: 'Illustration: an anamorphic 3D render on a corner screen' },
  },
  {
    slug: 'seoul',
    name: 'Seoul',
    country: 'South Korea',
    lang: 'en',
    nearby: ['tokyo'],
    image: { src: '/images/fooh/hermes.jpg', alt: 'A FOOH film shot in Seoul' },
  },
];

export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);
export const cityByName = (name: string) => cities.find((c) => c.name === name);
