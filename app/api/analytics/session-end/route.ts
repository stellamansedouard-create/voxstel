import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const body = JSON.parse(raw) as { session_id?: string; last_step?: string };
    if (!body.session_id) {
      return NextResponse.json({ error: "session_id requis" }, { status: 400 });
    }

    const supabase = createServerSupabase();
    await supabase
      .from("sessions")
      .update({
        ended_at: new Date().toISOString(),
        last_step: body.last_step ?? null,
      })
      .eq("session_id", body.session_id);

    await trackEvent({
      eventType: "step_abandoned",
      sessionId: body.session_id,
      metadata: { last_step: body.last_step ?? null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("analytics/session-end error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
