/**
 * Contenu de la page /3dooh. Base : textes de /reference ; les tirets ont été retirés.
 * Tout objet `demo: true` est un texte écrit pour la démo (badge DÉMO, listé sur /todo) ;
 * quand il remplace une phrase de la référence, l'original est conservé dans `original`.
 */
import { bookLabel, brands } from './site';
import shiftVideos from './shift-videos.json';

/** Vidéo du comparateur si elle a été générée (public/video/shift-<name>.mp4), sinon image seule. */
const shiftVideo = (name: 'dooh' | '3dooh') =>
  (shiftVideos as string[]).includes(name) ? { src: `/video/shift-${name}.mp4`, poster: `/images/shift/${name}.webp` } : undefined;

export { bunny } from './bunny';
import { bunny } from './bunny';
import type { Lang } from '../i18n/config';

/** Délai standard (décision « delay ») : 3 à 4 semaines du brief validé à la livraison. */
export const DELAY = '3 to 4 weeks';

export const hero = {
  title: {
    demo: true,
    original: ['The new way', 'to display'],
    text: 'Anamorphic billboards people stop for and film.',
  },
  subtitle: {
    demo: true,
    text: 'Anamorphic 3D creative (3DOOH) for the screens you already book. Corner screens or flat ones: your brand steps out of the frame, stops people in their tracks and travels far beyond the street.',
  },
  personalized: { demo: true, prefix: 'A free 3D concept for' },
  /** Preuve au-dessus de la ligne de flottaison : chiffre confirmé + marques (src/data/site.ts → brands). */
  proof: { views: '150+ campaigns in 14 countries', partners: brands },
  /** Film de présentation KOSMO® (video/out/kosmo-presentation-v1-light.mp4), copié dans public/video. */
  /** `mobile` : même film en 854 × 480 (4,8 Mo au lieu de 12,8 Mo), servi sous 767 px par le mini lecteur du hero. */
  showreel: { src: '/video/showreel.mp4?v=2', mobile: '/video/showreel-mobile.mp4?v=1', poster: '/video/showreel-poster.jpg?v=2' },
  /** VSL 3DOOH : film KOSMO® 4:3 de 31 s avec musique et bruitages (video/out/kosmo-brand-film-sound.mp4, version web 1440×1080). */
  vsl: { src: '/video/vsl.mp4?v=1', poster: '/video/vsl-poster.jpg?v=1' },
  // Vidéo de la référence (New York), poster local. Le vrai hero 3DOOH est attendu (assets « hero-3dooh-video »).
  video: bunny('b54422f7-eaeb-4bcb-ba0a-b162216d3022', 'new-york'),
  // Visuel du hero : le dino de la référence sur fond noir (Hero.astro l'utilise par défaut).
  fallback: { src: '/images/hero/dino-black.png' },
  chips: [
    { icon: 'maximize', label: 'Works on every DOOH screen' },
    { icon: 'clock', label: `Live in ${DELAY}` },
  ],
  secondaryCta: bookLabel,
};

/**
 * « 2D vs 3D » : le passage d'une vidéo plate à la 3D anamorphique, sur le même écran et le même budget (pas seulement
 * pour le DOOH). Réécrit le 22/10/2026 à la demande de Mehdi (l'ancien angle « Your DOOH gets impressions » est dans git).
 */
