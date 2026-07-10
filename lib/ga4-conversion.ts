/**
 * Server-side "purchase" event upload to GA4 via the Measurement Protocol.
 * Called from app/api/stripe/webhook on checkout.session.completed — the
 * replacement for the Google Ads API offline-conversion path (see
 * lib/google-ads-conversion.ts, kept in the repo but no longer called: the
 * Ads API developer token now requires a separate Manager account + MFA-gated
 * OAuth setup, too much friction for this launch).
 *
 * "purchase" is one of GA4's recommended events and is auto-marked as a key
 * event/conversion on most properties — verify under GA4 Admin > Events, and
 * toggle "Mark as key event" if it isn't already. Once GA4 is linked to the
 * Google Ads account (Admin > Google Ads Links — a manual, one-time step),
 * this conversion becomes importable into Google Ads as its own goal.
 *
 * Requires:
 *   GA4_API_SECRET — GA4 Admin > Data Streams > "Voxstel Web" >
 *     Measurement Protocol API secrets > Create
 *   GA4_MP_DEBUG (optional) — routes to the /debug/mp/collect validation
 *     endpoint instead of production. Leave unset in prod.
 *
 * Best-effort — logs and returns on any missing config or upload failure,
 * never throws, so a tracking hiccup can never break the Stripe webhook.
 */

const GA4_MEASUREMENT_ID = "G-960CH3E68D"; // must match lib/gtag.ts's GA4_MEASUREMENT_ID

interface UploadPurchaseEventParams {
  clientId: string | null | undefined;
  value: number;
  currency: string;
  transactionId: string;
}

export async function uploadPurchaseEvent(params: UploadPurchaseEventParams): Promise<void> {
  const apiSecret = process.env.GA4_API_SECRET;
  if (!apiSecret) {
    console.warn("[ga4] purchase event skipped — missing GA4_API_SECRET");
    return;
  }
  if (!params.clientId) {
    console.warn("[ga4] purchase event skipped — no GA4 client_id stored for this user (signed up before GA4 tracking was live, or refused cookies)");
    return;
  }

  const debug = process.env.GA4_MP_DEBUG === "true";
  const endpoint = debug
    ? "https://www.google-analytics.com/debug/mp/collect"
    : "https://www.google-analytics.com/mp/collect";

  try {
    const res = await fetch(
      `${endpoint}?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${apiSecret}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: params.clientId,
          events: [
            {
              name: "purchase",
              params: {
                value: params.value,
                currency: params.currency,
                transaction_id: params.transactionId,
              },
            },
          ],
        }),
      }
    );

    // The production /mp/collect endpoint always returns 204 with an empty
    // body, whether or not the event validated — GA4 doesn't surface errors
    // there by design. Only /debug/mp/collect returns validationMessages.
    if (debug) {
      const body = await res.json().catch(() => null);
      if (!res.ok || body?.validationMessages?.length) {
        console.error("[ga4] purchase event validation failed —", JSON.stringify(body));
        return;
      }
    } else if (!res.ok) {
      console.error("[ga4] purchase event upload failed — status", res.status);
      return;
    }

    console.log("[ga4] purchase event uploaded — value:", params.value, params.currency, "transaction_id:", params.transactionId);
  } catch (error) {
    console.error("[ga4] purchase event upload error:", error);
  }
}
