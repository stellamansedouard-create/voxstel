"use client";

const UTM_KEY = "vx_utm";
const SESSION_KEY = "vx_sid";

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  first_visit_at?: string;
  session_id?: string;
}

/** Called on page load. Persists UTM params on first touch only (does not overwrite). */
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

  const serialized = JSON.stringify(data);
  localStorage.setItem(UTM_KEY, serialized);
  // Cookie so the server-side auth callback can read it at signup (30-day TTL)
  document.cookie = `vx_utm=${encodeURIComponent(serialized)}; max-age=2592000; path=/; SameSite=Lax`;
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
