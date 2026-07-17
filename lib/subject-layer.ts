// Layer 2 — the subject. THE seam for Prompt 4.
//
// deliverSubjectLayer() is the single delivery point for the subject layer.
// Prompt 4 adds `deductCredit` + the 0-credit paywall at the marker below and
// nowhere else, so it stays a tiny diff. For now delivery is free and ungated
// so the whole journey is testable end to end without spending anything.
//
// How the ambiance stays frozen, per category:
//
//   music        The ambiance IS the Suno STYLE field, so it is copied through
//                VERBATIM and the model is never asked to touch it. Only the
//                LYRICS field is generated. The lock is structural, not a
//                politely-worded instruction.
//
//   image/video  One prompt, so the merge is a model call. The ambiance is
//   text         passed as frozen context to weave the subject into.
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getWording, isTwoFieldCategory } from "@/lib/ambiance";
import type {
  AITool,
  AmbianceLayer,
  Category,
  LayeredOutput,
  MergedLayeredOutput,
  MusicLayeredOutput,
} from "@/types";

export interface DeliverSubjectLayerParams {
  userId: string;
  category: Category;
  tool: AITool;
  /** Must be locked — the subject step may read it but never reopen it. */
  ambiance: AmbianceLayer;
  /** What the user said they want to talk about / show. */
  subject: string;
  /** Question label -> answer from the subject round. */
  subjectAnswers: Record<string, string>;
  useSonnet?: boolean;
}

/**
 * Delivers the subject layer merged with the frozen ambiance.
 * This is the ONE place layer 2 is handed to the user.
 */
export async function deliverSubjectLayer(
  params: DeliverSubjectLayerParams
): Promise<LayeredOutput> {
  // TODO(prompt-4): consume 1 credit + paywall here.
  //   const balance = await getBalance(params.userId);
  //   if (!balance.unlimited && balance.credits < 1) throw new PaywallError();
  //   await deductCredit(params.userId, "generation", { category: params.category });
  // Deliberately ungated for now — the journey must produce its output for free.

  if (!params.ambiance.locked) {
    throw new Error(
      "deliverSubjectLayer called with an unlocked ambiance — the ambiance must be frozen before the subject step."
    );
  }

  return isTwoFieldCategory(params.category)
    ? deliverMusicLayers(params)
    : deliverMergedPrompt(params);
}

