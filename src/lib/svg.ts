/**
 * Rend uniques les id d'un SVG inliné (masques, clipPath, dégradés) : le même logo apparaît plusieurs fois par page
 * (hero, bande de logos, témoignages) et des id en double font disparaître les formes masquées sur Safari iOS.
 */
export function uniqueSvgIds(svg: string, prefix: string): string {
  const ids = new Set<string>();
  svg.replace(/\bid="([^"]+)"/g, (_, id: string) => (ids.add(id), _));
  let out = svg;
  for (const id of ids) {
    const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    out = out
      .replace(new RegExp(`\\bid="${escaped}"`, 'g'), `id="${prefix}-${id}"`)
      .replace(new RegExp(`url\\(#${escaped}\\)`, 'g'), `url(#${prefix}-${id})`)
      .replace(new RegExp(`href="#${escaped}"`, 'g'), `href="#${prefix}-${id}"`);
  }
  return out;
}

let counter = 0;
/** Préfixe court et unique par instance rendue (build statique : stable d'un rendu à l'autre dans la page). */
export const svgInstanceId = (base: string) => `${base.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-${(counter++).toString(36)}`;
