/**
 * Mini-jeu de /play (section « à vous de jouer », PlayTry.astro) : « attrape les cubes ». Canvas en basse résolution (pixels logiques motion.play.game),
 * agrandi sans lissage. Écran titre en mode démo (les cubes tombent tout seuls), partie chronométrée, fin de partie
 * avec record (localStorage) et aperçu de la capture d'email. Couleurs lues dans les tokens CSS de la charte.
 * Le visiteur pilote au doigt, à la souris ou aux flèches. La boucle s'arrête quand le mobile sort de l'écran.
 */
import { motion } from './motion-tokens';
import { SPRITE_VARS, spriteRuns, type SpriteColor, type SpriteName } from '../lib/play-sprites';

const cfg = motion.play.game;
const BEST_KEY = 'kosmo-play-best';

type Kind = 'cube' | 'star' | 'trap';
interface Item {
  kind: Kind;
  x: number;
  y: number;
  vy: number;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const storage = {
  get(key: string) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* navigation privée : le record reste en mémoire */
    }
  },
};

function init(root: HTMLElement) {
  const hero = root.closest<HTMLElement>('[data-play-try]') ?? document.body;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-play-canvas]');
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return;
  canvas.width = cfg.width;
  canvas.height = cfg.height;
  ctx.imageSmoothingEnabled = false;

  const css = getComputedStyle(document.documentElement);
  const color = (c: SpriteColor) => css.getPropertyValue(SPRITE_VARS[c]).trim();

  /** Sprites pré-rendus une fois sur des canvas hors écran. */
  const sprite = (name: SpriteName) => {
    const { width, height, runs } = spriteRuns(name);
    const off = document.createElement('canvas');
    off.width = width;
    off.height = height;
    const o = off.getContext('2d')!;
    runs.forEach((r) => {
      o.fillStyle = color(r.color);
      o.fillRect(r.x, r.y, r.w, 1);
    });
    return off;
  };
  const art = { cube: sprite('cube'), star: sprite('star'), trap: sprite('trap'), tray: sprite('tray') };
  const sparkColor: Record<Kind, string> = { cube: color('A'), star: color('W'), trap: color('O') };

  const el = {
    score: root.querySelector<HTMLElement>('[data-play-score]'),
    time: root.querySelector<HTMLElement>('[data-play-time]'),
    final: root.querySelector<HTMLElement>('[data-play-final]'),
    best: root.querySelector<HTMLElement>('[data-play-best]'),
    newBest: root.querySelector<HTMLElement>('[data-play-newbest]'),
    nudge: hero.querySelector<HTMLElement>('[data-play-nudge]'),
    callouts: hero.querySelectorAll<HTMLElement>('[data-play-callout]'),
  };

  let state: 'title' | 'playing' | 'over' = 'title';
  let items: Item[] = [];
  let sparks: Spark[] = [];
  let score = 0;
  let elapsed = 0;
  let spawnIn = 0;
  let flash = 0;
  let dotOffset = 0;
  let plays = 0;
  let best = Number(storage.get(BEST_KEY)) || 0;
  const trayY = cfg.height - art.tray.height - 6;
  let playerX = (cfg.width - art.tray.width) / 2;
  let targetX = playerX;
  const keys = { left: false, right: false };

  const setCallout = (n: number) => el.callouts.forEach((c) => (c.dataset.active = c.dataset.playCallout === String(n) ? 'true' : 'false'));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  const progress = () => Math.min(elapsed / cfg.duration, 1);

  function spawn(attract = false) {
    const roll = Math.random();
    const kind: Kind = attract ? (roll < cfg.trapShare ? 'trap' : 'cube') : roll < cfg.bonusShare ? 'star' : roll < cfg.bonusShare + cfg.trapShare ? 'trap' : 'cube';
    const w = art[kind].width;
    items.push({ kind, x: Math.random() * (cfg.width - w), y: -art[kind].height, vy: attract ? cfg.fallStart : lerp(cfg.fallStart, cfg.fallEnd, progress()) * (0.85 + Math.random() * 0.3) });
  }

  function burst(x: number, y: number, kind: Kind) {
    for (let i = 0; i < cfg.burstCount; i++) {
      const angle = (Math.PI * 2 * i) / cfg.burstCount;
      sparks.push({ x, y, vx: Math.cos(angle) * cfg.burstSpeed, vy: Math.sin(angle) * cfg.burstSpeed, life: cfg.burstLife, color: sparkColor[kind] });
    }
  }

  function start() {
    state = 'playing';
    root.dataset.state = state;
    items = [];
    sparks = [];
    score = 0;
    elapsed = 0;
    spawnIn = 0;
    plays++;
    if (el.score) el.score.textContent = '0';
    if (el.time) el.time.textContent = String(cfg.duration);
    if (el.nudge) el.nudge.hidden = plays < 2;
    setCallout(2);
    root.focus({ preventScroll: true });
    window.kosmoTrack?.('play_game_start', { play: String(plays) });
  }

  function end() {
    state = 'over';
    root.dataset.state = state;
    const record = score > best;
    if (record) {
      best = score;
      storage.set(BEST_KEY, String(best));
    }
    if (el.final) el.final.textContent = String(score);
    if (el.best) el.best.textContent = String(best);
    if (el.newBest) el.newBest.hidden = !record || plays < 2;
    setCallout(3);
    window.kosmoTrack?.('play_game_end', { score: String(score), play: String(plays) });
  }

  function update(dt: number) {
    dotOffset = (dotOffset + cfg.dotSpeed * dt) % cfg.dotSpacing;
    if (flash > 0) flash -= dt;

    if (state === 'playing') {
      elapsed += dt;
      const left = Math.max(0, Math.ceil(cfg.duration - elapsed));
      if (el.time && el.time.textContent !== String(left)) el.time.textContent = String(left);
      if (keys.left) targetX -= cfg.keySpeed * dt;
      if (keys.right) targetX += cfg.keySpeed * dt;
      targetX = Math.max(0, Math.min(cfg.width - art.tray.width, targetX));
      playerX = lerp(playerX, targetX, 1 - Math.pow(1 - cfg.follow, dt * 60));
      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawn();
        spawnIn = lerp(cfg.spawnStart, cfg.spawnEnd, progress());
      }
      if (elapsed >= cfg.duration) end();
    } else if (state === 'title') {
      spawnIn -= dt;
      if (spawnIn <= 0) {
        spawn(true);
        spawnIn = cfg.spawnStart * 1.5;
      }
    }

    items = items.filter((item) => {
      item.y += item.vy * dt;
      const sprite = art[item.kind];
      if (state === 'playing') {
        const hit = item.y + sprite.height >= trayY && item.y <= trayY + 2 && item.x + sprite.width > playerX + 1 && item.x < playerX + art.tray.width - 1;
        if (hit) {
          score = Math.max(0, score + cfg.points[item.kind]);
          if (el.score) el.score.textContent = String(score);
          burst(item.x + sprite.width / 2, trayY, item.kind);
          if (item.kind === 'trap') flash = cfg.hitFlash;
          return false;
        }
      }
      return item.y < cfg.height;
    });

    sparks = sparks.filter((s) => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.life -= dt;
      return s.life > 0;
    });
  }

  function draw() {
    ctx!.fillStyle = flash > 0 ? color('O') : color('K');
    ctx!.fillRect(0, 0, cfg.width, cfg.height);
    // Grille de points qui défile : l'écran « vit » même à l'arrêt (rappel des pixels de la carte du monde).
    ctx!.fillStyle = color('G');
    ctx!.globalAlpha = Number(css.getPropertyValue('--chart-dim')) || 0.25;
    for (let y = dotOffset; y < cfg.height; y += cfg.dotSpacing) {
      for (let x = cfg.dotSpacing / 2; x < cfg.width; x += cfg.dotSpacing) ctx!.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
    ctx!.globalAlpha = 1;
    items.forEach((item) => ctx!.drawImage(art[item.kind], Math.round(item.x), Math.round(item.y)));
    sparks.forEach((s) => {
      ctx!.fillStyle = s.color;
      ctx!.fillRect(Math.round(s.x), Math.round(s.y), 1, 1);
    });
    if (state === 'playing') ctx!.drawImage(art.tray, Math.round(playerX), trayY);
  }

  let last = 0;
  let running = false;
  let frame = 0;
  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt);
    draw();
    frame = requestAnimationFrame(loop);
  };
  const run = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      frame = requestAnimationFrame(loop);
    } else cancelAnimationFrame(frame);
  };

  // Commandes
  const pointerX = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width) * cfg.width - art.tray.width / 2;
  };
  root.addEventListener('pointermove', (event) => state === 'playing' && pointerX(event));
  root.addEventListener('pointerdown', (event) => state === 'playing' && pointerX(event));
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') keys.left = true;
    else if (event.key === 'ArrowRight') keys.right = true;
    else if ((event.key === 'Enter' || event.key === ' ') && state !== 'playing' && event.target === root) {
      event.preventDefault();
      start();
      return;
    } else return;
    if (state === 'playing') event.preventDefault();
  });
  root.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowLeft') keys.left = false;
    if (event.key === 'ArrowRight') keys.right = false;
  });
  root.querySelectorAll<HTMLElement>('[data-play-start]').forEach((button) => button.addEventListener('click', start));

  if (el.best) el.best.textContent = String(best);
  draw();
  new IntersectionObserver(([entry]) => run(entry.isIntersecting)).observe(root);
}

const root = document.querySelector<HTMLElement>('[data-play-game]');
if (root) init(root);
