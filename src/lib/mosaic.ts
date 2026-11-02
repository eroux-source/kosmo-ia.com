/** Conversion des cas (collection `cases`) et des projets FOOH vers les tuiles de la mosaïque (MosaicCard). */
import type { MosaicItem } from '../components/ui/MosaicCard.astro';
import { CATEGORY_LABELS, displayClient, type Case } from './cases';
import { cardVideo, cityOf, clientOf, featuredName, foohHref, metricsOf, poster, showsMetrics, type FoohProject } from './fooh';

export type WorkItem = MosaicItem & { date: string };

export function caseItem(entry: Case): WorkItem {
  const { data } = entry;
  return {
    date: data.dates.start,
    href: `/work/${entry.id}`,
    video: data.videos.insitu.src,
    poster: data.videos.insitu.poster,
    ratio: data.videos.insitu.ratio,
    brand: displayClient(entry),
    logo: data.clientLogo,
    category: data.category,
    categoryLabel: CATEGORY_LABELS[data.category],
    industry: data.industry,
    city: data.city,
    title: data.title,
    metric: data.results[0] && { value: data.results[0].value, label: data.results[0].label },
  };
}

export function foohItem(p: FoohProject): WorkItem {
  const m = showsMetrics(p) ? metricsOf(p) : undefined;
  return {
    date: p.date.slice(0, 7),
    href: foohHref(p),
    video: cardVideo(p),
    poster: poster(p),
    ratio: p.videoRatio,
    brand: featuredName(p),
    /* Projet KOSMO® mis au nom d'une marque (Apple, Disney+…) : pas le logo KOSMO®, le nom de la marque à la place. */
    logo: clientOf(p)?.slug === 'kosmo' && featuredName(p) !== 'KOSMO' ? undefined : clientOf(p)?.logo,
    category: p.category,
    categoryLabel: 'CGI & mixed reality',
    industry: p.industry,
    city: cityOf(p),
    title: p.subtitle,
    metric: m?.items[0] && { value: m.items[0].display, label: m.scope === 'series' ? `${m.items[0].label} · ${m.parts} films` : m.items[0].label },
  };
}
