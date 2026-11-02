/**
 * Projets FOOH (src/data/fooh/projects.json, export Framer nettoyé, voir imports/fooh-projects/README.md).
 * Règles de publication appliquées ici, une seule fois (décision du 27/09 : tous les projets sont
 * publiés et tous sont de vraies commandes ; `restrictedClient` et `commissioned` ne changent rien à l'affichage) :
 * - le client affiché est la marque (`brandName` quand le client Framer est KOSMO) ;
 * - quote.internal → jamais affichée ;
 * - metrics.scope "campaign" → chiffres montrés au niveau de la série, pas par volet ;
 * - location.confidence "low" → ville non affichée.
 */
import projects from '../data/fooh/projects.json';
import clients from '../data/fooh/clients.json';
import posters from '../data/fooh/posters.json';

interface Media {
  video?: string;
  poster?: string;
}
interface Metric {
  raw: string;
  value: number;
  display: string;
}
export interface FoohProject {
  slug: string;
  originalSlug?: string;
  title: string;
  subtitle: string;
  client: string;
  clientName: string;
  commissioned: boolean;
  brand?: string;
  brandName?: string;
  series?: string;
  date: string;
  year: number;
  category: 'fooh';
  format: string;
  industry: string;
  location?: { city?: string; country?: string; confidence: 'high' | 'low' };
  description: string[];
  /** `views` = vues du post de la marque (owned media), à ne pas confondre avec l'earned media. */
  metrics?: { views?: Metric; earnedMedia?: Metric; engagement?: Metric; scope?: 'campaign' };
  quote?: { text: string; author: string; role: string; internal: boolean };
  videoRatio: '9:16' | '16:9' | '1:1';
  media: {
    mainVideo: string;
    hookVideo?: string;
    thumbnail?: { desktop?: Media; mobile?: Media };
    header?: { desktop?: Media; mobile?: Media };
    projectLogo?: string;
    wideImage?: string;
    finalWideImage?: string;
    locationCard?: string;
    /** Durée ISO 8601 du film principal (PT12S), quand elle est connue. */
    duration?: string;
  };
  restrictedClient: boolean;
  toCheck: string[];
}
export interface FoohClient {
  slug: string;
  name: string;
  logo?: string;
  restricted: boolean;
  projectCount: number;
}

const all = projects as FoohProject[];
const clientList = clients as FoohClient[];

/** Tous les projets, du plus récent au plus ancien. */
export const foohProjects = all;
/** Marques signalées « à ne pas citer sans accord » dans l'export, rappelées sur /todo. */
export const restrictedFooh = all.filter((p) => p.restrictedClient);

export const foohHref = (p: FoohProject) => `/work/${p.slug}`;
export const foohBySlug = (slug: string) => foohProjects.find((p) => p.slug === slug);
export const clientOf = (p: FoohProject) => clientList.find((c) => c.slug === p.client);

/** Client affiché : la marque (le client Framer « KOSMO » porte la marque dans `brandName`). */
export const featuredName = (p: FoohProject) => p.brandName ?? p.clientName;

/** Ville affichable (confiance haute uniquement). */
export const cityOf = (p: FoohProject) => (p.location && p.location.confidence !== 'low' ? p.location.city : undefined);

/** Couverture : image extraite de la vidéo principale (scripts/build-fooh-posters.mjs), sinon le poster Framer. */
export const poster = (p: FoohProject) =>
  (posters as string[]).includes(p.slug) ? `/images/fooh/${p.slug}.jpg` : (p.media.thumbnail?.desktop?.poster ?? p.media.header?.desktop?.poster);
/** Vidéo des cartes : toujours la vidéo principale. */
export const cardVideo = (p: FoohProject) => p.media.mainVideo;

/** Volets publiés d'une série, du premier au dernier. */
export const seriesOf = (p: FoohProject) => (p.series ? foohProjects.filter((s) => s.series === p.series).sort((a, b) => a.date.localeCompare(b.date)) : [p]);

/** Chiffres à afficher : pour un scope « campaign », une seule fois, sur le premier volet de la série. */
export function metricsOf(p: FoohProject): { items: { label: string; display: string }[]; scope: 'project' | 'series'; parts: number } | undefined {
  const m = p.metrics;
  if (!m || (!m.views && !m.earnedMedia && !m.engagement)) return undefined;
  const items = [
    m.views && { label: 'Instagram views', display: m.views.display },
    m.earnedMedia && { label: 'earned media', display: m.earnedMedia.display },
    m.engagement && { label: 'engagement', display: m.engagement.display },
  ].filter(Boolean) as { label: string; display: string }[];
  if (m.scope === 'campaign') {
    const parts = seriesOf(p);
    return { items, scope: 'series', parts: parts.length };
  }
  return { items, scope: 'project', parts: 1 };
}

/** Le chiffre de série se montre sur un seul volet (le premier publié). */
export const showsMetrics = (p: FoohProject) => {
  const m = metricsOf(p);
  if (!m) return false;
  return m.scope === 'project' || seriesOf(p)[0]?.slug === p.slug;
};

export const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

/** Paragraphe Framer : texte brut avec italique en `*…*`. Échappé puis converti en <em>. */
export function inline(text: string): string {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

export function countBy<T extends string>(list: FoohProject[], pick: (p: FoohProject) => T | undefined): Record<string, number> {
  return list.reduce(
    (acc, p) => {
      const key = pick(p);
      if (key) acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}
