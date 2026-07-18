import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getUseCaseById } from "@/lib/usecases";
import { getCurrentUser } from "@/lib/auth";
import { getThemeHints, PLAIN_LANGUAGE_RULE } from "@/lib/question-themes";
import type { AITool, DirectQuestion } from "@/types";

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

function getUsageContextRule(categoryId: string, usageContext: string | undefined): string {
  if (usageContext?.trim()) {
    return `✅ CONTEXTE D'USAGE DÉJÀ FOURNI : "${usageContext}"
Ne pose JAMAIS de question sur l'usage ou la destination du résultat — ce point est entièrement couvert. Concentre-toi sur les autres axes.`;
  }
  const themeLabel =
    categoryId === "music" ? '"Usage & Contexte"' :
    categoryId === "image" ? '"Décor & Contexte"' :
    categoryId === "video" ? '"Détails Techniques"' :
    '"Objectif & Contraintes"';
  return `⚠ CONTEXTE D'USAGE ABSENT — Tu DOIS inclure au moins une question sur l'usage ou la destination du résultat (à quoi va servir cette création, dans quel cadre) dans le thème ${themeLabel}.`;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { tool, category, useCase, description, usageContext } = await req.json() as {
      tool: AITool;
      category: string;
      useCase?: string;
      description: string;
      usageContext?: string;
    };

    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const useCaseMeta = useCase ? getUseCaseById(category, useCase) : undefined;
    // Le cas d'usage (ex: "Fond d'écran") capture déjà la finalité — s'il est
    // présent, le moteur ne doit pas reposer "à quoi ça va servir".
    const effectiveUsage = usageContext?.trim() || useCaseMeta?.label || "";
    const useCaseBlock = useCaseMeta
      ? `\n\n━━━ TYPE DE CRÉATION CHOISI : ${useCaseMeta.label} ━━━
L'utilisateur crée précisément : ${useCaseMeta.label} (${useCaseMeta.tagline}).
${useCaseMeta.questionGuidance}
Les questions marquées OBLIGATOIRE ci-dessus doivent impérativement figurer dans ta liste, même si la description n'en dit rien — elles font partie du minimum pour ce type de création. Ne les formule jamais en jargon technique : garde des libellés simples (ex : « Sur quel appareil ? » plutôt que « Quel ratio ? »), et laisse les suggestions guider vers la précision.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
      : "";

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 2500,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte de l'outil : ${promptContext}${useCaseBlock}

━━━ PLANCHER MINIMUM — JAMAIS MOINS DE 2 QUESTIONS ━━━
Tu dois TOUJOURS générer au moins 2 questions, même si la description semble déjà très complète.
Un utilisateur sur Voxstel a par définition besoin d'aide à la précision — ne renvoie jamais une liste vide.
S'il ne reste presque aucune ambiguïté évidente, pose les 2 questions qui apporteraient le plus de valeur
ajoutée même marginale (rendu final, usage, détail technique fin).
Ne classe jamais une question comme "optionnelle" ou "bonus" — si elle vaut la peine d'être posée,
elle a la même importance que les autres. Toutes les questions dans une seule liste plate, par thème.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ ANALYSE QQOQCP SYSTÉMATIQUE (ne jamais mentionner ces axes dans les questions) ━━━
Pour CHAQUE axe ci-dessous, évalue SANS EXCEPTION : est-ce que connaître la réponse à cet axe
changerait significativement le résultat final pour ${toolName} ?
Ne présume jamais qu'un axe est "moins pertinent" par défaut pour cette catégorie — juge chaque axe
AU CAS PAR CAS selon ce que son absence implique réellement pour CETTE description précise.

Exemple : "un chat qui joue de la flûte" — l'absence totale d'indice sur l'époque (médiéval ? contemporain ?
conte intemporel ?) change radicalement le style, les couleurs et le décor → c'est une ambiguïté réelle à poser.

${getQQOQCPAxes(category)}

Règle : génère une question pour tout axe ABSENT ou INSUFFISAMMENT PRÉCIS dont la réponse changerait le résultat.
Ne saute jamais un axe uniquement parce qu'il "semble" secondaire — value chaque axe au cas par cas.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ RÈGLE CONTEXTE D'USAGE ━━━
${getUsageContextRule(category, effectiveUsage)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

━━━ NOMBRE DE QUESTIONS ━━━
Pas de plafond haut. Pose exactement autant de questions que nécessaire pour lever toutes les ambiguïtés réelles.
- Description très vague → beaucoup de questions (6, 10, 14…)
- Description déjà précise → peu de questions, mais JAMAIS moins de 2
- Ne t'arrête jamais artificiellement tôt si des axes importants restent non couverts.
- Ne fabrique jamais de question redondante ou triviale.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Une question est valide pour DEUX raisons :
a) APPROFONDIR quelque chose de VAGUE/GÉNÉRIQUE déjà mentionné
   → Ex : "ambiance sombre" → "Quelle nuance d'ambiance sombre ?" + suggestions : Oppressant, Mélancolique, Mystérieux, Inquiétant
b) COMBLER un MANQUE ESSENTIEL détecté dans l'analyse QQOQCP
   → Question ciblée + suggestions adaptées au contexte précis

${PLAIN_LANGUAGE_RULE}

RÈGLES DE FORMAT pour chaque question :
- 4-5 suggestions courtes et TRÈS contextuelles (3 mots max), collées à la description spécifique (pas génériques)
- Ne jamais utiliser les noms QQOQCP comme formulation de question
- Champ "theme" obligatoire, choisi EXACTEMENT parmi les libellés ci-dessous

${getThemeHints(category)}

Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans champ supplémentaire :
{
  "questions": [
    { "id": "id_snake", "label": "Question en français ?", "theme": "Thème valide", "suggestions": ["Sug 1", "Sug 2", "Sug 3", "Sug 4"] }
  ],
  "readyToGenerate": false
}`,
      messages: [
        {
          role: "user",
          content: `L'utilisateur veut créer avec ${toolName}.${useCaseMeta ? ` Type de création : ${useCaseMeta.label}.` : ""} Sa description :

"${description}"
${effectiveUsage ? `\nContexte d'usage déclaré : "${effectiveUsage}"` : "\nContexte d'usage : non renseigné"}
Génère les questions de précision.`,
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

    if (parsed.questions.length < 2) {
      console.warn(
        `[analyze-description] Moins de 2 questions retournées (${parsed.questions.length}). Réponse brute :`,
        content.text.slice(0, 500)
      );
    }

    return NextResponse.json({
      questions: parsed.questions,
      readyToGenerate: parsed.questions.length === 0,
    });
  } catch (error) {
    console.error("analyze-description error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'analyse de la description" },
      { status: 500 }
    );
  }
}
