/**
 * Section « services de la 3D anamorphique » (/3dooh et pages villes), qui remplace les trois formats (corner, flat,
 * social) le 22/10/2026 à la demande de Mehdi : un service par lieu où la 3D anamorphique se montre, chacun avec sa page
 * (/3dooh/<service>, src/data/anamorphic-services.ts). Illustrations : photos générées
 * (Higgsfield, Nano Banana 2.1, validées par Mehdi le 22/10/2026 ; sources dans docs/exports/service-cards).
 */

export interface AnamorphicService {
  demo: boolean;
  slug: 'billboards' | 'in-store' | 'events' | 'architecture';
  title: string;
  text: string;
  /** Photo du bas de la case (5:4). */
  image: { src: string; alt: string };
  /** Destination de la case : la page du service (/3dooh/<service>). */
  href: string;
}

export const formats = {
  overline: 'anamorphic 3D',
  heading: { demo: true, text: 'One 3D idea, four places to show it.' },
  intro: {
    demo: true,
    text: 'Anamorphic 3D works wherever there is a screen and people in front of it: in the street, in the shop, on stage and on the building itself.',
  },
  items: [
    {
      demo: true,
      slug: 'billboards',
      title: 'Anamorphic billboards',
      text: 'The DOOH screens in your media plan, in the street, in stations and malls, turned into a 3D moment people film.',
      image: { src: '/images/formats/service-billboards.webp?v=2', alt: 'A corner billboard among skyscrapers: a tiger leaps out of the screen over the avenue' },
      href: '/3dooh/billboards',
    },
    {
      demo: true,
      slug: 'in-store',
      title: 'In-store & retail',
      text: 'Shop windows, in-store screens and mall columns that stop shoppers before they reach the shelf.',
      image: { src: '/images/formats/service-in-store.webp', alt: 'A shop window screen: a peacock spreads its tail out of the window onto the facade' },
      href: '/3dooh/in-store',
    },
    {
      demo: true,
      slug: 'events',
      title: 'Events & experiential',
      text: 'LED walls for launches, stands and festivals. A 3D moment the whole room films and posts.',
      image: { src: '/images/formats/service-events.webp', alt: 'A festival LED wall: a whale breaches out of the screen above the crowd' },
      href: '/3dooh/events',
    },
    {
      demo: true,
      slug: 'architecture',
      title: 'Architecture & real estate',
      text: 'Media facades, lobbies and permanent LED walls, with 3D content made for the building.',
      image: { src: '/images/formats/service-architecture.webp?v=2', alt: 'A luxury restaurant: tropical flowers grow out of the LED wall above the bar' },
      href: '/3dooh/architecture',
    },
  ] satisfies AnamorphicService[],
};
