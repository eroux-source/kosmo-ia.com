/**
 * Timbres du modèle de campagne (CampaignModel.astro) : inclinaison 3D qui suit le pointeur, reflet holo sur l'image
 * vu à travers une trame de pixels (cases de 4 px, tuile de 256 px dessinée en 2x, niveaux 0 / 12 / 37 / 50 %).
 */
import { gsap } from 'gsap';
import { motion } from './motion-tokens';

const T = motion.ticket;
const tickets = [...document.querySelectorAll<HTMLElement>('[data-ticket]')];

if (tickets.length) {
  const S = T.holoTile;
  const C = T.holoCell;
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
    document.documentElement.style.setProperty('--holo-mask', `url(${cv.toDataURL()})`);
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    const glare = getComputedStyle(document.documentElement).getPropertyValue('--holo-opacity').trim();
    tickets.forEach((t) => {
      gsap.set(t, { transformPerspective: T.perspective, transformOrigin: '50% 50%' });
      const rx = gsap.quickTo(t, 'rotationX', { duration: T.duration, ease: T.ease });
      const ry = gsap.quickTo(t, 'rotationY', { duration: T.duration, ease: T.ease });
      const sc = gsap.quickTo(t, 'scale', { duration: T.duration, ease: T.ease });
      const im = t.querySelector<HTMLElement>('.ticket__img');
      t.addEventListener('pointermove', (e) => {
        const r = t.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * T.rotateY);
        rx(-py * T.rotateX);
        sc(T.scale);
        if (im) {
          const ir = im.getBoundingClientRect();
          im.style.setProperty('--gx', `${(((e.clientX - ir.left) / ir.width) * 100).toFixed(1)}%`);
          im.style.setProperty('--gy', `${(((e.clientY - ir.top) / ir.height) * 100).toFixed(1)}%`);
          im.style.setProperty('--glare-o', glare);
        }
      });
      t.addEventListener('pointerleave', () => {
        rx(0);
        ry(0);
        sc(1);
        im?.style.setProperty('--glare-o', '0');
      });
    });
  }
}
