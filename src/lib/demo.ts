/**
 * Contenu DÉMO — règle 4 de CLAUDE.md.
 * Tout objet de contenu inventé porte `demo: true` ; le composant <Demo> affiche le badge
 * tant que PUBLIC_SHOW_DEMO n'est pas « false ».
 */
import { publicEnv } from './env';

export const showDemo = publicEnv.showDemo;

export interface DemoFlag {
  /** true = texte/preuve inventé, à remplacer avant mise en ligne. */
  demo: boolean;
}
