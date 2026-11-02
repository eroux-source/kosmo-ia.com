/**
 * Map monde en pixels sur canvas. Chaque pixel de terre a une intensité qui monte vite
 * quand le pointeur approche et redescend lentement quand il s'éloigne : les pixels
 * grossissent, passent de la première à la dernière couleur de --map-trail-colors en
 * s'éteignant, et laissent une traînée derrière le pointeur. Les repères de villes
 * (HTML) affichent leur vignette au survol.
 */
import world from '../data/world-dots.json';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector<HTMLElement>('[data-world-map]');

if (root) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-map-canvas]')!;
  const ctx = canvas.getContext('2d')!;
  const styles = getComputedStyle(root);
  const token = (name: string) => styles.getPropertyValue(name).trim();
  const number = (name: string, fallback: number) => Number(token(name)) || fallback;

  const REST = number('--map-dot', 0.4);
  const LIT = number('--map-dot-hover', 0.9);
  const RADIUS = number('--map-hover-radius', 9);
  const GLOW = number('--map-glow', 0.7);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const RISE = reduced ? 1 : number('--map-rise', 0.35);
  const DECAY = reduced ? 1 : number('--map-decay', 0.035);

  // Le canvas normalise n'importe quelle notation de couleur en hexadécimal.
  const parse = (value: string) => {
    ctx.fillStyle = value;
    const hex = String(ctx.fillStyle);
    return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  };
  const restColor = token('--map-rest-color') || token('--grey-200');
  const trail = token('--map-trail-colors')
    .split(',')
    .map((value) => parse(value.trim()));
  const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  /** Couleur de traînée : t = 0 sous le pointeur, 1 en fin d'extinction. */
  const mix = (t: number) => {
    const pos = t * (trail.length - 1);
    const from = trail[Math.floor(pos)];
    const to = trail[Math.min(Math.ceil(pos), trail.length - 1)];
    const k = pos - Math.floor(pos);
    return `#${hex2(from[0] + (to[0] - from[0]) * k)}${hex2(from[1] + (to[1] - from[1]) * k)}${hex2(from[2] + (to[2] - from[2]) * k)}`;
  };

  const { cols, rows, dots } = world as { cols: number; rows: number; dots: number[][] };
  const count = dots.length;
  const intensity = new Float32Array(count);
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);
  let cell = 0;
  let width = 0;
  let height = 0;
  let frame = 0;
  let pointer: { x: number; y: number } | null = null; // en cellules
  // Apparition de gauche à droite à l'entrée à l'écran (0 → 1 = part de la largeur dessinée)
  let intro = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;

  const draw = () => {
    frame = 0;
    ctx.clearRect(0, 0, width, height);
    let alive = false;
    const restSize = cell * REST;
    ctx.globalAlpha = 1;
    ctx.fillStyle = restColor;
    for (let i = 0; i < count; i++) {
      if (dots[i][0] / cols > intro) continue;
      ctx.fillRect(xs[i] - restSize / 2, ys[i] - restSize / 2, restSize, restSize);
    }
    for (let i = 0; i < count; i++) {
      let target = 0;
      if (pointer) {
        const d = Math.hypot(dots[i][0] + 0.5 - pointer.x, dots[i][1] + 0.5 - pointer.y);
        if (d < RADIUS) target = Math.pow(1 - d / RADIUS, 1.5);
      }
      const current = intensity[i];
      const next = current + (target - current) * (target > current ? RISE : DECAY);
      const k = next < 0.005 ? 0 : next;
      intensity[i] = k;
      if (k === 0) continue;
      alive = true;
      const color = mix(1 - k);
      const size = cell * (REST + (LIT - REST) * k);
      if (GLOW > 0 && k > 0.2) {
        const glow = size + cell * GLOW;
        ctx.globalAlpha = k * 0.15;
        ctx.fillStyle = color;
        ctx.fillRect(xs[i] - glow / 2, ys[i] - glow / 2, glow, glow);
      }
      ctx.globalAlpha = Math.sqrt(k);
      ctx.fillStyle = color;
      ctx.fillRect(xs[i] - size / 2, ys[i] - size / 2, size, size);
    }
    ctx.globalAlpha = 1;
    if (pointer || alive) frame = requestAnimationFrame(draw);
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cell = width / cols;
    for (let i = 0; i < count; i++) {
      xs[i] = (dots[i][0] + 0.5) * cell;
      ys[i] = (dots[i][1] + 0.5) * cell;
    }
    cancelAnimationFrame(frame);
    draw();
  };

  const toCell = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * cols, y: ((event.clientY - rect.top) / rect.height) * rows };
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  root.addEventListener('pointermove', (event) => {
    pointer = toCell(event);
    wake();
  });
  const leave = () => {
    pointer = null;
    wake();
  };
  root.addEventListener('pointerleave', leave);
  root.addEventListener('pointercancel', leave);
  new ResizeObserver(resize).observe(canvas);

  if (intro < 1) {
    const { worldMap: W } = motion;
    const o = { p: 0 };
    gsap.to(o, {
      p: 1,
      duration: W.introDuration,
      ease: W.introEase,
      scrollTrigger: { trigger: canvas, start: W.start, once: true },
      onUpdate: () => {
        intro = o.p;
        if (!frame) draw();
      },
    });
    gsap.from(root.querySelectorAll('[data-map-city]'), {
      scale: 0,
      opacity: 0,
      duration: W.pinDuration,
      stagger: W.pinStagger,
      ease: W.pinEase,
      delay: W.pinDelay,
      scrollTrigger: { trigger: canvas, start: W.start, once: true },
    });
  }

  // Repères (point + étiquette dans la même ancre) : positions en pourcentage de la map.
  root.querySelectorAll<HTMLElement>('[data-x]').forEach((el) => {
    el.style.left = `${el.dataset.x}%`;
    el.style.top = `${el.dataset.y}%`;
  });

}

export {};
