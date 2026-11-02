/**
 * Page /contact (« Work with us »), inspirée de la structure whycgi.media/brief : promesse de réponse,
 * trois canaux, « a good brief has five things », formulaire, bloc direct. Textes DÉMO ; faits confirmés :
 * concept gratuit en CTA secondaire (sans délai annoncé ni « statique »), email et numéro. Pas de durée de call ni de ville d'ancrage (05/10).
 */
import { contact } from './site';

export const contactPage = {
  seoTitle: 'Contact KOSMO®: send a brief or book a call',
  seoDescription: 'Send a brief, book a call or message us on WhatsApp. Reply within one working day, free concept for your screen.',
  overline: 'work with us',
  promise: { demo: true, text: 'Reply within one working day · free concept for your screen' },
  heading: 'Work with us.',
  intro: {
    demo: true,
    text: 'Send the brief, book a call, or message us on WhatsApp. Tell us what the moment needs to do and where it will run; we come back with questions, a first concept for your screen and a sense of scope.',
  },
  brief: {
    demo: true,
    overline: 'a good brief has',
    heading: 'Five things.',
    items: [
      {
        title: 'The screen',
        text: 'Where it is, its layout (corner or flat), its real size and a photo from where people see it. If you have not booked yet, the cities you are thinking of.',
      },
      {
        title: 'The job of the moment',
        text: 'A launch, a brand moment, a product hero, an event. The job decides the format: 3D billboard, FOOH film, or both.',
      },
      {
        title: 'Where it runs',
        text: 'The screens in the plan and the media owner, plus the social channels where the film will be posted. Placements decide the versions, ratios and languages.',
      },
      {
        title: 'Dates and media budget',
        text: 'A live date and a rough range let us propose the right size of job instead of guessing. We need 3 to 4 weeks from the approved brief.',
      },
      {
        title: 'References',
        text: 'Two or three moments you like, from anyone, and one you do not. Taste is faster to show than to describe.',
      },
    ],
  },
  form: {
    overline: 'send a brief',
    heading: 'Tell us about the screen.',
    intro: { demo: true, text: 'Two short steps. We come back with questions, a first idea for your screen and a sense of scope.' },
    submit: 'send the brief',
  },
  direct: {
    overline: 'direct',
    email: contact.email,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    studio: 'Remote team · worldwide',
  },
};
