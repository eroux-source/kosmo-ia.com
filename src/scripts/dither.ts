/**
 * Lisières en pixels tramés (Dither.astro) : colonnes de pixels de hauteur aléatoire, quelques pixels isolés
 * au-dessus (dont certains acides), dessinées dans la couleur de la section voisine. À l'entrée à l'écran, la
 * lisière pousse en huit paliers (steps). Port du script de la maquette Cofounder (home.js, « Bords pixel tramés »).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = getComputedStyle(document.documentElement);
const ACID = root.getPropertyValue('--kosmo-acid').trim();
const PX = Number(root.getPropertyValue('--dither-pixel')) || 2;
const { dither: D } = motion;

const seeded = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

const SKIP = new Set(['SCRIPT', 'STYLE', 'TEMPLATE', 'LINK']);
const transparent = (el: Element) => /,\s*0\)$|transparent/.test(getComputedStyle(el).backgroundColor);

/** Élément voisin dans le flux (frère, sinon frère d'un parent), en descendant dans un conteneur transparent (<main>). */
function neighbour(el: Element, dir: 'prev' | 'next'): Element | null {
  let cur: Element | null = el;
  let sib: Element | null = null;
  while (cur && cur !== document.body && !sib) {
    sib = dir === 'prev' ? cur.previousElementSibling : cur.nextElementSibling;
    while (sib && SKIP.has(sib.tagName)) sib = dir === 'prev' ? sib.previousElementSibling : sib.nextElementSibling;
    cur = cur.parentElement;
  }
  while (sib && transparent(sib)) {
    let child = dir === 'prev' ? sib.lastElementChild : sib.firstElementChild;
    while (child && SKIP.has(child.tagName)) child = dir === 'prev' ? child.previousElementSibling : child.nextElementSibling;
    if (!child) break;
    sib = child;
  }
  return sib;
}

/** Couleur de fond effective (le premier parent opaque). */
function background(el: Element | null): string {
  let cur: Element | null = el;
  while (cur) {
    const c = getComputedStyle(cur).backgroundColor;
    if (c && c !== 'transparent' && !/,\s*0\)$/.test(c)) return c;
    cur = cur.parentElement;
  }
  return getComputedStyle(document.body).backgroundColor;
}

/** Luminance relative approximative (0 → 1) d'une couleur rgb(). */
function luminance(c: string) {
  const [r, g, b] = (c.match(/\d+(\.\d+)?/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

document.querySelectorAll<HTMLElement>('[data-dither]').forEach((box, i) => {
  const section = box.parentElement;
  if (!section) return;
  const up = box.dataset.dither === 'up';
  const other = neighbour(section, up ? 'next' : 'prev');
  // Pas de voisine (haut de page), ou voisine sombre (deux sections noires qui se suivent) : pas de lisière.
  if (!other) return box.remove();
  const paint = background(other);
  if (luminance(paint) < D.darkThreshold) return box.remove();

  const cv = document.createElement('canvas');
  box.appendChild(cv);
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const seed = 7919 * (i + 3);
  let progress = reduce ? 1 : D.from;

  const draw = () => {
    const cols = cv.width;
    const rows = cv.height;
    const r = seeded(seed);
    ctx.clearRect(0, 0, cols, rows);
    ctx.fillStyle = paint;
    let h = rows * D.base;
    for (let x = 0; x < cols; x++) {
      h += (r() - 0.5) * rows * D.wobble;
      h = Math.max(rows * D.min, Math.min(rows * D.max, h));
      const tuft = r() < D.tuftChance ? Math.floor(r() * rows * D.tuft) : 0;
      const col = Math.round((h + tuft) * progress);
      ctx.fillRect(x, up ? rows - col : 0, 1, col);
      // pixels isolés au-dessus de la lisière
      const stray = Math.floor(r() * D.strays);
      for (let s = 0; s < stray; s++) {
        const yy = col + 1 + Math.floor(r() * rows * D.strayReach * progress);
        if (yy < rows && r() < D.strayChance) {
          ctx.fillStyle = r() < D.acidChance ? ACID : paint;
          ctx.fillRect(x, up ? rows - 1 - yy : yy, 1, 1);
          ctx.fillStyle = paint;
        }
      }
    }
  };
  const size = () => {
    cv.width = Math.ceil(box.offsetWidth / PX);
    cv.height = Math.ceil(box.offsetHeight / PX);
    draw();
  };
  size();
  new ResizeObserver(size).observe(box);
  if (reduce) return;
  const o = { p: D.from };
  gsap.to(o, {
    p: 1,
    duration: D.duration,
    ease: `steps(${D.steps})`,
    onUpdate: () => {
      progress = o.p;
      draw();
    },
    scrollTrigger: { trigger: box, start: D.start, once: true },
  });
});
