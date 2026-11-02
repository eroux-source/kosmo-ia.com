/// <reference types="astro/client" />


interface ImportMetaEnv {
  readonly PUBLIC_SHOW_DEMO?: string;
  readonly PUBLIC_BOOKING_URL?: string;
  readonly PUBLIC_WHATSAPP_NUMBER?: string;
  readonly PUBLIC_PLAUSIBLE_DOMAIN?: string;
  readonly PUBLIC_GA4_ID?: string;
  readonly PUBLIC_CLARITY_ID?: string;
  readonly PUBLIC_LINKEDIN_PARTNER_ID?: string;
  readonly PUBLIC_META_PIXEL_ID?: string;
  readonly PUBLIC_VERCEL_ANALYTICS?: string;
  readonly HUBSPOT_ACCESS_TOKEN?: string;
  readonly SLACK_WEBHOOK_URL?: string;
}

/** Globals posés par src/scripts/analytics.ts et les outils tiers. */
interface Window {
  kosmoTrack: (name: string, props?: Record<string, string | number>) => void;
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  reb2b?: { loaded: boolean };
  plausible?: (name: string, options?: { props?: Record<string, string | number> }) => void;
  fbq?: (...args: unknown[]) => void;
  lintrk?: (...args: unknown[]) => void;
  _linkedin_partner_id?: string;
  _linkedin_data_partner_ids?: string[];
}
