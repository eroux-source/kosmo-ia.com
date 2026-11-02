/**
 * Avant / après « Compare » (SparkCompare.astro), port du composant Aceternity :
 * - la ligne suit le pointeur (souris : sans clic, comme le mode « hover » ; doigt : en glissant) et revient au milieu
 *   quand la souris sort ; la position passe par --spark-x (film de gauche coupé + ligne, global.css) ;
 * - champ d'étincelles à droite de la ligne, comme SparklesCore (tsparticles) : particules blanches de 0,4 à 1 px,
 *   1200 pour 400 × 400 px, qui dérivent dans toutes les directions, ressortent du côté opposé et scintillent chacune à
 *   son rythme ;
 * - les deux films sont lancés à l'écran, gardés synchrones, mis en pause hors écran (étincelles aussi).
 * Réduction des animations : étincelles figées, films en pause sur leur première image.
 */
import { motion } from './motion-tokens';

const S = motion.sparkCompare;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
/** Couleur d'un token CSS, résolue par le navigateur (le canvas ne lit pas les var()). */
const tokenColor = (name: string) => {
  const probe = document.createElement('i');
  probe.style.color = `var(${name})`;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
};

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  o: number;
  vo: number;
}

document.querySelectorAll<HTMLElement>('[data-spark-compare]').forEach((root) => {
  const handle = root.querySelector<HTMLElement>('[data-spark-handle]');
  const canvas = root.querySelector<HTMLCanvasElement>('[data-spark-field]');
  const ctx = canvas?.getContext('2d');
  if (!handle || !canvas || !ctx) return;
  const videos = [...root.querySelectorAll<HTMLVideoElement>('video')];
  const ink = tokenColor('--kosmo-white');

  let value = S.start;
  let touching = false;
  let visible = false;
  let raf = 0;
  let last = 0;
  let W = 0;
  let H = 0;
  let sparks: Spark[] = [];

  const set = (v: number) => {
    value = Math.max(0, Math.min(1, v));
    root.style.setProperty('--spark-x', `${value * 100}%`);
    handle.setAttribute('aria-valuenow', String(Math.round(value * 100)));
  };
  const fromPointer = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    set((e.clientX - r.left) / r.width);
  };

  // Souris : la ligne suit sans clic et revient au milieu à la sortie. Doigt : elle suit le glissé.
  handle.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' || touching) fromPointer(e);
  });
  handle.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    touching = true;
    fromPointer(e);
  });
  const release = () => {
    touching = false;
  };
  handle.addEventListener('pointerup', release);
  handle.addEventListener('pointercancel', release);
  handle.addEventListener('pointerleave', (e) => {
    if (e.pointerType === 'mouse') set(S.start);
  });
  handle.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -S.step, ArrowRight: S.step, PageDown: -S.page, PageUp: S.page } as Record<string, number>;
    if (e.key in step) set(value + step[e.key]);
    else if (e.key === 'Home') set(0);
    else if (e.key === 'End') set(1);
    else return;
    e.preventDefault();
  });

  // Étincelles.
  const spawn = (): Spark => {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(S.speed.min, S.speed.max);
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: rand(S.size.min, S.size.max),
      o: rand(S.opacity.min, S.opacity.max),
      vo: S.twinkle * Math.random() * (Math.random() < 0.5 ? -1 : 1),
    };
  };
  const size = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sparks = Array.from({ length: Math.round((S.density * W * H) / S.densityArea) }, spawn);
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ink;
    for (const s of sparks) {
      ctx.globalAlpha = s.o;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };
  const step = (k: number) => {
    for (const s of sparks) {
      s.x += s.vx * k;
      s.y += s.vy * k;
      // Sortie d'un côté : retour par le côté opposé, à une hauteur (ou largeur) au hasard.
      if (s.x < -s.r) [s.x, s.y] = [W + s.r, Math.random() * H];
      else if (s.x > W + s.r) [s.x, s.y] = [-s.r, Math.random() * H];
      if (s.y < -s.r) [s.y, s.x] = [H + s.r, Math.random() * W];
      else if (s.y > H + s.r) [s.y, s.x] = [-s.r, Math.random() * W];
      s.o += s.vo * k;
      if (s.o > S.opacity.max || s.o < S.opacity.min) {
        s.o = Math.max(S.opacity.min, Math.min(S.opacity.max, s.o));
        s.vo = -s.vo;
      }
    }
  };
  const loop = (t: number) => {
    const k = last ? Math.min((t - last) / (1000 / 60), 3) : 1;
    last = t;
    step(k);
    draw();
    raf = visible ? requestAnimationFrame(loop) : 0;
  };
  const start = () => {
    if (reduce || raf) return;
    last = 0;
    raf = requestAnimationFrame(loop);
  };

  // Films et étincelles : à l'écran seulement ; films synchronisés.
  const sync = () => {
    if (videos.length === 2 && Math.abs(videos[0].currentTime - videos[1].currentTime) > 0.1) videos[1].currentTime = videos[0].currentTime;
  };
  videos[0]?.addEventListener('timeupdate', sync);
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      videos.forEach((v) => {
        if (visible) {
          if (!v.src && v.dataset.src) v.src = v.dataset.src;
          if (!reduce) v.play().catch(() => {});
        } else v.pause();
      });
      if (visible) start();
    },
    { rootMargin: '200px 0px' },
  ).observe(root);

  new ResizeObserver(() => {
    size();
    draw();
  }).observe(canvas);
  set(S.start);
});
