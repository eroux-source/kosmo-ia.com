/** Sélecteur de langue : mémorise le choix un an (cookie strictement nécessaire), lu par la redirection automatique. */
import { LANG_COOKIE } from '../i18n/config';

document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch] a[hreflang]').forEach((link) => {
  link.addEventListener('click', () => {
    document.cookie = `${LANG_COOKIE}=${link.hreflang}; path=/; max-age=31536000; samesite=lax${location.protocol === 'https:' ? '; secure' : ''}`;
    window.kosmoTrack?.('locale_switch', { lang: link.hreflang });
  });
});

/* Variante menu déroulant (barre de navigation desktop) : ouverture au clic, fermeture au clic extérieur et à Échap. */
document.querySelectorAll<HTMLElement>('[data-lang-dropdown]').forEach((root) => {
  const toggle = root.querySelector<HTMLButtonElement>('[data-lang-toggle]');
  const list = root.querySelector<HTMLElement>('[data-lang-list]');
  if (!toggle || !list) return;
  const set = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    list.hidden = !open;
  };
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    set(list.hidden);
  });
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node)) set(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !list.hidden) {
      set(false);
      toggle.focus();
    }
  });
});
