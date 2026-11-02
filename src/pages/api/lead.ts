/**
 * POST /api/lead — reçoit un lead (JSON), le pousse dans HubSpot, alerte Slack.
 * Sans HUBSPOT_ACCESS_TOKEN : mode mock (log serveur + succès simulé).
 * Fonction serverless Vercel (prerender = false).
 */
import type { APIRoute } from 'astro';
import { validateLead } from '../../lib/lead';
import { notifySlack, pushToHubspot } from '../../lib/hubspot';
import { verifyTurnstile } from '../../lib/captcha';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const secret = (key: 'HUBSPOT_ACCESS_TOKEN' | 'SLACK_WEBHOOK_URL' | 'TURNSTILE_SECRET_KEY') => process.env[key] ?? import.meta.env[key];

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, errors: { body: 'Invalid JSON' } }, 400);
  }

  // Honeypot : un robot a rempli le champ caché → on répond « ok » sans rien enregistrer.
  if ((body as Record<string, unknown>)?.website) return json({ ok: true, mode: 'ignored' });

  const result = validateLead(body);
  if (!result.ok) return json({ ok: false, errors: result.errors }, 400);
  const { lead } = result;

  // Captcha (Cloudflare Turnstile) : vérifié à chaque envoi, étape 1 comprise, dès que la clé secrète est configurée.
  const turnstileSecret = secret('TURNSTILE_SECRET_KEY');
  if (turnstileSecret) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined;
    const captcha = await verifyTurnstile(turnstileSecret, (body as Record<string, unknown>).captcha, ip);
    if (!captcha.ok) {
      console.warn('[lead] captcha rejected', captcha.codes.join(','));
      return json({ ok: false, errors: { captcha: 'We could not confirm you are human. Please try again, or email us at contact@kosmocgi.com.' } }, 400);
    }
  }

  const token = secret('HUBSPOT_ACCESS_TOKEN');
  let mode: 'hubspot' | 'mock' = 'mock';
  let propertiesUsed: string | undefined;

  if (token) {
    try {
      ({ propertiesUsed } = await pushToHubspot(token, lead));
      mode = 'hubspot';
    } catch (error) {
      console.error('[lead] HubSpot error', error);
      return json({ ok: false, errors: { server: 'Could not save your request. Email us at contact@kosmocgi.com.' } }, 502);
    }
  } else {
    console.log('[lead:mock]', JSON.stringify(lead));
  }

  // Attendu avant la réponse : une fonction serverless est gelée dès qu'elle répond, un appel non attendu n'aboutit pas.
  const webhook = secret('SLACK_WEBHOOK_URL');
  if (webhook) {
    try {
      await notifySlack(webhook, lead, mode);
    } catch (error) {
      console.error('[lead] Slack error', error);
    }
  }

  return json({ ok: true, mode, propertiesUsed });
};

export const GET: APIRoute = () => json({ ok: false, errors: { method: 'Use POST' } }, 405);
