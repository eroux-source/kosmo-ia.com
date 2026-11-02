/** Bascule galerie / liste de /work : boutons [data-view], conteneurs [data-work-view], choix mémorisé (URL ?view= et localStorage). */
const KEY = 'kosmo:work-view';
document.querySelectorAll<HTMLElement>('[data-work]').forEach((root) => {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-view]')];
  const views = [...root.querySelectorAll<HTMLElement>('[data-work-view]')];
  if (!buttons.length || !views.length) return;

  const apply = (view: string, persist: boolean) => {
    views.forEach((el) => (el.hidden = el.dataset.workView !== view));
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    if (!persist) return;
    try {
      localStorage.setItem(KEY, view);
    } catch {}
    const url = new URL(window.location.href);
    view === 'grid' ? url.searchParams.delete('view') : url.searchParams.set('view', view);
    window.history.replaceState({}, '', url);
  };

  let initial = new URLSearchParams(window.location.search).get('view');
  if (!initial) {
    try {
      initial = localStorage.getItem(KEY);
    } catch {}
  }
  apply(initial === 'list' ? 'list' : 'grid', false);
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.view!, true)));
});

export {};
