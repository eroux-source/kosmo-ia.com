/**
 * Personnalisation cold email : `?company=Brand` affiche « A free 3D concept for Brand »
 * dans le hero et pré-remplit le champ société des formulaires.
 */
import { captureAttribution } from './attribution';

const { company } = captureAttribution();

if (company) {
  document.querySelectorAll<HTMLElement>('[data-personalize="company"]').forEach((el) => {
    el.textContent = company;
  });
  document.querySelectorAll<HTMLElement>('[data-personalize-block]').forEach((el) => {
    el.hidden = false;
  });
  document.querySelectorAll<HTMLInputElement>('input[name="company"]').forEach((input) => {
    if (!input.value) input.value = company;
  });
}
