/** Comparateur avant/après — équivalent du booster Flowbase « Before After Slider ». */
import { motion } from './motion-tokens';

document.querySelectorAll<HTMLElement>('[data-compare]').forEach((root) => {
  const range = root.querySelector<HTMLInputElement>('[data-compare-range]');
  const set = (value: number) => {
    const clamped = Math.min(100, Math.max(0, value));
    root.style.setProperty('--compare-position', `${clamped}%`);
    if (range) range.value = String(clamped);
  };

  set(Number(root.dataset.compareStart ?? motion.compare.start));

  const fromPointer = (event: PointerEvent) => {
    const rect = root.getBoundingClientRect();
    set(((event.clientX - rect.left) / rect.width) * 100);
  };

  root.addEventListener('pointerdown', (event) => {
    if ((event.target as HTMLElement).closest('[data-compare-label]')) return;
    root.setPointerCapture(event.pointerId);
    fromPointer(event);
    const move = (e: PointerEvent) => fromPointer(e);
    const up = () => {
      root.removeEventListener('pointermove', move);
      root.removeEventListener('pointerup', up);
    };
    root.addEventListener('pointermove', move);
    root.addEventListener('pointerup', up);
  });

  // Les étiquettes « avant » / « après » basculent d'un côté à l'autre (comportement Flowbase).
  root.querySelectorAll<HTMLElement>('[data-compare-label]').forEach((label) => {
    label.addEventListener('click', () => set(label.dataset.compareLabel === 'before' ? 100 : 0));
  });

  range?.addEventListener('input', () => set(Number(range.value)));

  // Mode vidéo : les deux vidéos (plate / 3D) restent synchronisées.
  const [before, after] = [...root.querySelectorAll<HTMLVideoElement>('video')];
  if (before && after) {
    const sync = () => {
      if (Math.abs(before.currentTime - after.currentTime) > 0.15) after.currentTime = before.currentTime;
    };
    before.addEventListener('timeupdate', sync);
    before.addEventListener('play', () => after.play().catch(() => {}));
    before.addEventListener('pause', () => after.pause());
  }
});
