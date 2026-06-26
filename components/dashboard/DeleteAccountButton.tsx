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

  if (step === "idle") {
    return (
      <button
        onClick={() => setStep("confirm")}
        className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
      >
        Supprimer mon compte
      </button>
    );
  }

  if (step === "confirm") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-4">
        <div>
          <p className="text-sm font-semibold text-red-800 mb-1">
            Supprimer définitivement votre compte ?
          </p>
          <p className="text-sm text-red-700 leading-relaxed">
            Cette action est <strong>irréversible</strong>. Votre compte, votre historique de
            prompts et vos données d&apos;utilisation seront supprimés immédiatement.
          </p>
          {isPaidPlan && (
            <p className="mt-2 text-sm text-red-700 bg-red-100 rounded-lg px-3 py-2">
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
        <div className="flex gap-3">
          <button
            onClick={() => { setStep("idle"); setError(null); }}
            className="btn-secondary !px-4 !py-2 !text-sm"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Confirmer la suppression
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <span className="w-4 h-4 border-2 border-muted/30 border-t-muted rounded-full animate-spin" />
      Suppression en cours…
    </div>
  );
}
