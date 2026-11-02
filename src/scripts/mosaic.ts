/**
 * Mosaïque de /work (d'après whycgi.media/projects) : grille de 4 colonnes (2 sur mobile) à rangées de 1 px, remplie
 * en « dense ». Chaque tuile ([data-ratio]) reçoit le nombre de rangées qui correspond à la hauteur exacte de son film
 * au format natif (16:9 sur deux colonnes, 9:16 et 1:1 sur une) plus l'écart vertical, recalculé à chaque
 * redimensionnement. Sans script, les valeurs de départ de tokens.css (--mosaic-span-*) donnent une mosaïque proche.
 */
const RATIO: Record<string, number> = { '16:9': 16 / 9, '9:16': 9 / 16, '1:1': 1 };

document.querySelectorAll<HTMLElement>('[data-mosaic]').forEach((grid) => {
  const fit = () => {
    const cs = getComputedStyle(grid);
    const col = parseFloat(cs.gridTemplateColumns.split(' ')[0]);
    const gap = parseFloat(cs.columnGap) || 0;
    if (!col) return;
    grid.querySelectorAll<HTMLElement>('[data-ratio]').forEach((tile) => {
      const ratio = RATIO[tile.dataset.ratio ?? ''] ?? 1;
      const width = ratio > 1 ? 2 * col + gap : col;
      tile.style.gridRow = `span ${Math.round(width / ratio + gap)}`;
    });
  };
  new ResizeObserver(fit).observe(grid);
  fit();
});
