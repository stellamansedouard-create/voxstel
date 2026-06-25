import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getCurrentUser } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { checkQuota, incrementQuota } from "@/lib/quota";
import { createServerSupabase } from "@/lib/supabase";
import type { AITool, GeneratedPrompt, ImageAspect } from "@/types";

interface TrackingPayload {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  session_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tool, category, description, usageContext, adaptiveAnswers, useSonnet, referenceAspects, _tracking } =
      await req.json() as {
        tool: AITool;
        category: string;
        description: string;
        usageContext?: string;
        adaptiveAnswers: Record<string, string>;
        useSonnet?: boolean;
        referenceAspects?: ImageAspect[];
        _tracking?: TrackingPayload;
      };

    // Auth + quota check — must run before calling Anthropic
    const user = await getCurrentUser().catch(() => null);
    let quotaStatus = null;

    if (user) {
      quotaStatus = await checkQuota(user.id);
      if (!quotaStatus || !quotaStatus.allowed) {
        return NextResponse.json({ error: "quota_exceeded" }, { status: 429 });
      }
    }

    const model = useSonnet ? MODELS.sonnet : MODELS.haiku;
    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const extras = Object.entries(adaptiveAnswers)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `- ${k} : ${v}`)
      .join("\n");

    const selectedAspects = (referenceAspects ?? []).filter((a) => a?.label && a?.description);
    const referenceSection = selectedAspects.length
      ? `\nRéférence — aspects à intégrer dans le prompt :\n${selectedAspects
          .map((a) => `- ${a.label} : ${a.description}`)
          .join("\n")}`
      : "";

    const message = await anthropic.messages.create({
      model,
      max_tokens: 1200,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte technique : ${promptContext}

Crée un prompt professionnel, complet et directement utilisable dans ${toolName}.
Le prompt EN doit être riche, détaillé, et respecter la syntaxe exacte de ${toolName}.

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{
  "en": "Prompt complet en anglais pour ${toolName}...",
  "fr": "Traduction française naturelle du prompt..."
}`,
      messages: [
        {
          role: "user",
          content: `Génère un prompt ${toolName}.

Description : "${description}"
${usageContext ? `\nContexte d'usage : ${usageContext}` : ""}${extras ? `\nPrécisions :\n${extras}` : ""}${referenceSection}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let result: GeneratedPrompt;
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      result = JSON.parse(cleaned);
    } catch {
      throw new Error("Failed to parse prompt JSON");
    }

    // Quota increment — fire-and-forget, only for plans with a monthly limit
    if (user && quotaStatus && quotaStatus.limit !== null) {
      void incrementQuota(user.id, quotaStatus.quotaUsed).catch((e) =>
        console.error("[quota]", e)
      );
    }

    // Prompt history — fire-and-forget, service role bypasses RLS
    if (user) {
      void createServerSupabase()
        .from("prompts_history")
        .insert({
          user_id: user.id,
          category,
          tool,
          prompt_en: result.en,
          prompt_fr: result.fr,
        })
        .then(({ error }) => {
          if (error) console.error("[prompts_history]", error.message);
        });
    }

    // Analytics — fire-and-forget
    void trackEvent({
      userId: user?.id ?? null,
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
    console.error("generate-prompt error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du prompt" },
      { status: 500 }
    );
  }
}
