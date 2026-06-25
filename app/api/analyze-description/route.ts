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

function getQQOQCPAxes(categoryId: string): string {
  switch (categoryId) {
    case "image":
      return `- QUOI : sujet principal, personnages, éléments visuels clés
- OÙ : lieu, décor, environnement
- QUAND : époque, moment de la journée, saison, lumière naturelle
- COMMENT : style artistique, technique, éclairage, composition, palette de couleurs
- POURQUOI : contexte d'usage (publicité, décoration, portfolio, jeu vidéo, réseaux sociaux…)`;
    case "video":
      return `- QUOI : action principale, sujet, scène
- OÙ : lieu, ambiance visuelle, décor
- QUAND : durée de scène, rythme, époque de référence
- COMMENT : style visuel, mouvement de caméra, transitions, couleurs
- POURQUOI : usage final (clip musical, publicité, court-métrage, intro YouTube…)`;
    case "text":
      return `- QUI : audience cible, destinataire, niveau de connaissance
- QUOI : sujet précis, tâche à accomplir, contenu attendu
- COMMENT : ton, structure, format, longueur, niveau de langage
- POURQUOI : objectif final (SEO, conversion, documentation, pédagogie, divertissement…)`;
    case "music":
      return `- QUOI : genre musical, style, sous-genre
- COMMENT : instruments, tempo, arrangement, structure du morceau
- QUAND : durée, époque musicale de référence
- POURQUOI : usage final (bande son, méditation, danse, générique, ambiance…)`;
    default:
      return `- QUOI : sujet, contenu principal
- COMMENT : style, technique, format
- POURQUOI : contexte d'usage`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tool, category, description, usageContext } = await req.json() as {
      tool: AITool;
      category: string;
      description: string;
      usageContext?: string;
    };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const usageContextBlock = usageContext
      ? `\n⚠ CONTEXTE D'USAGE DÉCLARÉ : "${usageContext}"\nIMPÉRATIF : inclus AU MOINS UNE question directement liée à ce contexte d'usage. Exemples — si "publicité" : quel produit/service, quel message, quelle cible, quel format ; si "jeu vidéo" : quel genre, quelle plateforme, quel personnage. Les autres questions tiennent également compte de ce contexte.\n`
      : "";

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 900,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}

━━━ ANALYSE INTERNE QQOQCP (ne jamais mentionner ces axes dans les questions) ━━━
Évalue mentalement quels axes sont DÉJÀ couverts dans la description :
${getQQOQCPAxes(category)}

Règle : génère une question UNIQUEMENT pour un axe clairement ABSENT de la description. Ne génère PAS de question pour un axe déjà couvert ou facilement inférable. Si la description couvre déjà la quasi-totalité des axes, retourne readyToGenerate: true.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${usageContextBlock}
Une question est valide pour DEUX raisons, pas une seule :
a) APPROFONDIR quelque chose de VAGUE/GÉNÉRIQUE déjà mentionné
   → Ex : l'utilisateur écrit "ambiance sombre" — c'est présent mais trop flou pour ${toolName}
   → Question : "Quelle nuance d'ambiance sombre ?" + suggestions : Oppressant, Mélancolique, Mystérieux, Inquiétant
b) COMBLER un MANQUE ESSENTIEL détecté dans l'analyse QQOQCP
   → Ex : aucune mention du style alors que c'est structurant pour ${toolName}
   → Question ciblée + suggestions adaptées au contexte

1. "questions" — uniquement pour les axes réellement manquants
   - Chaque question avec 4-5 suggestions courtes et TRÈS contextuelles (3 mots max)
   - Les suggestions doivent coller à la description spécifique, pas être génériques
   - Ne jamais utiliser les noms QQOQCP comme formulation de question

2. "categories" — catégories optionnelles supplémentaires pour affiner davantage
   - Points secondaires UNIQUEMENT, pas ceux déjà couverts par les questions
   - Maximum 4 catégories, priority: true pour les 2 plus pertinentes
   - Labels courts (2-3 mots) en français, ids en snake_case anglais

Si tous les axes QQOQCP sont couverts : questions: [], categories: [], readyToGenerate: true.

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
${usageContext ? `\nContexte d'usage : "${usageContext}"` : ""}
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

    // Server-side cap: richer/longer descriptions need fewer follow-up questions
    const totalChars = description.length + (usageContext?.length ?? 0);
    const maxQ = totalChars < 20 ? 4 : totalChars < 50 ? 3 : totalChars < 100 ? 2 : 1;
    parsed.questions = parsed.questions.slice(0, maxQ);

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
