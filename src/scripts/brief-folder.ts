/** Dossiers de /contact : clic ou clavier ouvre / ferme (data-open), utile sans survol (mobile). */
document.querySelectorAll<HTMLButtonElement>('[data-brief-folder]').forEach((folder) => {
  folder.addEventListener('click', () => {
    const open = folder.hasAttribute('data-open');
    folder.toggleAttribute('data-open', !open);
    folder.setAttribute('aria-expanded', String(!open));
  });
});

export {};
