import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import type { EventType } from "@/lib/analytics";

const ALLOWED_EVENTS: EventType[] = [
  "prompt_generated",
  "user_signup",
  "plan_upgraded",
];

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json() as {
      event_type: string;
      prompt_category?: string;
      session_id?: string;
      metadata?: Record<string, unknown>;
    };

    if (!ALLOWED_EVENTS.includes(body.event_type as EventType)) {
      return NextResponse.json({ error: "event_type invalide" }, { status: 400 });
    }

    await trackEvent({
      userId: user.id,
      eventType: body.event_type as EventType,
      promptCategory: body.prompt_category ?? null,
      sessionId: body.session_id ?? null,
      metadata: body.metadata ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("analytics/events error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
