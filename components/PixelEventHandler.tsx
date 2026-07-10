"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fbTrack } from "@/lib/fbq";
import { gtagTrackConversion, GOOGLE_ADS_CONVERSION } from "@/lib/gtag";

/** Fires Meta Pixel events signalled via redirect query params, then strips them from the URL. */
export function PixelEventHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fired = useRef(false);

  useEffect(() => {
    const fbqEvent = searchParams.get("fbq_event");
    const checkout = searchParams.get("checkout");
    if (fired.current || (!fbqEvent && checkout !== "success")) return;
    fired.current = true;

    async function run() {
      if (fbqEvent === "registration") {
        fbTrack("CompleteRegistration");
        gtagTrackConversion(GOOGLE_ADS_CONVERSION.signup);
      }

      if (checkout === "success") {
        const sessionId = searchParams.get("session_id");
        if (sessionId) {
          try {
            const res = await fetch(
              `/api/stripe/session?session_id=${encodeURIComponent(sessionId)}`
            );
            if (res.ok) {
              const data = await res.json();
              if (typeof data.value === "number" && data.currency) {
                fbTrack("Purchase", { value: data.value, currency: data.currency });
              }
            }
          } catch {
            // Pixel tracking is best-effort — a failed fetch shouldn't affect the page
          }
        }
      }

      const params = new URLSearchParams(searchParams.toString());
      params.delete("fbq_event");
      params.delete("checkout");
      params.delete("session_id");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    }

    run();
  }, [searchParams, pathname, router]);

  return null;
}
