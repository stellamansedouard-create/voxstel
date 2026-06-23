import type { PricingInfo, PricingPlan } from "@/types";

export const PRICING: Record<PricingPlan, PricingInfo> = {
  free: {
    plan: "free",
    monthlyLimit: 5,
    price: 0,
    currency: "EUR",
    features: [
      "5 prompts par mois",
      "Catégorie Image uniquement",
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
