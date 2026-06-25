import { NextResponse } from "next/server";
import { getCurrentUser, getAuthServerClient } from "@/lib/auth";

const CATEGORY_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  text: "Texte",
  music: "Musique",
  other: "Autre",
};

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = getAuthServerClient();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { data: rawEvents } = await supabase
      .from("analytics_events")
      .select("prompt_category, created_at")
      .eq("user_id", user.id)
      .eq("event_type", "prompt_generated")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true });

    const events = rawEvents ?? [];

    // Donut chart: category breakdown over last 30 days
    const catCounts: Record<string, number> = {};
    for (const e of events) {
      const cat = e.prompt_category ?? "other";
      catCounts[cat] = (catCounts[cat] ?? 0) + 1;
    }
    const total = events.length;
    const categories = Object.entries(catCounts)
      .map(([cat, count]) => ({
        category: cat,
        label: CATEGORY_LABELS[cat] ?? cat,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Line chart: prompts per day, last 30 days — zeros filled in for days with no activity
    const dailyCounts: Record<string, number> = {};
    for (const e of events) {
      const day = e.created_at.slice(0, 10); // YYYY-MM-DD
      dailyCounts[day] = (dailyCounts[day] ?? 0) + 1;
    }

    const daily: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      daily.push({ date: key, count: dailyCounts[key] ?? 0 });
    }

    return NextResponse.json({ categories, daily });
  } catch (error) {
    console.error("analytics/charts error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
