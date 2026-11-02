/**
 * Mentions légales et politique de confidentialité, rédigées en DÉMO (à valider par toi ou un conseil).
 * Faits confirmés : KOSMO CGI SAS (SIREN 930 375 902), l'email, le téléphone.
 */
export const entity = { name: 'KOSMO CGI SAS', siren: '930 375 902' };

export interface LegalSection {
  demo: boolean;
  heading: string;
  paragraphs: string[];
}

export const legalPage = {
  title: 'Legal notice',
  description: 'Legal notice for kosmo-ia.com, the KOSMO® AI website published by KOSMO CGI SAS: publisher, hosting, intellectual property and contact details.',
  updated: '2026-09-27',
  sections: [
    {
      demo: true,
      heading: 'Publisher',
      paragraphs: [
        'This website is published by KOSMO CGI SAS, a simplified joint-stock company (SIREN 930 375 902).',
        'Registered address, share capital and the name of the publication director will be added here once confirmed.',
        'Contact: contact@kosmocgi.com · (+971) 5 26 71 38 90.',
      ],
    },
    {
      demo: true,
      heading: 'Hosting',
      paragraphs: ['The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States. Videos are delivered by BunnyWay d.o.o. (Bunny CDN), Slovenia.'],
    },
    {
      demo: true,
      heading: 'Intellectual property',
      paragraphs: [
        'All content on this site (texts, videos, 3D visuals, logos, code) belongs to KOSMO® or to its clients and partners, and is protected by copyright and trademark law. Any reproduction without prior written consent is prohibited.',
        'KOSMO® is a registered trademark. Client and media-owner names are used to describe work delivered and imply no endorsement.',
      ],
    },
    {
      demo: true,
      heading: 'Liability',
      paragraphs: ['KOSMO® strives to keep the information on this site accurate but cannot guarantee it is complete or current. Results shown on case studies are specific to each campaign and are not a guarantee of future performance.'],
    },
  ] satisfies LegalSection[],
};

export const privacyPage = {
  title: 'Privacy policy',
  description: 'How KOSMO® collects and uses personal data on kosmo-ia.com: forms, analytics, cookies, your rights under GDPR.',
  updated: '2026-09-27',
  sections: [
    {
      demo: true,
      heading: 'Who we are',
      paragraphs: ['The data controller is KOSMO CGI SAS (SIREN 930 375 902). You can reach us at contact@kosmocgi.com for any question about your data.'],
    },
    {
      demo: true,
      heading: 'What we collect and why',
      paragraphs: [
        'Forms (free concept, screen brief checklist, partner enquiry): work email, company, name, campaign details and the brief you write. Purpose: answer your request, prepare a concept and follow up commercially. Legal basis: pre-contractual measures and legitimate interest (B2B prospecting).',
        'Attribution: the campaign parameters of the link you clicked (UTM, company name) and the page you landed on, attached to your request so we know how you reached us.',
        'Analytics: we measure visits and campaign performance with Plausible, Vercel Analytics, Google Analytics, Contentsquare and RB2B (business visitor identification). Some of these tools set cookies or similar identifiers.',
      ],
    },
    {
      demo: true,
      heading: 'Where your data goes',
      paragraphs: [
        'Our forms are protected by Cloudflare Turnstile, which checks that a request comes from a person and not a script. Cloudflare may process technical data such as your IP address for this check. It sets no tracking cookies.',
        'Requests are stored in HubSpot (CRM) and may trigger an internal notification. Data may be transferred outside the EU/EEA (for example to the United States) under appropriate safeguards such as standard contractual clauses.',
        'We do not sell personal data. We keep prospect data for three years after our last exchange, and client data for the duration of the contract plus legal retention periods.',
      ],
    },
    {
      demo: true,
      heading: 'Your rights',
      paragraphs: [
        'Under the GDPR you can access, rectify, erase or port your data, object to or restrict its processing, and withdraw consent at any time. Write to contact@kosmocgi.com. You may also lodge a complaint with the CNIL (France) or your local authority.',
        'You can block these cookies in your browser settings or with a tracker blocker. The site works the same without them.',
      ],
    },
  ] satisfies LegalSection[],
};
