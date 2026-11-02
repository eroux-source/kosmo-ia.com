/**
 * Pages services construites sur le gabarit de /3dooh (audit §4D) : FOOH.
 * Textes DÉMO, sans jargon ; images = extraits des vidéos de la référence.
 */
import { bunny, process as dooohProcess, type ProcessData } from './3dooh';
import type { FaqItem } from './faq';
import type { Stat } from './stats';
import type { MapCity } from './world';

export interface Shape {
  title: string;
  text: string;
  image: { src: string; alt: string };
  /** Projet FOOH à montrer à la place de l'image : sa vidéo principale, cliquable vers la page projet. */
  project?: string;
}

interface CompareSide {
  label: string;
  src: string;
  video?: { src: string; poster: string };
}

export interface Service {
  slug: 'fooh';
  category: 'fooh';
  demo: boolean;
  name: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  subtitle: string;
  chips: { icon: string; label: string }[];
  video: { src: string; poster: string };
  definition: { heading: string; text: string; image: { src: string; alt: string } };
  /** Avant / après à côté de la définition : la rue filmée, puis le film fake out-of-home (comparateur lenticulaire). */
  compare?: { before: CompareSide; after: CompareSide };
  shapes: Shape[];
  faq: FaqItem[];
  /** Frise « how we work » avec les textes de la discipline (structure et délais identiques au 3DOOH). */
  process?: ProcessData;
  /** Page /fooh refaite le 22/10/2026 : chiffres, carte des villes, sélection de projets, articles du journal. */
  numbers?: { overline: string; items: Stat[] };
  map?: { overline: string; heading: string; intro: string; cities: MapCity[] };
  work?: { heading: string; limit: number };
  shapesHeading?: string;
  guides?: { overline: string; heading: string; slugs: string[] };
  secondary?: { label: string; href: string };
}

