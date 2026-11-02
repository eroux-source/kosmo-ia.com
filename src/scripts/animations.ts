/**
 * Animations GSAP équivalentes aux interactions IX3 de /reference.
 * Déclenchées par attributs (voir CLAUDE.md) :
 *   data-fade="trigger" / data-fade="target"
 *   data-stagger-text
 *   data-eyebrow="trigger" / data-eyebrow="target"
 * Le survol des boutons « Get started » est en CSS (Button.astro).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger, SplitText);

const root = document.documentElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initFade() {
  document.querySelectorAll<HTMLElement>('[data-fade="trigger"]').forEach((trigger) => {
    const targets = trigger.querySelectorAll<HTMLElement>('[data-fade="target"]');
    if (!targets.length) return;
    gsap.fromTo(
      targets,
      { opacity: 0, y: motion.fade.y },
      {
        opacity: 1,
        y: 0,
        duration: motion.fade.duration,
        ease: motion.fade.ease,
        stagger: motion.fade.stagger,
        scrollTrigger: { trigger, start: motion.fade.start, toggleActions: 'play none none none' },
      },
    );
  });
}

function initStaggerText() {
  document.querySelectorAll<HTMLElement>('[data-stagger-text]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words' });
    gsap.fromTo(
      split.words,
      { opacity: 0, yPercent: motion.staggerText.yPercent, filter: motion.staggerText.blur },
      {
        opacity: 1,
        yPercent: 0,
        filter: motion.staggerText.clear,
        duration: motion.staggerText.duration,
        stagger: motion.staggerText.stagger,
        ease: motion.staggerText.ease,
        scrollTrigger: { trigger: el, start: motion.staggerText.start, toggleActions: 'play none none none' },
      },
    );
  });
}

function initEyebrow() {
  document.querySelectorAll<HTMLElement>('[data-eyebrow="trigger"]').forEach((trigger) => {
    const bars = trigger.querySelectorAll<HTMLElement>('[data-eyebrow="target"]');
    gsap.fromTo(
      bars,
      { width: '0%' },
      {
        width: '100%',
        duration: motion.eyebrow.duration,
        ease: motion.eyebrow.ease,
        scrollTrigger: { trigger, start: motion.eyebrow.start, toggleActions: 'play none none none' },
      },
    );
  });
}

/* Vidéo en biais du bloc concept gratuit : entrée au scroll, redressée au survol. */
function initTilt() {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: motion.tilt.y, rotation: 0 },
      {
        opacity: 1,
        y: 0,
        rotation: motion.tilt.rotation,
        duration: motion.tilt.duration,
        ease: motion.tilt.ease,
        scrollTrigger: { trigger: el, start: motion.tilt.start, toggleActions: 'play none none none' },
      },
    );
    el.addEventListener('mouseenter', () => gsap.to(el, { rotation: 0, duration: motion.tilt.hoverDuration, ease: motion.tilt.hoverEase }));
    el.addEventListener('mouseleave', () => gsap.to(el, { rotation: motion.tilt.rotation, duration: motion.tilt.hoverDuration, ease: motion.tilt.hoverEase }));
  });
}

if (reduceMotion) {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => gsap.set(el, { rotation: motion.tilt.rotation }));
  root.classList.add('motion-ready');
} else {
  initFade();
  initStaggerText();
  initEyebrow();
  initTilt();
  root.classList.add('motion-ready');
}

/* Les images, polices et canvas chargés après coup décalent la page : on recalcule les déclencheurs. */
window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts?.ready.then(() => ScrollTrigger.refresh());
