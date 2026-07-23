"use client";

// Browser-side funnel tracking — POSTs to /api/ingest (see that route for the
// allow-list) and the two /api/ingest/session-* routes.
//
// The path is deliberately neutral (NOT /api/analytics/events): ad/tracking
// blockers match filter lists on URL substrings like "analytics", "events",
// "track", "collect", "beacon" and drop the request client-side as
// `(blocked:other)` before it ever leaves the browser. Our audience
// (AI/creative/tech) runs blockers heavily, so the old path silently
// under-counted prompt_copied and the rest of the funnel. Keep this path free
// of those substrings. /api/prompts/mark-copied was never blocked, which is
// why was_copied kept working while its paired prompt_copied event vanished.
//
// Consent-gated the same way lib/utm.client.ts is: nothing fires until the
// visitor has accepted the cookie banner, so this never becomes a second,
// non-consented tracking path running alongside the one CookieBanner already
// gates. See lib/gtag.ts / lib/utm.client.ts for the existing pattern this
// mirrors.

import { getConsentStatus, getStoredUTM } from "@/lib/utm.client";
import type { EventType } from "@/lib/analytics";

type ClientEventType = Extract<
  EventType,
  | "category_selected"
  | "input_submitted"
  | "questions_shown"
  | "generation_started"
  | "prompt_copied"
  | "upgrade_clicked"
  | "pricing_viewed"
>;

/** Fire-and-forget — never throws, never blocks the UI it's called from. */
export function track(
  eventType: ClientEventType,
  opts?: { promptCategory?: string; metadata?: Record<string, unknown> }
): void {
  if (typeof window === "undefined") return;
  if (getConsentStatus() !== "accepted") return;

  const sessionId = getStoredUTM().session_id ?? undefined;

  fetch("/api/ingest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event_type: eventType,
      prompt_category: opts?.promptCategory,
      session_id: sessionId,
      metadata: opts?.metadata ?? null,
    }),
    keepalive: true,
  }).catch(() => {
    // best-effort — a dropped analytics call must never surface to the user
  });
}

/**
 * Records the current step so a session-end beacon (see AnalyticsTracker)
 * can report "left here" even though the tab-close event itself can't run
 * async code. Cheap sessionStorage write, no network call.
 */
export function setLastStep(step: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("vx_last_step", step);
  } catch {
    // storage blocked (private mode, quota) — exit tracking just degrades
  }
}

export function getLastStep(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem("vx_last_step");
  } catch {
    return null;
  }
}
