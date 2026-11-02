/**
 * Home agence « / » : page « pont » (décision home-bridge, 28/09/2026). Elle ne vend ni les écrans ni les films
 * seuls : elle raconte le modèle KOSMO® (campagne 3DOOH, amplifiée par un film FOOH, soutenue si besoin par un stunt
 * OOH, relayée par la RP) avec deux portes d'entrée, 3DOOH et FOOH. Textes DÉMO ; H1 donné par Mehdi le 28/09 (« Unreal campaigns people stop for. »).
 */

export const home = {
  seoTitle: 'KOSMO®: anamorphic billboards, FOOH films and street stunts people stop for',
  seoDescription: 'KOSMO® builds anamorphic billboard campaigns (3DOOH) and amplifies them with FOOH films, street stunts and PR. One idea for the screen and for the feed. 150+ campaigns in 14 countries.',
  hero: {
    title: { demo: true, text: 'Unreal campaigns people stop for.', soft: 'people stop for.' },
    subtitle: { demo: true, text: 'We build anamorphic billboard campaigns and make them travel: a FOOH film for the feed, a stunt in the street when the launch calls for it, and the PR that keeps it going.' },
    secondary: { label: 'our work', href: '/work' },
  },
  /** Deux portes : la section Services, avec un titre et une intro propres à la home. */
  doors: {
    heading: { demo: true, text: 'Two ways in, one team.' },
    intro: { demo: true, text: 'Screens in your media plan? Start with a free 3D concept for them. Want the film people share? Start with FOOH. Either way, the same team builds both, and the best campaigns use both.' },
  },
  /**
   * Le modèle de campagne KOSMO® en trois couches (maquette Cofounder validée le 21/10/2026) : un dossier noir à onglets
   * (« Campaign ») qui range trois timbres (3DOOH, FOOH, PR), puis un appel discret à parler à Mehdi.
   * L'ancienne courbe en quatre couches (3DOOH, FOOH, stunt OOH, PR) est dans l'historique git (ReachCurve).
   */
  model: {
    overline: 'how a campaign works',
    heading: { demo: true, text: 'One idea, three layers of reach.' },
    intro: {
      demo: true,
      text: 'A screen reaches the people who walk past it. Everything we add after that reaches everyone else. This is how we build a campaign, from the media plan to the press.',
    },
    tab: 'Campaign',
    tickets: [
      { number: '01', title: '3DOOH', text: 'An anamorphic 3D moment built for every screen you book.', image: { src: '/images/home/layers/3dooh.jpg', alt: 'A giant billboard with a steel frame on a dark hill under a yellow sky' }, imageSide: 'bottom' },
      { number: '02', title: 'FOOH', text: 'The same idea filmed in real streets and cut for social.', image: { src: '/images/home/layers/fooh.jpg', alt: 'A giant black soda can on a dark hill under a yellow sky, filmed by two small figures' }, imageSide: 'top' },
      { number: '03', title: 'PR', text: 'Press and creators keep it climbing after the screen goes dark.', image: { src: '/images/home/layers/pr.jpg', alt: 'A giant folded newspaper on a dark hill under a yellow sky, pages flying' }, imageSide: 'bottom' },
    ] as const,
  },
  work: { heading: { demo: true, text: 'Screens and streets, recently.' } },
  /** Chiffres : films FOOH tramés intercalés entre les chiffres (proxies 360p muets de public/video/ascii). */
  numbers: [
    { src: '/video/ascii/porsche.mp4', label: 'Porsche, Paris (FOOH)' },
    { src: '/video/ascii/france-tv.mp4', label: 'France TV, Paris (FOOH)' },
    { src: '/video/ascii/squid-game.mp4', label: 'Netflix, Squid Game, Paris (FOOH)' },
    { src: '/video/ascii/maisons-du-monde.mp4', label: 'Maisons du Monde, Paris (FOOH)' },
  ],
  /** Carte du monde : un bouton vers les réalisations à la place du texte d'intro. */
  map: { cta: { label: 'our work', href: '/work' } },
};
