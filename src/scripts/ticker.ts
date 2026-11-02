/**
 * Défilement infini — équivalent du booster Flowbase « Carousel Ticker » de /reference.
 * [data-ticker="partners|team"] contient un [data-ticker-track] dupliqué pour boucler sans couture.
 */
import { gsap } from 'gsap';
import { motion } from './motion-tokens';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-ticker]').forEach((root) => {
  const config = motion.ticker[root.dataset.ticker as keyof typeof motion.ticker];
  const track = root.querySelector<HTMLElement>('[data-ticker-track]');
  if (!config || !track || reduceMotion) return;

  const clone = track.cloneNode(true) as HTMLElement;
  clone.setAttribute('aria-hidden', 'true');
  clone.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
  root.appendChild(clone);

  const tween = gsap.to([track, clone], {
    xPercent: -100,
    duration: config.duration,
    delay: config.delay,
    ease: 'none',
    repeat: -1,
  });

  if (config.pauseOnHover) {
    root.addEventListener('mouseenter', () => tween.pause());
    root.addEventListener('mouseleave', () => tween.resume());
  }
});

// Survol des cartes équipe (IX3 t-7b2a5b5d)
document.querySelectorAll<HTMLElement>('[data-team-card]').forEach((card) => {
  const image = card.querySelector('[data-team-image]');
  const overlay = card.querySelector('[data-team-overlay]');
  const { duration, imageScale } = motion.teamCard;
  const tl = gsap.timeline({ paused: true, defaults: { duration } });
  if (image) tl.to(image, { scale: imageScale }, 0);
  if (overlay) tl.to(overlay, { opacity: 1 }, 0);
  card.addEventListener('mouseenter', () => tl.play());
  card.addEventListener('mouseleave', () => tl.reverse());
});
