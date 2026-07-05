import { NextResponse } from "next/server";
import { getCurrentUser, getAuthServerClient } from "@/lib/auth";

export const dynamic = "force-dynamic";

function distribute(
  items: (string | null | undefined)[]
): { value: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item) continue;
    counts[item] = (counts[item] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const supabase = getAuthServerClient();

    const { data: events } = await supabase
      .from("analytics_events")
      .select("utm_source, utm_medium")
      .eq("user_id", user.id);

    const rows = events ?? [];

    return NextResponse.json({
      bySource: distribute(rows.map((r) => r.utm_source)),
      byMedium: distribute(rows.map((r) => r.utm_medium)),
    });
  } catch (error) {
    console.error("analytics/source error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