export const shift = {
  overline: '2D vs 3D',
  heading: ['A 2D video gets seen.', 'A 3D one gets filmed.'],
  intro: 'Same screen, same media budget. A flat video plays like every other ad. Anamorphic 3D seems to leave the screen, so people stop, film it and share it.',
  /**
   * Même écran, deux versions (fournies le 27/09) : le film plat (DOOH) à gauche, la version 3D (3DOOH) à droite.
   * Images fixes pour l'instant ; dès que les deux GIF sont déposés dans imports/shift/ (dooh.gif, 3dooh.gif),
   * scripts/build-shift-videos.mjs les convertit en MP4 et le comparateur passe en vidéos synchronisées.
   */
  compare: {
    before: { src: '/images/shift/dooh.webp', label: 'Without anamorphic', video: shiftVideo('dooh') },
    after: { src: '/images/shift/3dooh.webp', label: 'With anamorphic', video: shiftVideo('3dooh') },
  },
  table: {
    head: ['What changes', '2D video', 'Anamorphic 3D'],
    rows: [
      { icon: 'eye', feature: 'Attention', old: 'Seen, then forgotten', new: 'People stop and film it' },
      { icon: 'trending-up', feature: 'Reach', old: 'Only the people who walk past', new: 'Passers-by, plus everyone who sees the videos online' },
      { icon: 'coins', feature: 'Media budget', old: 'Same', new: 'Same media buy, zero extra spend' },
      { icon: 'share', feature: 'Shareability', old: 'Nobody films a flat ad', new: 'Reposted, stitched, duetted for free' },
      { icon: 'hourglass', feature: 'Shelf life', old: 'Over when the campaign ends', new: 'Lives on social long after the screen goes dark' },
      { icon: 'arrows-maximize', feature: 'Format', old: 'A flat image inside the frame', new: 'A 3D moment that breaks the frame' },
    ],
  },
};

/**
 * Textes de /3dooh en version générale (22/10/2026, demande de Mehdi) : la 3D anamorphique sur tout écran (rue, boutique,
 * scène, bâtiment), pas seulement la publicité DOOH. `hero`, `shift` et `process` gardent l'angle publicité pour les
 * pages villes ; le formulaire « concept gratuit » (Offer) partira sur une page dédiée.
 */
export const anamorphic = {
  seo: {
    title: 'Anamorphic 3D billboards for any screen | KOSMO®',
    description:
      'Anamorphic 3D for any screen: billboards, shop windows, event LED walls, media facades. 3D moments people stop for, film and share, by KOSMO®.',
  },
  hero: {
    title: { demo: true, text: 'Anamorphic 3D people stop for and film.' },
    subtitle: {
      demo: true,
      text: 'We build 3D for the exact shape of a screen and the spot people see it from. On a billboard, in a shop window, on stage or across a building, your brand steps out of the frame and travels far beyond the place.',
    },
    personalized: { demo: true, prefix: 'Anamorphic 3D for' },
    chips: [
      { icon: 'maximize', label: 'Any screen, any shape' },
      { icon: 'clock', label: `Live in ${DELAY}` },
    ],
    secondary: { label: 'our work', href: '/work?category=3dooh' },
  },
};

/** Bloc « concept gratuit » réutilisé sur plusieurs pages (ConceptCta). Pas de livrables détaillés, pas d'urgence. */
export const conceptCta = {
  demo: true,
  overline: 'free concept',
  heading: 'Have a screen in your plan? Let us show you what it could become.',
  text: 'Tell us about the campaign. We come back with a concept built for your screen and your brand, free, no commitment. The quickest way to get there is a call.',
  /** Film FOOH 30 s (video/out/kosmo-showreel-fooh-30s.mp4), muet, en boucle, posé en biais dans le bloc. */
  video: { src: '/video/concept-cta.mp4', poster: '/images/concept-cta-poster.jpg', alt: 'KOSMO® FOOH showreel: mixed reality films in real streets' },
};

export const work = {
  overline: 'work',
  heading: 'On every screen, globally',
  intro: "From New York to Tokyo, we've turned brand moments into content people actually stop for: 150+ campaigns on 750+ screens in 14 countries.",
  items: [
    { city: 'paris', ...bunny('e6fc0531-a741-4196-be28-ce072c1d2dc9', 'paris') },
    { city: 'dubai', ...bunny('ecc4b8c6-f1b9-4599-99c2-6e88f95bf2dd', 'dubai') },
    { city: 'tokyo', ...bunny('8c4274a0-fc73-4ee2-8f83-521bbd4eebfb', 'tokyo') },
    { city: 'London', ...bunny('58f239dd-d7ba-4385-9ef4-666a236401a5', 'london') },
    { city: 'Berlin', ...bunny('85eac8ca-b545-438f-bb9f-6092770df9a8', 'berlin') },
    { city: 'Brussel', ...bunny('09ef6246-bcc5-47e5-b82b-bde416eaab46', 'brussels') },
    { city: 'New York', ...bunny('b54422f7-eaeb-4bcb-ba0a-b162216d3022', 'new-york') },
  ],
};

