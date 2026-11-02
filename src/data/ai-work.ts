/**
 * Productions IA de KOSMO® (références fournies par Eugène le 02/11/2026, encodées en 720p dans public/video/ai,
 * affiches dans public/images/ai). `concept: true` = film réalisé par KOSMO® à son initiative, sans commande de la
 * marque : la carte et la page l'indiquent (« AI concept »). À confirmer projet par projet (AI-SITE-NOTES.md).
 */
import type { MosaicItem } from '../components/ui/MosaicCard.astro';

export interface AiWork {
  slug: string;
  brand: string;
  title: string;
  /** Une phrase, affichée au survol de la carte et sur la page du film. */
  subtitle: string;
  ratio: '16:9' | '9:16' | '1:1';
  /** Format réel du fichier source, affiché sur la page. */
  format: string;
  industry: string;
  concept: boolean;
}

export const aiWorks: AiWork[] = [
  { slug: 'gucci-ai-fashion-film', brand: 'Gucci', title: 'Desert couture', subtitle: 'A fashion film shot nowhere: a cast in embroidered coats across a dry lake, built entirely with AI.', ratio: '16:9', format: 'Fashion film, 22 s', industry: 'Fashion', concept: true },
  { slug: 'alaia-ai-tv-spot', brand: 'Alaïa', title: 'Red lens', subtitle: 'A TV spot for a pair of sunglasses: leather, velvet and one red lens, in ten seconds.', ratio: '16:9', format: 'TV spot, 10 s', industry: 'Fashion', concept: true },
  { slug: 'zara-ai-fashion-film', brand: 'Zara', title: 'Paris, off duty', subtitle: 'A street-style campaign film in Paris, cast, styled and shot with AI.', ratio: '16:9', format: 'Campaign film, 15 s', industry: 'Fashion', concept: true },
  { slug: 'oakley-ai-tv-spot', brand: 'Oakley', title: 'Heatwave', subtitle: 'A desert road, a muscle car and one pair of shades: a TV spot with a music video edit.', ratio: '16:9', format: 'TV spot, 21 s', industry: 'Eyewear', concept: true },
  { slug: 'all-quiet-teaser', brand: 'All Quiet', title: 'All Quiet, teaser', subtitle: 'An animated teaser drawn in pencil: a young designer imagines his own brand.', ratio: '16:9', format: 'Animated teaser, 49 s', industry: 'Fashion', concept: false },
  { slug: 'memoria-jardin-interdit', brand: 'Memoria', title: 'Jardin Interdit', subtitle: 'A perfume film: a pear dripping with nectar becomes the bottle.', ratio: '9:16', format: 'Social film, 13 s', industry: 'Fragrance', concept: false },
  { slug: 'memoria-dernier-rayon', brand: 'Memoria', title: 'Dernier Rayon', subtitle: 'Sunset, skin and sea foam: the last ray of the day, bottled.', ratio: '9:16', format: 'Social film, 15 s', industry: 'Fragrance', concept: false },
  { slug: 'lanvin-ai-social', brand: 'Lanvin', title: 'The leopard clasp', subtitle: 'A golden leopard walks out of the jewelry and onto the bag.', ratio: '1:1', format: 'Social film, 4:5, 13 s', industry: 'Luxury', concept: true },
  { slug: 'balenciaga-ai-social', brand: 'Balenciaga', title: 'Lift', subtitle: 'A steel elevator, a silhouette, a door that opens on the collection.', ratio: '1:1', format: 'Social film, 4:5, 12 s', industry: 'Luxury', concept: true },
  { slug: 'loewe-ai-social', brand: 'Loewe', title: 'Mandarin', subtitle: 'The anagram embossed on a mandarin, then the fragrance it inspired.', ratio: '1:1', format: 'Social film, 4:5, 7 s', industry: 'Fragrance', concept: true },
  { slug: 'polene-ai-product-film', brand: 'Polène', title: 'Above the plateau', subtitle: 'A leather bag floating over green highlands, light as the air around it.', ratio: '1:1', format: 'Product film, 4:5, 6 s', industry: 'Fashion', concept: true },
  { slug: 'tui-brazil', brand: 'TUI', title: 'Brazil', subtitle: 'A striped parasol opens on the beach and becomes the destination.', ratio: '9:16', format: 'Social film, 8 s', industry: 'Travel', concept: false },
  { slug: 'tui-egypt', brand: 'TUI', title: 'Egypt', subtitle: 'A felucca sails down the Nile under the brand’s flag.', ratio: '9:16', format: 'Social film, 8 s', industry: 'Travel', concept: false },
  { slug: 'tui-suitcase', brand: 'TUI', title: 'Sticker suitcase', subtitle: 'A suitcase collects a sticker for every trip, right in the terminal.', ratio: '9:16', format: 'Social film, 9 s', industry: 'Travel', concept: false },
  { slug: 'etam-live-show-cake', brand: 'Etam', title: 'Live Show: the cake', subtitle: 'A birthday cake that spells the brand, a teaser for the Etam Live Show.', ratio: '9:16', format: 'Social teaser, 8 s', industry: 'Fashion', concept: true },
  { slug: 'etam-live-show-shower', brand: 'Etam', title: 'Live Show: the mirror', subtitle: 'A name written in the steam of a shower, a teaser for the Etam Live Show.', ratio: '9:16', format: 'Social teaser, 10 s', industry: 'Fashion', concept: true },
  { slug: 'etam-live-show-alarm', brand: 'Etam', title: 'Live Show: the alarm', subtitle: 'An alarm clock counts down to the show, a teaser for the Etam Live Show.', ratio: '9:16', format: 'Social teaser, 8 s', industry: 'Fashion', concept: true },
];

