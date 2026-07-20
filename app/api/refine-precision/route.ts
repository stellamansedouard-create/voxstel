import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getUseCaseById } from "@/lib/usecases";
import { getCurrentUser } from "@/lib/auth";
import { assertCanGenerate } from "@/lib/deliver";
import { InsufficientCreditsError } from "@/lib/credits";
import { buildSeededQuestionSystem } from "@/lib/ambiance";
import { getThemeHints, PLAIN_LANGUAGE_RULE } from "@/lib/question-themes";
import type { AITool, Category, DirectQuestion } from "@/types";

/**
 * Seeds this engine with a library page's ambiance prompt instead of a blank
 * field. `description` then carries the ambiance prompt (mode "ambiance") or
 * the user's subject (mode "subject"), and the ambiance layer is passed here.
 */
interface AmbianceSeed {
  mode: "ambiance" | "subject";
  /** Ambiance prompt: the one being refined, or the frozen one for a subject. */
  ambiancePrompt: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Credits gate — see analyze-description. The previous note here said the
    // monthly quota was the real limiter; that quota is gone with the credits
    // pivot, which left this route with no limiter at all.
    await assertCanGenerate(user.id);

    const { tool, category, useCase, description, usageContext, previousQA, ambianceSeed } = await req.json() as {
      tool: AITool;
      category: string;
      useCase?: string;
      description: string;
      usageContext?: string;
      previousQA: Array<{ question: string; theme: string; answer: string }>;
      ambianceSeed?: AmbianceSeed;
    };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const useCaseMeta = useCase ? getUseCaseById(category, useCase) : undefined;
    const useCaseBlock = useCaseMeta
      ? `\n\n━━━ TYPE DE CRÉATION : ${useCaseMeta.label} ━━━\n${useCaseMeta.questionGuidance}\nToute question déjà couverte par le type ou les réponses précédentes ne doit PAS être reposée.\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      : "";

    const previousQASummary = previousQA
      .map((item) => `- [${item.theme}] ${item.question} → "${item.answer}"`)
      .join("\n");

    // Seeded run: the starting text is a library page's ambiance prompt (or a
    // subject sitting inside a frozen one) rather than a free-form description.
    // Same loop, same JSON contract, same theme taxonomy — only the framing swaps.
    const seedSystem = ambianceSeed
      ? buildSeededQuestionSystem({
          toolName,
          promptContext,
          category: category as Category,
          mode: ambianceSeed.mode,
          ambiancePrompt: ambianceSeed.ambiancePrompt,
          previousQACount: previousQA.length,
        })
      : null;

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 2000,
      system: seedSystem ?? `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}${useCaseBlock}

Tu reçois une description initiale, un contexte d'usage, et une liste de questions déjà posées avec leurs réponses. Ton rôle est d'identifier s'il reste des axes d'ambiguïté réels et non encore couverts par l'ensemble (description + contexte + réponses déjà données) — PAS de reposer une variante des questions déjà répondues, et PAS de redemander un niveau de détail supplémentaire sur un thème déjà traité en profondeur lors du premier tour, sauf si une réponse donnée révèle elle-même une nouvelle ambiguïté (par exemple, si l'utilisateur répond "pour un usage commercial" à une question d'usage, cela peut ouvrir une nouvelle question sur les droits d'utilisation ou la licence, qui n'aurait pas de sens à poser sans cette réponse).

Si après analyse de l'ensemble des informations déjà connues, aucun axe d'ambiguïté réel ne justifie une nouvelle question, retourne un tableau "questions" VIDE. Ne génère jamais de question artificielle juste pour remplir un second tour — contrairement au premier tour où un plancher minimum de questions est exigé, ce second tour n'a AUCUN plancher : 0 question est un résultat valide et même souhaitable si tout est déjà clair.

Si des questions sont justifiées, applique les mêmes règles de qualité que le premier tour : regroupement par thème (champ "theme"), pas de hiérarchie de rang entre les questions, pas de plafond haut si plusieurs axes nouvellement révélés méritent d'être creusés.

${PLAIN_LANGUAGE_RULE}

RÈGLES DE FORMAT pour chaque question :
- 4-5 suggestions courtes et TRÈS contextuelles (3 mots max), collées à la description spécifique (pas génériques)
- Champ "theme" obligatoire, choisi EXACTEMENT parmi les libellés ci-dessous

${getThemeHints(category)}

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "questions": [
    { "id": "id_snake", "label": "Question en français ?", "theme": "Thème valide", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }
  ]
}`,
      messages: [
        {
          role: "user",
          content: ambianceSeed
            ? ambianceSeed.mode === "ambiance"
              ? `L'utilisateur a choisi ce prompt et veut l'ajuster pour ${toolName}.
${previousQA.length ? `\nQuestions déjà posées et réponses obtenues :\n${previousQASummary}\n` : ""}
Génère les questions d'affinage, bloc par bloc, en variantes légères autour des valeurs actuelles.`
              : `L'utilisateur crée avec ${toolName}. Son sujet :

"${description}"
${previousQA.length ? `\nQuestions déjà posées et réponses obtenues :\n${previousQASummary}\n` : ""}
Génère les questions de précision portant UNIQUEMENT sur ce sujet. La couche déjà figée ne doit jamais être rouverte.`
            : `L'utilisateur veut créer avec ${toolName}.

Description initiale : "${description}"
${usageContext ? `Contexte d'usage : "${usageContext}"` : "Contexte d'usage : non renseigné"}

Questions déjà posées et réponses obtenues :
${previousQASummary}

Identifie les axes d'ambiguïté restants non couverts et génère les questions d'affinage si nécessaire. Si tout est déjà précis, retourne un tableau vide.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let parsed: { questions: DirectQuestion[] };
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { questions: [] };
    }

    if (!Array.isArray(parsed.questions)) parsed.questions = [];

    return NextResponse.json({ questions: parsed.questions });
  } catch (error) {
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    console.error("refine-precision error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'affinage" },
      { status: 500 }
    );
  }
}
