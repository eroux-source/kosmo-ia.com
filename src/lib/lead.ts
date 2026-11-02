/**
 * Modèle de lead partagé entre le formulaire (client) et la fonction serverless (/api/lead).
 */
export const FORM_KINDS = ['free-concept', 'checklist', 'partner', 'contact', 'compatibility', 'demo-game', 'ai-brief'] as const;
export type FormKind = (typeof FORM_KINDS)[number];

/** Fourchettes de budget média (décision « budget-ranges »). */
export const BUDGET_RANGES = ['Under €100k', '€100k to €250k', '€250k to €500k', '€500k to €1M', '€1M to €5M', '€5M and above'] as const;

/** Budgets de production du site IA (à valider). */
export const AI_BUDGET_RANGES = ['Under $10k', '$10k to $25k', '$25k to $50k', '$50k to $100k', '$100k and above'] as const;

export const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'company', 'gclid', 'fbclid', 'li_fat_id'] as const;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  company?: string;
  gclid?: string;
  fbclid?: string;
  li_fat_id?: string;
  landing?: string;
  referrer?: string;
}

export interface Lead {
  form: FormKind;
  step: 1 | 2;
  email: string;
  company: string;
  name?: string;
  campaignDate?: string;
  market?: string;
  budget?: string;
  /** Site IA : service demandé. */
  service?: string;
  message?: string;
  attribution: Attribution;
  page?: string;
  /** Langue de la page du formulaire (en, fr, de, nl). */
  language?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX = 3000;

const str = (value: unknown, max = 256) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export function validateLead(body: unknown): { ok: true; lead: Lead } | { ok: false; errors: Record<string, string> } {
  const input = (body ?? {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const form = str(input.form) as FormKind;
  if (!FORM_KINDS.includes(form)) errors.form = 'Unknown form';

  const email = str(input.email).toLowerCase();
  if (!EMAIL.test(email)) errors.email = 'Enter a valid email address';

  const company = str(input.company);
  if (form !== 'checklist' && !company) errors.company = 'Enter your company';

  if (Object.keys(errors).length) return { ok: false, errors };

  const rawAttribution = (input.attribution ?? {}) as Record<string, unknown>;
  const attribution: Attribution = {};
  for (const key of [...ATTRIBUTION_KEYS, 'landing', 'referrer'] as const) {
    const value = str(rawAttribution[key], 512);
    if (value) attribution[key] = value;
  }

  return {
    ok: true,
    lead: {
      form,
      step: Number(input.step) === 2 ? 2 : 1,
      email,
      company,
      name: str(input.name) || undefined,
      campaignDate: str(input.campaignDate, 32) || undefined,
      market: str(input.market) || undefined,
      budget: str(input.budget, 64) || undefined,
      service: str(input.service, 128) || undefined,
      message: str(input.message, MAX) || undefined,
      attribution,
      page: str(input.page, 512) || undefined,
      language: /^(en|fr|de|nl)$/.test(str(input.language, 2)) ? str(input.language, 2) : undefined,
    },
  };
}

/** Résumé lisible du lead (Slack, champ « message » HubSpot, logs). */
export function summarizeLead(lead: Lead): string {
  const lines = [
    `Form: ${lead.form} (step ${lead.step})`,
    lead.name && `Name: ${lead.name}`,
    `Company: ${lead.company || '-'}`,
    lead.campaignDate && `Campaign date: ${lead.campaignDate}`,
    lead.market && `Market / city: ${lead.market}`,
    lead.service && `Service: ${lead.service}`,
    lead.budget && `Budget: ${lead.budget}`,
    lead.message && `Brief: ${lead.message}`,
    lead.page && `Page: ${lead.page}`,
    lead.language && `Language: ${lead.language}`,
    Object.keys(lead.attribution).length && `Attribution: ${Object.entries(lead.attribution).map(([k, v]) => `${k}=${v}`).join(' · ')}`,
  ];
  return lines.filter(Boolean).join('\n');
}
