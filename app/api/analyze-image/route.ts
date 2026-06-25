import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { FEATURE_IMAGE_REFERENCE_PLAN_RESTRICTED } from "@/lib/features";
import type { AITool, ImageAspect } from "@/types";

const REFERENCE_ALLOWED_PLANS = ["unlimited", "promax"];

export async function POST(req: NextRequest) {
  try {
    // Auth check — always required
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Plan check — enforced when the feature flag is active
    if (FEATURE_IMAGE_REFERENCE_PLAN_RESTRICTED) {
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

    const { tool, category, base64, mimeType } = await req.json() as {
      tool: AITool;
      category: string;
      base64: string;
      mimeType: string;
    };

    // Validate mime type — Claude Vision supports jpeg, png, gif, webp
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const safeMime = allowedTypes.includes(mimeType) ? mimeType : "image/jpeg";

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 600,
      system: `Tu es un expert en analyse d'images pour créer des prompts optimisés pour l'IA "${toolName}".

Analyse cette image de référence et identifie 4 à 6 aspects visuels pertinents et spécifiques à ce que tu vois réellement.

Règles :
- Chaque aspect doit être basé sur ce qui est RÉELLEMENT visible dans l'image
- Labels courts (2-3 mots max) en français
- Descriptions précises (une phrase) sur ce que tu observes concrètement
- Ids en snake_case anglais
- Adapte les aspects à ce que tu détectes : ne propose pas un aspect "style artistique" si c'est une photo ordinaire

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "aspects": [
    { "id": "style", "label": "Style visuel", "description": "Illustration vectorielle au trait épuré, fond blanc" },
    { "id": "palette", "label": "Palette de couleurs", "description": "Tons pastels — rose poudré, bleu lavande, crème" },
    { "id": "eclairage", "label": "Éclairage", "description": "Lumière douce et diffuse, sans ombres marquées" },
    { "id": "composition", "label": "Composition", "description": "Sujet centré, beaucoup d'espace négatif autour" }
  ]
}`,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: safeMime as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
                data: base64,
              },
            },
            {
              type: "text",
              text: `Analyse cette image pour créer des aspects réutilisables dans un prompt ${toolName}. Identifie ce qui est visuellement distinctif et utilisable.`,
            },
          ],
        },
      ],
    });

    // Image is processed in-memory only — no storage anywhere
    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let parsed: { aspects: ImageAspect[] };
    try {
      const cleaned = content.text
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
    console.error("analyze-image error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de l'image" },
      { status: 500 }
    );
  }
}
