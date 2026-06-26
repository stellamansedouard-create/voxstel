import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getCurrentUser } from "@/lib/auth";
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
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

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
      max_tokens: 2500,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}

━━━ ANALYSE INTERNE QQOQCP (ne jamais mentionner ces axes dans les questions) ━━━
Évalue mentalement quels axes sont DÉJÀ couverts dans la description :
${getQQOQCPAxes(category)}

Règle : génère une question UNIQUEMENT pour un axe clairement ABSENT de la description ou insuffisamment précis pour ${toolName}. Ne génère PAS de question pour un axe déjà couvert ou facilement inférable. Si la description couvre déjà la quasi-totalité des axes, retourne readyToGenerate: true.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${usageContextBlock}
━━━ PRINCIPE CENTRAL — NOMBRE DE QUESTIONS ━━━
Il n'y a AUCUNE limite ni objectif chiffré. Pose exactement autant de questions que nécessaire pour lever toutes les ambiguïtés réelles — ni plus, ni moins.
- Description très vague (ex: "un portrait", "une mélodie triste", "écris un article") → pose toutes les questions nécessaires pour couvrir les axes manquants, qu'il y en ait 6, 10 ou 14.
- Description déjà précise avec un seul axe flou → pose uniquement cette question.
- Ne t'arrête JAMAIS artificiellement tôt si des axes importants restent non couverts.
- Ne fabrique JAMAIS de question redondante ou triviale juste pour augmenter le nombre.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Une question est valide pour DEUX raisons, pas une seule :
a) APPROFONDIR quelque chose de VAGUE/GÉNÉRIQUE déjà mentionné
   → Ex : l'utilisateur écrit "ambiance sombre" — c'est présent mais trop flou pour ${toolName}
   → Question : "Quelle nuance d'ambiance sombre ?" + suggestions : Oppressant, Mélancolique, Mystérieux, Inquiétant
b) COMBLER un MANQUE ESSENTIEL détecté dans l'analyse QQOQCP
   → Ex : aucune mention du style alors que c'est structurant pour ${toolName}
   → Question ciblée + suggestions adaptées au contexte

1. "questions" — pour chaque axe réellement manquant ou insuffisamment précis
   - Chaque question avec 4-5 suggestions courtes et TRÈS contextuelles (3 mots max)
   - Les suggestions doivent coller à la description spécifique, pas être génériques
   - Ne jamais utiliser les noms QQOQCP comme formulation de question
   - Chaque question doit inclure un champ "theme" choisi parmi les thèmes valides ci-dessous

${getThemeHints(category)}

2. "categories" — catégories optionnelles supplémentaires pour affiner davantage
   - Points secondaires UNIQUEMENT, pas ceux déjà couverts par les questions
   - Maximum 4 catégories, priority: true pour les 2 plus pertinentes
   - Labels courts (2-3 mots) en français, ids en snake_case anglais

Si tous les axes QQOQCP sont couverts : questions: [], categories: [], readyToGenerate: true.

Catégories possibles : ${getCategoryHints(category)}

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "questions": [
    { "id": "id_snake", "label": "Question en français ?", "theme": "Thème valide", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }
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
