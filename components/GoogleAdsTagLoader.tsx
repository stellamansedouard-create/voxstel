"use client";

import { useEffect } from "react";
import { getConsentStatus } from "@/lib/utm.client";
import { grantAdsConsent } from "@/lib/gtag";

/**
 * gtag.js (app/layout.tsx) always defaults every Consent Mode v2 signal to
 * "denied" on a fresh page load. For a returning visitor who already
 * accepted cookies in a previous session, re-grant consent on mount so
 * ad_storage/analytics_storage aren't stuck denied for the rest of the visit.
 */
export function GoogleAdsTagLoader() {
  useEffect(() => {
    if (getConsentStatus() === "accepted") {
      grantAdsConsent();
    }
  }, []);

  return null;
}
