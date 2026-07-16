"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { track } from "@/lib/track.client";
import type { PricingPlan } from "@/types";

interface PricingCheckoutButtonProps {
  plan: Exclude<PricingPlan, "free">;
  label: string;
  primary: boolean;
}

export default function PricingCheckoutButton({
  plan,
  label,
  primary,
}: PricingCheckoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);

    track("upgrade_clicked", { plan_targeted: plan, source_page: "pricing" }, { category: null });

    const supabase = createBrowserSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login?next=/pricing");
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError("Impossible de démarrer le paiement. Réessayez.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
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
