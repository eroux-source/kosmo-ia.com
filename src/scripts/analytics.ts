/**
 * Chargement des outils de mesure selon la configuration (#kosmo-analytics).
 * Plausible, Vercel et le Google tag sont injectés côté serveur (Analytics.astro). Ici : Clarity, LinkedIn, Meta
 * (sans bandeau cookies depuis le 20/10), et `window.kosmoTrack(name, props)` pour les conversions.
 */
export type AnalyticsConfig = { ga4Id?: string; clarityId?: string; linkedinPartnerId?: string; metaPixelId?: string; plausible?: boolean };

const config: AnalyticsConfig = JSON.parse(document.getElementById('kosmo-analytics')?.textContent ?? '{}');

const script = (src: string, attrs: Record<string, string> = {}) => {
  const el = document.createElement('script');
  el.async = true;
  el.src = src;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  document.head.appendChild(el);
  return el;
};

function loadTools() {
  if (config.clarityId) {
    script(`https://www.clarity.ms/tag/${encodeURIComponent(config.clarityId)}`);
  }
  if (config.linkedinPartnerId) {
    window._linkedin_partner_id = config.linkedinPartnerId;
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(config.linkedinPartnerId);
    script('https://snap.licdn.com/li.lms-analytics/insight.min.js');
  }
  if (config.metaPixelId) {
    const queue: unknown[][] = [];
    const fbq = ((...args: unknown[]) => queue.push(args)) as unknown as NonNullable<Window['fbq']> & { queue?: unknown[][]; loaded?: boolean; version?: string };
    fbq.queue = queue;
    fbq.loaded = true;
    fbq.version = '2.0';
    window.fbq = fbq;
    script('https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', config.metaPixelId);
    window.fbq('track', 'PageView');
  }
}

window.kosmoTrack = (name, props = {}) => {
  window.plausible?.(name, { props });
  window.gtag?.('event', name, props);
  window.fbq?.('trackCustom', name, props);
  window.lintrk?.('track', { conversion_id: name });
};

loadTools();

// --- Événements de conversion déclarés dans le HTML ------------------------
document.querySelectorAll<HTMLElement>('[data-track-view]').forEach((el) => {
  window.kosmoTrack(el.dataset.trackView!, { page: window.location.pathname });
});
document.querySelectorAll<HTMLElement>('[data-track-click]').forEach((el) => {
  el.addEventListener('click', () => window.kosmoTrack(el.dataset.trackClick!, { page: window.location.pathname }));
});
