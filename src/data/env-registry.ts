/** Variables d'environnement attendues sur Vercel. /todo indique celles qui sont renseignées au build. */
export interface EnvVar {
  key: string;
  purpose: string;
  /** true = préfixe PUBLIC_, lisible au build (état affiché sur /todo). */
  isPublic: boolean;
  required: boolean;
}

export const envRegistry: EnvVar[] = [
  { key: 'HUBSPOT_ACCESS_TOKEN', purpose: 'Jeton d’application privée HubSpot (contacts write). Sans lui : mode mock (lead loggé, succès simulé).', isPublic: false, required: true },
  { key: 'SLACK_WEBHOOK_URL', purpose: 'Alerte Slack à chaque lead.', isPublic: false, required: false },
  { key: 'PUBLIC_TURNSTILE_SITE_KEY', purpose: 'Cloudflare Turnstile (captcha des formulaires), clé de site. Sans elle : pas de widget. Créer un widget sur dash.cloudflare.com → Turnstile, domaine kosmocgi.com, mode « managed ».', isPublic: true, required: false },
  { key: 'TURNSTILE_SECRET_KEY', purpose: 'Cloudflare Turnstile, clé secrète : /api/lead vérifie le jeton avant d’enregistrer le lead. Sans elle : vérification ignorée.', isPublic: false, required: false },
  { key: 'PUBLIC_BOOKING_URL', purpose: 'Agenda de rendez-vous (Google Calendar par défaut, HubSpot Meetings accepté).', isPublic: true, required: false },
  { key: 'PUBLIC_WHATSAPP_NUMBER', purpose: 'Numéro WhatsApp (défaut : celui de la référence).', isPublic: true, required: false },
  { key: 'PUBLIC_PLAUSIBLE_DOMAIN', purpose: 'Plausible (ex. kosmocgi.com).', isPublic: true, required: false },
  { key: 'PUBLIC_GA4_ID', purpose: 'Google Analytics 4. Défaut dans le code : G-X3XP05M4YF (balise chargée avec le mode Consentement v2 : refusé par défaut, accordé après le bandeau).', isPublic: true, required: false },
  { key: 'PUBLIC_RB2B_KEY', purpose: 'RB2B (identification des visiteurs, trafic US). Défaut dans le code : QOQRJHKQ5K62, chargé dans le head sans consentement (décision du 27/09) ; mettre une valeur vide pour désactiver.', isPublic: true, required: false },
  { key: 'PUBLIC_CONTENTSQUARE_ID', purpose: 'Contentsquare (parcours, heatmaps). Défaut dans le code : bcb5040312a6d, chargé dans le head sans consentement (décision du 27/09) ; mettre une valeur vide pour désactiver.', isPublic: true, required: false },
  { key: 'PUBLIC_CLARITY_ID', purpose: 'Microsoft Clarity (heatmaps), sans consentement.', isPublic: true, required: false },
  { key: 'PUBLIC_LINKEDIN_PARTNER_ID', purpose: 'LinkedIn Insight Tag (retargeting), sans consentement.', isPublic: true, required: false },
  { key: 'PUBLIC_META_PIXEL_ID', purpose: 'Pixel Meta (retargeting), sans consentement.', isPublic: true, required: false },
  { key: 'PUBLIC_VERCEL_ANALYTICS', purpose: '« true » pour Vercel Web Analytics.', isPublic: true, required: false },
  { key: 'PUBLIC_SHOW_DEMO', purpose: '« true » pour afficher les badges DÉMO (masqués par défaut).', isPublic: true, required: false },
];
