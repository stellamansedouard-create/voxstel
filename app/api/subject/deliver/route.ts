// Layer 2 delivery — the ONLY call site of deliverSubjectLayer().
// Prompt 4 gates this journey by editing deliverSubjectLayer(), not this route.
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deliverSubjectLayer } from "@/lib/subject-layer";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import type { AITool, AmbianceLayer, Category, LayeredOutput } from "@/types";

interface TrackingPayload {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  session_id?: string;
}

/** The Q&A of both rounds, persisted so the journey is measurable. */
interface QAEntry {
  question: string;
  theme: string;
  answer: string;
  layer: "ambiance" | "subject";
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { category, tool, ambiance, subject, subjectAnswers, questionsAnswers, _tracking } =
      (await req.json()) as {
        category: Category;
        tool: AITool;
        ambiance: AmbianceLayer;
        subject: string;
        subjectAnswers: Record<string, string>;
        questionsAnswers?: QAEntry[];
        _tracking?: TrackingPayload;
      };

    if (!ambiance?.prompt?.trim() || !subject?.trim()) {
      return NextResponse.json({ error: "missing_layers" }, { status: 400 });
    }

    const output = await deliverSubjectLayer({
      userId: user.id,
      category,
      tool,
      // The subject step is entered only after the ambiance is frozen; assert it
      // here so a client that skipped the lock cannot slip through.
      ambiance: { ...ambiance, locked: true },
      subject,
      subjectAnswers: subjectAnswers ?? {},
    });

    await saveHistory(user.id, category, tool, output, questionsAnswers, ambiance);

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

    return NextResponse.json(output);
  } catch (error) {
    console.error("subject/deliver error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}

async function saveHistory(
  userId: string,
  category: Category,
  tool: AITool,
  output: LayeredOutput,
  questionsAnswers: QAEntry[] | undefined,
  ambiance: AmbianceLayer
) {
  // Music keeps two fields; flatten them for the single-column history.
  const promptEn =
    output.kind === "music"
      ? `[STYLE]\n${output.style}\n\n[LYRICS]\n${output.lyrics}`
      : output.en;
  const promptFr = output.kind === "music" ? null : output.fr || null;

  const { error } = await createServerSupabase()
    .from("prompts_history")
    .insert({
      user_id: userId,
      category,
      tool,
      prompt_en: promptEn,
      prompt_fr: promptFr,
      questions_answers: questionsAnswers?.length
        ? { source_page: ambiance.sourcePageSlug ?? null, qa: questionsAnswers }
        : null,
    });

  if (error) {
    console.error(
      "[prompts_history] INSERT failed — message:", error.message,
      "| code:", error.code,
      "| details:", error.details
    );
  }
}
