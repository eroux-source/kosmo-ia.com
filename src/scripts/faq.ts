/**
 * Accordéon FAQ (DESIGN-SYSTEM.md) : la réponse se déplie (hauteur + fondu) et le trait vertical du + pivote pour
 * former un −. À plat : plus de changement de fond de la ligne (ancienne interaction IX3 i-e63f0491).
 */
import { gsap } from 'gsap';
import { motion } from './motion-tokens';

document.querySelectorAll<HTMLElement>('[data-faq-item]').forEach((item) => {
  const trigger = item.querySelector<HTMLButtonElement>('[data-faq-trigger]');
  const panel = item.querySelector<HTMLElement>('[data-faq-panel]');
  const line = item.querySelector<HTMLElement>('[data-faq-line]');
  if (!trigger || !panel) return;

  const tl = gsap
    .timeline({ paused: true, defaults: { duration: motion.faq.duration, ease: motion.faq.ease } })
    .fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1 }, 0);
  if (line) tl.fromTo(line, { rotation: 0 }, { rotation: motion.faq.lineRotation }, 0);

  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!open));
    panel.hidden = false;
    if (open) tl.reverse();
    else tl.play();
  });
});
