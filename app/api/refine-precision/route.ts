import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getUseCaseById } from "@/lib/usecases";
import { getCurrentUser } from "@/lib/auth";
import type { AITool, DirectQuestion } from "@/types";

function getThemeHints(categoryId: string): string {
  switch (categoryId) {
    case "image":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Sujet & Composition" — sujet principal, personnages, éléments visuels, cadrage
- "Style & Esthétique" — style artistique, technique, medium (photo, peinture, 3D, illustration…)
- "Lumière & Couleurs" — éclairage, palette, heure, ambiance colorée
- "Décor & Contexte" — lieu, environnement, époque, contexte d'usage
- "Détails Techniques" — ratio, texte affiché, contraintes spécifiques à l'outil`;
    case "video":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Action & Scène" — sujet, action principale, personnages
- "Style Visuel" — esthétique, références visuelles, grade colorimétrique
- "Mouvement & Rythme" — mouvements caméra, transitions, rythme de montage
- "Ambiance & Atmosphère" — humeur, émotion, son d'ambiance
- "Détails Techniques" — durée, format, plateforme de destination`;
    case "text":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Sujet & Contenu" — tâche précise, périmètre, angle
- "Audience & Ton" — destinataire, niveau, registre, voix
- "Structure & Format" — longueur, mise en forme, plan, format de sortie
- "Objectif & Contraintes" — but final (SEO, conversion, documentation…), ce qu'il faut éviter
- "Technique" — langage, framework, version, environnement (pour les demandes de code)`;
    case "music":
      return `Thèmes valides pour cette catégorie (utilise exactement ces libellés dans le champ "theme") :
- "Style & Genre" — genre, sous-genre, ère musicale, influences
- "Instrumentation" — instruments, arrangement, présence vocale
- "Énergie & Émotion" — tempo, intensité, humeur, dynamique
- "Structure & Durée" — structure du morceau, durée, intro/outro
- "Usage & Contexte" — usage final (bande-son, méditation, danse, générique…)`;
    default:
      return `Attribue un thème court et descriptif en français à chaque question (ex: "Style", "Contexte", "Technique").`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Affinage supplémentaire is available to every authenticated user
    // (incl. free) — the monthly quota is the real limiter.

    const { tool, category, useCase, description, usageContext, previousQA } = await req.json() as {
      tool: AITool;
      category: string;
      useCase?: string;
      description: string;
      usageContext?: string;
      previousQA: Array<{ question: string; theme: string; answer: string }>;
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

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 2000,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}${useCaseBlock}

Tu reçois une description initiale, un contexte d'usage, et une liste de questions déjà posées avec leurs réponses. Ton rôle est d'identifier s'il reste des axes d'ambiguïté réels et non encore couverts par l'ensemble (description + contexte + réponses déjà données) — PAS de reposer une variante des questions déjà répondues, et PAS de redemander un niveau de détail supplémentaire sur un thème déjà traité en profondeur lors du premier tour, sauf si une réponse donnée révèle elle-même une nouvelle ambiguïté (par exemple, si l'utilisateur répond "pour un usage commercial" à une question d'usage, cela peut ouvrir une nouvelle question sur les droits d'utilisation ou la licence, qui n'aurait pas de sens à poser sans cette réponse).

Si après analyse de l'ensemble des informations déjà connues, aucun axe d'ambiguïté réel ne justifie une nouvelle question, retourne un tableau "questions" VIDE. Ne génère jamais de question artificielle juste pour remplir un second tour — contrairement au premier tour où un plancher minimum de questions est exigé, ce second tour n'a AUCUN plancher : 0 question est un résultat valide et même souhaitable si tout est déjà clair.

Si des questions sont justifiées, applique les mêmes règles de qualité que le premier tour : regroupement par thème (champ "theme"), pas de hiérarchie de rang entre les questions, pas de plafond haut si plusieurs axes nouvellement révélés méritent d'être creusés.

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
          content: `L'utilisateur veut créer avec ${toolName}.

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
    console.error("refine-precision error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'affinage" },
      { status: 500 }
    );
  }
}
