import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PromptHistoryList from "@/components/dashboard/PromptHistoryList";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import ManageSubscriptionButton from "@/components/dashboard/ManageSubscriptionButton";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import SourceBreakdown from "@/components/dashboard/SourceBreakdown";
import type { PromptHistoryItem } from "@/components/dashboard/PromptHistoryList";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
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

const PLAN_BADGE: Record<string, string> = {
  free: "bg-card-hover text-muted border-border",
  pro: "bg-blue-50 text-blue-700 border-blue-200",
  unlimited: "bg-accent/10 text-accent border-accent/30",
  promax: "bg-accent/10 text-accent border-accent/30",
};

const CATEGORY_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  text: "Texte",
  music: "Musique",
};

function distribute(items: (string | null | undefined)[]) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item) continue;
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const supabase = createServerSupabase();

  const signupDate = new Date(user.created_at);
  const now = new Date();
  const daysSinceSignup = Math.max(
    1,
    Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Toutes les requêtes en parallèle
  const [
    { data: userData },
    { data: allEvents },
    { data: recentEvents },
    { data: sourceEvents },
    { data: promptsRaw },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("plan, quota_used, quota_reset_date")
      .eq("id", user.id)
      .single(),
    supabase
      .from("analytics_events")
      .select("prompt_category, created_at")
      .eq("user_id", user.id)
      .eq("event_type", "prompt_generated"),
    supabase
      .from("analytics_events")
      .select("prompt_category, created_at")
      .eq("user_id", user.id)
      .eq("event_type", "prompt_generated")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true }),
    supabase
      .from("analytics_events")
      .select("utm_source, utm_medium")
      .eq("user_id", user.id),
    supabase
      .from("prompts_history")
      .select("id, category, tool, prompt_en, prompt_fr, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  // ── Plan & quota ────────────────────────────────────────────────
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
  const quotaPercent = isUnlimited
    ? 0
    : Math.min(100, (quotaUsed / (quotaLimit ?? 1)) * 100);

  // ── KPIs ────────────────────────────────────────────────────────
  const events = allEvents ?? [];
  const total = events.length;
  const thisMonth = events.filter((e) => e.created_at >= startOfMonth).length;
  const avgPerDay =
    total > 0 ? Math.round((total / daysSinceSignup) * 10) / 10 : 0;

  const catCounts: Record<string, number> = {};
  for (const e of events) {
    const cat = e.prompt_category ?? "other";
    catCounts[cat] = (catCounts[cat] ?? 0) + 1;
  }
  let topCategory: string | null = null;
  let topCategoryPct = 0;
  if (total > 0) {
    const [cat, count] = Object.entries(catCounts).sort(
      ([, a], [, b]) => b - a
    )[0];
    topCategory = cat;
    topCategoryPct = Math.round((count / total) * 100);
  }

  // ── Chart data ──────────────────────────────────────────────────
  const recentEvts = recentEvents ?? [];

  const recentCatCounts: Record<string, number> = {};
  for (const e of recentEvts) {
    const cat = e.prompt_category ?? "other";
    recentCatCounts[cat] = (recentCatCounts[cat] ?? 0) + 1;
  }
  const recentTotal = recentEvts.length;
  const categories = Object.entries(recentCatCounts)
    .map(([cat, count]) => ({
      category: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      count,
      percentage:
        recentTotal > 0 ? Math.round((count / recentTotal) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const dailyCounts: Record<string, number> = {};
  for (const e of recentEvts) {
    const day = e.created_at.slice(0, 10);
    dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
  }
  const daily = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    return { date: key, count: dailyCounts[key] ?? 0 };
  });

  // ── Source data ─────────────────────────────────────────────────
  const sourceRows = sourceEvents ?? [];
  const bySource = distribute(sourceRows.map((r) => r.utm_source));
  const byMedium = distribute(sourceRows.map((r) => r.utm_medium));

  const prompts: PromptHistoryItem[] = promptsRaw ?? [];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* En-tête */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bonjour 👋
            </h1>
            <p className="text-sm text-muted">{user.email}</p>
          </div>

          {/* ── Usage ─────────────────────────────────────────── */}
          <section>
            <SectionTitle>Utilisation</SectionTitle>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KpiCard
                label="Total généré"
                value={total}
                sub="prompts"
              />
              <KpiCard
                label="Ce mois"
                value={thisMonth}
                sub="prompts"
              />
              <KpiCard
                label="Catégorie favorite"
                value={
                  topCategory
                    ? (CATEGORY_LABELS[topCategory] ?? topCategory)
                    : "—"
                }
                sub={
                  topCategoryPct > 0
                    ? `${topCategoryPct}% des générations`
                    : undefined
                }
              />
              <KpiCard
                label="Moyenne / jour"
                value={avgPerDay}
                sub="par jour"
              />
            </div>
          </section>

          {/* ── Abonnement ────────────────────────────────────── */}
          <section>
            <SectionTitle>Abonnement</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Plan */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                  Plan actuel
                </p>
                <div className="mb-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border ${PLAN_BADGE[plan] ?? PLAN_BADGE.free}`}
                  >
                    {PLAN_LABELS[plan] ?? plan}
                  </span>
                </div>
                <p className="text-xs text-muted mb-4">
                  Membre depuis{" "}
                  {signupDate.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  <span className="text-muted/60 ml-1">
                    ({daysSinceSignup} jour{daysSinceSignup > 1 ? "s" : ""})
                  </span>
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <Link
                    href="/pricing"
                    className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1"
                  >
                    Voir les offres <span aria-hidden>→</span>
                  </Link>
                  {plan !== "free" && <ManageSubscriptionButton />}
                </div>
              </div>

              {/* Quota */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                  Quota ce mois
                </p>
                {isUnlimited ? (
                  <div>
                    <p className="text-2xl font-bold text-foreground mb-1">
                      Illimité
                    </p>
                    <p className="text-sm text-muted">
                      {quotaUsed} génération{quotaUsed !== 1 ? "s" : ""} ce mois
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-1.5 mb-3">
                      <span className="text-2xl font-bold text-foreground tabular-nums">
                        {quotaUsed}
                      </span>
                      <span className="text-muted pb-0.5">/ {quotaLimit}</span>
                    </div>
                    <div className="w-full h-2 bg-card-hover rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${quotaPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted">
                      {(quotaLimit ?? 0) - quotaUsed} restant
                      {(quotaLimit ?? 0) - quotaUsed !== 1 ? "s" : ""}
                      {quotaReset && (
                        <span className="ml-1">
                          — réinit. le {quotaReset}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── Graphiques ────────────────────────────────────── */}
          <section>
            <SectionTitle>Graphiques</SectionTitle>
            <AnalyticsCharts categories={categories} daily={daily} />
          </section>

          {/* ── Source d'acquisition ──────────────────────────── */}
          <section>
            <SectionTitle>Source d&apos;acquisition</SectionTitle>
            <SourceBreakdown bySource={bySource} byMedium={byMedium} />
          </section>

          {/* ── Prompts récents ───────────────────────────────── */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">
                Générations récentes
              </h2>
              <Link
                href="/generate/image"
                className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1"
              >
                Nouvelle génération <span aria-hidden>→</span>
              </Link>
            </div>
            <PromptHistoryList prompts={prompts} />
          </section>

          {/* ── Zone dangereuse ───────────────────────────────── */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-1">Zone dangereuse</h2>
            <p className="text-sm text-muted mb-4">
              La suppression de compte est définitive et irréversible.
            </p>
            <DeleteAccountButton isPaidPlan={plan !== "free"} />
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-bold text-foreground mb-4">{children}</h2>
  );
}

function KpiCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
        {label}
      </p>
      <p className="text-2xl font-bold text-foreground leading-none tabular-nums">
        {value}
      </p>
      {sub && <p className="text-xs text-muted mt-1.5">{sub}</p>}
    </div>
  );
}
