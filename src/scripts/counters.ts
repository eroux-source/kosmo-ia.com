/** Compteurs animés de la bande de chiffres ([data-counter]) — GSAP, une fois, à l'entrée dans le viewport. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lang = document.documentElement.lang || 'en';

document.querySelectorAll<HTMLElement>('[data-counter]').forEach((el) => {
  const target = Number(el.dataset.counter);
  /* Décimales du chiffre d'origine (2.5 → une décimale, affichée « 2,5 » en français). */
  const digits = (el.dataset.counter?.split('.')[1] ?? '').length;
  const format = new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  if (!Number.isFinite(target) || reduceMotion) {
    el.textContent = format.format(target);
    return;
  }
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: motion.counter.duration,
    ease: motion.counter.ease,
    scrollTrigger: { trigger: el, start: motion.counter.start, toggleActions: 'play none none none' },
    onUpdate: () => {
      el.textContent = format.format(digits ? state.value : Math.round(state.value));
    },
  });
});
