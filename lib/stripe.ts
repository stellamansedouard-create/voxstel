import Stripe from "stripe";
import type { PricingPlan } from "@/types";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRICE_PRO!,
  unlimited: process.env.STRIPE_PRICE_UNLIMITED!,
  promax: process.env.STRIPE_PRICE_PROMAX!,
} as const;

/** Reverse lookup used by the webhook to resolve a plan from a Stripe price id. */
export const PLAN_BY_PRICE_ID: Record<string, PricingPlan> = {
  [STRIPE_PRICES.pro]: "pro",
  [STRIPE_PRICES.unlimited]: "unlimited",
  [STRIPE_PRICES.promax]: "promax",
};
