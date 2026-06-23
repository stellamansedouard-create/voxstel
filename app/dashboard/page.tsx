import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromptHistoryList from "@/components/dashboard/PromptHistoryList";
import type { PromptHistoryItem } from "@/components/dashboard/PromptHistoryList";
import { getCurrentUser, getAuthServerClient } from "@/lib/auth";
import { PRICING } from "@/lib/pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Voxstel",
};

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  unlimited: "Illimité",
  promax: "Pro Max",
};

const PLAN_COLORS: Record<string, string> = {
  free: "bg-card-hover text-muted border-border",
  pro: "bg-blue-50 text-blue-700 border-blue-200",
  unlimited: "bg-accent/10 text-accent border-accent/30",
  promax: "bg-accent/10 text-accent border-accent/30",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Fallback protection (middleware is primary)
  if (!user) redirect("/login");

  const supabase = getAuthServerClient();

  // Fetch user row from public.users
  const { data: userData } = await supabase
    .from("users")
    .select("plan, quota_used, quota_reset_date")
    .eq("id", user.id)
    .single();

  const plan = (userData?.plan ?? "free") as keyof typeof PRICING;
  const quotaUsed = userData?.quota_used ?? 0;
  const quotaReset = userData?.quota_reset_date
    ? new Date(userData.quota_reset_date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
      })
    : null;

  const planInfo = PRICING[plan];
  const quotaLimit = planInfo?.monthlyLimit ?? 5;
  const isUnlimited = quotaLimit === null;
  const quotaPercent = isUnlimited ? 0 : Math.min(100, (quotaUsed / quotaLimit!) * 100);

  // Fetch prompt history
  const { data: promptsRaw } = await supabase
    .from("prompts_history")
    .select("id, category, tool, prompt_en, prompt_fr, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const prompts: PromptHistoryItem[] = promptsRaw ?? [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bonjour 👋
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>

          {/* Info cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">

            {/* Plan actuel */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Plan actuel
              </p>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${PLAN_COLORS[plan] ?? PLAN_COLORS.free}`}
                >
                  {PLAN_LABELS[plan] ?? plan}
                </span>
              </div>
              <Link
                href="/pricing"
                className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1"
              >
                Voir les tarifs <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Quota */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                Quota ce mois
              </p>

              {isUnlimited ? (
                <div>
                  <p className="text-2xl font-bold text-foreground mb-1">Illimité</p>
                  <p className="text-sm text-muted">{quotaUsed} prompts générés</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-end gap-1.5 mb-3">
                    <span className="text-2xl font-bold text-foreground">{quotaUsed}</span>
                    <span className="text-muted pb-0.5">/ {quotaLimit}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-card-hover rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    {quotaLimit! - quotaUsed} prompts restants
                    {quotaReset && (
                      <span className="ml-1">— réinitialisation le {quotaReset}</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Prompt history */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-foreground">Vos prompts récents</h2>
              <Link
                href="/generate/image"
                className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1"
              >
                Nouveau prompt <span aria-hidden>→</span>
              </Link>
            </div>

            <PromptHistoryList prompts={prompts} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
