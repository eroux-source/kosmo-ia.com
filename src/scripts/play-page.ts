/**
 * Animations propres à /play (réglages motion.play) :
 *  - [data-play-track]      cases de la frise du constat, allumées une à une
 *  - [data-play-flow]       liaisons SVG canaux → jeu → leads, pointillés qui défilent (recalculées au redimensionnement)
 *  - [data-play-tabs]       onglets objectifs → mécaniques (clic, flèches haut / bas / gauche / droite)
 *  - [data-play-levels]     barre de progression du process, liée au scroll, niveaux validés au passage
 *  - [data-play-bar]        barres du tableau de bord (data-value en %, axe x ou y)
 *  - [data-play-bob]        sprites qui flottent en deux temps, comme un sprite de jeu
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const m = motion.play;

function initTrack() {
  document.querySelectorAll<HTMLElement>('[data-play-track]').forEach((track) => {
    const cells = track.querySelectorAll<HTMLElement>('[data-play-cell]');
    if (reduceMotion) return;
    gsap.fromTo(
      cells,
      { opacity: 0, x: motion.staggerText.x },
      { opacity: 1, x: 0, duration: m.track.duration, ease: m.track.ease, stagger: m.track.stagger, scrollTrigger: { trigger: track, start: m.track.start, toggleActions: 'play none none none' } },
    );
  });
}

function initFlow() {
  const SVG = 'http://www.w3.org/2000/svg';
  document.querySelectorAll<HTMLElement>('[data-play-flow]').forEach((flow) => {
    const svg = flow.querySelector<SVGSVGElement>('[data-play-flow-lines]');
    const hub = flow.querySelector<HTMLElement>('[data-flow-hub]');
    const out = flow.querySelector<HTMLElement>('[data-flow-out]');
    if (!svg || !hub || !out) return;
    let tweens: gsap.core.Tween[] = [];

    const draw = () => {
      tweens.forEach((t) => t.kill());
      tweens = [];
      svg.replaceChildren();
      if (getComputedStyle(svg).display === 'none') return;
      const box = flow.getBoundingClientRect();
      const h = hub.getBoundingClientRect();
      const o = out.getBoundingClientRect();
      const paths: string[] = [];
      flow.querySelectorAll<HTMLElement>('[data-flow-from]').forEach((card) => {
        const c = card.getBoundingClientRect();
        const fromLeft = card.dataset.flowFrom === 'left';
        const x1 = (fromLeft ? c.right : c.left) - box.left;
        const y1 = c.top + c.height / 2 - box.top;
        const x2 = (fromLeft ? h.left : h.right) - box.left;
        const y2 = h.top + h.height / 2 - box.top;
        const mid = (x1 + x2) / 2;
        paths.push(`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`);
      });
      const cx = h.left + h.width / 2 - box.left;
      paths.push(`M${cx},${h.bottom - box.top} L${cx},${o.top - box.top}`);

      paths.forEach((d) => {
        const base = document.createElementNS(SVG, 'path');
        base.setAttribute('d', d);
        base.setAttribute('fill', 'none');
        base.setAttribute('class', 'stroke-line-dark');
        const dash = document.createElementNS(SVG, 'path');
        dash.setAttribute('d', d);
        dash.setAttribute('fill', 'none');
        dash.setAttribute('stroke-dasharray', m.flow.dash);
        dash.setAttribute('class', 'stroke-acid stroke-2');
        svg.append(base, dash);
        if (!reduceMotion) tweens.push(gsap.to(dash, { strokeDashoffset: -m.flow.cycle, duration: m.flow.duration, ease: 'none', repeat: -1 }));
      });
    };

    draw();
    new ResizeObserver(() => draw()).observe(flow);
    // Les cartes entrent en glissant (data-fade, en cascade) : on retrace quand la dernière est posée.
    const targets = flow.closest('[data-fade="trigger"]')?.querySelectorAll('[data-fade="target"]').length ?? 0;
    ScrollTrigger.create({ trigger: flow, start: 'top bottom', once: true, onEnter: () => gsap.delayedCall(motion.fade.duration + motion.fade.stagger * targets, draw) });
  });
}

function initTabs() {
  document.querySelectorAll<HTMLElement>('[data-play-tabs]').forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const select = (index: number, focus = false) => {
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(tab.getAttribute('aria-controls') ?? '');
        if (!panel) return;
        panel.hidden = !on;
        if (on && !reduceMotion) gsap.fromTo(panel, { opacity: 0, x: motion.staggerText.x }, { opacity: 1, x: 0, duration: motion.fade.duration, ease: motion.fade.ease });
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (event) => {
        const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : event.key === 'ArrowUp' || event.key === 'ArrowLeft' ? -1 : 0;
        if (!step) return;
        event.preventDefault();
        select((i + step + tabs.length) % tabs.length, true);
      });
    });
  });
}

function initLevels() {
  document.querySelectorAll<HTMLElement>('[data-play-levels]').forEach((root) => {
    const fill = root.querySelector<HTMLElement>('[data-play-progress-fill]');
    const levels = [...root.querySelectorAll<HTMLElement>('[data-play-level]')];
    if (!fill) return;
    const set = (progress: number) => {
      fill.style.width = `${progress * 100}%`;
      // Chaque niveau est au centre de sa colonne : 1/6, 3/6, 5/6 de la barre.
      levels.forEach((level, i) => (level.dataset.reached = String(progress >= (2 * i + 1) / (2 * levels.length))));
    };
    if (reduceMotion) return set(1);
    ScrollTrigger.create({ trigger: fill.parentElement ?? root, start: m.progress.start, end: m.progress.end, scrub: true, onUpdate: (self) => set(self.progress) });
  });
}

function initBars() {
  document.querySelectorAll<HTMLElement>('[data-play-dashboard]').forEach((root) => {
    const bars = [...root.querySelectorAll<HTMLElement>('[data-play-bar]')];
    const target = (bar: HTMLElement) => ({ [bar.dataset.playBar === 'x' ? 'width' : 'height']: `${bar.dataset.value}%` });
    if (reduceMotion) return bars.forEach((bar) => gsap.set(bar, target(bar)));
    bars.forEach((bar, i) =>
      gsap.to(bar, { ...target(bar), duration: m.bars.duration, ease: m.bars.ease, delay: i * m.bars.stagger, scrollTrigger: { trigger: root, start: m.bars.start, toggleActions: 'play none none none' } }),
    );
  });
}

function initBob() {
  if (reduceMotion) return;
  document.querySelectorAll<HTMLElement>('[data-play-bob]').forEach((el, i) => {
    gsap.to(el, { y: m.bob.y, duration: m.bob.duration, ease: m.bob.ease, repeat: -1, yoyo: true, delay: (i % 4) * m.bob.duration * 0.5 });
  });
}

initTrack();
initFlow();
initTabs();
initLevels();
initBars();
initBob();
