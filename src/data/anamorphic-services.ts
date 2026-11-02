/**
 * Pages des quatre services de la 3D anamorphique (/3dooh/billboards, /3dooh/in-store, /3dooh/events,
 * /3dooh/architecture), créées le 22/10/2026 à la demande de Mehdi. Chaque page répond au lecteur type du service et à
 * sa crainte (analyse du 22/10 : marque ou agence média, retail, agence événementielle, promoteur ou hôtel).
 * Images : photos générées (Higgsfield, Nano Banana 2.1), en attendant de vrais projets retail, événementiel et
 * architecture (sources dans docs/exports/service-pages et docs/exports/service-cards). Textes écrits sans validation de
 * Mehdi (décision anamorphic-service-pages). FAQ : faqServices dans src/data/faq.ts.
 */
import type { FaqItem } from './faq';
import { faqServices } from './faq';
import type { Stat } from './stats';

/**
 * Chiffres de marché cités sur les pages de service (recherche du 22/10/2026). Pas d'étude indépendante sur la 3D
 * anamorphique seule : on ne garde que des études nommées, avec leur source sous le chiffre.
 * - Vistar Media × JCDecaux × Omnicom, « Science in Motion », Pays-Bas, 7 513 répondants (vistarmedia.com/science-in-motion-research) :
 *   la 3D 67 % plus efficace en notoriété qu'une créa sans mouvement ; le mouvement +33 % de mémorisation vs fixe.
 * - Ocean Outdoor (régie UK), recherche neuro sur DeepScreen (oceanoutdoor.com/labs/deepscreen) : full motion 2,5× vs fixe en mémoire à long terme.
 * - BCN Visuals × MFour, sondage déclaratif, États-Unis (oohtoday.com/the-anamorphic-advantage-in-out-of-home-advertising) :
 *   55 % filmeraient et partageraient, 68 % marque plus premium, 66 % plus enclins à acheter.
 * - Exhibit Surveys, cité via le CEIR (source secondaire) : 3 secondes pour s'arrêter ou passer devant un stand.
 */
const VISTAR = 'Vistar Media × JCDecaux × Omnicom, 7,513 people (NL)';
const BCN = 'BCN Visuals × MFour survey (US)';
const RESEARCH = {
  awareness: { value: 67, suffix: '%', label: 'more brand awareness for 3D vs a still ad', source: VISTAR, demo: false },
  recall: { value: 33, suffix: '%', label: 'more ad recall when the ad moves', source: VISTAR, demo: false },
  memory: { value: 2.5, suffix: '×', label: 'better long-term memory for moving ads', source: 'Ocean Outdoor neuroscience research (UK)', demo: false },
  share: { value: 55, suffix: '%', label: 'of viewers would film and share a 3D ad', source: BCN, demo: false },
  premium: { value: 68, suffix: '%', label: 'see the brand as more premium', source: BCN, demo: false },
  buy: { value: 66, suffix: '%', label: 'say they are more likely to buy', source: BCN, demo: false },
  stop: { value: 3, suffix: 's', label: 'for a visitor to stop or walk past a stand', source: 'Exhibit Surveys, via CEIR', demo: false },
} satisfies Record<string, Stat>;

export type ServiceSlug = 'billboards' | 'in-store' | 'events' | 'architecture';

interface Place {
  title: string;
  text: string;
  image: { src: string; alt: string };
}

export interface AnamorphicServicePage {
  slug: ServiceSlug;
  name: string;
  seo: { title: string; description: string };
  hero: { title: string; subtitle: string; image: string };
  places: { overline: string; heading: string; intro: string; items: Place[] };
  /** Bande de chiffres de marché, sources sous chaque chiffre. */
  research: Stat[];
  /** Méthode propre au service (quatre étapes) et livrables. */
  method: { heading: string; intro: string; steps: { title: string; text: string; image?: { src: string; alt: string } }[]; deliverables: string[] };
  faq: FaqItem[];
}

const img = (name: string) => `/images/services/${name}.webp`;

