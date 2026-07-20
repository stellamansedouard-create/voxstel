import Link from "next/link";
import CreditCheckoutButton from "@/components/pricing/CreditCheckoutButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs — Voxstel",
  description:
    "Des crédits à l'acte, sans abonnement imposé. 2 crédits offerts à l'inscription, puis des packs dès 4,90 € ou l'illimité à 19 €/mois.",
};

// One-shot credit packs. `product` maps to POST /api/checkout.
const PACKS = [
  {
    product: "pack_10" as const,
    name: "Pack 10",
    credits: 10,
    price: "4,90",
    unit: "≈ 0,49 € par prompt",
    tagline: "Pour un projet ponctuel",
    popular: false,
  },
  {
    product: "pack_50" as const,
    name: "Pack 50",
    credits: 50,
    price: "19",
    unit: "≈ 0,38 € par prompt",
    tagline: "Le plus choisi",
    popular: true,
  },
  {
    product: "pack_200" as const,
    name: "Pack 200",
    credits: 200,
    price: "49",
    unit: "≈ 0,25 € par prompt",
    tagline: "Meilleur prix au prompt",
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header section */}
      <section className="pt-32 pb-12 px-4 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
          Tarifs
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
          Payez à l&apos;usage, pas à l&apos;abonnement
        </h1>
        <p className="text-xl text-muted max-w-xl mx-auto text-balance">
          1 crédit = 1 prompt généré par le moteur, où que vous soyez sur le site.
          Copier un prompt brut de la bibliothèque reste gratuit.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent bg-accent/10 px-4 py-2 rounded-full">
          🎁 2 crédits offerts à l&apos;inscription — testez sans payer
        </p>
      </section>

      {/* Packs grid */}
      <section className="pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PACKS.map((pack) => (
              <div
                key={pack.product}
                className={[
                  "relative bg-card rounded-2xl flex flex-col",
                  pack.popular
                    ? "border-2 border-accent shadow-xl pt-10 pb-8 px-7"
                    : "border border-border shadow-sm p-7",
                ].join(" ")}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-accent text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      ⭐ Populaire
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h2 className="text-lg font-bold text-foreground mb-1">
                    {pack.name}
                  </h2>
                  <p className="text-sm text-muted">{pack.tagline}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1.5">
                    <span className="text-4xl font-bold text-foreground">
                      {pack.price} €
                    </span>
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    paiement unique · {pack.unit}
                  </p>
                </div>

                <CreditCheckoutButton
                  product={pack.product}
                  label={`Acheter ${pack.credits} crédits`}
                  primary={pack.popular}
                />

                <ul className="space-y-3">
                  <Feature>{pack.credits} crédits (1 crédit = 1 prompt)</Feature>
                  <Feature>Crédits sans expiration</Feature>
                  <Feature>Toutes les catégories : image, vidéo, texte, musique</Feature>
                  <Feature>Bibliothèque + générateur</Feature>
                  <Feature>Prompts en anglais et en français</Feature>
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unlimited subscription */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-7 sm:flex sm:items-center sm:justify-between gap-8">
            <div className="mb-6 sm:mb-0">
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className="text-lg font-bold text-foreground">Illimité</h2>
                <span className="text-2xl font-bold text-foreground">
                  19 €
                  <span className="text-sm font-normal text-muted"> / mois</span>
                </span>
              </div>
              <p className="text-sm text-muted max-w-md">
                Générations illimitées, sans compter les crédits. Abonnement
                récurrent, résiliable à tout moment depuis votre dashboard.
              </p>
            </div>
            <div className="sm:w-64 flex-shrink-0">
              <CreditCheckoutButton
                product="unlimited"
                label="Passer à l'illimité"
                primary
              />
            </div>
          </div>

          <p className="text-center text-xs text-muted mt-10">
            Paiement sécurisé via Stripe. TVA non applicable (art. 293 B du CGI).
          </p>
        </div>
      </section>

      {/* Back to home */}
      <section className="py-14 px-4" style={{ backgroundColor: "#F5F5F3" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-muted mb-5 leading-relaxed">
            Vous souhaitez comprendre comment Voxstel construit vos prompts avant
            de choisir ?
          </p>
          <Link
            href="/"
            className="btn-secondary inline-flex items-center justify-center gap-2"
          >
            ← Découvrir comment ça marche
          </Link>
        </div>
      </section>
    </main>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="text-green-600 font-bold text-sm flex-shrink-0 mt-0.5">
        ✓
      </span>
      <span className="text-sm leading-snug text-foreground">{children}</span>
    </li>
  );
}
