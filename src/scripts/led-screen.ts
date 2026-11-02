/**
 * Effet LED sur les photos des cartes services (Formats.astro, `data-led`) : recette « Vibrant Pulse Glow »
 * (21st.dev/community/ascii, rendu « lego ») posée en voile léger sur la photo.
 * - la photo est réduite à une grille de cellules (couleur moyenne, contraste) ;
 * - chaque cellule devient une brique : joint plus sombre, face, plot rond éclairci avec un reflet en haut à gauche ;
 * - halo (bloom : la grille agrandie avec lissage, en « screen ») et vignette ; le tout dessiné une fois ;
 * - à chaque image, la couche de briques est posée en transparence puis un anneau lumineux part du centre (pulse),
 *   30 images / s tant que la carte est à l'écran. Réduction des animations : image fixe, sans anneau.
 */
import { motion } from './motion-tokens';

const L = motion.led;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Couleur canvas en hexadécimal à partir de composantes calculées (la photo), bornées à 0-255. */
const hex = (r: number, g: number, b: number, a = 1) =>
  `#${[r, g, b, a * 255].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;

document.querySelectorAll<HTMLElement>('[data-led]').forEach((host) => {
  const img = host.querySelector('img');
  const cv = host.querySelector('canvas');
  const ctx = cv?.getContext('2d');
  if (!img || !cv || !ctx) return;

  let W = 0;
  let H = 0;
  let layer: HTMLCanvasElement | null = null;
  let visible = false;
  let raf = 0;
  let last = 0;

  /** Couche fixe : briques, halo et vignette, à la taille de la carte. */
  const build = () => {
    W = host.clientWidth;
    H = host.clientHeight;
    if (!W || !H || !img.naturalWidth) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    const cols = Math.ceil(W / L.cell);
    const rows = Math.ceil(H / L.cell);

    // Couleur moyenne par cellule : la photo cadrée « cover » réduite à cols × rows.
    const grid = Object.assign(document.createElement('canvas'), { width: cols, height: rows });
    const gc = grid.getContext('2d', { willReadFrequently: true });
    if (!gc) return;
    const k = Math.max((cols * L.cell) / img.naturalWidth, (rows * L.cell) / img.naturalHeight);
    const sw = (cols * L.cell) / k;
    const sh = (rows * L.cell) / k;
    gc.imageSmoothingQuality = 'high';
    gc.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, 0, 0, cols, rows);
    const px = gc.getImageData(0, 0, cols, rows).data;
    for (let i = 0; i < px.length; i += 4) for (let c = 0; c < 3; c++) px[i + c] = (px[i + c] - 128) * L.contrast + 128;
    gc.putImageData(new ImageData(px, cols, rows), 0, 0);

    layer = Object.assign(document.createElement('canvas'), { width: cv.width, height: cv.height });
    const lc = layer.getContext('2d');
    if (!lc) return;
    lc.scale(dpr, dpr);
    const s = L.cell;
    const r = s * L.stud;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        const [R, G, B] = [px[i], px[i + 1], px[i + 2]];
        const ox = x * s;
        const oy = y * s;
        lc.fillStyle = hex(R * L.joint, G * L.joint, B * L.joint);
        lc.fillRect(ox, oy, s, s);
        lc.fillStyle = hex(R, G, B);
        lc.fillRect(ox, oy, s - 1, s - 1);
        lc.fillStyle = hex(R * L.studLift, G * L.studLift, B * L.studLift);
        lc.beginPath();
        lc.arc(ox + s / 2, oy + s / 2, r, 0, Math.PI * 2);
        lc.fill();
        lc.fillStyle = hex(255, 255, 255, L.highlight);
        lc.beginPath();
        lc.arc(ox + s / 2 - r / 3, oy + s / 2 - r / 3, r / 3, 0, Math.PI * 2);
        lc.fill();
      }
    }
    // Halo : la grille agrandie avec lissage, éclaircie en « screen ».
    lc.globalCompositeOperation = 'screen';
    lc.globalAlpha = L.bloom;
    lc.imageSmoothingEnabled = true;
    lc.drawImage(grid, 0, 0, cols * s, rows * s);
    // Vignette.
    lc.globalCompositeOperation = 'source-over';
    lc.globalAlpha = 1;
    const v = lc.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) / 2);
    v.addColorStop(0, hex(0, 0, 0, 0));
    v.addColorStop(1, hex(0, 0, 0, L.vignette));
    lc.fillStyle = v;
    lc.fillRect(0, 0, W, H);
    draw(0);
  };

  /** Image : la couche en transparence, puis l'anneau de pulsation (seulement sur les briques). */
  const draw = (t: number) => {
    if (!layer) return;
    const dpr = cv.width / W;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = L.opacity;
    ctx.drawImage(layer, 0, 0);
    if (reduce) return;
    const R = Math.hypot(W, H) / 2;
    const f = ((t / 1000) % L.pulsePeriod) / L.pulsePeriod;
    const mid = f * (1 + L.pulseWidth);
    const at = (v: number) => Math.max(0, Math.min(1, v));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, R);
    g.addColorStop(at(mid - L.pulseWidth), hex(255, 255, 255, 0));
    g.addColorStop(at(mid - L.pulseWidth / 2), hex(255, 255, 255, L.pulse));
    g.addColorStop(at(mid), hex(255, 255, 255, 0));
    ctx.globalCompositeOperation = 'source-atop';
    ctx.globalAlpha = L.opacity * (1 - f);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  };

  const tick = (t: number) => {
    raf = 0;
    if (!visible) return;
    if (t - last >= 1000 / L.fps) {
      last = t;
      draw(t);
    }
    raf = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !reduce && !raf) raf = requestAnimationFrame(tick);
  }).observe(host);
  new ResizeObserver(() => build()).observe(host);
  if (img.complete) build();
  else img.addEventListener('load', build, { once: true });
});
