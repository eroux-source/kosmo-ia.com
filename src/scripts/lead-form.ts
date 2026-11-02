/**
 * Formulaires de lead ([data-lead-form]) : validation par champ, honeypot, envoi JSON vers
 * /api/lead avec l'attribution, étapes multiples ([data-step]) et redirection de remerciement.
 * Étape 1 = capture (email + société) envoyée immédiatement ; étape 2 = qualification.
 */
import { getAttribution } from './attribution';

declare global {
  interface Window {
    turnstile?: { reset: (container?: HTMLElement | string) => void; getResponse: (container?: HTMLElement | string) => string | undefined };
  }
}

/** Jeton Turnstile du formulaire : attend (jusqu'à 12 s) que le widget l'ait produit. Sans widget : undefined. */
async function captchaToken(form: HTMLFormElement): Promise<string | undefined> {
  const widget = form.querySelector<HTMLElement>('[data-captcha]');
  if (!widget) return undefined;
  const read = () => form.querySelector<HTMLInputElement>('[name="cf-turnstile-response"]')?.value || window.turnstile?.getResponse?.(widget) || '';
  for (let i = 0; i < 60; i++) {
    const token = read();
    if (token) return token;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw Object.assign(new Error('captcha missing'), { errors: { captcha: form.dataset.msgCaptcha ?? 'Please complete the security check, then try again.' } });
}

/** Un jeton ne sert qu'une fois : le widget est réarmé après chaque envoi (étape 1 puis étape 2, ou nouvel essai). */
function resetCaptcha(form: HTMLFormElement) {
  const widget = form.querySelector<HTMLElement>('[data-captcha]');
  if (widget && window.turnstile) {
    try {
      window.turnstile.reset(widget);
    } catch {
      /* widget pas encore rendu */
    }
  }
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Errors = Record<string, string>;

function setError(form: HTMLFormElement, field: string, message?: string) {
  const el = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
  const input = form.querySelector<HTMLInputElement>(`[name="${field}"]`);
  if (el) {
    el.textContent = message ?? '';
    el.hidden = !message;
  }
  input?.setAttribute('aria-invalid', message ? 'true' : 'false');
}

function validateStep(form: HTMLFormElement, step: HTMLElement): Errors {
  const errors: Errors = {};
  step.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('[name]').forEach((input) => {
    const value = input.value.trim();
    const required = input.hasAttribute('required');
    // Messages traduits : data-msg-* du formulaire (src/data/site.ts → dictionnaires i18n).
    const msg = form.dataset;
    if (required && !value) errors[input.name] = input.dataset.errorRequired ?? msg.msgRequired ?? 'This field is required';
    else if (input.type === 'email' && value && !EMAIL.test(value)) errors[input.name] = msg.msgEmail ?? 'Enter a valid email address';
    else if (input.type === 'url' && value && !/^https?:\/\//i.test(value)) errors[input.name] = msg.msgUrl ?? 'Paste a link starting with http';
    setError(form, input.name, errors[input.name]);
  });
  return errors;
}

/** Envoi d'un formulaire de lead vers /api/lead. Exporté pour les formulaires à parcours propre (data-lead-manual, ex. /play). */
export async function send(form: HTMLFormElement, step: number) {
  const data = Object.fromEntries(new FormData(form).entries());
  delete data['cf-turnstile-response'];
  const captcha = await captchaToken(form);
  let response: Response;
  try {
    response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...data, captcha, form: form.dataset.leadForm, step, attribution: getAttribution(), page: window.location.pathname + window.location.search }),
    });
  } finally {
    resetCaptcha(form);
  }
  const result = (await response.json().catch(() => ({}))) as { ok?: boolean; errors?: Errors; mode?: string };
  if (!response.ok || !result.ok) throw Object.assign(new Error('lead failed'), { errors: result.errors ?? {} });
  return result;
}

document.querySelectorAll<HTMLFormElement>('form[data-lead-form]:not([data-lead-manual])').forEach((form) => {
  // Langue de la page (en, fr, de, nl) : transmise au CRM pour répondre dans la bonne langue.
  form.querySelectorAll<HTMLInputElement>('[data-lang-field]').forEach((input) => {
    input.value = document.documentElement.lang || 'en';
  });
  const steps = [...form.querySelectorAll<HTMLElement>('[data-step]')];
  const stepIndicators = form.querySelectorAll<HTMLElement>('[data-step-indicator]');
  const serverError = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  let current = 0;
  let step1Sent = false;

  const showStep = (index: number) => {
    current = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    stepIndicators.forEach((el, i) => el.setAttribute('aria-current', i === index ? 'step' : 'false'));
    if (submit) {
      // Le libellé vit dans le span .text-button du bouton « slide » (Button.astro).
      const label = submit.querySelector<HTMLElement>('.text-button') ?? submit;
      label.textContent = steps[index]?.dataset.stepLabel ?? submit.dataset.label ?? label.textContent;
    }
    steps[index]?.querySelector<HTMLElement>('input, select, textarea')?.focus({ preventScroll: true });
  };

  if (steps.length) showStep(0);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (serverError) serverError.hidden = true;
    const scope = steps[current] ?? form;
    const errors = validateStep(form, scope);
    if (Object.keys(errors).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    const isLast = !steps.length || current === steps.length - 1;
    submit?.setAttribute('disabled', '');

    try {
      if (!isLast) {
        // Étape 1 : on capture le lead tout de suite, même s'il abandonne ensuite.
        if (!step1Sent) {
          await send(form, 1);
          step1Sent = true;
          window.kosmoTrack?.('lead_step1', { form: form.dataset.leadForm ?? '' });
        }
        showStep(current + 1);
        return;
      }
      const result = await send(form, steps.length ? 2 : 1);
      window.kosmoTrack?.('lead_submitted', { form: form.dataset.leadForm ?? '', mode: result.mode ?? '' });
      const success = form.dataset.success;
      if (success) {
        window.location.assign(success);
        return;
      }
      form.hidden = true;
      form.parentElement?.querySelector<HTMLElement>('[data-form-done]')?.removeAttribute('hidden');
    } catch (error) {
      const fieldErrors = (error as { errors?: Errors }).errors ?? {};
      // Erreurs du serveur (en anglais) : message traduit du formulaire quand il existe.
      Object.entries(fieldErrors).forEach(([field, message]) => setError(form, field, field === 'email' ? (form.dataset.msgEmail ?? message) : field === 'company' ? (form.dataset.msgRequired ?? message) : message));
      if (serverError) {
        serverError.textContent = fieldErrors.captcha ? (form.dataset.msgCaptcha ?? fieldErrors.captcha) : (serverError.dataset.default ?? fieldErrors.server ?? 'Something went wrong. Email us at contact@kosmocgi.com.');
        serverError.hidden = false;
      }
    } finally {
      submit?.removeAttribute('disabled');
    }
  });
});
