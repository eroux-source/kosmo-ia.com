/**
 * Inclinaison 3D qui suit le pointeur + reflet holo pixelisé ([data-tilt-holo] sur le bloc qui s'incline, .holo sur
 * l'image qui reçoit le reflet). Même recette que les timbres de la home (campaign-tickets.ts), réglages
 * motion.featuredTilt. Souris seulement ; rien si l'utilisateur réduit les animations.
 */
import { gsap } from 'gsap';
import { motion } from './motion-tokens';

const blocks = [...document.querySelectorAll<HTMLElement>('[data-tilt-holo]')];
const root = document.documentElement;

if (blocks.length) {
  /* Trame de pixels du reflet (cases de 4 px, tuile de 256 px dessinée en 2x), partagée avec les timbres. */
  if (!root.style.getPropertyValue('--holo-mask')) {
    const { holoTile: S, holoCell: C } = motion.ticket;
    const cv = Object.assign(document.createElement('canvas'), { width: S, height: S });
    const g = cv.getContext('2d');
    if (g) {
      for (let y = 0; y < S; y += C)
        for (let x = 0; x < S; x += C) {
          const r = Math.random();
          const a = r < 0.39 ? 0 : r < 0.83 ? 0.5 : r < 0.915 ? 0.375 : 0.125;
          if (!a) continue;
          g.globalAlpha = a;
          g.fillStyle = 'white';
          g.fillRect(x, y, C, C);
        }
      root.style.setProperty('--holo-mask', `url(${cv.toDataURL()})`);
    }
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    const T = motion.featuredTilt;
    const glare = getComputedStyle(root).getPropertyValue('--holo-opacity').trim();
    blocks.forEach((el) => {
      const trigger = el.closest('a') ?? el;
      gsap.set(el, { transformPerspective: T.perspective, transformOrigin: '50% 50%' });
      const rx = gsap.quickTo(el, 'rotationX', { duration: T.duration, ease: T.ease });
      const ry = gsap.quickTo(el, 'rotationY', { duration: T.duration, ease: T.ease });
      const sc = gsap.quickTo(el, 'scale', { duration: T.duration, ease: T.ease });
      const holo = el.querySelector<HTMLElement>('.holo');
      trigger.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = Math.min(0.5, Math.max(-0.5, (e.clientX - r.left) / r.width - 0.5));
        const py = Math.min(0.5, Math.max(-0.5, (e.clientY - r.top) / r.height - 0.5));
        ry(px * T.rotateY);
        rx(-py * T.rotateX);
        sc(T.scale);
        if (holo) {
          holo.style.setProperty('--gx', `${((px + 0.5) * 100).toFixed(1)}%`);
          holo.style.setProperty('--gy', `${((py + 0.5) * 100).toFixed(1)}%`);
          holo.style.setProperty('--glare-o', glare);
        }
      });
      trigger.addEventListener('pointerleave', () => {
        rx(0);
        ry(0);
        sc(1);
        holo?.style.setProperty('--glare-o', '0');
      });
    });
  }
}
