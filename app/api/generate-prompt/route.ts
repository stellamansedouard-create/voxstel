import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import type { AITool, GeneratedPrompt, ImageAspect } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { tool, category, description, adaptiveAnswers, useSonnet, referenceAspects } =
      await req.json() as {
        tool: AITool;
        category: string;
        description: string;
        adaptiveAnswers: Record<string, string>;
        useSonnet?: boolean;
        referenceAspects?: ImageAspect[];
      };

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
${extras ? `\nPrécisions :\n${extras}` : ""}${referenceSection}`,
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("generate-prompt error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du prompt" },
      { status: 500 }
    );
  }
}