/** Process en cinq étapes, réécrit pour des responsables marque (texte DÉMO ; original de la référence conservé). */
/** Section « how we work » : même frise pour le 3DOOH et le FOOH, textes propres à chaque discipline. */
export interface ProcessData {
  overline: string;
  heading: { demo: boolean; original?: string; text: string };
  intro: { demo: boolean; original?: string; text: string };
  image: { src: string; srcset: string; alt: string };
  outcomeLabel: string;
  weeks: string[];
  timeline: { start: string; end: string };
  steps: { demo: boolean; icon: string; label: string; col: string; when: string; title: string; text: string; outcome: string }[];
}
export const process: ProcessData = {
  overline: 'HOW WE WORK',
  heading: {
    demo: true,
    original: 'A collaborative process designed to align vision, execution, and results',
    text: 'From your media plan to a moment people film.',
  },
  intro: {
    demo: true,
    original: "Whether you're upgrading a DOOH campaign or launching a viral moment, we run the whole thing end-to-end so you stay focused on the brand while we handle the craft.",
    text: 'You bring the screens and the brand. We bring the idea, the 3D and the delivery, and we keep it simple for you from the first call to the day it goes live.',
  },
  image: {
    src: '/images/process/briefing.avif',
    srcset: '/images/process/briefing-500.avif 500w, /images/process/briefing-800.avif 800w, /images/process/briefing-1080.avif 1080w, /images/process/briefing.avif 1384w',
    alt: 'The KOSMO team reviewing a media plan',
  },
  outcomeLabel: 'What you get',
  /* Frise (Process.astro) : 4 semaines + « live » en 10 demi-colonnes ; `col` = position de la barre, `when` = repère lisible. */
  weeks: ['Week 01', 'Week 02', 'Week 03', 'Week 04', 'Live +'],
  timeline: { start: 'Approved brief', end: 'Live on screen' },
  steps: [
    {
      demo: true,
      icon: 'file-text',
      label: 'Brief',
      col: 'col-start-1 col-span-2',
      when: 'Day 1',
      title: 'Tell us about the campaign',
      text: 'Your screens, your dates, your product. We look at the plan and tell you where a 3D moment will hit hardest.',
      outcome: 'A clear answer on what is possible',
    },
    {
      demo: true,
      icon: 'sparkles',
      label: 'Concept',
      col: 'col-start-2 col-span-2',
      when: 'Week 1',
      title: 'We find the idea people will stop for',
      text: 'A 3D scene is not enough. We build the twist that makes someone stop, film and share instead of walking past.',
      outcome: 'A concept and a first look at your screen',
    },
    {
      demo: true,
      icon: 'cube',
      label: 'Production',
      col: 'col-start-3 col-span-4',
      when: 'Weeks 2 to 3',
      title: 'We build it in 3D',
      text: 'Our own 3D team builds the scene to the exact shape of your screen and to the eyes of the people passing by.',
      outcome: 'Your campaign in 3D, ready for every screen',
    },
    {
      demo: true,
      icon: 'send',
      label: 'Delivery',
      col: 'col-start-7 col-span-2',
      when: 'Week 4',
      title: 'We take care of every screen',
      text: 'One idea, every screen in your plan. We prepare each version, deal with the media owners and get the files approved.',
      outcome: 'Nothing stuck in logistics',
    },
    {
      demo: true,
      icon: 'share',
      label: 'Amplification',
      col: 'col-start-9 col-span-2',
      when: 'After live',
      title: 'The screen becomes content',
      text: 'We turn the moment into social videos built to travel across feeds, so the campaign reaches everyone who never walked past.',
      outcome: 'Organic reach on top of your media',
    },
  ],
};

