"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storeUTM, captureGA4ClientId } from "@/lib/utm.client";

export function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    storeUTM({
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
      gclid: searchParams.get("gclid"),
    });
    // Opportunistic retry on every navigation — the _ga cookie may not exist
    // yet on the very first page (gtag.js loads async right after consent).
    captureGA4ClientId();
  }, [searchParams]);

  return null;
}
