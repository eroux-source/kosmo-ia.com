/**
 * Aperçu vidéo de la vue liste de /work : un seul élément [data-work-preview] par bloc, fixé à l'écran, qui suit
 * la souris au-dessus des lignes [data-preview-video]. Pointeur fin uniquement.
 */
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.querySelectorAll<HTMLElement>('[data-work]').forEach((root) => {
  const preview = root.querySelector<HTMLElement>('[data-work-preview]');
  const video = preview?.querySelector<HTMLVideoElement>('video');
  if (!preview || !video || !canHover) return;
  const read = (name: string) => getComputedStyle(root).getPropertyValue(name).trim();

  const move = (e: MouseEvent) => {
    const offset = parseFloat(read('--worklist-cursor-offset')) || 16;
    const w = preview.offsetWidth;
    const h = preview.offsetHeight;
    // À droite du curseur, à gauche s'il manque la place ; jamais hors de l'écran en hauteur.
    const x = e.clientX + offset + w > window.innerWidth ? e.clientX - offset - w : e.clientX + offset;
    const y = Math.min(Math.max(e.clientY - h / 2, offset), window.innerHeight - h - offset);
    preview.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
  };

  root.querySelectorAll<HTMLElement>('[data-preview-video]').forEach((row) => {
    row.addEventListener('mouseenter', (e) => {
      const { previewVideo, previewPoster, previewRatio } = row.dataset;
      video.classList.toggle('aspect-video', previewRatio === '16:9');
      video.classList.toggle('aspect-square', previewRatio === '1:1');
      video.classList.toggle('aspect-portrait', previewRatio === '9:16');
      video.poster = previewPoster ?? '';
      if (video.src !== previewVideo) {
        video.src = previewVideo ?? '';
        video.load();
      }
      preview.hidden = false;
      move(e);
      video.play().catch(() => {});
    });
    row.addEventListener('mousemove', move);
    row.addEventListener('mouseleave', () => {
      preview.hidden = true;
      video.pause();
    });
  });
});

export {};
