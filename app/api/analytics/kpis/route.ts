import { NextResponse } from "next/server";
import { getCurrentUser, getAuthServerClient } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  text: "Texte",
  music: "Musique",
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = getAuthServerClient();

    const signupDate = new Date(user.created_at);
    const now = new Date();
    const daysSinceSignup = Math.max(
      1,
      Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [{ data: allEvents }, { data: userData }] = await Promise.all([
      supabase
        .from("analytics_events")
        .select("prompt_category, created_at")
        .eq("user_id", user.id)
        .eq("event_type", "prompt_generated"),
      supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single(),
    ]);

    const events = allEvents ?? [];
    const total = events.length;
    const thisMonth = events.filter((e) => e.created_at >= startOfMonth).length;

    // Category distribution for top category
    const catCounts: Record<string, number> = {};
    for (const e of events) {
      const cat = e.prompt_category ?? "other";
      catCounts[cat] = (catCounts[cat] ?? 0) + 1;
    }

    let topCategory: string | null = null;
    let topCategoryLabel: string | null = null;
    let topCategoryPct = 0;

    if (total > 0) {
      const [cat, count] = Object.entries(catCounts).sort(([, a], [, b]) => b - a)[0];
      topCategory = cat;
      topCategoryLabel = CATEGORY_LABELS[cat] ?? cat;
      topCategoryPct = Math.round((count / total) * 100);
    }

    return NextResponse.json({
      total,
      thisMonth,
      topCategory,
      topCategoryLabel,
      topCategoryPct,
      avgPerDay: total > 0 ? Math.round((total / daysSinceSignup) * 100) / 100 : 0,
      plan: userData?.plan ?? "free",
      signupDate: signupDate.toISOString(),
      daysSinceSignup,
    });
  } catch (error) {
    console.error("analytics/kpis error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
