/**
 * Éventail de témoignages : chaque carte est placée selon sa position par rapport au centre
 * (décalage horizontal, montée de la centrale, alternance haut/bas et inclinaison des autres).
 * Clic sur une carte = la ramener au centre ; flèches = un cran ; au doigt, un glissé horizontal = un cran.
 * Bordure « spotlight » qui suit le pointeur.
 */
import { motion } from './motion-tokens';

document.querySelectorAll<HTMLElement>('[data-stagger-testimonials]').forEach((root) => {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-stagger-card]')];
  if (cards.length < 2) return;
  const styles = getComputedStyle(root);
  const read = (name: string) => styles.getPropertyValue(name).trim();
  let order = cards.slice();

  const render = () => {
    const size = cards[0].getBoundingClientRect().width;
    const step = Number(read('--stagger-step')) || 0.66;
    const half = Math.floor(order.length / 2);
    order.forEach((card, index) => {
      const position = index - half;
      const center = position === 0;
      const odd = Math.abs(position) % 2 === 1;
      const y = center ? `calc(-50% - ${read('--stagger-lift')})` : `calc(-50% ${odd ? '+' : '-'} ${read('--stagger-offset')})`;
      const tilt = center ? '0deg' : `${odd ? '' : '-'}${read('--stagger-tilt')}`;
      card.style.transform = `translate(-50%, ${y}) translateX(${size * step * position}px) rotate(${tilt})`;
      card.style.zIndex = String(order.length - Math.abs(position));
      card.toggleAttribute('data-center', center);
      card.setAttribute('aria-current', center ? 'true' : 'false');
      card.dataset.position = String(position);
    });
  };

  const move = (steps: number) => {
    if (steps > 0) for (let i = 0; i < steps; i++) order.push(order.shift()!);
    else for (let i = 0; i > steps; i--) order.unshift(order.pop()!);
    render();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => move(Number(card.dataset.position ?? 0)));
  });
  root.querySelector('[data-stagger-prev]')?.addEventListener('click', () => move(-1));
  root.querySelector('[data-stagger-next]')?.addEventListener('click', () => move(1));

  /* Glissé au doigt : vers la gauche = carte suivante, vers la droite = précédente (le vertical reste au défilement). */
  let sx = 0;
  let sy = 0;
  root.addEventListener('touchstart', (e) => ((sx = e.touches[0].clientX), (sy = e.touches[0].clientY)), { passive: true });
  root.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > motion.swipe.threshold && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
    },
    { passive: true },
  );
  new ResizeObserver(render).observe(root);
  render();

  /* Spotlight : position du pointeur relative à chaque carte (--x / --y en px) et dans la fenêtre (--xp, pour la teinte). */
  let px = -9999;
  let py = -9999;
  let frame = 0;
  const spot = () => {
    frame = 0;
    const xp = (px / window.innerWidth).toFixed(3);
    cards.forEach((c) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--x', (px - r.left).toFixed(1));
      c.style.setProperty('--y', (py - r.top).toFixed(1));
      c.style.setProperty('--xp', xp);
    });
  };
  const queue = () => {
    if (!frame) frame = requestAnimationFrame(spot);
  };
  window.addEventListener(
    'pointermove',
    (e) => {
      px = e.clientX;
      py = e.clientY;
      queue();
    },
    { passive: true },
  );
  window.addEventListener('scroll', queue, { passive: true });
  cards.forEach((c) => c.addEventListener('transitionend', spot));
});

export {};
