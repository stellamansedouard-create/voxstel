"use client";

const UTM_KEY = "vx_utm";
const SESSION_KEY = "vx_sid";
const PENDING_KEY = "vx_utm_pending";
const CONSENT_KEY = "vx_consent";

export type ConsentValue = "accepted" | "refused";

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  gclid?: string;
  ga_client_id?: string;
  referrer?: string;
  first_visit_at?: string;
  session_id?: string;
  landing_page?: string;
}

function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/vx_consent=([^;]+)/);
  return (match?.[1] as ConsentValue) ?? null;
}

/** Called on page load. Stores UTM on first touch only. Respects consent. */
export function storeUTM(params: {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  gclid: string | null;
}): void {
  if (!params.utmSource && !params.gclid) return;
  if (localStorage.getItem(UTM_KEY)) return; // first-touch attribution — never overwrite

  const data: UTMData = {
    utm_source: params.utmSource ?? undefined,
    utm_medium: params.utmMedium ?? undefined,
    utm_campaign: params.utmCampaign ?? undefined,
    gclid: params.gclid ?? undefined,
    referrer: document.referrer || undefined,
    first_visit_at: new Date().toISOString(),
  };

  const consent = getConsent();

  if (consent === "accepted") {
    // Consent already given — store immediately
    const serialized = JSON.stringify(data);
    localStorage.setItem(UTM_KEY, serialized);
    document.cookie = `${UTM_KEY}=${encodeURIComponent(serialized)}; max-age=2592000; path=/; SameSite=Lax`;
  } else if (!consent) {
    // No consent yet — hold in sessionStorage until user decides
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(data));
  }
  // refused: discard silently
}

/**
 * Called by CookieBanner when the user makes a consent choice.
 * Flushes or discards the pending UTM data accordingly.
 */
export function applyConsent(accepted: boolean): void {
  const maxAge = 365 * 24 * 3600; // 12 months
  document.cookie = `${CONSENT_KEY}=${accepted ? "accepted" : "refused"}; max-age=${maxAge}; path=/; SameSite=Lax`;

  if (accepted) {
    const pending = sessionStorage.getItem(PENDING_KEY);
    if (pending && !localStorage.getItem(UTM_KEY)) {
      localStorage.setItem(UTM_KEY, pending);
      document.cookie = `${UTM_KEY}=${encodeURIComponent(pending)}; max-age=2592000; path=/; SameSite=Lax`;
    }
    sessionStorage.removeItem(PENDING_KEY);
  } else {
    sessionStorage.removeItem(PENDING_KEY);
    localStorage.removeItem(UTM_KEY);
    // Expire the UTM cookie if it was previously set
    document.cookie = `${UTM_KEY}=; max-age=0; path=/`;
  }
}

/** Returns the consent value, or null if not yet decided. */
export function getConsentStatus(): ConsentValue | null {
  return getConsent();
}

/**
 * Reads the GA4 client_id out of the _ga cookie (set by gtag.js once loaded —
 * see lib/gtag.ts) and merges it into the existing vx_utm payload. Unlike
 * storeUTM's first-touch guard, this always overwrites with the freshest
 * value: it's a technical identifier needed to stitch a later server-side
 * purchase event back to this browser, not attribution data.
 *
 * Call this right before any signup action (email or Google OAuth) — by then
 * the user has necessarily accepted cookies, so gtag.js has had a chance to
 * set _ga. Safe to call repeatedly (e.g. also from UTMTracker on every page
 * load) since a missing cookie is a silent no-op.
 */
export function captureGA4ClientId(): void {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;

  const match = document.cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
  const clientId = match?.[1];
  if (!clientId) return;

  const raw = localStorage.getItem(UTM_KEY);
  const data: UTMData = raw ? JSON.parse(raw) : {};
  if (data.ga_client_id === clientId) return;

  data.ga_client_id = clientId;
  const serialized = JSON.stringify(data);
  localStorage.setItem(UTM_KEY, serialized);
  document.cookie = `${UTM_KEY}=${encodeURIComponent(serialized)}; max-age=2592000; path=/; SameSite=Lax`;
}

/**
 * Records the first path the visitor landed on, into the vx_utm payload, so the
 * signup handler (app/auth/callback) can attribute users.landing_page. First
 * touch only — never overwritten. Consent-gated, like captureGA4ClientId.
 */
export function captureLandingPage(path: string): void {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;
  try {
    const raw = localStorage.getItem(UTM_KEY);
    const data: UTMData & { landing_page?: string } = raw ? JSON.parse(raw) : {};
    if (data.landing_page) return;
    data.landing_page = path;
    const serialized = JSON.stringify(data);
    localStorage.setItem(UTM_KEY, serialized);
    document.cookie = `${UTM_KEY}=${encodeURIComponent(serialized)}; max-age=2592000; path=/; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

/** Returns stored UTM + live session_id. Safe to call server-side (returns {}). */
export function getStoredUTM(): UTMData {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(UTM_KEY);
    const utm: UTMData = raw ? JSON.parse(raw) : {};

    if (!sessionStorage.getItem(SESSION_KEY)) {
      sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
    }
    utm.session_id = sessionStorage.getItem(SESSION_KEY) ?? undefined;

    return utm;
  } catch {
    return {};
  }
}
