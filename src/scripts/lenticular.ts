/**
 * Comparateur lenticulaire (LenticularCompare.astro), port du composant « Lenticular Compare » (21st.dev) :
 * - N lamelles ; chaque lamelle est une fenêtre en perspective contenant un prisme 3D (transform-style: preserve-3d) à
 *   deux faces : A (avant) devant, B (après) tournée de 90°, toutes deux à translateZ(profondeur / 2) ;
 * - le prisme pivote de 0 à -90° (rotateY), chaque lamelle avec un léger retard de gauche à droite ;
 * - ombrage des faces selon l'angle (brightness), ressort (raideur 265, amortissement 34, masse 0,72) ;
 * - aux extrémités, les films entiers prennent le relais (les lamelles s'effacent).
 * Les faces sont des canvas redessinés depuis les deux films (ou deux images), 30 images / s tant que les lamelles sont
 * visibles et la section à l'écran.
 */
import { motion } from './motion-tokens';

const L = motion.lenticular;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number) => Math.max(0, Math.min(1, v));

type Src = HTMLVideoElement | HTMLImageElement;
const ready = (s: Src | null) => !!s && (s instanceof HTMLVideoElement ? s.readyState >= 2 : s.complete && s.naturalWidth > 0);
const dims = (s: Src) => (s instanceof HTMLVideoElement ? { w: s.videoWidth, h: s.videoHeight } : { w: s.naturalWidth, h: s.naturalHeight });