export const aiWorkBySlug = (slug: string) => aiWorks.find((w) => w.slug === slug);
export const aiWorkHref = (w: AiWork) => `/work/ai/${w.slug}`;
export const aiWorkVideo = (w: AiWork) => `/video/ai/${w.slug}.mp4`;
export const aiWorkPoster = (w: AiWork) => `/images/ai/${w.slug}.jpg`;

/** Tuile de mosaïque (MosaicCard). */
export function aiItem(w: AiWork): MosaicItem {
  return {
    href: aiWorkHref(w),
    video: aiWorkVideo(w),
    poster: aiWorkPoster(w),
    ratio: w.ratio,
    brand: w.brand,
    category: 'ai',
    categoryLabel: w.concept ? 'AI concept' : 'AI production',
    industry: w.industry,
    title: w.subtitle,
  };
}

/**
 * Ambassadeurs IA créés par KOSMO® (Higgsfield, 02/11/2026) : visuels hébergés sur le stockage Higgsfield du compte
 * KOSMO® (WebP compressés). À rapatrier dans public/images si l'on veut se passer de ce stockage.
 */
const HF = 'https://d2ol7oe51mr4n9.cloudfront.net/user_2wfxxwdDlbdG7tjzItT0Ln2Igtz';
export const ambassadors = [
  {
    name: 'The beauty ambassador',
    role: 'Skincare and beauty',
    campaign: `${HF}/5727c820-5469-4c87-bea8-cf67ad1b9dbc.webp`,
    post: `${HF}/41ca636f-3b91-407d-86d8-3386659119be.webp`,
  },
  {
    name: 'The sport ambassador',
    role: 'Running and fitness',
    campaign: `${HF}/10ae4418-3673-4823-aa20-da191edb7b06.webp`,
    post: `${HF}/44d8fff9-b374-498e-aba4-c924758d16bc.webp`,
  },
  {
    name: 'The tech creator',
    role: 'Tech and lifestyle',
    campaign: `${HF}/03635524-dcb1-4857-a7c5-0efe9d2b060e.webp`,
    post: `${HF}/3ada389a-b553-42b6-bc52-4bfb9ff78f29.webp`,
  },
];
