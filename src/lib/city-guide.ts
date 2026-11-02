/**
 * Guide local d'une page ville (src/content/cities/<slug>.md) découpé en blocs pour la mise en page : le Markdown reste
 * la source (rédaction et traduction simples), le rendu HTML est coupé à chaque intertitre `##`, et chaque section est
 * reconnue à son intertitre (marché, écrans, campagnes, régies, règles, prix, calendrier). Une section inconnue garde
 * le rendu « prose ». Les contenus gardent leur HTML (liens sources, gras) : les segments traduits restent identiques.
 */
import { parseFragment, serialize } from 'parse5';
import type { DefaultTreeAdapterMap } from 'parse5';

type Node = DefaultTreeAdapterMap['childNode'];
type Element = DefaultTreeAdapterMap['element'];

export type GuideKind = 'market' | 'screens' | 'campaigns' | 'owners' | 'rules' | 'costs' | 'calendar' | 'method' | 'other';

export interface GuideSection {
  kind: GuideKind;
  /** Intertitre (HTML). */
  heading: string;
  /** Paragraphes hors tableau et listes (HTML). */
  paragraphs: string[];
  /** Tableau (cellules en HTML) : en-têtes, puis lignes. */
  table?: { head: string[]; rows: string[][] };
  /** Éléments de liste (HTML). */
  items: string[];
  /** Paragraphes placés après le tableau ou la liste. */
  after: string[];
}

const KINDS: [GuideKind, RegExp][] = [
  ['method', /^How we work/i],
  /* Avant « screens » : « What the screens cost in 2026 » (Berlin) est un bloc de prix. */
  ['costs', /cost/i],
  ['screens', /screens that suit|where 3D works|screens/i],
  ['campaigns', /3D campaigns/i],
  ['owners', /who sells/i],
  ['rules', /permits|rules/i],
  ['calendar', /when to launch/i],
  ['market', /market/i],
];

const isEl = (n: Node): n is Element => 'tagName' in n;
const inner = (el: Element) => serialize(el).trim();
const text = (el: Element): string => el.childNodes.map((c) => ('value' in c ? c.value : isEl(c) ? text(c) : '')).join('');

export function parseGuide(html: string): GuideSection[] {
  const sections: GuideSection[] = [];
  let current: GuideSection | undefined;
  for (const node of parseFragment(html).childNodes) {
    if (!isEl(node)) continue;
    if (node.tagName === 'h2') {
      const label = text(node);
      current = { kind: KINDS.find(([, re]) => re.test(label))?.[0] ?? 'other', heading: inner(node), paragraphs: [], items: [], after: [] };
      sections.push(current);
      continue;
    }
    current ??= sections[sections.push({ kind: 'other', heading: '', paragraphs: [], items: [], after: [] }) - 1];
    const late = Boolean(current.table) || current.items.length > 0;
    if (node.tagName === 'p') (late ? current.after : current.paragraphs).push(inner(node));
    else if (node.tagName === 'ul' || node.tagName === 'ol') current.items.push(...node.childNodes.filter(isEl).filter((li) => li.tagName === 'li').map(inner));
    else if (node.tagName === 'table') {
      const rows = (tag: string) =>
        node.childNodes
          .filter(isEl)
          .filter((part) => part.tagName === tag)
          .flatMap((part) => part.childNodes.filter(isEl).filter((tr) => tr.tagName === 'tr'))
          .map((tr) => tr.childNodes.filter(isEl).filter((cell) => cell.tagName === 'td' || cell.tagName === 'th').map(inner));
      current.table = { head: rows('thead')[0] ?? [], rows: rows('tbody') };
    } else (late ? current.after : current.paragraphs).push(serialize({ nodeName: '#document-fragment', childNodes: [node] } as never));
  }
  return sections;
}