/**
 * Offre d'entrée « concept gratuit ». Titre : texte de la home. On n'entre pas dans le détail
 * de ce qui est offert : un concept pour votre écran, et le bon réflexe est de réserver un call.
 */
export const offer = {
  overline: 'get a free concept',
  heading: 'See your brand break the screen.',
  intro: {
    demo: true,
    text: 'Tell us about your next campaign. We come back with a concept built for your screen and your brand: the idea, the twist, and how it plays out. Free, and yours to keep.',
  },
  reassurance: { demo: true, text: 'No commitment. If you would rather talk it through first, book a call and we look at your plan together.' },
  submit: 'get my free concept',
};

export type IndustryTag =
  | { label: string; color: 'orange' | 'red' | 'pink' | 'rose' | 'amber' | 'olive' | 'green' | 'sky' | 'cream' | 'blue' | 'brown' }
  | { image: string; alt: string; shape: 'square' | 'rect' };

export const industries = {
  overline: 'INDUSTRIES',
  heading: 'Any brand. Any screen. Any industry.',
  intro:
    "3DOOH works anywhere there's a screen and an audience. Retail, automotive, gaming, F&B, luxury, entertainment: the format adapts, and the impact only gets stronger.",
  /**
   * Nuage de tags magnétiques (maquette Cofounder validée le 21/10/2026) : 7 industries en pastilles de couleur
   * (palette de référence de Mehdi, hors charte, décision tag-palette) et 4 images de projets FOOH, dans cet ordre.
   */
  cloud: [
    { label: 'Retail', color: 'orange' },
    { image: '/images/home/industries/porsche.jpg', alt: 'Porsche FOOH: a car bursting out of a giant chrome sphere in a Paris street', shape: 'rect' },
    { label: 'Automotive', color: 'blue' },
    { label: 'Gaming', color: 'olive' },
    { image: '/images/home/industries/oysho-i.jpg', alt: 'Oysho FOOH: a giant tennis ball rolling past the Colosseum', shape: 'square' },
    { label: 'Food & drink', color: 'rose' },
    { label: 'Luxury', color: 'brown' },
    { image: '/images/home/industries/super-mario-galaxy-yoshi-eggs.jpg', alt: 'Super Mario Galaxy FOOH: a carton of Yoshi eggs in a supermarket', shape: 'square' },
    { label: 'Entertainment', color: 'pink' },
    { label: 'Sport', color: 'red' },
    { image: '/images/home/industries/psg.jpg', alt: 'PSG x Nike FOOH: a giant 3D billboard over a road', shape: 'rect' },
  ] as IndustryTag[],
};

/** Régie (media owner) du bandeau. `logo` absent = SVG officiel pas encore récupéré : la régie n'est pas affichée. */
export interface MediaOwner {
  name: string;
  /** Largeur d'affichage (px), calée sur une hauteur visuelle commune. */
  logo?: { src: string; width: number };
}

