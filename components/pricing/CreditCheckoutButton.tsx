"use client";

// Credits checkout CTA. Posts to /api/checkout with { product } (the credits
// endpoint) — NOT the legacy /api/stripe/checkout. Crediting is applied by the
// Stripe webhook on checkout.session.completed, never client-side.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

type CreditProduct = "pack_10" | "pack_50" | "pack_200" | "unlimited";

interface CreditCheckoutButtonProps {
  product: CreditProduct;
  label: string;
  primary?: boolean;
}

export default function CreditCheckoutButton({
  product,
  label,
  primary = false,
}: CreditCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError("Impossible de démarrer le paiement. Réessayez.");
        setLoading(false);
        return;
      }

      window.location.href = data.url as string;
    } catch {
      setError("Impossible de démarrer le paiement. Réessayez.");
      setLoading(false);
    }
  }

  return (
    <div className="mb-7">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={[
          "w-full text-center py-2.5 rounded-xl font-semibold text-sm transition-all duration-200",
          primary
            ? "bg-accent text-white hover:bg-accent-dark"
            : "bg-white border border-border text-foreground hover:bg-card-hover",
          loading ? "opacity-60 cursor-wait" : "",
        ].join(" ")}
      >
        {loading ? "Redirection…" : label}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
