/** Vidéos Bunny de la référence, avec poster local (public/images/posters). Module séparé pour éviter un cycle site → cities → 3dooh → site. */
const BUNNY = 'https://vz-78bf47d9-72b.b-cdn.net';
export const bunny = (id: string, poster: string) => ({
  src: `${BUNNY}/${id}/play_720p.mp4`,
  poster: `/images/posters/${poster}.jpg`,
});
