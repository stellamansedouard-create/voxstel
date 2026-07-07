"use client";

import { useEffect } from "react";
import { getConsentStatus } from "@/lib/utm.client";
import { loadFacebookPixel } from "@/lib/fbq";

/** Loads the Meta Pixel only if the visitor already accepted cookies in a previous session. */
export function FacebookPixelLoader() {
  useEffect(() => {
    if (getConsentStatus() === "accepted") {
      loadFacebookPixel();
    }
  }, []);

  return null;
}
