"use client";

import { useEffect } from "react";
import { track } from "@/lib/track.client";

/**
 * Fires pricing_viewed once on mount. quotaUsed is resolved server-side and
 * passed in (null for anonymous visitors). source_page is best-effort from the
 * document referrer path.
 */
export function PricingViewTracker({ quotaUsed }: { quotaUsed: number | null }) {
  useEffect(() => {
    let sourcePage: string | null = null;
    try {
      sourcePage = document.referrer ? new URL(document.referrer).pathname : null;
    } catch {
      sourcePage = null;
    }
    track("pricing_viewed", { source_page: sourcePage, quota_used_at_time: quotaUsed });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
