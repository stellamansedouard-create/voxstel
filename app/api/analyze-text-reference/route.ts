import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { FEATURE_TEXT_REFERENCE_PLAN_RESTRICTED } from "@/lib/features";
import type { AITool, ImageAspect } from "@/types";

const REFERENCE_ALLOWED_PLANS = ["unlimited", "promax"];
const MAX_CONTENT_CHARS = 3000;

export async function POST(req: NextRequest) {
  try {
    // Auth check — always required
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Plan check — enforced when the feature flag is active
    if (FEATURE_TEXT_REFERENCE_PLAN_RESTRICTED) {
      const supabase = createServerSupabase();
      const { data } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single();
      if (!data || !REFERENCE_ALLOWED_PLANS.includes(data.plan)) {
        return NextResponse.json({ error: "plan_required" }, { status: 403 });
      }
    }

    const { tool, category, content, usageContext } = await req.json() as {
      tool: AITool;
      category: string;
      content: string;
      usageContext?: string;
    };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;

    // Truncate in case the client didn't
    const truncated = content.slice(0, MAX_CONTENT_CHARS);

    // Detect likely content type from the text heuristic
    const looksLikeCode =
      /[{};()\[\]]/.test(truncated) &&
      /(function|const|let|var|def |class |import |export |=>|->)/.test(truncated);

    const contentType = looksLikeCode ? "code" : "texte";

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 500,
      system: `Tu es un expert en analyse de style pour l'IA "${toolName}".

Analyse cet extrait de ${contentType} et identifie 4 à 6 aspects stylistiques ou structurels pertinents qui pourraient enrichir un prompt.

Règles :
- Basé uniquement sur ce qui est RÉELLEMENT observable dans l'extrait
- Si c'est du code : conventions de nommage, patterns utilisés, verbosité, commentaires, structure des fonctions…
- Si c'est du texte : ton, registre, longueur des phrases, structure, vocabulaire, niveau de formalité…
- Labels courts (2-3 mots) en français
- Descriptions précises (une phrase) sur ce que tu observes concrètement
- Ids en snake_case anglais

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "aspects": [
    { "id": "ton", "label": "Ton décontracté", "description": "Écriture informelle avec tutoiement, phrases courtes et contractions" },
    { "id": "structure", "label": "Structure courte", "description": "Paragraphes de 2-3 phrases max, une idée par paragraphe" }
  ]
}`,
      messages: [
        {
          role: "user",
          content: `Analyse ce ${contentType} et identifie ses aspects stylistiques caractéristiques.${usageContext ? `\nContexte d'usage : ${usageContext}` : ""}\n\n${truncated}${content.length > MAX_CONTENT_CHARS ? "\n[extrait tronqué]" : ""}`,
        },
      ],
    });

    // Content is analyzed in-memory only — no storage anywhere
    const responseContent = message.content[0];
    if (responseContent.type !== "text") throw new Error("Unexpected response type");

    let parsed: { aspects: ImageAspect[] };
    try {
      const cleaned = responseContent.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { aspects: [] };
    }

    if (!Array.isArray(parsed.aspects)) parsed.aspects = [];

    return NextResponse.json({ aspects: parsed.aspects });
  } catch (error) {
    console.error("analyze-text-reference error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du fichier texte" },
      { status: 500 }
    );
  }
}