document.querySelectorAll<HTMLElement>('[data-lenticular]').forEach((root) => {
  const stage = root.querySelector<HTMLElement>('[data-lenticular-stage]');
  const facetsBox = root.querySelector<HTMLElement>('[data-lenticular-facets]');
  const range = root.querySelector<HTMLInputElement>('[data-lenticular-range]');
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-lenticular-to]')];
  const a = root.querySelector<Src>('[data-lenticular-va], [data-lenticular-ia]');
  const b = root.querySelector<Src>('[data-lenticular-vb], [data-lenticular-ib]');
  if (!stage || !facetsBox || !a || !b) return;
  const videos = [a, b].filter((s): s is HTMLVideoElement => s instanceof HTMLVideoElement);

  let W = 0;
  let H = 0;
  let n = 0;
  let dpr = 1;
  type Facet = { prism: HTMLElement; faceA: HTMLElement; faceB: HTMLElement; ctxA: CanvasRenderingContext2D; ctxB: CanvasRenderingContext2D };
  let facets: Facet[] = [];

  // Ressort
  let p = 0;
  let v = 0;
  let target = 0;
  let visible = false;
  let raf = 0;
  let lastT = 0;
  let lastDraw = 0;

  const build = () => {
    W = stage.clientWidth;
    H = stage.clientHeight;
    if (!W || !H) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    n = W < L.mobileBreakpoint ? L.facetsMobile : L.facets;
    facetsBox.replaceChildren();
    facets = [];
    const d = W / n;
    for (let i = 0; i < n; i++) {
      const win = document.createElement('div');
      win.className = 'lenticular-facet';
      win.style.left = `${(i / n) * 100}%`;
      win.style.width = `${100 / n + L.overlap}%`;
      const prism = document.createElement('div');
      prism.className = 'lenticular-prism';
      const make = (back: boolean) => {
        const wrap = document.createElement('div');
        wrap.className = 'lenticular-face';
        wrap.style.transform = back ? `rotateY(90deg) translateZ(${d / 2}px)` : `translateZ(${d / 2}px)`;
        const cv = document.createElement('canvas');
        cv.width = Math.ceil(d * dpr);
        cv.height = Math.ceil(H * dpr);
        cv.className = 'lenticular-face';
        const edge = document.createElement('span');
        edge.className = 'lenticular-face-edge';
        wrap.append(cv, edge);
        prism.append(wrap);
        return { wrap, ctx: cv.getContext('2d')! };
      };
      const fa = make(false);
      const fb = make(true);
      win.append(prism);
      facetsBox.append(win);
      facets.push({ prism, faceA: fa.wrap, faceB: fb.wrap, ctxA: fa.ctx, ctxB: fb.ctx });
    }
    paintFaces(true);
    render();
  };

  /** Dessine dans chaque face sa tranche du film (cadrage « cover » sur la scène). */
  const paintFaces = (force = false) => {
    if (!facets.length || (!force && !(ready(a) && ready(b)))) return;
    const d = W / n;
    const draw = (s: Src, ctx: CanvasRenderingContext2D, i: number) => {
      if (!ready(s)) return;
      const { w, h } = dims(s);
      const k = Math.max(W / w, H / h);
      const ox = (w * k - W) / 2;
      const oy = (h * k - H) / 2;
      ctx.drawImage(s, (i * d + ox) / k, oy / k, d / k, H / k, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    facets.forEach((f, i) => {
      draw(a, f.ctxA, i);
      draw(b, f.ctxB, i);
    });
  };

  /** Pose les angles, l'ombrage et les fondus selon p. */
  const render = () => {
    const d = W / n;
    const showFacets = p > L.hide && p < 1 - L.hide;
    facetsBox.style.opacity = showFacets ? '1' : '0';
    b.style.opacity = String(p > 1 - L.snap ? (p - (1 - L.snap)) / L.snap : 0);
    if (!showFacets) return;
    facets.forEach((f, i) => {
      const angle = -90 * clamp(p * (1 + L.stagger) - (i / (n - 1)) * L.stagger);
      f.prism.style.transform = `translateZ(${-d / 2}px) rotateY(${angle}deg)`;
      const rad = (angle * Math.PI) / 180;
      f.faceA.style.filter = `brightness(${L.shadeMin + (1 - L.shadeMin) * Math.cos(rad)})`;
      f.faceB.style.filter = `brightness(${L.shadeMin + (1 - L.shadeMin) * Math.cos(rad + Math.PI / 2)})`;
    });
  };

  const tick = (t: number) => {
    raf = 0;
    const dt = Math.min(0.05, lastT ? (t - lastT) / 1000 : 1 / 60);
    lastT = t;
    if (reduce) {
      p = target;
      v = 0;
    } else {
      const { stiffness: k, damping: c, mass: m } = L.spring;
      const steps = 4;
      for (let s = 0; s < steps; s++) {
        const acc = (k * (target - p) - c * v) / m;
        v += (acc * dt) / steps;
        p += (v * dt) / steps;
      }
      if (Math.abs(target - p) < 0.0005 && Math.abs(v) < 0.0005) {
        p = target;
        v = 0;
      }
    }
    const moving = p !== target || v !== 0;
    const playing = visible && videos.some((vid) => !vid.paused);
    const showFacets = p > L.hide && p < 1 - L.hide;
    if (showFacets && (playing || moving) && t - lastDraw > 1000 / L.fps) {
      lastDraw = t;
      if (videos.length === 2 && Math.abs(videos[0].currentTime - videos[1].currentTime) > 0.15) videos[1].currentTime = videos[0].currentTime;
      paintFaces();
    }
    render();
    if (moving || (visible && showFacets && playing)) raf = requestAnimationFrame(tick);
    else lastT = 0;
  };
  const wake = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const syncUi = () => {
    if (range) range.value = String(Math.round(target * 100));
    tabs.forEach((tab) => tab.setAttribute('aria-pressed', String(Number(tab.dataset.lenticularTo) === target)));
  };
  const set = (value: number) => {
    target = reduce ? (clamp(value) < 0.5 ? 0 : 1) : clamp(value);
    syncUi();
    wake();
  };

  const fromPointer = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    set((e.clientX - r.left) / r.width);
  };
  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('[data-lenticular-range]')) return;
    stage.setPointerCapture(e.pointerId);
    fromPointer(e);
  });
  stage.addEventListener('pointermove', (e) => {
    if (stage.hasPointerCapture(e.pointerId)) fromPointer(e);
  });
  range?.addEventListener('input', () => set(Number(range.value) / 100));
  tabs.forEach((tab) => tab.addEventListener('click', () => set(Number(tab.dataset.lenticularTo))));

  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        videos.forEach((vid) => {
          if (!vid.src && vid.dataset.src) vid.src = vid.dataset.src;
          if (!reduce) vid.play().catch(() => {});
        });
        wake();
      } else videos.forEach((vid) => vid.pause());
    },
    { rootMargin: '200px 0px' },
  ).observe(stage);
  [a, b].forEach((s) => s.addEventListener(s instanceof HTMLVideoElement ? 'loadeddata' : 'load', () => paintFaces()));
  videos.forEach((vid) => vid.addEventListener('play', wake));

  new ResizeObserver(build).observe(stage);
  p = target = L.start;
  syncUi();
});
