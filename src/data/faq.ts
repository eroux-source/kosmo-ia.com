/**
 * FAQ. Base : questions de /reference, réponses réécrites sans jargon ni tirets pour des responsables marque.
 * `demo: true` = réponse écrite ou reformulée pour la démo.
 */
export interface FaqItem {
  question: string;
  answer: string;
  demo?: boolean;
}

export const faq = {
  overline: 'Faq',
  heading: 'Everything you need to know.',
  card: {
    title: 'Still have a question?',
    text: "Can't find your answer? Send us your brief and we'll come back with a first direction.",
  },
  items: <FaqItem[]>[
    {
      demo: true,
      question: 'Do I need an existing DOOH campaign to work with you?',
      answer:
        "Not necessarily, but it's the ideal starting point. If you've already booked screens, we plug into your plan and turn flat placements into 3D moments, with no extra media spend. If you're planning a campaign from scratch, we can help shape it too.",
    },
    {
      demo: true,
      question: 'Does an anamorphic billboard cost extra on top of my media budget?',
      answer:
        "The creative is a separate line, but it never requires you to buy more media. You're making the impressions you've already paid for work harder: the same screens start generating organic reach on their own.",
    },
    {
      demo: true,
      question: 'How long does a project take?',
      answer:
        '3 to 4 weeks from the approved brief to delivery, with two rounds of changes included. We build around your media calendar, not the other way around. If your dates are already fixed, tell us the deadline and we confirm upfront.',
    },
    {
      demo: true,
      question: 'Will it work on my screens?',
      answer:
        "Yes. We create both flat and 3D versions and adapt them to every screen and media owner in your plan, whether that's one flagship billboard or dozens across markets. The technical back-and-forth is our job, not yours.",
    },
    {
      demo: false,
      question: 'Do you handle media buying?',
      answer:
        "Yes. If your screens are already booked, we plug into your plan. If not, we can buy the media ourselves: you keep control of the budget, and we pick screens that suit the idea instead of bending the idea to the screens.",
    },
    {
      demo: false,
      question: 'How much does an anamorphic billboard campaign cost?',
      answer:
        'There is no fixed price per asset. Every campaign is quoted after a short brief, because the price depends on the resizing, how many screens and formats the idea runs on, and how far you want the moment to travel on social.',
    },
    {
      demo: true,
      question: 'Who owns the films?',
      answer: 'You do. Once the project is paid, the films we deliver are yours to reuse on other screens and channels. We only keep the right to show the work in our portfolio, unless you prefer otherwise.',
    },
    {
      demo: true,
      question: 'Is it AI?',
      answer:
        'Ideas and early visuals can use AI. The final 3D is built by our own team, because a real screen with real people in front of it does not forgive approximation.',
    },
    {
      demo: true,
      question: 'Do I need a corner screen?',
      answer:
        'No. Corner screens give the strongest illusion, but the effect also works on flat screens, which is most of what brands book. Send us the screen and we tell you what fits.',
    },
    {
      demo: false,
      question: 'Which countries do you work in?',
      answer: 'Wherever your screens are. Recent work in Paris, Dubai, London, Berlin, Milan, Seoul and New York, and we deliver to 14 countries so far.',
    },
    {
      demo: false,
      question: 'Do you work white label for agencies and media owners?',
      answer:
        'Yes. You stay client-facing, we produce in the background: 3 to 4 weeks from the approved brief to delivery, two rounds of changes included. Details on the partners page.',
    },
    {
      demo: true,
      question: 'What if the media owner rejects the file?',
      answer:
        'We deliver exactly what each media owner asks for and handle any resubmission ourselves. It rarely happens, because we check their requirements before we build anything.',
    },
  ],
};

/**
 * FAQ de /3dooh en version générale (22/10/2026, demande de Mehdi) : la 3D anamorphique sur tout écran, pas seulement
 * la publicité DOOH. Reprend telles quelles les réponses qui valent pour tous les projets ; les questions « régie » et
 * « budget média » restent dans `faq` (pages villes, future page billboards).
 */
