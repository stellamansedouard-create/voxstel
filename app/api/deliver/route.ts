// The single gated delivery route — calls deliverGeneratedPrompt() for BOTH
// engine outputs (refined ambiance and subject). The free intermediate refine
// of the refine-and-subject flow does NOT come here: it stays on
// /api/ambiance/apply, which never charges. Raw page-prompt copying never hits
// any API at all.
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deliverGeneratedPrompt, type QAEntry } from "@/lib/deliver";
import { InsufficientCreditsError } from "@/lib/credits";
import { ContentBlockedError, REFUS_MESSAGE } from "@/lib/moderation";
import { trackEvent } from "@/lib/analytics";
import type { AITool, AmbianceLayer, Category } from "@/types";

interface TrackingPayload {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  session_id?: string;
}

interface DeliverBody {
  layer: "ambiance" | "subject";
  category: Category;
  tool: AITool;
  sourcePageSlug?: string | null;
  questionsAnswers?: QAEntry[];
  _tracking?: TrackingPayload;
  // subject
  ambiance?: AmbianceLayer;
  subject?: string;
  subjectAnswers?: Record<string, string>;
  // ambiance
  ambiancePrompt?: string;
  answers?: Record<string, string>;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as DeliverBody;
    const { layer, category, tool, sourcePageSlug, questionsAnswers, _tracking } =
      body;

    if (layer !== "ambiance" && layer !== "subject") {
      return NextResponse.json({ error: "bad_layer" }, { status: 400 });
    }

    let result;
    if (layer === "ambiance") {
      if (!body.ambiancePrompt?.trim()) {
        return NextResponse.json({ error: "missing_ambiance" }, { status: 400 });
      }
      result = await deliverGeneratedPrompt({
        layer: "ambiance",
        userId: user.id,
        category,
        tool,
        ambiancePrompt: body.ambiancePrompt,
        answers: body.answers ?? {},
        sourcePageSlug: sourcePageSlug ?? null,
        questionsAnswers,
        sessionId: _tracking?.session_id ?? null,
      });
    } else {
      if (!body.ambiance?.prompt?.trim() || !body.subject?.trim()) {
        return NextResponse.json({ error: "missing_layers" }, { status: 400 });
      }
      result = await deliverGeneratedPrompt({
        layer: "subject",
        userId: user.id,
        category,
        tool,
        // The subject step is entered only after the ambiance is frozen; assert
        // it here so a client that skipped the lock cannot slip through.
        ambiance: { ...body.ambiance, locked: true },
        subject: body.subject,
        subjectAnswers: body.subjectAnswers ?? {},
        sourcePageSlug: sourcePageSlug ?? null,
        questionsAnswers,
        sessionId: _tracking?.session_id ?? null,
      });
    }

    void trackEvent({
      userId: user.id,
      eventType: "prompt_generated",
      promptCategory: category,
      utmSource: _tracking?.utm_source ?? null,
      utmMedium: _tracking?.utm_medium ?? null,
      utmCampaign: _tracking?.utm_campaign ?? null,
      referrer: _tracking?.referrer ?? null,
      sessionId: _tracking?.session_id ?? null,
    }).catch((e) => console.error("[analytics]", e));

    return NextResponse.json(result);
  } catch (error) {
    // 0 credits (checked up front, or lost to a concurrent generation) -> 402,
    // the signal the client turns into the paywall.
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    // Blocked by moderation (input or output) — logged at the block site; map to
    // the neutral 422 the client shows in place of a result.
    if (error instanceof ContentBlockedError) {
      return NextResponse.json(
        { error: "content_blocked", message: REFUS_MESSAGE },
        { status: 422 }
      );
    }
    console.error("deliver error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}
