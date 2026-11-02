/**
 * Filtres de /work (une instance par bloc `[data-work]`) : compteurs et URL. Les paramètres d'URL sont
 * préfixés par le nom du bloc quand il en a un (`?fooh-industry=…`) pour ne pas se marcher dessus.
 */
document.querySelectorAll<HTMLElement>('[data-work]').forEach((root) => {
  const cards = [...root.querySelectorAll<HTMLElement>('[data-case]')];
  const groups = [...root.querySelectorAll<HTMLElement>('[data-filter-group]')];
  const empty = root.querySelector<HTMLElement>('[data-work-empty]');
  const total = root.querySelector<HTMLElement>('[data-work-count]');
  const prefix = root.dataset.work ? `${root.dataset.work}-` : '';
  const active: Record<string, string> = {};

  const params = new URLSearchParams(window.location.search);
  groups.forEach((group) => {
    const key = group.dataset.filterGroup!;
    const value = params.get(prefix + key);
    if (value) active[key] = value;
  });

  const matches = (card: HTMLElement, except?: string) =>
    Object.entries(active).every(([key, value]) => key === except || !value || card.dataset[key] === value);

  /* Les mêmes projets existent en vue galerie et en vue liste : on ne compte que la première vue. */
  const counted = (card: HTMLElement) => card.closest<HTMLElement>('[data-work-view]')?.dataset.workView !== 'list';
  const render = () => {
    let visible = 0;
    cards.forEach((card) => {
      const show = matches(card);
      // On masque la cellule de grille (li) pour que les cartes visibles se réalignent.
      (card.closest('li') ?? card).hidden = !show;
      if (show && counted(card)) visible++;
    });
    if (empty) empty.hidden = visible > 0;
    if (total) total.textContent = String(visible);

    groups.forEach((group) => {
      const key = group.dataset.filterGroup!;
      group.querySelectorAll<HTMLButtonElement>('[data-filter-value]').forEach((button) => {
        const value = button.dataset.filterValue!;
        const count = cards.filter((card) => counted(card) && (!value || card.dataset[key] === value) && matches(card, key)).length;
        const counter = button.querySelector<HTMLElement>('[data-filter-count]');
        if (counter) counter.textContent = String(count);
        button.setAttribute('aria-pressed', String((active[key] ?? '') === value));
        button.disabled = count === 0 && value !== '';
      });
    });

    const url = new URL(window.location.href);
    Object.keys(active).forEach((key) => (active[key] ? url.searchParams.set(prefix + key, active[key]) : url.searchParams.delete(prefix + key)));
    window.history.replaceState({}, '', url);
  };

  groups.forEach((group) => {
    const key = group.dataset.filterGroup!;
    group.querySelectorAll<HTMLButtonElement>('[data-filter-value]').forEach((button) => {
      button.addEventListener('click', () => {
        active[key] = button.dataset.filterValue!;
        render();
      });
    });
  });

  render();
});

export {};
