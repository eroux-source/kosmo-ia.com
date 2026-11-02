#!/usr/bin/env node
/**
 * Génère src/data/world-dots.json : grille de points « pixel » couvrant les terres émergées
 * (Natural Earth 110m, domaine public), projection équirectangulaire. Usage : node scripts/build-world-dots.mjs <land.geojson>
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , source = 'scratch/land.geojson'] = process.argv;
const COLS = 160; // points en largeur (360° de longitude)
const ROWS = 68; // 170° de latitude (on coupe l'Antarctique en dessous de -58°)
const LAT_MAX = 84;
const LAT_MIN = -58;

const geo = JSON.parse(readFileSync(source, 'utf8'));
const polygons = [];
for (const f of geo.features) {
  const g = f.geometry;
  if (g.type === 'Polygon') polygons.push(g.coordinates);
  else if (g.type === 'MultiPolygon') polygons.push(...g.coordinates);
}

function inRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
const isLand = (lon, lat) => polygons.some((poly) => inRing(poly[0], lon, lat) && !poly.slice(1).some((hole) => inRing(hole, lon, lat)));

const dots = [];
for (let r = 0; r < ROWS; r++) {
  const lat = LAT_MAX - ((r + 0.5) / ROWS) * (LAT_MAX - LAT_MIN);
  for (let c = 0; c < COLS; c++) {
    const lon = -180 + ((c + 0.5) / COLS) * 360;
    if (isLand(lon, lat)) dots.push([c, r]);
  }
}
writeFileSync(new URL('../src/data/world-dots.json', import.meta.url), JSON.stringify({ cols: COLS, rows: ROWS, latMax: LAT_MAX, latMin: LAT_MIN, dots }));
console.log(`✓ ${dots.length} dots on a ${COLS}×${ROWS} grid`);
