"use client";

// Session-level tracking: one row per browser session in `sessions`
// (started on first page load, closed out with an exit beacon), plus a
// pathname-based pricing_viewed funnel event. Mounted once in app/layout.tsx
// alongside UTMTracker/GoogleAdsTagLoader — same pattern, same consent gate.
//
// Consent-gated like the rest (lib/utm.client.ts / CookieBanner): nothing is
// written until the visitor accepts. A visitor who refuses simply isn't
// session-tracked, same as they aren't UTM-tracked today.
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { getConsentStatus, getStoredUTM } from "@/lib/utm.client";
import { track, setLastStep, getLastStep } from "@/lib/analytics.client";

function detectDevice(): string {
  if (typeof navigator === "undefined") return "unknown";
  return /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const sessionStartedRef = useRef(false);

  // Session start — once per browser session (vx_sid), not once per page.
  // utm_source/medium/campaign ride along here (from the same first-touch
  // localStorage payload lib/utm.client.ts already maintains) so a session
  // row can be attributed to instagram/google/etc. without re-deriving it
  // from an unreliable document.referrer later.
  useEffect(() => {
    if (getConsentStatus() !== "accepted") return;
    if (sessionStartedRef.current) return;
    sessionStartedRef.current = true;

    const utm = getStoredUTM();
    const sessionId = utm.session_id;
    if (!sessionId) return;

    fetch("/api/analytics/session-start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        landing_page: window.location.pathname,
        referrer: document.referrer || null,
        device: detectDevice(),
        utm_source: utm.utm_source ?? null,
        utm_medium: utm.utm_medium ?? null,
        utm_campaign: utm.utm_campaign ?? null,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  // Track the current page as the "last step" for the exit beacon, and fire
  // the one funnel event that's a plain page (pricing has no click handler
  // of its own to hang this off).
  useEffect(() => {
    setLastStep(pathname);
    if (pathname === "/pricing") {
      track("pricing_viewed");
    }
  }, [pathname]);

  // Exit beacon — pagehide fires reliably on tab close/navigation-away on
  // both mobile and desktop (unlike beforeunload). sendBeacon is used
  // instead of fetch because the browser can tear down the page before a
  // normal fetch completes; sendBeacon is fire-and-forget by design.
  useEffect(() => {
    function sendExitBeacon() {
      if (getConsentStatus() !== "accepted") return;
      const sessionId = getStoredUTM().session_id;
      if (!sessionId || typeof navigator.sendBeacon !== "function") return;

      const payload = JSON.stringify({
        session_id: sessionId,
        last_step: getLastStep() ?? pathname,
      });
      navigator.sendBeacon("/api/analytics/session-end", payload);
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") sendExitBeacon();
    }

    window.addEventListener("pagehide", sendExitBeacon);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", sendExitBeacon);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [pathname]);

  return null;
}
