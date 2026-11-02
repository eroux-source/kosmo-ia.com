/**
 * Attribution des palettes de couverture animée (tokens --shader-N-a / --shader-N-b) aux articles sans image :
 * index = rang de l'article dans la liste triée des slugs, donc stable et jamais la même paire pour deux articles
 * tant qu'il y a au plus SHADER_PALETTES articles sans image.
 */
export const SHADER_PALETTES = 16;

export function paletteFor(slug: string, slugs: string[]): number {
  const sorted = [...slugs].sort();
  const index = Math.max(0, sorted.indexOf(slug));
  return (index % SHADER_PALETTES) + 1;
}
