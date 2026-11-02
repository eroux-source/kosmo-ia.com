/** Accès centralisé aux variables publiques (build-time). Voir .env.example. */
const env = import.meta.env;

const clean = (value?: string) => (value && value.trim() !== '' ? value.trim() : undefined);

export const publicEnv = {
  showDemo: env.PUBLIC_SHOW_DEMO === 'true',
  /** Agenda de rendez-vous Google Calendar fourni le 27/09 ; PUBLIC_BOOKING_URL permet d'en changer. */
  bookingUrl:
    clean(env.PUBLIC_BOOKING_URL) ??
    'https://calendar.google.com/calendar/appointments/schedules/AcZssZ2Bsw0c5NAWST5kNWj56-MfLlNGgQtBUDRMptQPOlEcN-4fjLdGG9IseMJqORfREL0ucwIIqw4q?gv=true',
  whatsappNumber: clean(env.PUBLIC_WHATSAPP_NUMBER) ?? '971526713890',
  plausibleDomain: clean(env.PUBLIC_PLAUSIBLE_DOMAIN),
  /** Google tag GA4 fourni le 27/09 (identifiant public) ; PUBLIC_GA4_ID permet d'en changer. */
  ga4Id: clean(env.PUBLIC_GA4_ID) ,
  clarityId: clean(env.PUBLIC_CLARITY_ID),
  /** Contentsquare (parcours, heatmaps) fourni le 27/09, chargé dans le head ; PUBLIC_CONTENTSQUARE_ID permet d'en changer, vide pour désactiver. */
  contentsquareId: env.PUBLIC_CONTENTSQUARE_ID === '' ? undefined : clean(env.PUBLIC_CONTENTSQUARE_ID),
  /** RB2B (identification des visiteurs US) fourni le 27/09, chargé dans le head ; PUBLIC_RB2B_KEY permet d'en changer, vide pour désactiver. */
  rb2bKey: env.PUBLIC_RB2B_KEY === '' ? undefined : clean(env.PUBLIC_RB2B_KEY),
  linkedinPartnerId: clean(env.PUBLIC_LINKEDIN_PARTNER_ID),
  metaPixelId: clean(env.PUBLIC_META_PIXEL_ID),
  vercelAnalytics: env.PUBLIC_VERCEL_ANALYTICS === 'true',
  /** Cloudflare Turnstile (captcha des formulaires) : clé de site publique. Sans clé, aucun widget et aucune vérification. */
  turnstileSiteKey: clean(env.PUBLIC_TURNSTILE_SITE_KEY),
};

export const whatsappHref = (text: string) => `https://wa.me/${publicEnv.whatsappNumber}?text=${encodeURIComponent(text)}`;