/** Catalogue des régies ; logos officiels en SVG passés en noir (Wikimedia Commons ou sites des régies). */
export const mediaOwners: Record<string, MediaOwner> = {
  // Réseaux internationaux (pas des partenaires attitrés : KOSMO® n'a pas de régie partenaire, décision 05/10)
  jcdecaux: { name: 'JCDecaux', logo: { src: '/images/partners/jcdecaux.svg', width: 193 } },
  cityz: { name: 'Cityz Media', logo: { src: '/images/partners/cityz.svg', width: 150 } },
  phi: { name: 'Phi advertising', logo: { src: '/images/partners/phi.svg', width: 117 } },
  idooh: { name: 'iDOOH', logo: { src: '/images/partners/idooh.svg', width: 96 } },
  // France, Belgique, Suisse
  mediatransports: { name: 'Mediatransports' },
  extime: { name: 'Extime JCDecaux Airport' },
  phenix: { name: 'Phenix Groupe' },
  'apg-sga': { name: 'APG|SGA' },
  'goldbach-neo': { name: 'Goldbach Neo' },
  publifer: { name: 'Publifer' },
  // Allemagne, Autriche
  stroer: { name: 'Ströer', logo: { src: '/images/partners/stroer.svg', width: 170 } },
  'blowup-media': { name: 'blowUP media', logo: { src: '/images/partners/blowup-media.svg', width: 190 } },
  'media-frankfurt': { name: 'Media Frankfurt' },
  awk: { name: 'awk AUSSENWERBUNG' },
  gewista: { name: 'Gewista' },
  epamedia: { name: 'EPAMEDIA' },
  // Royaume-Uni, Pays-Bas, Belgique
  'ocean-outdoor': { name: 'Ocean Outdoor', logo: { src: '/images/partners/ocean-outdoor.svg', width: 64 } },
  global: { name: 'Global', logo: { src: '/images/partners/global.svg', width: 56 } },
  'bauer-media-outdoor': { name: 'Bauer Media Outdoor', logo: { src: '/images/partners/bauer-media-outdoor.svg', width: 100 } },
  // États-Unis
  'clear-channel': { name: 'Clear Channel Outdoor', logo: { src: '/images/partners/clear-channel.svg', width: 190 } },
  'outfront-media': { name: 'Outfront Media', logo: { src: '/images/partners/outfront-media.svg', width: 180 } },
  lamar: { name: 'Lamar Advertising', logo: { src: '/images/partners/lamar.svg', width: 190 } },
  'branded-cities': { name: 'Branded Cities' },
  sherwood: { name: 'Sherwood Outdoor' },
  // Golfe
  backlite: { name: 'BackLite Media', logo: { src: '/images/partners/backlite.svg', width: 170 } },
  hypermedia: { name: 'Hypermedia', logo: { src: '/images/partners/hypermedia.svg', width: 200 } },
  'al-arabia': { name: 'Al Arabia' },
  'arabian-outdoor': { name: 'Arabian Outdoor' },
  faden: { name: 'Faden Media' },
};

/**
 * Bandeau des régies (#antik-logo-01), une liste par langue du site = par marché (décision media-owner-logos-by-language) :
 *  - en : international. JCDecaux, Cityz, Phi et iDOOH d'abord (réseaux sur lesquels on peut acheter, pas des partenaires), puis États-Unis, Royaume-Uni, Golfe.
 *  - fr : France (JCDecaux, Cityz Media = ex-Clear Channel France), puis Belgique francophone et Suisse romande.
 *  - de : Allemagne (Ströer, blowUP, WallDecaux = JCDecaux), Autriche, Suisse alémanique.
 *  - nl : Pays-Bas (Ocean, Global = ex-Exterion, Bauer = ex-Clear Channel), puis Flandre.
 * Le surtitre dit « media owners », pas « partners » : KOSMO® n'a pas de régie partenaire attitrée (05/10), le titre parle des specs que l'on maîtrise.
 */
/**
 * Formes d'écran (/3dooh, à la place des régies le 22/10/2026 à la demande de Mehdi : la page ne parle pas que de
 * publicité). Une figure Hairline par forme (public/hairline/screen-<shape>.js, sources du générateur hors du site) :
 * l'écran en caissons LED, les caissons proches du pointeur sortent de la face. L'image fixe sert de secours.
 */
export const screenTypes = {
  overline: 'screen formats',
  heading: 'Any screen, any shape.',
  intro: 'Flat, corner, curved or one of a kind: the 3D is built for the exact geometry of your screen and the spot people see it from.',
  items: [
    { shape: 'flat', label: 'Flat', alt: 'A flat LED screen: the cabinets near the pointer slide out of its face' },
    { shape: 'corner', label: 'Corner 90°', alt: 'A corner LED screen on a building: the cabinets near the pointer slide out of both faces' },
    { shape: 'curved', label: 'Curved', alt: 'A curved LED screen: the cabinets near the pointer slide out of the arc' },
    { shape: 'column', label: 'Column', alt: 'An LED column round a pillar: the cabinets near the pointer slide out of it' },
  ] as const,
};

