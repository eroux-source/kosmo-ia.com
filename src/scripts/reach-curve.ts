/**
 * Courbe impressions / temps : lance l'entrée quand le dessin arrive à l'écran, et relie
 * le survol d'une phase (zone du dessin ou colonne de la légende) à la mise en retrait des autres.
 */
document.querySelectorAll<HTMLElement>('[data-reach-curve]').forEach((root) => {
  const reveal = () => root.setAttribute('data-in', '');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal();
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
  } else {
    reveal();
  }

  root.querySelectorAll<HTMLElement | SVGElement>('[data-phase-trigger]').forEach((trigger) => {
    const phase = (trigger as HTMLElement).dataset.phaseTrigger ?? trigger.getAttribute('data-phase-trigger') ?? '';
    const same = root.querySelectorAll(`[data-phase="${phase}"]`);
    trigger.addEventListener('pointerenter', () => {
      root.setAttribute('data-active', phase);
      same.forEach((el) => el.classList.add('is-active'));
    });
    trigger.addEventListener('pointerleave', () => {
      root.removeAttribute('data-active');
      same.forEach((el) => el.classList.remove('is-active'));
    });
  });
});

export {};
