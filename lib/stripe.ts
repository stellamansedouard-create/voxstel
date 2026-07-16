import Stripe from "stripe";
import type { PricingPlan } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ---------------------------------------------------------------------------
// Legacy subscription plans (pre-credits pivot).
// STRIPE_PRICE_UNLIMITED is being REPOINTED to the new 19€/mo recurring price
// (see the credits section below). The old 8,99 / 17,99 / 29,99 prices stay in
// Stripe (prices are immutable) but can no longer be purchased — the old
// /api/stripe/checkout subscription path is retired for `unlimited`.
// ---------------------------------------------------------------------------
export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRICE_PRO!,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
  promax: process.env.STRIPE_PRICE_PROMAX!,
} as const;

// Legacy plan price ids (pre-credits pivot), kept EXPLICITLY — NOT derived from
// env — so the webhook still resolves the CORRECT plan for old subscriptions
// after STRIPE_PRICE_UNLIMITED is repointed to the new 19€ price. Each id maps
// to its real plan (not all to "unlimited"): mapping the 8,99€/29,99€ ids to
// "unlimited" would mislabel the live pro sub. NONE of these grant
// credits-unlimited — they are deliberately excluded from UNLIMITED_PRICE_IDS.
// NOTE: values are the test-mode ids from .env.local. Add the PRODUCTION legacy
// ids here too if they differ.
const LEGACY_PRICE_IDS: Record<string, PricingPlan> = {
  price_1TphuLPQc6WKsJkg7b1j9SJE: "pro", // 8,99 € (a live active sub is on this)
  price_1TphuLPQc6WKsJkgwsoqku7d: "unlimited", // 17,99 €
  price_1TphuKPQc6WKsJkg3jVnCsrO: "promax", // 29,99 €
};

/** Reverse lookup used by the webhook to resolve a plan from a Stripe price id.
 *  Env entries win over the legacy literals on any shared id. */
export const PLAN_BY_PRICE_ID: Record<string, PricingPlan> = {
  ...LEGACY_PRICE_IDS,
  [STRIPE_PRICES.pro]: "pro",
  [STRIPE_PRICES.unlimited]: "unlimited",
  [STRIPE_PRICES.promax]: "promax",
};

// ---------------------------------------------------------------------------
// Credits pivot — packs (one-shot payment) + unlimited (recurring subscription)
//   Pack 10  = 4,90 €   -> +10 crédits
//   Pack 50  = 19 €     -> +50 crédits
//   Pack 200 = 49 €     -> +200 crédits
//   Unlimited = 19 €/mois (récurrent) -> pas de décompte
// TVA non applicable (franchise en base, art. 293 B du CGI) — automatic_tax OFF.
// ---------------------------------------------------------------------------
export type CreditProduct = "pack_10" | "pack_50" | "pack_200" | "unlimited";

export function isCreditProduct(value: unknown): value is CreditProduct {
  return (
    value === "pack_10" ||
    value === "pack_50" ||
    value === "pack_200" ||
    value === "unlimited"
  );
}

/** Product -> Stripe price id (from env). `unlimited` reuses STRIPE_PRICE_UNLIMITED. */
export const PRICE_BY_PRODUCT: Record<CreditProduct, string> = {
  pack_10: process.env.STRIPE_PRICE_PACK_10!,
  pack_50: process.env.STRIPE_PRICE_PACK_50!,
  pack_200: process.env.STRIPE_PRICE_PACK_200!,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
};

/** Reverse: Stripe price id -> credits granted. Packs only. */
export const CREDITS_BY_PRICE_ID: Record<string, number> = {
  [PRICE_BY_PRODUCT.pack_10]: 10,
  [PRICE_BY_PRODUCT.pack_50]: 50,
  [PRICE_BY_PRODUCT.pack_200]: 200,
};

/** credit_transactions.reason for a pack purchase, keyed by credits granted. */
export const PACK_REASON_BY_CREDITS: Record<number, string> = {
  10: "purchase_pack_10",
  50: "purchase_pack_50",
  200: "purchase_pack_200",
};

/**
 * Price ids that grant "unlimited" for credit purposes — the new 19€/mo
 * subscription ONLY. Deliberately excludes the legacy 8,99 / 17,99 / 29,99
 * ids, so an existing legacy subscriber (subscription_status='active') is not
 * mistaken for unlimited by lib/credits.ts's getBalance().
 */
export const UNLIMITED_PRICE_IDS = new Set<string>([
  process.env.STRIPE_PRICE_UNLIMITED!,
]);