export const services: Service[] = [
  {
    slug: 'fooh',
    category: 'fooh',
    demo: true,
    name: 'FOOH & Mixed Reality',
    seoTitle: 'FOOH agency: fake out-of-home & mixed reality | KOSMO®',
    seoDescription: 'Fake out-of-home (FOOH) and mixed reality films: your product at an impossible scale in a real street, cut for social. 65 films, 41 brands, 9 countries.',
    headline: 'Fake out-of-home films people stop to share.',
    subtitle: 'FOOH, short for fake out-of-home, puts your product into real footage of a real street, at a scale nobody can ignore. Mixed reality, filmed on location, built in 3D and cut for the feed.',
    chips: [
      { icon: 'world', label: '65 films in 9 countries' },
      { icon: 'clock', label: 'Live in 3 to 4 weeks' },
    ],
    secondary: { label: 'our work', href: '/work?category=fooh' },
    video: bunny('85eac8ca-b545-438f-bb9f-6092770df9a8', 'berlin'),
    definition: {
      heading: 'What is FOOH? A real street, an impossible product.',
      text: 'Fake out-of-home is mixed reality made for brands. We film a real place, build your product in 3D and blend the two so well that people wonder whether it happened. No permit, no installation, no media buy: the film is made for social, it travels on its own, and the press picks it up. Paired with a 3D billboard, it reaches everyone who never walked past the screen.',
      image: { src: '/images/posters/berlin.jpg', alt: 'A FOOH film on a station platform in Berlin' },
    },
    compare: {
      before: { label: 'Real street', src: '/images/fooh-compare/before.jpg', video: { src: '/video/fooh-compare-before.mp4', poster: '/images/fooh-compare/before.jpg' } },
      after: { label: 'With FOOH', src: '/images/fooh-compare/after-red.jpg', video: { src: '/video/fooh-compare-after-red.mp4', poster: '/images/fooh-compare/after-red.jpg' } },
    },
    numbers: {
      overline: 'fooh in numbers',
      items: [
        { value: 65, label: 'fake out-of-home films', demo: false },
        { value: 41, label: 'brands', demo: false },
        { value: 9, label: 'countries', demo: false },
        { value: 3, suffix: 'B+', label: 'earned and owned media', demo: false },
      ],
    },
    map: {
      overline: 'worldwide',
      heading: 'Filmed from Paris to Seoul.',
      intro: 'Mixed reality works wherever there is a street worth filming. 65 FOOH films for 41 brands, from Paris and Milan to New York, Los Angeles, Dubai, Seoul, Bangkok and Abidjan.',
      cities: [
        { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, labelSide: 'bottom' },
        { name: 'New York', lat: 40.7128, lon: -74.006, labelSide: 'right' },
        { name: 'Niagara Falls', lat: 43.0962, lon: -79.0377, labelSide: 'top' },
        { name: 'Paris', lat: 48.8566, lon: 2.3522, labelSide: 'top' },
        { name: 'Valladolid', lat: 41.6523, lon: -4.7245, labelSide: 'left' },
        { name: 'Milan', lat: 45.4642, lon: 9.19, labelSide: 'right' },
        { name: 'Rome', lat: 41.9028, lon: 12.4964, labelSide: 'bottom' },
        { name: 'Abidjan', lat: 5.36, lon: -4.0083, labelSide: 'bottom' },
        { name: 'Dubai', lat: 25.2048, lon: 55.2708, labelSide: 'bottom' },
        { name: 'Bangkok', lat: 13.7563, lon: 100.5018, labelSide: 'bottom' },
        { name: 'Seoul', lat: 37.5665, lon: 126.978, labelSide: 'top' },
      ],
    },
    work: { heading: 'Fake out-of-home, for real brands.', limit: 12 },
    shapesHeading: 'Four ways to use mixed reality.',
    guides: {
      overline: 'from the journal',
      heading: 'Everything about fake out-of-home.',
      slugs: ['what-is-fooh', 'fake-out-of-home-examples', 'cgi-ads'],
    },
    shapes: [
      { title: 'Screen extension', text: 'The 3D moment leaves the billboard and continues on the street. The natural companion of a 3DOOH campaign.', image: { src: '/images/posters/new-york.jpg', alt: 'A character stepping out of a corner screen in New York' }, project: 'france-tv' },
      { title: 'Product takeover', text: 'A giant product, a landmark, a real crowd reacting. The classic FOOH, made to look plausible enough to be filmed twice.', image: { src: '/images/posters/london.jpg', alt: 'A giant product on a landmark screen in London' }, project: 'rhode' },
      { title: 'Launch stunt', text: 'A one-off scene timed with a release: a building unboxed, a monument wearing the product, a fleet arriving in town.', image: { src: '/images/posters/dubai.jpg', alt: 'A launch moment in Dubai' }, project: 'squid-game-i' },
      { title: 'Series and retainers', text: 'A monthly rhythm of scenes for brands that want the format as a channel, not a one-shot.', image: { src: '/images/posters/brussels.jpg', alt: 'A facade takeover in Brussels' }, project: 'maisons-du-monde-i' },
    ],
    process: {
      ...dooohProcess,
      heading: { demo: true, text: 'From a brief to a film people share.' },
      intro: { demo: true, text: 'You bring the product and the city. We bring the idea, the shoot, the 3D and the cut, and we keep it simple for you from the first call to the day it goes out.' },
      timeline: { start: 'Approved brief', end: 'Live on social' },
      steps: [
        { ...dooohProcess.steps[0], title: 'Tell us about the launch', text: 'Your product, your city, your date. We look at the brief and tell you which street, which scale and which twist will make people stop scrolling.', outcome: 'A clear answer on what is possible' },
        { ...dooohProcess.steps[1], title: 'We find the scene people will share', text: 'A giant product is not enough. We write the moment: where it sits, what it does, who reacts, and why someone sends it to a friend.', outcome: 'A concept and a first frame of the scene' },
        { ...dooohProcess.steps[2], title: 'We film the street and build the 3D', text: 'We shoot the real location the way the scene needs it, then build and place the 3D so it belongs there: light, reflections, people, the shake of the phone.', outcome: 'Your film, looking like it was caught on the spot' },
        { ...dooohProcess.steps[3], title: 'We cut it for every platform', text: 'One film, every format: 9:16, 1:1 and 4:5, the lengths and captions each platform needs, in every language of the campaign.', outcome: 'Ready-to-post files for every channel' },
        { ...dooohProcess.steps[4], title: 'The film goes to work', text: 'We seed it, watch it travel and feed the relays: reaction videos, press, creators, and the screen version if you have media booked.', outcome: 'Organic reach, and a bridge to your screens' },
      ],
    },
    faq: [
      { demo: true, question: 'What does FOOH mean?', answer: 'FOOH stands for fake out-of-home: a film where a product or a scene that does not physically exist is placed into real footage of a street, a landmark or a building. The out-of-home part is the setting, the fake part is the 3D.' },
      { demo: true, question: 'Is FOOH the same as mixed reality?', answer: 'Mixed reality is the technique: real footage and 3D blended so they read as one shot. FOOH is what brands do with it: a fake out-of-home moment, designed to be shared on social and picked up by the press.' },
      { demo: true, question: 'What is the difference between FOOH and a 3D billboard?', answer: 'A 3D (anamorphic) billboard plays on a real screen that people see in the street. A FOOH film never runs on a screen: it lives on social. Many campaigns use both, the billboard for the street and the FOOH film for everyone else.' },
      { demo: true, question: 'Is FOOH misleading?', answer: 'It is a creative format, like a commercial with visual effects. We recommend saying so in the caption. People engage with the craft and the surprise, not with a claim that it physically happened.' },
      { demo: true, question: 'Do you film the street yourselves?', answer: 'Yes, or we work from footage you provide. We film the place the way the scene needs it, then build and place the 3D so it belongs there.' },
      { demo: false, question: 'How long does a FOOH film take?', answer: '3 to 4 weeks from the approved brief to delivery, two rounds of changes included.' },
      { demo: true, question: 'How much does a FOOH film cost?', answer: 'There is no fixed price. Every film is quoted after a short brief, because the price depends on the scene, the number of shots, the formats and the languages it is cut in.' },
      { demo: true, question: 'Where can you film?', answer: 'Anywhere with a street worth filming. We have made fake out-of-home films in Paris, Milan, Rome, New York, Los Angeles, Dubai, Seoul, Bangkok and Abidjan, in 9 countries so far.' },
      { demo: true, question: 'Can it become a 3D billboard campaign?', answer: 'Yes. The same 3D assets are adapted to the screens in your plan, corner or flat, and the mixed reality film becomes the social side of the campaign.' },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
