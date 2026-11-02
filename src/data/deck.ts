/** Page /deck : le pitch en trois minutes pour les décideurs. Textes DÉMO sauf faits confirmés. Une image par slide. */
export interface Slide {
  demo: boolean;
  kicker: string;
  title: string;
  points: string[];
  image: { src: string; alt: string };
  /** Remplace l'image par le comparateur avant / après de « the shift » (vidéos DOOH / 3DOOH). */
  compare?: boolean;
  tone: 'light' | 'dark' | 'acid';
}

export const deck = {
  overline: 'the 3-minute deck',
  heading: { demo: true, text: 'KOSMO® in three minutes.' },
  intro: { demo: true, text: 'For the decision-maker who wants the whole story before a call: what 3DOOH is, what it changes, and what it costs to try. Nothing.' },
  slides: [
    {
      demo: true,
      kicker: 'who we are',
      title: 'The studio that makes screens worth filming.',
      points: ['3DOOH and FOOH, one team', '150+ campaigns on 750+ screens in 14 countries', 'We can buy the media too: your budget under control, screens picked for the idea'],
      image: { src: '/images/posters/new-york.jpg', alt: 'A corner screen moment in New York' },
      tone: 'dark',
    },
    {
      demo: false,
      kicker: 'the problem',
      title: "Your DOOH gets impressions. It doesn't get shared.",
      points: ['A flat visual on a screen is wallpaper.', 'Nobody films wallpaper.'],
      image: { src: '/images/work/indoor-billboard.avif', alt: 'A flat campaign on an indoor screen' },
      compare: true,
      tone: 'light',
    },
    {
      demo: true,
      kicker: 'what 3dooh is',
      title: 'Your billboard, in 3D.',
      points: ['3D creative for the screens you already book', 'Corner screens or flat ones, no special hardware', 'Same media buy, zero extra spend'],
      image: { src: '/images/posters/dubai.jpg', alt: 'A car launch stepping out of a screen in Dubai' },
      tone: 'light',
    },
    {
      demo: true,
      kicker: 'three formats',
      title: 'Three ways to break the screen.',
      points: ['The corner screen: the iconic illusion', 'The flat screen: works on most of what brands book', 'The social version: the one that travels'],
      image: { src: '/images/posters/tokyo.jpg', alt: 'A character on a corner screen in Tokyo' },
      tone: 'acid',
    },
    {
      demo: true,
      kicker: 'proof',
      title: 'Every screen, documented.',
      points: ['Case studies with the screen, the city, the media owner and the results', 'Behind the scenes, from first sketch to the street', 'What brand and media teams say'],
      image: { src: '/images/posters/paris.jpg', alt: 'A retail screen campaign in Paris' },
      tone: 'light',
    },
    {
      demo: false,
      kicker: 'how we work',
      title: 'From your media plan to a moment people film.',
      points: ['Brief, concept, production, delivery, amplification', '3 to 4 weeks from approved brief to delivery, two rounds of changes included'],
      image: { src: '/images/process/briefing.avif', alt: 'The KOSMO team at work' },
      tone: 'dark',
    },
    {
      demo: false,
      kicker: 'for agencies and media owners',
      title: 'You stay client-facing. We build the 3D.',
      points: ['White label, under your name', 'Your client feedback routed through you'],
      image: { src: '/images/posters/london.jpg', alt: 'A landmark screen in London' },
      tone: 'light',
    },
    {
      demo: true,
      kicker: 'start free',
      title: 'A concept for your screen, on us.',
      points: ['Tell us about the campaign', 'We come back with a concept for your screen', 'Then we talk, if you want to'],
      image: { src: '/images/posters/brussels.jpg', alt: 'A facade dressed in gold in Brussels' },
      tone: 'acid',
    },
  ] satisfies Slide[],
};
