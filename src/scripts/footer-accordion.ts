/**
 * Pied de page : sur mobile (< --breakpoint-md), chaque groupe de liens (<details data-footer-group>) est un accordéon
 * fermé au départ ; au-dessus, les groupes restent ouverts et leur titre ne replie rien. Sans script : tout est ouvert.
 */
const md = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-md').trim();
const mobile = window.matchMedia(`(width < ${md})`);
const groups = [...document.querySelectorAll<HTMLDetailsElement>('[data-footer-group]')];

const sync = () =>
  groups.forEach((group) => {
    group.open = !mobile.matches;
    group.querySelector('summary')?.setAttribute('tabindex', mobile.matches ? '0' : '-1');
  });

groups.forEach((group) =>
  group.querySelector('summary')?.addEventListener('click', (event) => {
    if (!mobile.matches) event.preventDefault();
  }),
);
if (md) {
  sync();
  mobile.addEventListener('change', sync);
}

export {};
