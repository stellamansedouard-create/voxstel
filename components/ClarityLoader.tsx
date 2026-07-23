"use client";

import { useEffect } from "react";
import { getConsentStatus } from "@/lib/utm.client";
import { initClarity } from "@/lib/clarity";

/**
 * Loads Microsoft Clarity on mount for a returning visitor who already accepted
 * the cookie banner in a previous session. A fresh visitor (no vx_consent
 * cookie) or one who refused loads nothing — Clarity is instead started from
 * the banner's "Accepter" handler (see components/CookieBanner.tsx). Mirrors
 * components/GoogleAdsTagLoader.tsx.
 */
export function ClarityLoader() {
  useEffect(() => {
    if (getConsentStatus() === "accepted") {
      initClarity();
    }
  }, []);

  return null;
}
