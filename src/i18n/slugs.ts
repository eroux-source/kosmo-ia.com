/**
 * Slugs traduits (mot-clé local dans l'URL). Clé = segment ou slug anglais. Un slug absent reste identique à l'anglais.
 * Changer un slug publié casse l'URL indexée : ajouter alors une redirection 301 dans astro.config.mjs.
 */
import type { LocalizedLang } from './config';

type SlugMap = Record<string, Partial<Record<LocalizedLang, string>>>;

/** Segments de premier niveau (et « thanks » sous /checklist). */
export const SEGMENTS: SlugMap = {
  about: { fr: 'a-propos', de: 'ueber-uns', nl: 'over-ons' },
  careers: { fr: 'carrieres', de: 'karriere', nl: 'vacatures' },
  contact: { de: 'kontakt' },
  partners: { fr: 'partenaires', de: 'partner' },
  legal: { fr: 'mentions-legales', de: 'impressum', nl: 'juridische-informatie' },
  privacy: { fr: 'confidentialite', de: 'datenschutz' },
  work: { fr: 'realisations', de: 'projekte', nl: 'projecten' },
  journal: { nl: 'journaal' },
  checklist: { de: 'checkliste' },
  'thank-you': { fr: 'merci', de: 'danke', nl: 'bedankt' },
  book: { fr: 'rendez-vous', de: 'termin', nl: 'afspraak' },
};

/** Sous /checklist. */
export const CHECKLIST_SEGMENTS: SlugMap = {
  thanks: { fr: 'merci', de: 'danke', nl: 'bedankt' },
};

/** Pages villes (/3dooh/<ville>) : exonyme local. Aussi les pages de service de la 3D anamorphique (/3dooh/<service>). */
export const CITY_SLUGS: SlugMap = {
  billboards: { fr: 'panneaux-publicitaires-3d', de: '3d-billboards', nl: '3d-billboards' },
  'in-store': { fr: 'vitrines-et-magasins', de: 'schaufenster-und-retail', nl: 'etalages-en-winkels' },
  events: { fr: 'evenements', de: 'events', nl: 'evenementen' },
  architecture: { de: 'architektur', nl: 'architectuur' },
  london: { fr: 'londres', nl: 'londen' },
  paris: { nl: 'parijs' },
  berlin: { nl: 'berlijn' },
  milan: { de: 'mailand', nl: 'milaan' },
  riyadh: { fr: 'riyad', de: 'riad', nl: 'riyad' },
  hamburg: { fr: 'hambourg' },
  munich: { de: 'muenchen', nl: 'munchen' },
  cologne: { de: 'koeln', nl: 'keulen' },
  'abu-dhabi': { fr: 'abou-dhabi' },
  tokyo: { de: 'tokio', nl: 'tokio' },
  seoul: { nl: 'seoel' },
};

/** Articles du journal (/journal/<slug>) : slug calé sur le mot-clé local (docs/i18n/KEYWORDS.md). */
export const POST_SLUGS: SlugMap = {
  '3d-billboard-cost': { fr: 'prix-panneau-publicitaire-3d', de: '3d-billboard-kosten', nl: '3d-billboard-kosten' },
  '3d-billboard-product-launch': { fr: 'lancement-produit-publicite-3d', de: '3d-billboard-produktlaunch', nl: '3d-billboard-productlancering' },
  '3d-billboard-timeline': { fr: 'delai-production-panneau-publicitaire-3d', de: '3d-billboard-produktionszeit', nl: '3d-billboard-doorlooptijd' },
  '3d-billboards-vs-traditional-billboards': { fr: 'panneau-publicitaire-3d-vs-affichage-classique', de: '3d-billboard-vs-klassische-aussenwerbung', nl: '3d-billboard-vs-traditionele-buitenreclame' },
  'anamorphic-billboards-explained': { fr: 'affichage-anamorphique-explique', de: 'anamorphe-werbung-erklaert', nl: 'anamorfe-billboards-uitgelegd' },
  'anamorphic-vs-forced-perspective': { fr: 'anamorphose-vs-perspective-forcee', de: 'anamorphose-vs-forced-perspective', nl: 'anamorfose-vs-geforceerd-perspectief' },
  'best-cities-for-3d-billboards': { fr: 'meilleures-villes-panneaux-publicitaires-3d', de: 'die-besten-staedte-fuer-3d-billboards', nl: 'beste-steden-voor-3d-billboards' },
  'how-3d-billboards-travel-on-social': { fr: 'publicite-3d-virale-reseaux-sociaux', de: '3d-billboards-social-media-reichweite', nl: '3d-billboards-viraal-social-media' },
  'how-to-choose-a-3d-billboard-agency': { fr: 'choisir-agence-publicite-3d', de: '3d-billboard-agentur-waehlen', nl: '3d-billboard-bureau-kiezen' },
  'media-owner-specs-3dooh': { fr: 'specifications-regies-dooh-3d', de: '3d-dooh-spezifikationen-vermarkter', nl: '3d-dooh-specificaties-mediaexploitanten' },
  'miele-hydroclean-case-study': { fr: 'etude-de-cas-miele-hydroclean', de: 'fallstudie-miele-hydroclean', nl: 'case-miele-hydroclean' },
  'miele-japan-shinjuku-wall-456': { fr: 'miele-japon-shinjuku-wall-456', de: 'miele-japan-shinjuku-wall-456', nl: 'miele-japan-shinjuku-wall-456' },
  'netflix-avatar-earth-kingdom-public-works': { fr: 'netflix-avatar-fooh-royaume-de-la-terre', de: 'netflix-avatar-fooh-erdkoenigreich', nl: 'netflix-avatar-fooh-aardekoninkrijk' },
  'netflix-big-mistakes-fooh': { fr: 'netflix-big-mistakes-fooh', de: 'netflix-big-mistakes-fooh', nl: 'netflix-big-mistakes-fooh' },
  'netflix-below-fooh': { fr: 'netflix-below-fooh', de: 'netflix-below-fooh', nl: 'netflix-below-fooh' },
  'nintendo-super-mario-galaxy-yoshi-eggs': { fr: 'nintendo-super-mario-galaxy-oeufs-yoshi', de: 'nintendo-super-mario-galaxy-yoshi-eier', nl: 'nintendo-super-mario-galaxy-yoshi-eieren' },
  'what-is-3dooh': { fr: 'quest-ce-que-le-3dooh', de: 'was-ist-3dooh', nl: 'wat-is-3dooh' },
  'what-is-fooh': { fr: 'quest-ce-que-le-fooh', de: 'was-ist-fooh', nl: 'wat-is-fooh' },
  'white-label-3d-production-for-agencies': { fr: 'production-3d-marque-blanche-agences', de: 'white-label-3d-produktion-agenturen', nl: 'white-label-3d-productie-bureaus' },
  'what-is-dooh': { fr: 'quest-ce-que-le-dooh', de: 'was-ist-dooh', nl: 'wat-is-dooh' },
  'dooh-advertising-cost': { fr: 'prix-publicite-dooh', de: 'dooh-werbung-kosten', nl: 'kosten-digitale-buitenreclame' },
  'fake-out-of-home-examples': { fr: 'exemples-fooh-fake-out-of-home', de: 'fooh-beispiele-fake-out-of-home', nl: 'fooh-voorbeelden-fake-out-of-home' },
  'anamorphic-screen': { fr: 'ecran-anamorphique', de: 'anamorpher-led-screen', nl: 'anamorf-scherm' },
  'cgi-ads': { fr: 'publicite-cgi', de: 'cgi-werbung', nl: 'cgi-reclame' },
};
