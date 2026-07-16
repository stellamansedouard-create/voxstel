"use client";

/**
 * PostHog bridge — intentionally dependency-free and no-op until PostHog is
 * actually wired up.
 *
 * The product decision (2026-07) was "DB first, PostHog câblé no-op": every
 * event already lands in analytics_events with full metadata; this mirror
 * fires the SAME event name + properties to PostHog IF and only IF a PostHog
 * client is present on `window` (i.e. once you add the posthog-js snippet or
 * SDK, keyed by NEXT_PUBLIC_POSTHOG_KEY). Until then it does nothing and adds
 * no bundle weight.
 *
 * To turn it on later: load posthog-js (respecting consent — EU host
 * https://eu.posthog.com), call posthog.init(NEXT_PUBLIC_POSTHOG_KEY), and it
 * will be picked up here automatically. No other file needs to change.
 */
type PostHogLike = {
  capture: (event: string, properties?: Record<string, unknown>) => void;
  identify?: (id: string, properties?: Record<string, unknown>) => void;
};

function getPostHog(): PostHogLike | null {
  if (typeof window === "undefined") return null;
  const ph = (window as unknown as { posthog?: PostHogLike }).posthog;
  return ph && typeof ph.capture === "function" ? ph : null;
}

export function posthogCapture(event: string, properties?: Record<string, unknown>): void {
  try {
    getPostHog()?.capture(event, properties);
  } catch {
    // never let analytics throw into product code
  }
}

export function posthogIdentify(id: string, properties?: Record<string, unknown>): void {
  try {
    getPostHog()?.identify?.(id, properties);
  } catch {
    /* no-op */
  }
}
