import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import type { AITool, DirectQuestion, PrecisionCategory } from "@/types";

function getCategoryHints(categoryId: string): string {
  switch (categoryId) {
    case "image":
      return "style, ambiance, eclairage, couleurs, composition, ratio, personnages, decor, technique, texte_affiche";
    case "video":
      return "mouvement_camera, style_visuel, eclairage, cadrage, rythme, transitions, ambiance, duree_scene, son_ambiance";
    case "text":
      return "ton, longueur, structure, niveau_complexite, audience_cible, langage_programmation, format_sortie, exemples, contraintes";
    case "music":
      return "genre, tempo, instruments, ambiance, type_vocal, structure_morceau, tonalite, duree, influences, arrangement";
    default:
      return "style, ambiance, technique, format, contenu";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tool, category, description } = await req.json() as {
      tool: AITool;
      category: string;
      description: string;
    };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 900,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}

Ton rôle : analyser la description et générer DEUX choses distinctes.

━━━ RÈGLE FONDAMENTALE SUR LES QUESTIONS ━━━
Une question est valide pour DEUX raisons, pas une seule :
a) APPROFONDIR quelque chose de VAGUE/GÉNÉRIQUE déjà mentionné
   → Ex : l'utilisateur écrit "ambiance sombre" — c'est présent mais trop flou pour ${toolName}
   → Question : "Quelle nuance d'ambiance sombre ?" + suggestions : Oppressant, Mélancolique, Mystérieux, Inquiétant
b) COMBLER un MANQUE ESSENTIEL pour ce type de prompt sur ${toolName}
   → Ex : aucune mention du style alors que c'est structurant pour ${toolName}
   → Question ciblée + suggestions adaptées au contexte

Tu dois décider pour chaque question si elle est de type (a) ou (b) selon ce que tu détectes.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. "questions" — les 2-3 questions les plus impactantes (types a ou b)
   - Chaque question avec 4-5 suggestions courtes et TRÈS contextuelles (3 mots max)
   - Les suggestions doivent coller à la description spécifique, pas être génériques
   - Maximum 3 questions

2. "categories" — catégories optionnelles supplémentaires pour affiner davantage
   - Points secondaires UNIQUEMENT, pas ceux déjà couverts par les questions
   - Maximum 4 catégories, priority: true pour les 2 plus pertinentes
   - Labels courts (2-3 mots) en français, ids en snake_case anglais

Si la description est déjà très précise et complète : questions: [], categories: [], readyToGenerate: true.

Catégories possibles : ${getCategoryHints(category)}

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "questions": [
    { "id": "id_snake", "label": "Question en français ?", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }
  ],
  "categories": [
    { "id": "id_snake", "label": "Catégorie", "priority": true }
  ],
  "readyToGenerate": false
}`,
      messages: [
        {
          role: "user",
          content: `L'utilisateur veut créer avec ${toolName}. Sa description :

"${description}"

Génère les questions directes et les catégories optionnelles pour enrichir son prompt.`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let parsed: { questions: DirectQuestion[]; categories: PrecisionCategory[]; readyToGenerate: boolean };
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { questions: [], categories: [], readyToGenerate: true };
    }

    if (!Array.isArray(parsed.questions)) parsed.questions = [];
    if (!Array.isArray(parsed.categories)) parsed.categories = [];

    if (parsed.questions.length === 0 && parsed.categories.length === 0) {
      parsed.readyToGenerate = true;
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("analyze-description error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de la description" },
      { status: 500 }
    );
  }
}
