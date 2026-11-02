/**
 * Envoi d'un lead vers HubSpot (upsert par email) + alerte Slack facultative. Côté serveur uniquement.
 * Décision « hubspot-properties » : essai avec les propriétés kosmo_*, repli sur les standards.
 */
import { summarizeLead, type Lead } from './lead';

const HUBSPOT_UPSERT = 'https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert';

/** Propriétés personnalisées facultatives (à créer dans HubSpot pour des champs structurés). */
export const EXTENDED_PROPERTIES = [
  'kosmo_form',
  'kosmo_campaign_date',
  'kosmo_market',
  'kosmo_media_budget',
  'kosmo_utm_source',
  'kosmo_utm_medium',
  'kosmo_utm_campaign',
  'kosmo_utm_content',
  'kosmo_landing_page',
] as const;

function splitName(name?: string) {
  if (!name) return {};
  const [firstname, ...rest] = name.split(/\s+/);
  return { firstname, lastname: rest.join(' ') || undefined };
}

function coreProperties(lead: Lead): Record<string, string> {
  const props: Record<string, string | undefined> = {
    email: lead.email,
    company: lead.company || undefined,
    message: summarizeLead(lead),
    ...splitName(lead.name),
  };
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v)) as Record<string, string>;
}

function extendedProperties(lead: Lead): Record<string, string> {
  const a = lead.attribution;
  const props: Record<string, string | undefined> = {
    ...coreProperties(lead),
    hs_lead_status: 'NEW',
    kosmo_form: lead.form,
    kosmo_campaign_date: lead.campaignDate,
    kosmo_market: lead.market,
    kosmo_media_budget: lead.budget,
    kosmo_utm_source: a.utm_source,
    kosmo_utm_medium: a.utm_medium,
    kosmo_utm_campaign: a.utm_campaign,
    kosmo_utm_content: a.utm_content,
    kosmo_landing_page: a.landing,
    /* Propriété HubSpot standard « Preferred language » : l'équipe répond dans la langue du formulaire. */
    hs_language: lead.language,
  };
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v)) as Record<string, string>;
}

async function upsert(token: string, email: string, properties: Record<string, string>) {
  const response = await fetch(HUBSPOT_UPSERT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: [{ idProperty: 'email', id: email, properties }] }),
  });
  const text = await response.text();
  return { ok: response.ok, status: response.status, text };
}

export async function pushToHubspot(token: string, lead: Lead): Promise<{ propertiesUsed: 'extended' | 'core' }> {
  let first = await upsert(token, lead.email, extendedProperties(lead));
  if (first.ok) return { propertiesUsed: 'extended' };
  // Valeur de langue refusée par le portail (options de hs_language) : on renvoie sans elle plutôt que de perdre le lead.
  if (first.status === 400 && /hs_language/.test(first.text)) {
    const { hs_language: _ignored, ...rest } = extendedProperties(lead);
    first = await upsert(token, lead.email, rest);
    if (first.ok) return { propertiesUsed: 'extended' };
  }

  const missingProperty = first.status === 400 && /does not exist|PROPERTY_DOESNT_EXIST|not a valid property/i.test(first.text);
  if (!missingProperty) throw new Error(`HubSpot ${first.status}: ${first.text.slice(0, 300)}`);

  const second = await upsert(token, lead.email, coreProperties(lead));
  if (!second.ok) throw new Error(`HubSpot ${second.status}: ${second.text.slice(0, 300)}`);
  return { propertiesUsed: 'core' };
}

export async function notifySlack(webhookUrl: string, lead: Lead, mode: string) {
  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: `New lead (${mode}): ${lead.email}\n${summarizeLead(lead)}` }),
  });
  if (!response.ok) throw new Error(`Slack ${response.status}: ${(await response.text()).slice(0, 200)}`);
}
