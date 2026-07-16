"use client";

import { getStoredUTM, getConsentStatus } from "@/lib/utm.client";
import { posthogCapture } from "@/lib/posthog.client";
import type { EventType } from "@/lib/analytics";

interface TrackOptions {
  /**
   * Service events reflect first-party product usage by an authenticated user
   * (copying/regenerating a prompt they just generated, etc.). They are logged
   * under the "execution of the contract" basis and therefore are NOT gated on
   * the cookie-consent banner. Anonymous funnel events (page_view,
   * category_selected, input_submitted…) leave this false and only fire once
   * vx_consent === "accepted". See the 2026-07 consent decision.
   */
  service?: boolean;
  /** Optional category shortcut → stored in analytics_events.prompt_category. */
  category?: string | null;
}

/**
 * Fire a first-party analytics event: writes to analytics_events (with full,
 * never-null metadata) via /api/track AND mirrors to PostHog (no-op until
 * PostHog is wired up). Safe to call from anywhere in a client component.
 */
export function track(
  eventType: EventType,
  properties: Record<string, unknown> = {},
  opts: TrackOptions = {}
): void {
  if (typeof window === "undefined") return;

  // RGPD gate: anonymous funnel events wait for consent; service events don't.
  if (!opts.service && getConsentStatus() !== "accepted") return;

  const utm = getStoredUTM();
  const metadata = { ...properties };

  const body = JSON.stringify({
    event_type: eventType,
    prompt_category: opts.category ?? (properties.category as string | undefined) ?? null,
    session_id: utm.session_id ?? null,
    referrer: utm.referrer ?? null,
    utm_source: utm.utm_source ?? null,
    utm_medium: utm.utm_medium ?? null,
    utm_campaign: utm.utm_campaign ?? null,
    metadata,
  });

  // sendBeacon survives navigations (important for upgrade_clicked, page_view
  // right before a route change). Falls back to keepalive fetch.
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // analytics must never break the UI
  }

  posthogCapture(eventType, { ...metadata, session_id: utm.session_id });
}

/**
 * Cheap best-effort language heuristic for the raw user input, stored as
 * prompts_history.input_lang. Not a real detector — just enough to segment
 * French vs. English vs. other in the funnel. Returns "fr" | "en" | "other".
 */
export function detectLang(text: string): string {
  const t = (text || "").toLowerCase();
  if (!t.trim()) return "unknown";
  if (/[àâäéèêëïîôöùûüÿçœæ]/.test(t)) return "fr";
  const fr = /\b(le|la|les|un|une|des|avec|pour|dans|qui|que|est|sur|mon|ma|mes|je|tu|il|elle|nous|vous|et|ou|d'|l'|au|aux|ce|cette)\b/g;
  const en = /\b(the|a|an|with|for|in|which|that|is|on|my|i|you|he|she|we|and|or|of|to|this|these)\b/g;
  const frCount = (t.match(fr) ?? []).length;
  const enCount = (t.match(en) ?? []).length;
  if (frCount === 0 && enCount === 0) return "other";
  return frCount >= enCount ? "fr" : "en";
}
