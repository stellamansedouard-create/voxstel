import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      session_id: string;
      landing_page?: string;
      referrer?: string;
      device?: string;
    };
    if (!body.session_id) {
      return NextResponse.json({ error: "session_id requis" }, { status: 400 });
    }

    const user = await getCurrentUser().catch(() => null);
    const supabase = createServerSupabase();

    const { data: existing } = await supabase
      .from("sessions")
      .select("id, page_count")
      .eq("session_id", body.session_id)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("sessions")
        .update({ page_count: existing.page_count + 1, user_id: user?.id ?? null })
        .eq("id", existing.id);
    } else {
      await supabase.from("sessions").insert({
        session_id: body.session_id,
        user_id: user?.id ?? null,
        landing_page: body.landing_page ?? null,
        referrer: body.referrer ?? null,
        device: body.device ?? null,
        page_count: 1,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("analytics/session-start error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
