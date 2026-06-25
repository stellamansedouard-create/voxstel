"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { storeUTM } from "@/lib/utm.client";

export function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    storeUTM({
      utmSource: searchParams.get("utm_source"),
      utmMedium: searchParams.get("utm_medium"),
      utmCampaign: searchParams.get("utm_campaign"),
    });
  }, [searchParams]);

  return null;
}
