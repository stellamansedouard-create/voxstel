import { redirect } from "next/navigation";
import Link from "next/link";
import PromptHistoryList from "@/components/dashboard/PromptHistoryList";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import ManageSubscriptionButton from "@/components/dashboard/ManageSubscriptionButton";
import AnalyticsCharts from "@/components/dashboard/AnalyticsCharts";
import type { PromptHistoryItem } from "@/components/dashboard/PromptHistoryList";
import { getCurrentUser, ensureUserRow } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { getBalance } from "@/lib/credits";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Voxstel",
};

const CATEGORY_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  text: "Texte",
  music: "Musique",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // Fallback for email/password signups: the OAuth callback creates the row
  // via ensureUserRow, but a confirmed email/password signup never hits a
  // server route beforehand — the dashboard is the first guaranteed one.
  await ensureUserRow(user.id, user.email ?? "");

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
  const [balance, { data: allEvents }, { data: recentEvents }, { data: promptsRaw }] =
    await Promise.all([
      getBalance(user.id),
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
        .from("prompts_history")
        .select("id, category, tool, prompt_en, prompt_fr, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  // ── Crédits ─────────────────────────────────────────────────────
  // Balance from lib/credits.getBalance(): `unlimited` is gated on the 19€/mo
  // subscription PRICE, not on subscription_status alone. Credits do NOT reset
  // monthly — there is no reset date to show.
  const { credits, unlimited } = balance;

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

  const prompts: PromptHistoryItem[] = promptsRaw ?? [];

  const memberSince = signupDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
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
              <KpiCard label="Total généré" value={total} sub="prompts" />
              <KpiCard label="Ce mois" value={thisMonth} sub="prompts" />
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
              <KpiCard label="Moyenne / jour" value={avgPerDay} sub="par jour" />
            </div>
          </section>

          {/* ── Crédits ───────────────────────────────────────── */}
          <section>
            <SectionTitle>Crédits</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">

              {/* Solde */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                  Solde
                </p>
                {unlimited ? (
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border bg-accent/10 text-accent border-accent/30">
                      Illimité
                    </span>
                    <p className="text-sm text-muted mt-3">
                      Générations illimitées — aucun crédit décompté.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-end gap-1.5 mb-1">
                      <span className="text-3xl font-bold text-foreground tabular-nums">
                        {credits}
                      </span>
                      <span className="text-muted pb-1">
                        crédit{credits !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      1 crédit = 1 prompt généré par le moteur. Les crédits
                      n&apos;expirent pas.
                    </p>
                  </div>
                )}
              </div>

              {/* Offre */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
                  Votre offre
                </p>
                <p className="text-base font-semibold text-foreground mb-1">
                  {unlimited ? "Abonnement Illimité — 19 €/mois" : "Crédits à l'acte"}
                </p>
                <p className="text-xs text-muted mb-4">
                  Membre depuis {memberSince}
                  <span className="text-muted/60 ml-1">
                    ({daysSinceSignup} jour{daysSinceSignup > 1 ? "s" : ""})
                  </span>
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {unlimited ? (
                    <ManageSubscriptionButton />
                  ) : (
                    <Link
                      href="/pricing"
                      className="text-sm text-accent font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Acheter des crédits <span aria-hidden>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ── Graphiques ────────────────────────────────────── */}
          <section>
            <SectionTitle>Graphiques</SectionTitle>
            <AnalyticsCharts categories={categories} daily={daily} />
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

          {/* ── Gestion de compte ───────────────────────────────── */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-4">
              Gestion de compte
            </h2>
            <DeleteAccountButton isPaidPlan={unlimited} />
          </section>

        </div>
      </main>
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
