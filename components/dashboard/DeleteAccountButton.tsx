"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isPaidPlan: boolean;
}

export default function DeleteAccountButton({ isPaidPlan }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "confirm" | "loading">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erreur inconnue");
      }
      router.push("/?compte_supprime=1");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setStep("confirm");
    }
  }

  return (
    <>
      <button
        onClick={() => setStep("confirm")}
        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
      >
        Supprimer mon compte
      </button>

      {(step === "confirm" || step === "loading") && (
        <div
          role="dialog"
          aria-label="Supprimer votre compte ?"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground mb-2">
                Supprimer votre compte ?
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Cette action est définitive et irréversible. Toutes vos données (historique de
                prompts, abonnement, informations de compte) seront supprimées.
              </p>
              {isPaidPlan && (
                <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠ Vous avez un abonnement payant actif. Annulez-le d&apos;abord via{" "}
                  <a
                    href="mailto:essasdev@gmail.com"
                    className="underline font-medium"
                  >
                    essasdev@gmail.com
                  </a>{" "}
                  pour éviter d&apos;être prélevé après la suppression.
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600 font-medium">{error}</p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setStep("idle"); setError(null); }}
                disabled={step === "loading"}
                className="btn-secondary !px-4 !py-2 !text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={step === "loading"}
                className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {step === "loading" ? "Suppression en cours…" : "Confirmer la suppression"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
