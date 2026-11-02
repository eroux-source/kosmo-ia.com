/**
 * Hero : l'image se pose (zoom 1.08 → 1) puis glisse au défilement ; mini lecteur du showreel (Hero.astro, `reel`).
 * Lecteur muet en boucle ; le bouton son relance le film depuis le début ; le bouton agrandir l'ouvre en grand au
 * centre de l'écran sur un voile sombre (le lecteur passe dans <body>, sa place reste réservée dans le hero). Sur écran
 * tactile, « agrandir » ouvre le plein écran natif du téléphone (le mode centré y rendait le film plus petit qu'au repos).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion-tokens';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-hero]').forEach((hero) => {
  const media = hero.querySelector<HTMLElement>('[data-hero-media]');
  if (!media || reduce) return;
  const zoom = Number(getComputedStyle(document.documentElement).getPropertyValue('--hero-zoom')) || 1;
  gsap.fromTo(media, { scale: zoom }, { scale: 1, duration: motion.hero.zoomDuration, ease: motion.hero.zoomEase });
  gsap.to(media, { yPercent: motion.hero.parallax, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
});

document.querySelectorAll<HTMLElement>('[data-vsl]').forEach((box) => {
  const video = box.querySelector('video');
  const sound = box.querySelector<HTMLButtonElement>('[data-vsl-sound]');
  const size = box.querySelector<HTMLButtonElement>('[data-vsl-size]');
  const slot = box.parentElement;
  if (!video || !sound || !size || !slot) return;
  const scrim = document.createElement('div');
  scrim.className = 'vsl-scrim';
  const labels = { on: sound.getAttribute('aria-label') ?? '', grow: size.getAttribute('aria-label') ?? '' };

  sound.addEventListener('click', () => {
    const turnOn = video.muted;
    video.muted = !turnOn;
    if (turnOn) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
    box.classList.toggle('is-sound', turnOn);
    sound.setAttribute('aria-pressed', String(turnOn));
    window.kosmoTrack?.(turnOn ? 'hero_reel_sound' : 'hero_reel_mute');
    sound.setAttribute('aria-label', labels.on);
  });
  const close = () => {
    if (!box.classList.contains('is-big')) return;
    box.classList.remove('is-big');
    slot.appendChild(box);
    scrim.remove();
    size.setAttribute('aria-pressed', 'false');
    size.setAttribute('aria-label', labels.grow);
    video.play().catch(() => {});
  };
  const open = () => {
    document.body.append(scrim, box);
    box.classList.add('is-big');
    size.setAttribute('aria-pressed', 'true');
    video.play().catch(() => {});
    window.kosmoTrack?.('hero_reel_enlarge');
  };
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const native = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
  /* Plein écran natif : contrôles du système le temps du plein écran (son, sortie), retirés au retour. */
  const leave = () => {
    if (document.fullscreenElement) return;
    video.controls = false;
    video.play().catch(() => {});
  };
  document.addEventListener('fullscreenchange', leave);
  video.addEventListener('webkitendfullscreen', leave);
  const fullscreen = () => {
    window.kosmoTrack?.('hero_reel_enlarge');
    video.controls = true;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {
        video.controls = false;
        open();
      });
    } else if (native.webkitEnterFullscreen) {
      native.webkitEnterFullscreen();
    } else {
      video.controls = false;
      open();
    }
  };
  size.addEventListener('click', () => {
    if (box.classList.contains('is-big')) close();
    else if (touch) fullscreen();
    else open();
  });
  scrim.addEventListener('click', close);
  window.addEventListener('keydown', (e) => e.key === 'Escape' && close());
});