const keep = (q: string) => faq.items.find((item) => item.question === q)!;
export const faqAnamorphic = {
  card: {
    title: 'Still have a question?',
    text: "Can't find your answer? Tell us about the place and the idea, and we come back to you within one working day.",
  },
  items: <FaqItem[]>[
    {
      question: 'What is anamorphic 3D?',
      answer:
        'A film built for one screen and the spot people see it from. From there, the perspective makes objects seem to leave the screen and step into the street, the shop or the room. It is the effect behind the 3D billboards people film and share.',
    },
    {
      question: 'Where can anamorphic 3D be shown?',
      answer:
        'On almost any LED screen that people see from a predictable spot: billboards and DOOH networks, shop windows and in-store screens, stage and event walls, media facades and lobbies.',
    },
    {
      question: 'Do I need a special screen?',
      answer:
        'No. Corner screens give the strongest illusion, but flat, curved and column screens work too. Send us the screen, its size and a photo from where people stand, and we tell you what fits.',
    },
    keep('How long does a project take?'),
    {
      question: 'How much does it cost?',
      answer:
        'There is no fixed price. Every project is quoted after a short brief, because the price depends on the idea, how many screens and formats it runs on, and the resizing each one needs.',
    },
    {
      question: 'Can you find the screens for us?',
      answer:
        'Yes. If you already have a screen, we build for it. If not, we can book the media ourselves: you keep control of the budget, and we pick screens that suit the idea.',
    },
    keep('Who owns the films?'),
    keep('Is it AI?'),
    keep('Which countries do you work in?'),
    keep('Do you work white label for agencies and media owners?'),
  ],
};

/**
 * FAQ des pages de service de la 3D anamorphique (src/data/anamorphic-services.ts) : les craintes du lecteur type de
 * chaque service d'abord, puis les questions communes (prix, délai, droits). Écrites sans validation de Mehdi.
 */
const price = faqAnamorphic.items.find((item) => item.question === 'How much does it cost?')!;
export const faqServices = {
  billboards: <FaqItem[]>[
    {
      question: 'Which screens can show a 3D billboard?',
      answer:
        'Corner screens give the strongest illusion, which is why the famous ones are in Times Square, Shinjuku and Piccadilly. Flat and curved DOOH screens work too, with the right framing. Send us the screen and a photo from where people stand, and we tell you what fits.',
    },
    {
      question: 'Will the media owner accept the film?',
      answer:
        'We build from the media owner\'s specs from day one: resolution, frame rate, file format, safe zones and running time. You get test files before the campaign goes live, so there is no surprise on the day.',
    },
    faqAnamorphic.items.find((item) => item.question === 'Can you find the screens for us?')!,
    price,
    keep('How long does a project take?'),
    {
      question: 'Does it work on social media too?',
      answer:
        'Yes, that is where most of the reach comes from. People film the screen and post it; we also deliver cuts of the film for your own channels.',
    },
    keep('Who owns the films?'),
  ],
  'in-store': <FaqItem[]>[
    {
      question: 'Does anamorphic 3D work on a small in-store screen?',
      answer:
        'Yes, if the film is built for that screen and for where people see it from. Small screens are seen up close, so we design the depth for a short distance. We tell you upfront if a screen is too small for the effect.',
    },
    {
      question: 'Can one film run in all our stores?',
      answer:
        'Yes. We make one master film and resize it for each screen format in your network, with one file per format and the specs your screen provider needs.',
    },
    {
      question: 'Do we need new screens?',
      answer:
        'Not always. We start from the screens you already have. If you are installing new ones, we tell you which shapes and places give the strongest effect: corners and columns beat a single flat screen.',
    },
    price,
    keep('How long does a project take?'),
    keep('Who owns the films?'),
  ],
  events: <FaqItem[]>[
    {
      question: 'Does the 3D effect work for a whole audience?',
      answer:
        'Anamorphic 3D is strongest from one point of view, so we set it where most people stand: the middle of the room, the end of the aisle, the camera position. From elsewhere, the film still reads as a strong piece of motion.',
    },
    {
      question: 'Can you work with our event agency and AV provider?',
      answer:
        'Yes, that is the usual setup. We take the wall\'s resolution, pixel pitch and playback system from them, and deliver files ready to load.',
    },
    {
      question: 'Our event date cannot move. Can you make it?',
      answer:
        'We plan backwards from your date: 3 to 4 weeks from the approved brief, with a test on the real wall before the day whenever the venue allows it. Tell us the date first, and we confirm upfront.',
    },
    price,
    {
      question: 'Do we get content for social after the event?',
      answer: 'Yes. We deliver clean cuts of the film for your channels, and the videos filmed by the crowd do the rest.',
    },
    keep('Who owns the films?'),
  ],
  architecture: <FaqItem[]>[
    {
      question: 'How is content for a building different from an ad?',
      answer:
        'It runs for months or years, so it has to fit the architecture and still feel right on the hundredth view. We design calm loops and a library of scenes rather than one campaign.',
    },
    {
      question: 'Can you design for a building that is not finished yet?',
      answer:
        "Yes. We work from the architect's plans and the screen specs, and show the content on the future building in CGI, which also helps sell the project.",
    },
    {
      question: 'Can the content change over time?',
      answer: 'Yes. We plan a library of films and add new ones by season or event, so the screen never feels old.',
    },
    {
      question: 'Which screens work best on a building?',
      answer:
        'Corners, curves and walls with depth around them give the strongest effect. If the screen is not installed yet, we advise on its shape and position before it is built.',
    },
    price,
    keep('Who owns the films?'),
  ],
};
