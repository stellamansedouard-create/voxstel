// Thin wrapper around the Google tag (gtag.js) — safe to call before the script has loaded.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GOOGLE_ADS_ID = "AW-18310195091";

export const GOOGLE_ADS_CONVERSION = {
  signup: `${GOOGLE_ADS_ID}/9VWBCIKjtc0cEJPP_ZpE`, // "Inscription" — soft conversion
  purchase: `${GOOGLE_ADS_ID}/6q1-CMLM1s0cEJPP_ZpE`, // "Achat" — hard conversion, fired server-side only
} as const;

/**
 * Pushes directly onto window.dataLayer — safe to call at any time, even
 * before gtag.js (loaded unconditionally in app/layout.tsx) has finished
 * loading, since gtag.js drains the queued array once it's ready.
 */
function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (typeof window.gtag === "function") {
    // window.gtag is defined by the inline beforeInteractive snippet in
    // app/layout.tsx, so it's always available by the time client code runs.
    window.gtag(...args);
    return;
  }
  // Fallback: gtag.js only processes `arguments` objects pushed onto the
  // dataLayer — pushing a plain Array is silently ignored. `arguments` is
  // available here because this is a regular (non-arrow) function.
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

/**
 * Updates Consent Mode v2 signals to "granted". app/layout.tsx always loads
 * gtag.js and defaults every signal to "denied" for every visitor (so no
 * cookie/ID is set pre-consent) — call this once the user accepts the
 * cookie banner, or on mount for a returning visitor who already accepted
 * in a previous session (see components/GoogleAdsTagLoader.tsx).
 */
export function grantAdsConsent() {
  gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
}

export function gtagTrackConversion(sendTo: string) {
  gtag("event", "conversion", { send_to: sendTo, value: 1.0, currency: "EUR" });
}
