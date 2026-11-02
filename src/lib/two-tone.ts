/**
 * Titres en deux tons (DESIGN-SYSTEM.md) : « One idea, <em>three layers of reach.</em> ».
 * La seconde partie est, par défaut, ce qui suit la dernière ponctuation intérieure (. ? ! : , ;) ;
 * `soft` la fixe à la main quand le titre n'a pas de ponctuation (« Unreal campaigns <em>people stop for.</em> »).
 * Le moteur de traduction voit « One idea, <t1>three layers of reach.</t1> » : chaque langue place son second ton.
 */
export function twoTone(text: string, soft?: string): [string, string] {
  const t = text.trim();
  if (soft && t.endsWith(soft.trim()) && soft.trim() !== t) return [t.slice(0, t.length - soft.trim().length).trim(), soft.trim()];
  const re = /[.?!:,;](?=\s+\S)/g;
  let cut = -1;
  for (const m of t.matchAll(re)) cut = (m.index ?? -1) + 1;
  if (cut <= 0) return [t, ''];
  return [t.slice(0, cut).trim(), t.slice(cut).trim()];
}
