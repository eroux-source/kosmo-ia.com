/**
 * Témoignages façon message privé : un simple remerciement, avec la marque et le logo.
 * DÉMO : les citations sont des exemples à remplacer par de vrais messages reçus, l'attribution à
 * chaque marque doit être confirmée avant mise en ligne. Le logo vient de src/assets/logos/brands/.
 */
export interface Testimonial {
  demo: boolean;
  quote: string;
  /** Marque (doit exister dans src/data/site.ts → brands). */
  company: string;
  /** Prénom ou fonction de la personne qui a écrit le message. */
  author: string;
  role: string;
}

export const testimonials = {
  overline: 'what clients say',
  heading: { demo: true, text: 'The messages we get once the screen goes live.', soft: 'once the screen goes live.' },
  items: [
    {
      demo: true,
      quote: 'Thank you, the team loves it',
      company: 'Netflix',
      author: 'Brand marketing',
      role: 'EMEA',
    },
    {
      demo: true,
      quote: 'Really great work, thanks a lot',
      company: 'Uber Eats',
      author: 'Social lead',
      role: 'UK',
    },
    {
      demo: true,
      quote: 'Thanks again, it looks amazing',
      company: 'Maisons du Monde',
      author: 'Brand content',
      role: 'HQ',
    },
    {
      demo: false,
      quote: 'Congratulations on a job exceptionally well done',
      company: 'Miele',
      author: 'Nathalie Dubois',
      role: 'Head of Brand Marketing, Media & Comms Western Europe',
    },
    {
      demo: true,
      quote: 'Great job, thank you',
      company: 'Zalando',
      author: 'Campaign lead',
      role: 'DACH',
    },
  ] satisfies Testimonial[],
};
