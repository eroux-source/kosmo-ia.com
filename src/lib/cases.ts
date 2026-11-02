/** Accès aux cas (collection `cases`) et libellés partagés. */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Case = CollectionEntry<'cases'>;

export const CATEGORY_LABELS: Record<Case['data']['category'], string> = {
  '3dooh': '3DOOH',
  fooh: 'FOOH',
  social: 'Social',
};

export const FORMAT_LABELS: Record<Case['data']['format'], string> = {
  'corner-anamorphic': 'Corner screen',
  'forced-perspective': 'Flat screen',
  'fooh-extension': 'Social version',
};

export async function getPublishedCases(): Promise<Case[]> {
  const all = await getCollection('cases', ({ data }) => data.published);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.dates.start.localeCompare(b.data.dates.start) * -1);
}

export const caseHref = (entry: Case) => `/work/${entry.id}`;

/** Nom affiché : le client si autorisé, sinon « Confidential — {industry} ». */
export const displayClient = (entry: Case) => (entry.data.nameCleared || entry.data.demo ? entry.data.client : `Confidential — ${entry.data.industry}`);

export function countBy<T extends string>(cases: Case[], pick: (c: Case) => T): Record<T, number> {
  return cases.reduce(
    (acc, c) => {
      const key = pick(c);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<T, number>,
  );
}
