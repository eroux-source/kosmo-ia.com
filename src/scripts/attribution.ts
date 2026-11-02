/**
 * Attribution : UTM, `?company=`, identifiants de clic. Capturés à la première visite de la
 * session (first touch) et conservés dans sessionStorage pour être envoyés avec chaque lead.
 */
import { ATTRIBUTION_KEYS, type Attribution } from '../lib/lead';

const STORAGE_KEY = 'kosmo:attribution';

function read(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}') as Attribution;
  } catch {
    return {};
  }
}

function write(data: Attribution) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* navigation privée : on garde la valeur en mémoire seulement */
  }
}

let cached: Attribution | undefined;

export function captureAttribution(): Attribution {
  const stored = cached ?? read();
  const params = new URLSearchParams(window.location.search);
  let changed = false;
  for (const key of ATTRIBUTION_KEYS) {
    const value = params.get(key)?.trim();
    if (value && !stored[key]) {
      stored[key] = value.slice(0, 256);
      changed = true;
    }
  }
  if (!stored.landing) {
    stored.landing = window.location.pathname + window.location.search;
    stored.referrer = document.referrer || undefined;
    changed = true;
  }
  if (changed) write(stored);
  cached = stored;
  return stored;
}

export const getAttribution = (): Attribution => cached ?? captureAttribution();
