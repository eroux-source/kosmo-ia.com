/** /about : studio, équipe (référence), disciplines. Manifeste DÉMO. Une seule société, pas de rattachement à un lieu. */
export const about = {
  seoTitle: 'About KOSMO®: the anamorphic billboard and FOOH studio',
  seoDescription: 'KOSMO® is an anamorphic billboard (3DOOH) and FOOH studio. We build 3D ads for the screens brands book and CGI films for the streets they want to own, wherever the campaign runs.',
  overline: 'about',
  headline: { demo: true, text: 'A studio built for screens that get filmed.' },
  manifesto: {
    demo: true,
    paragraphs: [
      'KOSMO® started with mixed reality: brands dropped into real cities at an impossible scale, cut for social. Those films reached 3B+ earned and owned media and taught us one thing. People share what surprises them in a real place.',
      'Anamorphic billboards, or 3DOOH, are that idea on a screen that is already paid for. We turn the billboards you book into scenes worth filming, and those scenes into content that travels far beyond the street.',
      'Founded in September 2024 by Eugène Roux and Mehdi Benkaci. One team, wherever your screens are.',
    ],
    image: { src: '/images/about/flag.jpg', alt: 'A KOSMO® flag' },
  },
  /**
   * Fondateurs. Sources : CB News, « Faire-part de naissance : Kosmo CGI », Isadora Lorient, 16/09/2024
   * (Eugène ex-Redpill Media, Mehdi ex-dentsu, agence FOOH, une vingtaine de clients au lancement) ; Mehdi (28/09/2026) :
   * rencontre en master de publicité, Eugène côté sales, Mehdi côté créatif. Rôles : ceux de la référence (team).
   */
  founders: {
    overline: 'founders',
    heading: { demo: false, text: 'Meet the founders.' },
    intro: {
      demo: false,
      text: 'Eugène and Mehdi met at school and started KOSMO® in September 2024 with one firm belief: the future of advertising is immersive, and closer to the people it reaches. Brand love first.',
    },
    people: [
      {
        name: 'Mehdi Benkaci',
        role: 'Co-founder, CEO',
        image: 'mehdi',
        photo: { src: '/images/about/mehdi.jpg', alt: 'Mehdi Benkaci holding a t-shirt that reads ceo of f*cking good ads' },
        bio: 'The creative side. Ex-dentsu.',
        linkedin: 'https://www.linkedin.com/in/mehdibenkaci',
      },
      {
        name: 'Eugène Roux',
        role: 'Co-founder, Head of Accounts',
        image: 'eugene',
        photo: { src: '/images/about/eugene.jpg', alt: 'Eugène Roux, portrait' },
        bio: 'The business side. Ex-Redpill Media.',
        linkedin: 'https://www.linkedin.com/in/eug%C3%A8ne-roux/',
      },
    ],
  },
  /** L’annonce de création dans la presse (CB News, 16/09/2024). Citation traduite, original conservé. */
  press: {
    demo: false,
    overline: 'in the press',
    source: 'CB News',
    title: 'Faire-part de naissance : Kosmo CGI',
    author: 'Isadora Lorient',
    date: '16 September 2024',
    href: 'https://www.cbnews.fr/conseil/faire-part-naissance-kosmo-cgi',
    image: { src: '/images/about/founders-cbnews.jpg', alt: 'Mehdi Benkaci and Eugène Roux in the KOSMO® office, in front of the KOSMO® logo on a concrete pillar' },
    summary:
      'CB News announced the launch of KOSMO® CGI, a French agency specialised in FOOH films, founded by Eugène Roux (formerly Redpill Media) and Mehdi Benkaci (formerly dentsu). Around twenty clients at launch, including Nestlé, Pantene, Bolero, Starship, Gucci, Nike, UFC, Proman and UKG.',
    quote: {
      text: 'Brands have understood that FOOH is not just a striking visual experience. It is a unique lever for strong engagement and millions of views.',
      original: 'Les marques ont bien compris que le FOOH ne se contente pas d’être une expérience visuelle marquante. C’est un levier unique pour générer un engagement fort et des millions de vues.',
      author: 'The founders, quoted by CB News',
    },
  },
  /** Section « Our services » (sur le modèle « Five disciplines, one team » de whycgi). */
  disciplines: {
    overline: 'our services',
    heading: { demo: true, text: 'Two disciplines, one team.' },
    intro: { demo: true, text: 'The same craft, two ways into it. Every project starts with the screen or the street your brand will live on.' },
    items: [
      { demo: true, number: '01', title: 'Anamorphic 3D', href: '/3dooh', text: 'Your brand in anamorphic 3D on any screen: billboards, shop windows, stages and facades, each built for the exact shape of the screen.', tags: ['Billboards', 'Retail', 'Events', 'Architecture'], image: { src: '/images/services/anamorphic-3d-times-square.jpg', alt: 'An anamorphic 3D motorbike riding out of a corner screen in Times Square, New York' } },
      { demo: true, number: '02', title: 'FOOH & Mixed Reality', href: '/fooh', text: 'Your product at giant scale in real footage of your city, built for the feed. Where every screen campaign goes to travel.', tags: ['Social-first', 'Real streets', 'Launch stunts'], image: { src: '/images/fooh/maisons-du-monde-i-wide.jpg', alt: 'Giant red Christmas baubles by Maisons du Monde at the foot of the Eiffel Tower, Paris (FOOH)' } },
    ],
    partner: { demo: true, title: 'Agencies and media owners', href: '/partners', text: 'White-label production: you stay client-facing, we build the 3D.' },
  },
};
