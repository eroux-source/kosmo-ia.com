/**
 * Vidéos différées : `<video data-lazy data-src="…">` reçoit son src à l'approche du viewport
 * et se met en pause hors écran. Le hero garde son chargement immédiat.
 */
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-lazy]');

if (videos.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        const video = target as HTMLVideoElement;
        if (isIntersecting) {
          if (!video.src && video.dataset.src) {
            video.src = video.dataset.src;
            video.load();
          }
          video.play().catch(() => {});
        } else if (!video.paused) {
          video.pause();
        }
      });
    },
    { rootMargin: '200px 0px' },
  );
  videos.forEach((video) => observer.observe(video));
} else {
  videos.forEach((video) => {
    if (video.dataset.src) video.src = video.dataset.src;
  });
}
