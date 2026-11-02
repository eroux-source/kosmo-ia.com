/**
 * Cartes vidéo : lecture au survol (pointeur fin). Sans survol (mobile, tablette) : lecture automatique quand la carte
 * est à l'écran, pause hors écran, sauf dans la mosaïque de /work ([data-work]) pour ne pas charger 58 films.
 * Partout : l'affiche (data-poster) n'est posée qu'à l'approche de l'écran.
 */
import { motion } from './motion-tokens';

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const load = (video: HTMLVideoElement) => {
  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src;
    video.load();
  }
};

const cards = [...document.querySelectorAll<HTMLElement>('[data-hover-video]')];

/* Affiches différées : posées quand la carte approche de l'écran (sinon /work charge 67 images d'un coup sur mobile).
   Dans un rail (mobile), toutes les cartes du rail dès qu'il approche : celles hors cadre à droite sont prêtes au glissé. */
const groups = new Map<Element, HTMLVideoElement[]>();
cards.forEach((card) => {
  const video = card.querySelector<HTMLVideoElement>('video[data-poster]');
  if (!video) return;
  const host = card.closest('[data-rail]') ?? card;
  groups.set(host, [...(groups.get(host) ?? []), video]);
});
const posters = new IntersectionObserver(
  (entries) =>
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      groups.get(target)?.forEach((video) => (video.poster = video.dataset.poster ?? ''));
      posters.unobserve(target);
    }),
  { rootMargin: motion.hoverVideo.posterMargin },
);
groups.forEach((_, host) => posters.observe(host));

if (canHover) {
  cards.forEach((card) => {
    const video = card.querySelector<HTMLVideoElement>('video');
    if (!video) return;
    card.addEventListener('mouseenter', () => {
      load(video);
      video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = (entry.target as HTMLElement).querySelector<HTMLVideoElement>('video');
        if (!video) return;
        if (entry.isIntersecting) {
          load(video);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { threshold: 0.35 },
  );
  cards.filter((card) => !card.closest('[data-work]')).forEach((card) => observer.observe(card));
}
