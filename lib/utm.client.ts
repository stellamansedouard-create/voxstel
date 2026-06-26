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
  referrer?: string;
  first_visit_at?: string;
  session_id?: string;
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
}): void {
  if (!params.utmSource) return;
  if (localStorage.getItem(UTM_KEY)) return; // first-touch attribution — never overwrite

  const data: UTMData = {
    utm_source: params.utmSource,
    utm_medium: params.utmMedium ?? undefined,
    utm_campaign: params.utmCampaign ?? undefined,
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
