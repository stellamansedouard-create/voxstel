// TODO(dead-legacy): the monthly-quota pricing model (free/pro/unlimited/promax)
// is superseded by the credits system (lib/credits.ts + lib/stripe.ts). After
// the credits migration, PRICING has ONE remaining live consumer: the Stripe
// webhook (app/api/stripe/webhook/route.ts) uses PRICING[plan].price/currency as
// a FALLBACK for the GA4 purchase amount when Stripe's own amount is absent. It
// is otherwise dead (the pricing page and dashboard no longer read it). Remove
// this file once the webhook fallback is dropped; keep the `PricingPlan` type
// (it lives in @/types, not here) which is still used elsewhere.
import type { PricingInfo, PricingPlan } from "@/types";

export const PRICING: Record<PricingPlan, PricingInfo> = {
  free: {
    plan: "free",
    monthlyLimit: 3,
    price: 0,
    currency: "EUR",
    features: [
      "3 prompts par mois",
      "Toutes les catégories",
      "Affinage supplémentaire inclus",
      "Image & texte de référence inclus",
      "Génération standard",
      "Export EN + FR",
    ],
  },
  pro: {
    plan: "pro",
    monthlyLimit: 50,
    price: 8.99,
    currency: "EUR",
    features: [
      "50 prompts par mois",
      "Toutes les catégories",
      "Génération standard",
      "Historique des prompts",
      "Export EN + FR",
    ],
  },
  unlimited: {
    plan: "unlimited",
    monthlyLimit: null,
    price: 17.99,
    currency: "EUR",
    features: [
      "Prompts illimités",
      "Toutes les catégories",
      "Génération standard",
      "Historique complet",
      "Export EN + FR",
      "Priorité support",
    ],
  },
  promax: {
    plan: "promax",
    monthlyLimit: null,
    price: 29.99,
    currency: "EUR",
    usesSonnet: true,
    features: [
      "Prompts illimités",
      "Toutes les catégories",
      "Génération haute qualité",
      "Historique complet",
      "Export EN + FR",
      "Support prioritaire",
      "Accès anticipé nouvelles fonctions",
    ],
  },
};
