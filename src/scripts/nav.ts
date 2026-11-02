/**
 * Nav fixe (Nav.astro) :
 *  - transparente sur un hero sombre, papier quand le bas du hero arrive près du haut (ou d'emblée : data-fixed-solid) ;
 *  - menu « Services » : survol sur ordinateur, clic partout, Échap ou clic dehors pour fermer ;
 *  - menu repliable ≤ 991 px (la nav passe en papier tant qu'il est ouvert) : la page ne défile plus derrière, un tap
 *    hors du menu le referme (sans activer ce qui est dessous).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);

const nav = document.querySelector<HTMLElement>('[data-nav]');

if (nav) {
  const fixedSolid = nav.hasAttribute('data-fixed-solid');
  let pastHero = fixedSolid;
  let menuOpen = false;
  const paint = () => (nav.dataset.solid = String(fixedSolid || pastHero || menuOpen));

  // --- Transparente → papier -----------------------------------------
  const hero = document.querySelector<HTMLElement>('main > section:first-child');
  if (!fixedSolid && hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: motion.nav.solidStart,
      onEnter: () => ((pastHero = true), paint()),
      onLeaveBack: () => ((pastHero = false), paint()),
    });
  } else if (!fixedSolid) {
    pastHero = true;
  }
  paint();

  // --- Menu Services -------------------------------------------------
  const dropdown = nav.querySelector<HTMLElement>('[data-dropdown]');
  const toggle = nav.querySelector<HTMLButtonElement>('[data-dropdown-toggle]');
  const list = nav.querySelector<HTMLElement>('[data-dropdown-list]');
  const arrow = nav.querySelector<HTMLElement>('[data-dropdown-arrow]');
  const strips = [...nav.querySelectorAll<HTMLElement>('[data-nav-strip]')];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let closeTimer = 0;

  // Bandes photo : la bande survolée (ou atteinte au clavier) s'ouvre, la dernière ouverte le reste.
  const activate = (strip: HTMLElement) => strips.forEach((s) => s.classList.toggle('is-active', s === strip));
  strips.forEach((strip) => {
    strip.addEventListener('pointerenter', () => activate(strip));
    strip.addEventListener('focusin', () => activate(strip));
  });

  const setDropdown = (open: boolean) => {
    if (!toggle || !list || !dropdown) return;
    window.clearTimeout(closeTimer);
    if ((toggle.getAttribute('aria-expanded') === 'true') === open) return;
    toggle.setAttribute('aria-expanded', String(open));
    dropdown.classList.toggle('is-open', open);
    const { duration, easeOpen, easeClose, shift, arrowRotation } = motion.navDropdown;
    gsap.killTweensOf(list);
    if (open) {
      list.hidden = false;
      gsap.fromTo(list, { opacity: 0, y: shift }, { opacity: 1, y: 0, duration, ease: easeOpen });
      if (strips.length && !reduce && !tablet.matches) {
        const { stripShift, stripStagger, stripDuration, stripEase } = motion.navDropdown;
        gsap.fromTo(strips, { opacity: 0, y: stripShift }, { opacity: 1, y: 0, duration: stripDuration, ease: stripEase, stagger: stripStagger, overwrite: true });
      }
      if (arrow) gsap.to(arrow, { rotation: arrowRotation, duration, ease: easeOpen });
    } else {
      gsap.to(list, { opacity: 0, y: shift, duration, ease: easeClose, onComplete: () => void (list.hidden = true) });
      if (arrow) gsap.to(arrow, { rotation: 0, duration, ease: easeClose });
    }
  };

  toggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    setDropdown(toggle.getAttribute('aria-expanded') !== 'true');
  });
  const tablet = window.matchMedia(`(width < ${getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-lg').trim()})`);
  if (dropdown && window.matchMedia('(hover: hover)').matches) {
    dropdown.addEventListener('pointerenter', () => !tablet.matches && setDropdown(true));
    dropdown.addEventListener('pointerleave', () => {
      if (tablet.matches) return;
      closeTimer = window.setTimeout(() => setDropdown(false), motion.nav.dropdownClose);
    });
  }
  document.addEventListener('click', (event) => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && !dropdown?.contains(event.target as Node)) setDropdown(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setDropdown(false);
      toggle.focus();
    }
  });

  // --- Menu mobile ----------------------------------------------------
  const menuButton = nav.querySelector<HTMLButtonElement>('[data-menu-button]');
  const menu = nav.querySelector<HTMLElement>('[data-menu]');

  const setMenu = (open: boolean) => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('nav-menu-open', open);
    const { duration, ease } = motion.navMenu;
    if (open) {
      menuOpen = true;
      paint();
      menu.dataset.open = 'true';
      gsap.fromTo(menu, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration, ease });
    } else {
      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration,
        ease,
        onComplete: () => {
          menu.dataset.open = 'false';
          gsap.set(menu, { clearProps: 'height,opacity' });
          menuOpen = false;
          paint();
        },
      });
    }
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener(
    'click',
    (event) => {
      if (menuButton?.getAttribute('aria-expanded') !== 'true' || nav.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      setMenu(false);
    },
    true,
  );
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => tablet.matches && setMenu(false)));
  tablet.addEventListener('change', () => {
    if (!tablet.matches && menu) {
      menuButton?.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('nav-menu-open');
      menu.dataset.open = 'false';
      gsap.set(menu, { clearProps: 'height,opacity' });
      menuOpen = false;
      paint();
    }
  });
}
