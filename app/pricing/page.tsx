import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PricingCheckoutButton from "@/components/pricing/PricingCheckoutButton";
import type { Metadata } from "next";
import type { PricingPlan } from "@/types";

export const metadata: Metadata = {
  title: "Tarifs — Voxstel",
  description: "Des tarifs simples pour générer des prompts IA professionnels. Commencez gratuitement.",
};

type Feature = { label: string; ok: boolean };

const plans = [
  {
    id: "free",
    name: "Free",
    tagline: "Pour découvrir Voxstel",
    price: "0",
    priceNote: "pour toujours",
    cta: "Commencer gratuitement",
    ctaPrimary: false,
    href: "/signup",
    popular: false,
    features: [
      { label: "5 prompts / mois", ok: true },
      { label: "Catégories Image & Texte/Code", ok: true },
      { label: "Prompts en anglais + français", ok: true },
      { label: "Toutes les catégories", ok: false },
      { label: "Upload de référence", ok: false },
      { label: "Génération haute qualité", ok: false },
    ] as Feature[],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Pour les créatifs réguliers",
    price: "8,99",
    priceNote: "/ mois",
    cta: "Choisir Pro",
    ctaPrimary: false,
    popular: false,
    features: [
      { label: "50 prompts / mois", ok: true },
      { label: "Toutes les catégories", ok: true },
      { label: "Prompts en anglais + français", ok: true },
      { label: "Upload de référence", ok: false },
      { label: "Génération haute qualité", ok: false },
    ] as Feature[],
  },
  {
    id: "unlimited",
    name: "Illimité",
    tagline: "Le meilleur rapport qualité-prix",
    price: "17,99",
    priceNote: "/ mois",
    cta: "Choisir Illimité",
    ctaPrimary: true,
    popular: true,
    features: [
      { label: "Prompts illimités", ok: true },
      { label: "Toutes les catégories", ok: true },
      { label: "Prompts en anglais + français", ok: true },
      { label: "Upload d'image de référence", ok: true },
      { label: "Upload de texte de référence", ok: true },
      { label: "Génération haute qualité", ok: false },
    ] as Feature[],
  },
  {
    id: "promax",
    name: "Pro Max",
    tagline: "Pour les professionnels exigeants",
    price: "29,99",
    priceNote: "/ mois",
    cta: "Choisir Pro Max",
    ctaPrimary: false,
    popular: false,
    features: [
      { label: "Prompts illimités", ok: true },
      { label: "Toutes les catégories", ok: true },
      { label: "Prompts en anglais + français", ok: true },
      { label: "Upload d'image de référence", ok: true },
      { label: "Upload de texte de référence", ok: true },
      { label: "Génération haute qualité", ok: true },
    ] as Feature[],
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header section */}
        <section className="pt-32 pb-16 px-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
            Tarifs
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Des tarifs simples et transparents
          </h1>
          <p className="text-xl text-muted max-w-xl mx-auto text-balance">
            Choisissez le plan adapté à votre usage créatif.
            Commencez gratuitement, évoluez quand vous le souhaitez.
          </p>
        </section>

        {/* Plans grid */}
        <section className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className={[
                    "relative bg-card rounded-2xl flex flex-col",
                    plan.popular
                      ? "border-2 border-accent shadow-xl pt-10 pb-8 px-7"
                      : "border border-border shadow-sm p-7",
                  ].join(" ")}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full">
                        ⭐ Populaire
                      </span>
                    </div>
                  )}

                  {/* Plan name + tagline */}
                  <div className="mb-5">
                    <h2 className="text-lg font-bold text-foreground mb-1">{plan.name}</h2>
                    <p className="text-sm text-muted">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-bold text-foreground">{plan.price} €</span>
                    </div>
                    <p className="text-sm text-muted mt-0.5">{plan.priceNote}</p>
                  </div>

                  {/* CTA */}
                  {plan.id === "free" ? (
                    <Link
                      href={plan.href ?? "/signup"}
                      className={[
                        "w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 mb-7",
                        plan.ctaPrimary
                          ? "bg-accent text-white hover:bg-accent-dark"
                          : "bg-white border border-border text-foreground hover:bg-card-hover",
                      ].join(" ")}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <PricingCheckoutButton
                      plan={plan.id as Exclude<PricingPlan, "free">}
                      label={plan.cta}
                      primary={plan.ctaPrimary}
                    />
                  )}

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat.label} className="flex items-start gap-2.5">
                        {feat.ok ? (
                          <span className="text-green-600 font-bold text-sm flex-shrink-0 mt-0.5">✓</span>
                        ) : (
                          <span className="text-muted text-sm flex-shrink-0 mt-0.5">—</span>
                        )}
                        <span
                          className={[
                            "text-sm leading-snug",
                            feat.ok ? "text-foreground" : "text-muted",
                          ].join(" ")}
                        >
                          {feat.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Note Stripe */}
            <p className="text-center text-xs text-muted mt-10">
              Paiement sécurisé via Stripe. Résiliable à tout moment depuis votre dashboard.
            </p>
          </div>
        </section>

        {/* Lien retour accueil */}
        <section className="py-14 px-4" style={{ backgroundColor: "#F5F5F3" }}>
          <div className="max-w-xl mx-auto text-center">
            <p className="text-muted mb-5 leading-relaxed">
              Vous souhaitez en savoir plus sur le fonctionnement de Voxstel
              avant de choisir un plan ?
            </p>
            <Link href="/" className="btn-secondary inline-flex items-center justify-center gap-2">
              ← Découvrir comment ça marche
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
