/** Footer : la bande de points acides suit la souris (projecteur), pas le tactile. */
document.querySelectorAll<HTMLElement>('[data-footer-band]').forEach((band) => {
  const field = band.querySelector<HTMLElement>('[data-footer-field]');
  if (!field) return;
  let frame = 0;
  band.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = field.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      field.style.setProperty('--df-x', `${x}px`);
      field.style.setProperty('--df-y', `${y}px`);
      field.classList.add('df-lit');
    });
  });
  band.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    field.classList.remove('df-lit');
  });
});
