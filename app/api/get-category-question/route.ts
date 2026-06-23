import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import type { AITool } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { tool, generatorCategory, description, topicId, topicLabel, existingAnswers } =
      await req.json() as {
        tool: AITool;
        generatorCategory: string;
        description: string;
        topicId: string;
        topicLabel: string;
        existingAnswers: Record<string, string>;
      };

    const toolMeta = getToolById(generatorCategory, tool);
    const toolName = toolMeta?.name ?? tool;

    const existingContext = Object.entries(existingAnswers)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 300,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Génère UNE question ciblée sur la catégorie demandée, avec 4-5 suggestions courtes.

RÈGLE : ta question peut être de deux types — choisis le plus pertinent selon la description :
a) APPROFONDIR quelque chose de vague/générique déjà mentionné sur ce sujet dans la description
   → Ex : "ambiance froide" est mentionné → question : "Quelle nuance d'ambiance froide ?" + suggestions précises
b) COMBLER un manque sur ce sujet si rien n'est mentionné dans la description
   → Ex : rien sur l'éclairage → question : "Quel type d'éclairage ?" + suggestions adaptées au contexte

Les suggestions doivent coller précisément à la description et au contexte de l'utilisateur, jamais génériques.
Chaque suggestion : 2-4 mots maximum.

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{ "label": "Question en français ?", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }`,
      messages: [
        {
          role: "user",
          content: `Outil : ${toolName}
Description : "${description}"
${existingContext ? `Déjà précisé : ${existingContext}` : ""}
Catégorie à questionner : "${topicLabel}" (id: ${topicId})`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let parsed: { label: string; suggestions: string[] };
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { label: `Précisez : ${topicLabel}`, suggestions: [] };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("get-category-question error:", error);
    return NextResponse.json(
      { label: "Pouvez-vous préciser ce point ?", suggestions: [] },
      { status: 200 }
    );
  }
}
