/**
 * Server-side "Achat" (hard) conversion upload to Google Ads via the Click
 * Conversions Upload API. Called from app/api/stripe/webhook on
 * checkout.session.completed — never client-side, so the real subscription
 * value is used and the event survives ad blockers.
 *
 * Requires env vars (all must be set or the upload is skipped, logged, and
 * never throws — a missing conversion must not break the Stripe webhook):
 *   GOOGLE_ADS_DEVELOPER_TOKEN
 *   GOOGLE_ADS_CLIENT_ID
 *   GOOGLE_ADS_CLIENT_SECRET
 *   GOOGLE_ADS_REFRESH_TOKEN
 *   GOOGLE_ADS_CUSTOMER_ID              — target account id, digits only, no dashes
 *   GOOGLE_ADS_LOGIN_CUSTOMER_ID        — optional, only if the account sits under an MCC
 *   GOOGLE_ADS_PURCHASE_CONVERSION_ACTION_ID — numeric id of the "Achat" conversion
 *     action. The conversion LABEL (6q1-CMLM1s0cEJPP_ZpE, used by gtag.js) is NOT
 *     accepted here — the API needs the numeric id. Find it in Google Ads under
 *     Goals > Conversions > "Achat" > conversion action details (or via GAQL:
 *     SELECT conversion_action.id FROM conversion_action WHERE conversion_action.name = 'Achat').
 */

const API_VERSION = process.env.GOOGLE_ADS_API_VERSION || "v19";

interface UploadPurchaseConversionParams {
  gclid: string | null | undefined;
  value: number;
  currency: string;
  conversionDateTime: Date;
}

function readConfig() {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
  const conversionActionId = process.env.GOOGLE_ADS_PURCHASE_CONVERSION_ACTION_ID;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;

  if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId || !conversionActionId) {
    return null;
  }
  return { developerToken, clientId, clientSecret, refreshToken, customerId, conversionActionId, loginCustomerId };
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth token refresh failed — status ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/** Formats a Date as Google Ads expects: "YYYY-MM-DD HH:MM:SS+HH:MM". */
function formatConversionDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const offsetH = pad(Math.floor(Math.abs(offsetMinutes) / 60));
  const offsetM = pad(Math.abs(offsetMinutes) % 60);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${sign}${offsetH}:${offsetM}`
  );
}

/** Best-effort — logs and returns on any missing config or upload failure, never throws. */
export async function uploadPurchaseConversion(params: UploadPurchaseConversionParams): Promise<void> {
  const config = readConfig();
  if (!config) {
    console.warn("[google-ads] purchase conversion skipped — missing GOOGLE_ADS_* env vars");
    return;
  }
  if (!params.gclid) {
    console.warn("[google-ads] purchase conversion skipped — no gclid on this user (organic/direct signup, or auto-tagging is off in the Google Ads account)");
    return;
  }

  try {
    const accessToken = await getAccessToken(config.clientId, config.clientSecret, config.refreshToken);

    const res = await fetch(
      `https://googleads.googleapis.com/${API_VERSION}/customers/${config.customerId}:uploadClickConversions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "developer-token": config.developerToken,
          ...(config.loginCustomerId ? { "login-customer-id": config.loginCustomerId } : {}),
        },
        body: JSON.stringify({
          conversions: [
            {
              gclid: params.gclid,
              conversionAction: `customers/${config.customerId}/conversionActions/${config.conversionActionId}`,
              conversionDateTime: formatConversionDateTime(params.conversionDateTime),
              conversionValue: params.value,
              currencyCode: params.currency,
            },
          ],
          partialFailure: true,
        }),
      }
    );

    const body = await res.json();
    if (!res.ok || body.partialFailureError) {
      console.error("[google-ads] purchase conversion upload failed —", JSON.stringify(body));
      return;
    }

    console.log("[google-ads] purchase conversion uploaded — value:", params.value, params.currency);
  } catch (error) {
    console.error("[google-ads] purchase conversion upload error:", error);
  }
}