export const partners = {
  overline: 'media owners',
  heading: "We speak every media owner's specs",
  markets: {
    en: ['jcdecaux', 'cityz', 'phi', 'idooh', 'clear-channel', 'outfront-media', 'lamar', 'branded-cities', 'sherwood', 'ocean-outdoor', 'global', 'bauer-media-outdoor', 'blowup-media', 'backlite', 'al-arabia', 'hypermedia', 'arabian-outdoor', 'faden'],
    fr: ['jcdecaux', 'cityz', 'mediatransports', 'extime', 'phenix', 'bauer-media-outdoor', 'apg-sga', 'goldbach-neo'],
    de: ['stroer', 'blowup-media', 'jcdecaux', 'media-frankfurt', 'awk', 'gewista', 'epamedia', 'apg-sga', 'goldbach-neo'],
    nl: ['ocean-outdoor', 'global', 'bauer-media-outdoor', 'jcdecaux', 'blowup-media', 'publifer'],
  } satisfies Record<Lang, string[]>,
  /** Sous ce nombre de logos, la liste est répétée pour que le défilement couvre la largeur de l'écran. */
  minTrack: 8,
};

/** Section équipe (#klarheit-team-02) : noms et rôles de la référence. */
export const team = {
  heading: {
    demo: false,
    original: 'A multidisciplinary team of brand love experts.',
    before: 'A multidisciplinary team of',
    highlight: 'brand love',
    after: ' experts.',
  },
  /** Mention sous le rôle d'un membre qui travaille dans un studio partenaire (champ `studio`). */
  partnerLabel: 'Partner studio',
  members: [
    { name: 'Theo ficat', role: 'Content Producer', image: 'theo', sizes: [500, 800] },
    { name: 'Jean piquemal', role: 'Production Lead', image: 'jean', sizes: [500, 800] },
    { name: 'Samia touchet', role: 'Creative Director', image: 'samia', sizes: [500, 800] },
    { name: 'Mehdi Benkaci', role: 'CEO', image: 'mehdi', sizes: [500, 800] },
    { name: 'Eugène Roux', role: 'Head of Accounts', image: 'eugene', sizes: [500, 800] },
    { name: 'Alexey komarov', role: 'VFX & CGI Lead', image: 'alexey', sizes: [500, 800] },
    { name: 'Sergei Nakariakov', role: 'CGI Art Director', studio: 'Untilted', image: 'sergei', sizes: [500] },
  ],
};

/** « 2D vs 3D » de /3dooh sans l'angle budget média (voir `anamorphic`). */
export const shiftAnamorphic: typeof shift = {
  ...shift,
  intro: 'Same screen, same place. A flat video plays like everything else around it. Anamorphic 3D seems to leave the screen, so people stop, film it and share it.',
  table: {
    head: shift.table.head,
    rows: shift.table.rows.map((row) =>
      row.icon === 'coins'
        ? { icon: 'coins', feature: 'Screen', old: 'Your screen', new: 'The same screen, nothing new to install' }
        : row.icon === 'share'
          ? { ...row, old: 'Nobody films a flat video' }
          : row.icon === 'hourglass'
            ? { ...row, old: 'Over when it stops playing' }
            : row,
    ),
  },
};

/** « How we work » de /3dooh sans plan média (voir `anamorphic`). */
export const processAnamorphic: ProcessData = {
  ...process,
  heading: { demo: true, text: 'From a first idea to a moment people film.' },
  intro: {
    demo: true,
    text: 'You bring the brand and the place: a street, a shop, a stage or a building. We bring the idea, the 3D and the delivery, and we keep it simple from the first call to the day it goes live.',
  },
};
