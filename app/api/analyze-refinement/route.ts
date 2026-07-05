import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getCurrentUser } from "@/lib/auth";
import type { AITool, DirectQuestion, PreviousQAItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { tool, category, description, usageContext, generatedPromptEn, previousQA } =
      await req.json() as {
        tool: AITool;
        category: string;
        description: string;
        usageContext?: string;
        generatedPromptEn: string;
        previousQA: PreviousQAItem[];
      };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const previousContext = previousQA.length
      ? previousQA.map((q) => `- ${q.label} → ${q.value}`).join("\n")
      : "Aucune précision donnée précédemment.";

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 1200,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}

L'utilisateur n'est PAS satisfait du prompt généré. Ton rôle : identifier des angles d'amélioration NON ENCORE EXPLORÉS pour l'enrichir.

━━━ RÈGLE FONDAMENTALE : DEUX TYPES DE QUESTION ━━━
a) APPROFONDIR quelque chose de VAGUE dans le prompt généré ou la description
   → Ex : "dramatic lighting" dans le prompt → demander quelle nuance exacte
b) COMBLER un manque qui explique pourquoi le prompt est insuffisant
   → Ex : le prompt ne précise pas la composition → demander angle/cadrage
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ce qui a déjà été précisé (NE PAS redemander ces points) :
${previousContext}

Génère de NOUVELLES questions pour améliorer le résultat.
- Analyse le prompt généré : qu'est-ce qui y est vague ou manquant ?
- Propose 1-2 nouvelles questions (types a ou b)
- Maximum 2 questions
- Labels en français, ids en snake_case anglais

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "questions": [
    { "id": "id_snake", "label": "Question ciblée ?", "theme": "Thème court en français", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }
  ],
  "readyToGenerate": false
}`,
      messages: [
        {
          role: "user",
          content: `Description originale : "${description}"
${usageContext ? `Contexte d'usage : "${usageContext}"\n` : ""}
Prompt généré (insatisfaisant) :
"${generatedPromptEn}"

Que faut-il améliorer ou préciser pour rendre ce prompt meilleur ?`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let parsed: { questions: DirectQuestion[]; readyToGenerate: boolean };
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { questions: [], readyToGenerate: false };
    }

    if (!Array.isArray(parsed.questions)) parsed.questions = [];

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("analyze-refinement error:", error);
    return NextResponse.json(
      { questions: [], readyToGenerate: false },
      { status: 200 }
    );
  }
}
