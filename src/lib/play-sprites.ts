/**
 * Sprites en pixel art de KOSMO® PLAY : un caractère = un pixel. Même dessin pour les icônes SVG (PixelSprite.astro)
 * et pour le mini-jeu en canvas (src/scripts/play-game.ts). Couleurs de la charte uniquement :
 * A acide · W blanc · G gris 400 · L gris 200 · O orange · K noir · « . » transparent.
 * Le pixel art prolonge les visuels bitmap de la référence (avatars en dither, carte du monde en pixels).
 */
export const SPRITES = {
  cube: ['...WW...', '.WWWWWW.', 'AAWWWWGG', 'AAAAGGGG', 'AAAAGGGG', 'AAAAGGGG', '.AAAGGG.', '...AG...'],
  trap: ['O.....O', '.O.O.O.', '..OOO..', '.OOWOO.', '..OOO..', '.O.O.O.', 'O.....O'],
  tray: ['W............W', 'WW..........WW', '.WWWWWWWWWWWW.', '.WAAAAAAAAAAW.', '..WWWWWWWWWW..'],
  star: ['...W...', '...W...', 'WWWWWWW', '.WWWWW.', '..WWW..', '.WW.WW.', '.W...W.'],
  joystick: ['...OOO...', '..OOOOO..', '..OOOOO..', '...OOO...', '....G....', '....G....', '.WWWWWWW.', 'WWWWWWWAW', 'WWWWWWWWW'],
  question: ['.AAAAA.', 'AA...AA', '.....AA', '....AA.', '...AA..', '...AA..', '.......', '...AA..', '...AA..'],
  gift: ['..A...A..', '...A.A...', 'WWWWAWWWW', 'WWWWAWWWW', '.........', '.WWWAWWW.', '.WWWAWWW.', '.WWWAWWW.', '.WWWAWWW.'],
  puzzle: ['...AA....', '...AA....', 'AAAAAAA..', 'AAAAAAA..', 'AAAAAAAAA', 'AAAAAAAAA', 'AAAAAAA..', 'AAAAAAA..'],
  calendar: ['.G.....G.', 'OOOOOOOOO', 'WWWWWWWWW', 'W.W.W.A.W', 'WWWWWWWWW', 'W.W.A.W.W', 'WWWWWWWWW', 'W.W.W.W.W', 'WWWWWWWWW'],
  trophy: ['AAAAAAAAA', 'A.AAAAA.A', 'A.AAAAA.A', '.AAAAAAA.', '..AAAAA..', '...AAA...', '....A....', '...AAA...', '..WWWWW..'],
  coin: ['..AAAA..', '.AAAAAA.', 'AAWWAAAA', 'AAWAAAAA', 'AAWAAAAA', 'AAWWAAAA', '.AAAAAA.', '..AAAA..'],
} as const;

export type SpriteName = keyof typeof SPRITES;
export type SpriteColor = 'A' | 'W' | 'G' | 'L' | 'O' | 'K';

/** Variables CSS de la charte lues par le canvas (getComputedStyle). */
export const SPRITE_VARS: Record<SpriteColor, string> = {
  A: '--kosmo-acid',
  W: '--kosmo-white',
  G: '--grey-400',
  L: '--grey-200',
  O: '--kosmo-orange',
  K: '--kosmo-black',
};

export interface SpriteRun {
  x: number;
  y: number;
  w: number;
  color: SpriteColor;
}

/** Lignes de pixels fusionnées en segments horizontaux (moins de rectangles à dessiner). */
export function spriteRuns(name: SpriteName): { width: number; height: number; runs: SpriteRun[] } {
  const rows = SPRITES[name];
  const runs: SpriteRun[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const char = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === char) end++;
      if (char !== '.') runs.push({ x, y, w: end - x, color: char as SpriteColor });
      x = end;
    }
  });
  return { width: Math.max(...rows.map((r) => r.length)), height: rows.length, runs };
}
