/** Média du hero et de la carte d'un service IA : production IA, visuel d'ambassadeur ou, à défaut, film du studio. */
import type { AiService } from '../data/ai';
import { aiWorkBySlug, aiWorkPoster, aiWorkVideo } from '../data/ai-work';
import { foohBySlug, poster } from './fooh';

export function heroOf(s: AiService): { video?: string; poster: string } {
  const work = s.hero.work && aiWorkBySlug(s.hero.work);
  if (work) return { video: aiWorkVideo(work), poster: aiWorkPoster(work) };
  if (s.hero.image) return { poster: s.hero.image };
  const p = foohBySlug(s.hero.project);
  return { video: p?.media.mainVideo, poster: (p && poster(p)) ?? '' };
}
