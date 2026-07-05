"use client";

import { useState } from "react";

export default function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError("Impossible d'ouvrir la gestion de l'abonnement. Réessayez.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Impossible d'ouvrir la gestion de l'abonnement. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1 disabled:opacity-60"
      >
        {loading ? "Ouverture…" : "Gérer mon abonnement"} <span aria-hidden>→</span>
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