export const anamorphicServices: AnamorphicServicePage[] = [
  {
    slug: 'billboards',
    name: 'Anamorphic billboards',
    seo: {
      title: 'Anamorphic 3D billboard advertising agency | KOSMO®',
      description:
        'Anamorphic 3D billboards for iconic corner screens and the DOOH screens already in your plan. Idea, CGI, screen specs and media buying in 3 to 4 weeks.',
    },
    hero: {
      title: 'Anamorphic 3D billboards, made to be filmed.',
      subtitle:
        "We design the 3D film, build it to each screen's specs and can book the media for you. Iconic corners or the screens already in your plan, live in 3 to 4 weeks.",
      image: 'billboards-hero',
    },
    places: {
      overline: 'where it runs',
      heading: 'Built for the screen, not just the brief.',
      intro: 'Every screen has its own angle, size and resolution. We build the illusion for the one you have, and for the spot people see it from.',
      items: [
        {
          title: 'Iconic corner screens',
          text: 'Times Square, Shinjuku, Piccadilly, Seoul: the corner screens made for 3D, where one film travels far beyond the street.',
          image: { src: img('billboards-iconic'), alt: 'A tiger leaps out of a corner screen above a Tokyo crossing at dusk' },
        },
        {
          title: 'The screens in your plan',
          text: 'Flat and curved DOOH screens in streets, stations and malls. One master film, resized for every screen in the campaign.',
          image: { src: img('billboards-plan'), alt: 'A corner screen above a New York avenue on a sunny day, a tiger stepping out over the traffic' },
        },
        {
          title: 'Media bought for you',
          text: 'We can book the screens ourselves, so the budget stays in check and every placement suits the idea.',
          image: { src: img('billboards-media'), alt: 'A New York corner screen at night with a tiger leaping out over the street' },
        },
      ],
    },
    research: [RESEARCH.awareness, RESEARCH.recall, RESEARCH.memory, RESEARCH.share],
    method: {
      heading: 'How we make sure it works on your screen.',
      intro: 'Most 3D billboards fail on details: a wrong angle, a file the media owner rejects, a crop nobody checked. This is how we rule them out.',
      steps: [
        { title: 'Screen survey', text: "We collect the media owner's specs and a photo from where people stand: size, angle, resolution, running time.", image: { src: img('billboards-method-1'), alt: "The team photographs a corner billboard from the exact viewing spot" } },
        { title: 'Preview on the real site', text: 'Before production, you see the illusion on a photo of the actual street, from the real point of view.', image: { src: img('billboards-method-2'), alt: "A preview of the 3D illusion on a tablet, held up in front of the real billboard" } },
        { title: 'Test files first', text: 'We send test files to the media owner before launch, so approval is never a surprise on the day.', image: { src: img('billboards-method-3'), alt: "The team checks a test cube on a corner billboard at night" } },
        { title: 'Every format, plus social', text: 'One master film, cut for each screen in the plan and for your social channels.', image: { src: img('billboards-method-4'), alt: "The same film framed for every screen format in the studio" } },
      ],
      deliverables: [
        "A film per screen, to the media owner's specs",
        'A preview on a photo of the real site',
        'Test files sent before launch',
        'Vertical and horizontal cuts for social',
        'Media booking, if you want it',
        'The rights to reuse the films',
      ],
    },
    faq: faqServices.billboards,
  },
  {
    slug: 'in-store',
    name: 'In-store & retail',
    seo: {
      title: '3D digital signage content for retail | KOSMO®',
      description:
        'Anamorphic 3D content for retail digital signage: storefront screens, window displays and in-store LED columns. One master film, resized for every store.',
    },
    hero: {
      title: '3D digital signage content, made for retail.',
      subtitle:
        'Anamorphic 3D for the screens in your shop windows, aisles and mall atriums. It stops people on the pavement, brings them inside and ends up on their phones. One master film, resized for every store.',
      image: 'in-store-hero',
    },
    places: {
      overline: 'where it works',
      heading: 'From the window to the checkout.',
      intro: 'Anamorphic 3D works on the screens you already have in store, or on new ones we help you choose and place.',
      items: [
        {
          title: 'Shop windows',
          text: 'LED windows on the high street: a 3D moment that stops passers-by and brings them through the door.',
          image: { src: img('in-store-windows'), alt: 'A black panther steps out of an acid yellow box in a boutique window' },
        },
        {
          title: 'In-store screens and columns',
          text: 'Columns, walls and corners inside the store. The launch moment people film before they reach the shelf.',
          image: { src: img('in-store-screens'), alt: 'Giant orchids grow out of a screen column in the middle of a bright concept store' },
        },
        {
          title: 'Malls and department stores',
          text: 'Atrium screens seen from every floor, built for the angles people actually walk past.',
          image: { src: img('in-store-malls'), alt: 'A giant koi swims out of a corner screen in a department store atrium' },
        },
      ],
    },
    research: [RESEARCH.awareness, RESEARCH.share, RESEARCH.premium, RESEARCH.buy],
    method: {
      heading: 'How we make sure it works in store.',
      intro: 'A shop is not a street: people stand closer, walk in every direction and pass the same screen twice. The method follows.',
      steps: [
        { title: 'Screens and paths', text: 'You send photos and the specs of each screen. We check distance, height and the path shoppers actually take.', image: { src: img('in-store-method-1'), alt: 'Two members of the team measure the distance to an LED column in a concept store' } },
        { title: 'Close-range test', text: 'We set the depth for the real viewing distance, so the effect works a few metres away, not only across a street.', image: { src: img('in-store-method-2'), alt: 'The team checks a 3D test cube on an in-store corner screen from a few metres away' } },
        { title: 'One master, every format', text: 'A resize table: one film, one file per screen format in your network, named for your screen provider.', image: { src: img('in-store-method-3'), alt: 'A 3D artist reviews the same film laid out in every screen format' } },
        { title: 'Measured, not guessed', text: 'We help you count passers-by and store entries before and after, with a control store if you have one.', image: { src: img('in-store-method-4'), alt: 'A people counter is fixed above a boutique entrance while a colleague checks the data' } },
      ],
      deliverables: [
        'One master film and a file per screen format',
        'A resize table for your screen provider',
        'Seasonal versions, on request',
        'Cuts for your social channels',
        'A before and after measurement plan',
        'The rights to reuse the films',
      ],
    },
    faq: faqServices['in-store'],
  },
  {
    slug: 'events',
    name: 'Events & experiential',
    seo: {
      title: '3D content for event LED screens and walls | KOSMO®',
      description:
        "Anamorphic 3D content for event LED screens at launches, trade show stands, concerts and festivals. Built to your AV team's specs, ready on the day.",
    },
    hero: {
      title: '3D for your event LED screen, the moment everyone films.',
      subtitle:
        "An immersive brand experience on the LED wall you already booked: launches, keynotes, trade show stands, festivals. Built for the crowd in front of it, delivered to your AV team's specs before the day.",
      image: 'events-hero',
    },
    places: {
      overline: 'where it works',
      heading: 'Stage, stand or open field.',
      intro: 'We work alongside your event agency and AV provider: their wall, their specs, your date.',
      items: [
        {
          title: 'Stages and concerts',
          text: 'The wall behind the show. A 3D moment timed to the set, filmed by the whole crowd at once.',
          image: { src: img('events-stages'), alt: 'A whale breaches out of the LED wall of a festival stage above the crowd' },
        },
        {
          title: 'Trade show stands',
          text: 'A corner LED on the stand that pulls the aisle in and ends up on the phone of everyone walking past.',
          image: { src: img('events-stands'), alt: 'A sea turtle swims out of the corner screen of a trade show stand, visitors filming' },
        },
        {
          title: 'Brand activations',
          text: 'Outdoor walls and pop-ups for brand activations, made to read in daylight for a moving crowd.',
          image: { src: img('events-activations'), alt: 'Giant sunflowers bloom out of an LED wall on a festival lawn' },
        },
      ],
    },
    research: [RESEARCH.stop, RESEARCH.awareness, RESEARCH.memory, RESEARCH.share],
    method: {
      heading: 'How we make sure it works on the day.',
      intro: 'An event gives you one chance. Everything is planned around the date, the room and the people who run the wall.',
      steps: [
        { title: 'Planned backwards', text: 'We start from the show date and fix the brief, the reviews and the file delivery around it.', image: { src: img('events-method-1'), alt: "The team plans the show backwards on a wall of sticky notes" } },
        { title: 'Viewpoint on the floor plan', text: 'We place the point of view of the illusion on the venue plan: where most of the audience and the cameras will be.', image: { src: img('events-method-2'), alt: "The team marks the viewpoint with tape in an empty conference hall" } },
        { title: 'A tech sheet for your AV team', text: 'Resolution, pixel pitch, frame rate, player and file format, agreed with your AV provider in the first week.', image: { src: img('events-method-3'), alt: "A creative checks the playback setup with the AV technician backstage" } },
        { title: 'Tested, with a backup', text: 'A test on the real wall whenever the venue allows it, and a backup file ready on the day.', image: { src: img('events-method-4'), alt: "The night before the show, the team tests the film on the LED wall with a backup in hand" } },
      ],
      deliverables: [
        'Files ready to load on the wall',
        'A tech sheet for your AV provider',
        'A backup version for the day',
        'A version timed to the show',
        'Cuts for social after the event',
        'The rights to reuse the films',
      ],
    },
    faq: faqServices.events,
  },
  {
    slug: 'architecture',
    name: 'Architecture & real estate',
    seo: {
      title: '3D LED display content for buildings | KOSMO®',
      description:
        'Naked-eye 3D content for 3D LED displays on facades, hotel lobbies and malls. Made for the architecture, built to last, refreshed over time.',
    },
    hero: {
      title: '3D LED displays, made for the building.',
      subtitle:
        'Naked-eye 3D for LED facades, lobby video walls and permanent screens. Films that fit the architecture, still look right years later and can be refreshed over time.',
      image: 'architecture-hero',
    },
    places: {
      overline: 'where it works',
      heading: 'Built into the place.',
      intro: 'A permanent screen is part of the building. The content should feel like it belongs there too.',
      items: [
        {
          title: 'Hotels, restaurants and lobbies',
          text: 'Lobby and dining room walls with calm, looping 3D scenes that guests stop to watch. Not ads.',
          image: { src: img('architecture-hospitality'), alt: 'A manta ray glides out of an LED wall into a bright luxury restaurant' },
        },
        {
          title: 'Residential and office towers',
          text: 'LED facades that give a tower its signature, and a 3D film that helps sell it before it is finished.',
          image: { src: img('architecture-towers'), alt: 'A falcon spreads its wings out of the LED corner of a white residential tower at golden hour' },
        },
        {
          title: 'Malls and public spaces',
          text: 'Atrium walls seen from every level, with a library of films that changes with the seasons.',
          image: { src: img('architecture-public'), alt: 'A blue whale swims out of a curved screen into a shopping mall atrium' },
        },
      ],
    },
    research: [RESEARCH.premium, RESEARCH.memory, RESEARCH.awareness, RESEARCH.share],
    method: {
      heading: 'How we make sure it lasts.',
      intro: 'A building screen plays every day for years. The content is planned like part of the architecture, not like a campaign.',
      steps: [
        { title: 'From the plans', text: "We work from the architect's plans and the screen specs, even before the building is finished.", image: { src: img('architecture-method-1'), alt: "The team works on the architect's plans in a site cabin" } },
        { title: 'CGI preview on the building', text: 'You see the content on the building in CGI before it plays. The same images help sell the project.', image: { src: img('architecture-method-2'), alt: "A CGI preview of the finished facade on a tablet, held up at the building site" } },
        { title: 'Day and night', text: 'Brightness and contrast set for daylight and for night, with local rules on brightness flagged to your team early.', image: { src: img('architecture-method-3'), alt: "The team sets the brightness of an LED facade at dusk from a rooftop" } },
        { title: 'A library, not a campaign', text: 'Calm loops and seasonal scenes, with new films added over time so the screen never feels old.', image: { src: img('architecture-method-4'), alt: "The team pins seasonal scenes on a moodboard wall in the studio" } },
      ],
      deliverables: [
        'A library of looping films',
        'CGI previews of the content on the building',
        'Day and night versions',
        'A refresh plan by season',
        "Files to the screen integrator's specs",
        'The rights to reuse the films',
      ],
    },
    faq: faqServices.architecture,
  },
];

export const serviceBySlug = (slug: ServiceSlug) => anamorphicServices.find((s) => s.slug === slug)!;
