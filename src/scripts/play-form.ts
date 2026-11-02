/**
 * Formulaire « démo jouable » de /play ([data-play-form], PlayDemo.astro). Parcours propre, différent des formulaires
 * de lead classiques : quatre étapes à cliquer (un choix unique fait passer à la suite, au clic seulement, pas aux
 * flèches du clavier), puis le contact. Chaque réponse remplit la cartouche d'aperçu et la barre de progression.
 * À la fin, les réponses sont résumées dans `message` (+ `campaignDate` = échéance) et envoyées par send() de lead-form.ts.
 */
import { gsap } from 'gsap';
import { motion } from './motion-tokens';
import { send } from './lead-form';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const cfg = motion.play.form;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function init(form: HTMLFormElement) {
  const section = form.closest('section') ?? document.body;
  const d = form.dataset;
  const steps = [...form.querySelectorAll<HTMLElement>('[data-play-step]')];
  const cells = [...form.querySelectorAll<HTMLElement>('[data-play-cell-bar]')];
  const percent = form.querySelector<HTMLElement>('[data-play-percent]');
  const stepIndex = form.querySelector<HTMLElement>('[data-play-step-index]');
  const back = form.querySelector<HTMLElement>('[data-play-back]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const serverError = form.querySelector<HTMLElement>('[data-form-error]');
  const done = form.parentElement?.querySelector<HTMLElement>('[data-form-done]');
  const cart = section.querySelector<HTMLElement>('[data-play-cartridge]');
  const completed = new Set<number>();
  let current = 0;
  let pointerChoice = false;
  let advance = 0;

  const checked = (name: string) => [...form.querySelectorAll<HTMLInputElement>(`[name="${name}"]:checked`)];
  const valuesOf = (name: string) => checked(name).map((input) => input.value);
  const field = (name: string) => form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);

  const setError = (name: string, message?: string) => {
    const el = form.querySelector<HTMLElement>(`[data-error-for="${name}"]`);
    if (el) {
      el.textContent = message ?? '';
      el.hidden = !message;
    }
    field(name)?.setAttribute('aria-invalid', message ? 'true' : 'false');
  };

  /** Libellé du bouton d'envoi (Button.astro : un seul `.text-button`, le bloc chevron est à part). */
  const setLabel = (text: string) => {
    const label = submit?.querySelector<HTMLElement>('.text-button');
    if (label) label.textContent = text;
  };

  const setProgress = () => {
    const pct = Math.round((completed.size / steps.length) * 100);
    if (percent) percent.textContent = String(pct);
    const on = Math.round((pct / 100) * cells.length);
    cells.forEach((cell, i) => (cell.dataset.on = String(i < on)));
  };

  const setStatus = (status: 'building' | 'ready' | 'sent') => {
    if (!cart) return;
    cart.dataset.status = status;
    const text = cart.querySelector<HTMLElement>('[data-cart-status-text]');
    const label = { building: d.statusBuilding, ready: d.statusReady, sent: d.statusSent }[status];
    if (text && label) text.textContent = label;
  };

  const updateCartridge = (changed?: string) => {
    if (!cart) return;
    const rows: Record<string, string> = {
      objective: valuesOf('objective').join(''),
      channels: valuesOf('channels').join(', '),
      genre: valuesOf('genre').join(''),
      timing: valuesOf('timing').join(''),
    };
    Object.entries(rows).forEach(([key, value]) => {
      const el = cart.querySelector<HTMLElement>(`[data-cart-field="${key}"]`);
      const text = value || d.empty || '';
      if (!el || el.textContent === text) return;
      el.textContent = text;
      el.dataset.empty = String(!value);
      if (key === changed && !reduceMotion) gsap.fromTo(el, { opacity: 0, x: motion.staggerText.x }, { opacity: 1, x: 0, duration: motion.fade.duration, ease: motion.fade.ease });
    });
    const sprite = checked('genre')[0]?.dataset.sprite;
    if (sprite) cart.querySelectorAll<HTMLElement>('[data-cart-sprite]').forEach((el) => (el.hidden = el.dataset.cartSprite !== sprite));
    const choicesDone = steps.filter((s) => s.dataset.type !== 'fields').every((s) => valuesOf(s.dataset.name ?? '').length > 0);
    if (cart.dataset.status !== 'sent') setStatus(choicesDone ? 'ready' : 'building');
  };

  /** `navigate` = vraie navigation du visiteur (animation, focus, suivi) ; false au chargement. */
  const showStep = (index: number, navigate = true) => {
    current = index;
    steps.forEach((step, i) => (step.hidden = i !== index));
    if (stepIndex) stepIndex.textContent = String(index + 1);
    if (back) back.hidden = index === 0;
    setLabel(index === steps.length - 1 ? (d.labelSubmit ?? '') : (d.labelNext ?? ''));
    if (!navigate) return;
    const step = steps[index];
    if (!reduceMotion) gsap.fromTo(step, { opacity: 0, x: motion.fade.x }, { opacity: 1, x: 0, duration: motion.fade.duration, ease: motion.fade.ease });
    step.querySelector<HTMLElement>('input:not([type="hidden"]), textarea')?.focus({ preventScroll: true });
    window.kosmoTrack?.('play_form_step', { step: index + 1 });
  };

  const validate = (index: number) => {
    const step = steps[index];
    if (step.dataset.type !== 'fields') {
      const name = step.dataset.name ?? '';
      const ok = valuesOf(name).length > 0;
      setError(name, ok ? undefined : d.msgChoose);
      return ok;
    }
    const company = field('company')?.value.trim() ?? '';
    const email = field('email')?.value.trim() ?? '';
    setError('company', company ? undefined : d.msgRequired);
    setError('email', !email ? d.msgRequired : EMAIL.test(email) ? undefined : d.msgEmail);
    const ok = Boolean(company) && EMAIL.test(email);
    if (!ok) form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    return ok;
  };

  /** Résumé lisible des réponses, envoyé dans `message` (HubSpot, Slack). */
  const compose = () => {
    const detail = field('detail')?.value.trim();
    const lines = [
      `Objectif : ${valuesOf('objective').join(', ')}`,
      `Diffusion : ${valuesOf('channels').join(', ')}`,
      `Style de jeu : ${valuesOf('genre').join(', ')}`,
      `Lancement : ${valuesOf('timing').join(', ')}`,
      detail && `Détails : ${detail}`,
    ];
    const message = field('message');
    const date = field('campaignDate');
    if (message) message.value = lines.filter(Boolean).join('\n');
    if (date) date.value = valuesOf('timing').join('');
  };

  // Choix : aperçu en direct ; un choix unique fait au clic passe à l'étape suivante.
  form.addEventListener('pointerdown', (event) => {
    pointerChoice = Boolean((event.target as HTMLElement).closest('label'));
  });
  form.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.type !== 'radio' && input.type !== 'checkbox') return;
    setError(input.name);
    updateCartridge(input.name);
    // Un seul passage par étape, même si le visiteur change d'avis pendant le délai.
    window.clearTimeout(advance);
    if (input.type === 'radio' && pointerChoice) {
      const from = current;
      advance = window.setTimeout(() => current === from && form.requestSubmit(), cfg.advanceDelay * 1000);
    }
    pointerChoice = false;
  });
  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'company' && cart) {
      const brand = cart.querySelector<HTMLElement>('[data-cart-brand]');
      if (brand) brand.textContent = input.value.trim() || d.brandFallback || '';
    }
    if (input.getAttribute('aria-invalid') === 'true') setError(input.name);
  });
  back?.addEventListener('click', () => current > 0 && showStep(current - 1));

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (serverError) serverError.hidden = true;
    if (!validate(current)) return;
    if (current < steps.length - 1) {
      completed.add(current);
      setProgress();
      showStep(current + 1);
      return;
    }

    compose();
    submit?.setAttribute('disabled', '');
    try {
      const result = await send(form, 2);
      completed.add(current);
      setProgress();
      setStatus('sent');
      window.kosmoTrack?.('lead_submitted', { form: d.leadForm ?? '', mode: result.mode ?? '' });
      form.hidden = true;
      done?.removeAttribute('hidden');
      done?.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    } catch (error) {
      const errors = (error as { errors?: Record<string, string> }).errors ?? {};
      if (errors.email) setError('email', d.msgEmail);
      if (errors.company) setError('company', d.msgRequired);
      if (serverError) {
        serverError.textContent = errors.captcha ? (d.msgCaptcha ?? errors.captcha) : (serverError.dataset.default ?? '');
        serverError.hidden = false;
      }
    } finally {
      submit?.removeAttribute('disabled');
    }
  });

  showStep(0, false);
  setProgress();
}

const form = document.querySelector<HTMLFormElement>('[data-play-form]');
if (form) init(form);
