/**
 * Cloudflare Turnstile, côté serveur : vérifie le jeton envoyé par le formulaire (champ `captcha`).
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(secret: string, token: unknown, ip?: string): Promise<{ ok: boolean; codes: string[] }> {
  if (typeof token !== 'string' || !token || token.length > 2048) return { ok: false, codes: ['missing-input-response'] };
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const response = await fetch(VERIFY_URL, { method: 'POST', body, signal: AbortSignal.timeout(8000) });
    const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
    return { ok: result.success === true, codes: result['error-codes'] ?? [] };
  } catch (error) {
    console.error('[captcha] Turnstile verification failed', error);
    return { ok: false, codes: ['internal-error'] };
  }
}
