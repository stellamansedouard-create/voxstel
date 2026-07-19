"use client";

// Shown when a delivery is blocked because the balance hit 0. No engine call
// happened, nothing was charged — this is the wall, not a receipt. The CTA
// routes to /pricing, where the credit packs are actually sold, so no checkout
// logic is duplicated here.
import { useRouter } from "next/navigation";

interface PaywallProps {
  /** Return to the previous step so the user can retry after topping up. */
  onBack?: () => void;
}

export default function Paywall({ onBack }: PaywallProps) {
  const router = useRouter();

  return (
    <div className="animate-slide-up text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-2xl mb-4">
        <span className="text-2xl">✨</span>
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">
        Vous n&apos;avez plus de crédits
      </h2>
      <p className="text-sm text-muted max-w-sm mx-auto mb-6">
        Chaque prompt généré par le moteur coûte 1 crédit. Rechargez pour
        continuer — votre travail en cours est conservé.
      </p>

      <button
        type="button"
        onClick={() => router.push("/pricing")}
        className="btn-primary w-full"
      >
        Voir les recharges →
      </button>

      {onBack && (
        <button type="button" onClick={onBack} className="btn-secondary w-full mt-3">
          ← Revenir en arrière
        </button>
      )}
    </div>
  );
}
