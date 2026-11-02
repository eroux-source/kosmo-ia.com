/**
 * Logos clients : même poids visuel pour tous. Le viewBox est recadré sur le dessin réel (getBBox), puis chaque logo
 * reçoit la même surface (largeur × hauteur), bornée en largeur et en hauteur : un logo long devient plus bas, un logo
 * carré plus étroit. Entrée en cascade (maquette Cofounder).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);
const { logos: L, logosMobile: M } = motion;
/* Mobile : 4 colonnes plus étroites, chaque logo garde la même surface que ses voisins mais en plus petit. */
const sm = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-sm').trim();
const size = window.matchMedia(`(width < ${sm})`).matches ? M : L;

document.querySelectorAll<HTMLElement>('[data-logo-strip]').forEach((grid) => {
  grid.querySelectorAll<SVGSVGElement>('svg').forEach((svg) => {
    let b: DOMRect;
    try {
      b = svg.getBBox();
    } catch {
      return;
    }
    if (!b.width || !b.height) return;
    svg.setAttribute('viewBox', `${b.x} ${b.y} ${b.width} ${b.height}`);
    const r = b.width / b.height;
    let w = Math.sqrt(size.area * r);
    let h = w / r;
    if (w > size.maxWidth) (w = size.maxWidth), (h = w / r);
    if (h > size.maxHeight) (h = size.maxHeight), (w = h * r);
    svg.style.width = `${w.toFixed(1)}px`;
    svg.style.height = `${h.toFixed(1)}px`;
    svg.style.maxWidth = 'none';
  });
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.from(grid.children, {
    opacity: 0,
    y: L.y,
    duration: L.duration,
    stagger: { each: L.stagger, grid: 'auto', from: 'start' },
    ease: 'power2.out',
    scrollTrigger: { trigger: grid, start: 'top 90%', once: true },
  });
});
