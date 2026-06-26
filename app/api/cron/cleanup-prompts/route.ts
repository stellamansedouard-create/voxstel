import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);

  const supabase = createServerSupabase();
  const { count, error } = await supabase
    .from("prompts_history")
    .delete({ count: "exact" })
    .lt("created_at", cutoff.toISOString());

  if (error) {
    console.error("[cron] cleanup-prompts error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  console.log(`[cron] cleanup-prompts: deleted ${count ?? 0} rows older than 12 months`);
  return NextResponse.json({ deleted: count ?? 0 });
}
