/**
 * /partners : marque blanche pour agences, régies et revendeurs.
 * Conditions confirmées : pas de prix fixe par asset (devis selon resizing et nombre d'écrans), 3 à 4 semaines, 2 rounds.
 */
import type { FaqItem } from './faq';

export const partners = {
  seoTitle: 'White-label anamorphic billboard production for agencies | KOSMO®',
  seoDescription: 'KOSMO® produces anamorphic 3D billboard campaigns in white label for agencies, media owners and resellers: you stay client-facing, we build the 3D. Quote within 24h.',
  overline: 'partners · white label',
  headline: { demo: true, text: 'You stay client-facing. We build the 3D.' },
  subtitle: {
    demo: true,
    text: 'For agencies, media owners and resellers who want to sell 3D billboards without building a 3D studio. Your brand on the deck, our team on the work.',
  },
  audiences: {
    demo: true,
    items: [
      { title: 'Agencies', text: 'Add 3D moments to your media recommendations. We produce under your name and join client calls only if you want us to.', image: { src: '/images/partners/audience-agencies.webp', alt: 'A perfume bottle bursting out of a curved corner screen in New York' } },
      { title: 'Media owners', text: 'Sell your corner and flat screens with a 3D creative offer attached. We already know your requirements, so files are approved the first time.', image: { src: '/images/partners/audience-media-owners.webp', alt: 'A chrome sphere inside a corner screen in New York' } },
      { title: 'Resellers', text: 'A production partner for the markets you cover: your time zone, your languages, fast turnaround, one point of contact.', image: { src: '/images/partners/audience-resellers.webp', alt: 'A golden falcon flying out of a curved mall screen in Riyadh' } },
    ],
  },
  /** Conditions. Pas de prix affiché : pas de prix fixe par asset (décision « partner-price », 05/10). */
  terms: {
    demo: false,
    overline: 'terms',
    items: [
      { value: '3 to 4', label: 'weeks from approved brief to delivery' },
      { value: '2 rounds', label: 'of changes included' },
      { value: '24h', label: 'to get a quote', demo: true },
    ],
  },
  deliverables: {
    demo: true,
    heading: 'What a white-label project includes',
    items: ['A 3D film built for the screen', 'A flat version for the rest of the network', 'Every screen in the plan prepared and delivered', 'A key visual and a social cut', 'Your name on everything, NDA by default'],
  },
  process: {
    demo: true,
    heading: 'How it works',
    steps: [
      { title: 'Send the screen', text: 'Media owner, screen, dates. We confirm what is possible and send a quote within 24h.' },
      { title: 'Concept', text: 'An idea and a first visual of the screen, under your name if you prefer.' },
      { title: 'Build', text: '3 to 4 weeks, two rounds of changes, your client feedback routed through you.' },
      { title: 'Delivery', text: 'Files exactly as the media owner needs them, submitted by you or by us.' },
    ],
  },
  faq: [
    { demo: false, question: 'Do you work white label?', answer: 'Yes. You stay client-facing, we produce in the background: 3 to 4 weeks from the approved brief to delivery, two rounds of changes included.' },
    { demo: true, question: 'Will you contact our client?', answer: 'Never without you. Communication goes through your team; we can join calls as your production partner if that helps.' },
    { demo: true, question: 'Can we show the work in our portfolio?', answer: 'Yes, as your project. We only publish white-label work with your written agreement.' },
    { demo: true, question: 'What does the price depend on?', answer: 'The number of screens and formats, how complex the 3D is, and the deadline. Send us a screen and a date and you get a quote within 24h.' },
  ] satisfies FaqItem[],
  form: { overline: 'partner enquiry', heading: { demo: true, text: 'Send us a screen and a deadline.' }, text: 'We reply within one working day with what is possible and a price.' },
};
