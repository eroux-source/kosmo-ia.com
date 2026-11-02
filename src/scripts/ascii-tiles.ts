/**
 * Tuiles de films tramés (Stats.astro, `tiles`) : recette « Prisma » (21st.dev/community/ascii) en version grise
 * fondue dans le fond. Chaque image du film (proxy 360p muet) est réduite à une cellule = un pixel, tramée en gris
 * (matrice de Bayer, contraste, contours), les zones très colorées passent en acide, puis agrandie sans lissage ;
 * grain, lignes et vignette par-dessus. 15 images / s, seulement quand la tuile est à l'écran.
 */
import { motion } from './motion-tokens';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const P = motion.prisma;
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const rgbOf = (c: string) => (c.match(/\d+(\.\d+)?/g) ?? ['0', '0', '0']).slice(0, 3).map(Number);
/** Couleur canvas en hexadécimal (#rrggbbaa) à partir de composantes lues dans les tokens. */
const hex = (c: number[], a = 1) => `#${[...c, a * 255].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
const root = getComputedStyle(document.documentElement);
const INK = rgbOf(getComputedStyle(document.body).color);
const acidProbe = document.createElement('i');
acidProbe.style.color = root.getPropertyValue('--kosmo-acid');
document.body.append(acidProbe);
const ACID = rgbOf(getComputedStyle(acidProbe).color);
acidProbe.remove();

document.querySelectorAll<HTMLElement>('[data-ascii]').forEach((tile) => {
  // Tuile masquée (mobile, Stats.astro) : ni film téléchargé ni rendu.
  if (!tile.offsetParent) return;
  const cv = tile.querySelector('canvas');
  const ctx = cv?.getContext('2d');
  if (!cv || !ctx) return;
  const vid = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'auto' });
  vid.src = tile.dataset.ascii ?? '';
  const BG = rgbOf(getComputedStyle(tile).backgroundColor);
  let W = 0;
  let H = 0;
  let cols = 0;
  let rows = 0;
  let sc: CanvasRenderingContext2D | null = null;
  let out: HTMLCanvasElement;
  let oc: CanvasRenderingContext2D | null = null;
  let od: ImageData;
  let grain: HTMLCanvasElement;
  let cover: Uint8Array;
  let visible = false;
  let last = 0;

  const setup = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = tile.clientWidth;
    H = tile.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(W / P.cell);
    rows = Math.ceil(H / P.cell);
    const sm = Object.assign(document.createElement('canvas'), { width: cols, height: rows });
    sc = sm.getContext('2d', { willReadFrequently: true });
    out = Object.assign(document.createElement('canvas'), { width: cols, height: rows });
    oc = out.getContext('2d');
    if (!oc) return;
    od = oc.createImageData(cols, rows);
    cover = new Uint8Array(cols * rows).map(() => (Math.random() < P.coverage ? 1 : 0));
    grain = Object.assign(document.createElement('canvas'), { width: 128, height: 128 });
    const gc = grain.getContext('2d');
    if (!gc) return;
    const gd = gc.createImageData(128, 128);
    for (let i = 0; i < gd.data.length; i += 4) {
      const n = Math.random() * 255;
      gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = n;
      gd.data[i + 3] = 255;
    }
    gc.putImageData(gd, 0, 0);
  };

  const frame = () => {
    if (!sc || !oc || vid.readyState < 2) return;
    const amp = 0.07 * P.flicker;
    const vw = vid.videoWidth;
    const vh = vid.videoHeight;
    const r = Math.max(cols / vw, rows / vh);
    sc.drawImage(vid, (cols - vw * r) / 2, (rows - vh * r) / 2, vw * r, vh * r);
    const d = sc.getImageData(0, 0, cols, rows).data;
    const o = od.data;
    const n = cols * rows;
    const lum = new Float32Array(n);
    for (let i = 0; i < n; i++) lum[i] = (0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]) / 255;
    const L = (x: number, y: number) => lum[Math.min(rows - 1, Math.max(0, y)) * cols + Math.min(cols - 1, Math.max(0, x))];
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const j = i * 4;
        const v = (lum[i] - 0.5) * P.contrast + 0.5 + Math.hypot(L(x + 1, y) - L(x - 1, y), L(x, y + 1) - L(x, y - 1)) * P.edge;
        const dark = 1 - Math.min(1, Math.max(0, v));
        const jitter = reduce ? 0 : (Math.random() - 0.5) * amp;
        // tons : les gris clairs fondent dans le fond, les sombres vont au noir plein
        const tone = Math.min(1, Math.max(0, (dark - P.toneFrom) / P.toneRange));
        const on = cover[i] && tone > BAYER[(y % 4) * 4 + (x % 4)] + jitter;
        const R = d[j];
        const G = d[j + 1];
        const B = d[j + 2];
        const mx = Math.max(R, G, B);
        const sat = mx ? (mx - Math.min(R, G, B)) / mx : 0;
        // touches d'acide : les zones très colorées du film
        const isAcid = sat > 0.5 && mx > 90;
        const col = isAcid && on ? ACID : INK;
        const k = !cover[i] ? 0 : on ? 1 : tone * P.offShare;
        for (let c = 0; c < 3; c++) o[j + c] = BG[c] + (col[c] - BG[c]) * k;
        o[j + 3] = 255;
      }
    oc.putImageData(od, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(out, 0, 0, cols * P.cell, rows * P.cell);
    const dpr = cv.width / W;
    if (!reduce && Math.random() < P.glitch * 0.1) {
      for (let g = 0; g < 2; g++) {
        const y = Math.random() * H;
        const h = 2 + Math.random() * 6;
        ctx.drawImage(cv, 0, y * dpr, cv.width, h * dpr, (Math.random() - 0.5) * 8, y, W, h);
      }
    }
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = P.grain * 0.5;
    const ox = Math.random() * 128;
    const oy = Math.random() * 128;
    for (let x = -ox; x < W; x += 128) for (let y = -oy; y < H; y += 128) ctx.drawImage(grain, x, y);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = P.scan;
    ctx.fillStyle = hex(BG);
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
    ctx.globalAlpha = 1;
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.hypot(W, H) / 2);
    vg.addColorStop(0, hex(BG, 0));
    vg.addColorStop(1, hex(BG, P.vignette));
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
  };

  const loop = (t: number) => {
    if (!visible) return;
    if (t - last > 1000 / P.fps) {
      last = t;
      frame();
    }
    requestAnimationFrame(loop);
  };
  setup();
  new ResizeObserver(() => {
    setup();
    frame();
  }).observe(tile);
  vid.addEventListener('loadeddata', frame);
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        if (!reduce) vid.play().catch(() => {});
        else vid.addEventListener('loadeddata', frame, { once: true });
        requestAnimationFrame(loop);
      } else vid.pause();
    },
    { rootMargin: '100px 0px' },
  ).observe(tile);
});