/** Suno: STYLE is the frozen ambiance verbatim; only LYRICS is generated. */
async function deliverMusicLayers(
  params: DeliverSubjectLayerParams
): Promise<MusicLayeredOutput> {
  const { tool, ambiance, subject, subjectAnswers, useSonnet } = params;
  const toolMeta = getToolById("music", tool);
  const toolName = toolMeta?.name ?? tool;
  const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

  const extras = formatAnswers(subjectAnswers);

  const message = await anthropic.messages.create({
    model: useSonnet ? MODELS.sonnet : MODELS.haiku,
    max_tokens: 3000,
    system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte technique : ${promptContext}

Tu écris UNIQUEMENT le champ PAROLES. Le champ STYLE est déjà arrêté et ne t'appartient pas.

Style figé (contexte de lecture seule — n'y touche pas, ne le reproduis pas dans ta réponse) :
"""
${ambiance.prompt}
"""

Écris la structure temporelle balisée et les paroles du morceau, cohérentes avec ce style et avec le thème de l'utilisateur.

RÈGLES :
- Balise la structure : [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Guitar Solo], [Outro]… Choisis la structure qui sert le morceau.
- Le flow, le nombre de syllabes et le phrasé doivent coller au style figé (tempo, genre, type de voix).
- Ne redécris JAMAIS le style, le genre, l'instrumentation ou le mix dans les paroles — ce champ ne contient que de la structure et du texte chanté.
- Les paroles sont en français par défaut. Si l'utilisateur a explicitement demandé une autre langue, respecte ce choix.
- Si l'utilisateur a fourni un texte à reprendre tel quel (slogan, refrain, citation), reproduis-le à l'identique, sans le traduire ni le reformuler.

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{ "lyrics": "[Intro]\\n...\\n\\n[Verse]\\n..." }`,
    messages: [
      {
        role: "user",
        content: `Thème du morceau : "${subject}"${extras ? `\n\nPrécisions :\n${extras}` : ""}

Écris la structure balisée et les paroles.`,
      },
    ],
  });

  const parsed = parseJson<{ lyrics?: string }>(message, "deliverMusicLayers");

  return {
    kind: "music",
    // Verbatim — the frozen ambiance never goes through the model.
    style: ambiance.prompt,
    lyrics: parsed?.lyrics?.trim() ?? "",
  };
}

/** image / video / text: the subject is woven into the frozen ambiance. */
async function deliverMergedPrompt(
  params: DeliverSubjectLayerParams
): Promise<MergedLayeredOutput> {
  const { category, tool, ambiance, subject, subjectAnswers, useSonnet } = params;
  const toolMeta = getToolById(category, tool);
  const toolName = toolMeta?.name ?? tool;
  const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;
  const w = getWording(category);

  const extras = formatAnswers(subjectAnswers);

  // text/music expect French output by default; image/video prompts are English.
  const outputLanguageRule =
    category === "text"
      ? `\n- Ajoute une ligne explicite et distincte indiquant la langue attendue du contenu produit (par défaut le français), sauf si l'utilisateur a demandé une autre langue.`
      : "";

  const message = await anthropic.messages.create({
    model: useSonnet ? MODELS.sonnet : MODELS.haiku,
    max_tokens: 3000,
    system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte technique : ${promptContext}

${w.ambianceLabel} figé${w.ambianceAgr} — l'utilisateur l'a arrêté${w.ambianceAgr} et c'est NON NÉGOCIABLE :
"""
${ambiance.prompt}
"""

Produis UN SEUL prompt ${toolName} qui insère le sujet de l'utilisateur dans cette ${w.ambianceLabel.toLowerCase()} figée.

RÈGLES ABSOLUES :
- Reprends INTÉGRALEMENT les choix ${
      category === "text"
        ? "de structure (sections, ordre, format, ton, contraintes)"
        : "d'ambiance (style, lumière, couleurs, matière, grade, cadrage)"
    }. Tu n'en abandonnes, n'en adoucis et n'en contredis aucun.
- N'ajoute aucun choix ${
      category === "text" ? "de structure" : "d'ambiance"
    } que l'utilisateur n'a pas fait.
- Le sujet doit habiter l'ambiance, pas cohabiter avec elle : ${
      category === "text"
        ? "la structure est remplie avec le métier, le secteur et le parcours donnés"
        : "le sujet est éclairé, cadré et texturé par l'ambiance figée"
    }.
- Le prompt EN doit être riche, détaillé et respecter la syntaxe exacte de ${toolName}.
- Si l'utilisateur a fourni un texte à faire apparaître tel quel (slogan, citation, titre, nom de marque), reproduis-le à l'identique entre guillemets, sans jamais le traduire — y compris dans le champ "en".${outputLanguageRule}

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{ "en": "Prompt complet en anglais pour ${toolName}...", "fr": "Traduction française naturelle du prompt..." }`,
    messages: [
      {
        role: "user",
        content: `Sujet : "${subject}"${extras ? `\n\nPrécisions :\n${extras}` : ""}

Génère le prompt fusionné.`,
      },
    ],
  });

  const parsed = parseJson<{ en?: string; fr?: string }>(
    message,
    "deliverMergedPrompt"
  );
  if (!parsed?.en) throw new Error("Failed to parse merged prompt JSON");

  return { kind: "merged", en: parsed.en, fr: parsed.fr ?? "" };
}

function formatAnswers(answers: Record<string, string>): string {
  return Object.entries(answers)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `- ${k} : ${v}`)
    .join("\n");
}

function parseJson<T>(
  message: { content: Array<{ type: string }> },
  label: string
): T | null {
  const content = message.content[0] as { type: string; text?: string };
  if (content.type !== "text" || !content.text) {
    throw new Error("Unexpected response type");
  }
  try {
    const cleaned = content.text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "");
    return JSON.parse(cleaned) as T;
  } catch {
    console.error(`[${label}] Failed to parse JSON. Raw:`, content.text.slice(0, 800));
    return null;
  }
}
