"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track } from "@/lib/track.client";
import { captureLandingPage } from "@/lib/utm.client";

/**
 * Fires a page_view on every route change (consent-gated inside track()).
 * Also records the first landing path so signup attribution has it.
 * Mounted once in the root layout, inside <Suspense> (uses useSearchParams).
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    captureLandingPage(pathname);
    track("page_view", {
      path: pathname,
      utm_source: searchParams.get("utm_source") ?? undefined,
      utm_medium: searchParams.get("utm_medium") ?? undefined,
      utm_campaign: searchParams.get("utm_campaign") ?? undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return null;
}
