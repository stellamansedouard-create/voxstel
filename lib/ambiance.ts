// Ambiance / subject layering.
//
// The two layers, and where the boundary sits, differ per category:
//
//   music        ambiance = the global sound  -> Suno STYLE field
//                subject  = structure + lyrics -> Suno LYRICS field
//                (the target tool already has two fields, so nothing is merged)
//
//   image/video  ambiance = the look of the scene (style, light, grain…)
//                subject  = what is placed inside it (character, vehicle, pose)
//                (one prompt: the subject is woven into the frozen ambiance)
//
//   text         ambiance = the generic prompt skeleton (e.g. a CV structure)
//                subject  = the trade/sector/background it is adapted to
//                (one prompt)
//
// Everything in this file that reaches the user says "Voxstel". The system
// instructions below are internal and are never rendered.
import type { AmbianceFlow, Category } from "@/types";

/** Whether the category's output keeps two fields instead of one merged prompt. */
export function isTwoFieldCategory(category: Category): boolean {
  return category === "music";
}

/** User-facing vocabulary. Music says style/lyrics; the rest say ambiance/subject. */
interface CategoryWording {
  /** "l'ambiance" / "le style" — used inside sentences, with its article. */
  ambiance: string;
  /** Capitalised, standalone. */
  ambianceLabel: string;
  subject: string;
  subjectLabel: string;
  /** Heading on the subject screen. */
  subjectHeading: string;
  subjectPlaceholder: string;
}

const WORDING: Record<Category, CategoryWording> = {
  music: {
    ambiance: "le style",
    ambianceLabel: "Style",
    subject: "les paroles",
    subjectLabel: "Paroles",
    subjectHeading: "De quoi parle votre morceau ?",
    subjectPlaceholder:
      "Le thème de votre chanson — une histoire, une émotion, un message…",
  },
  image: {
    ambiance: "l'ambiance",
    ambianceLabel: "Ambiance",
    subject: "le sujet",
    subjectLabel: "Sujet",
    subjectHeading: "Quel est votre sujet ?",
    subjectPlaceholder:
      "Ce que vous voulez placer dans cette ambiance — un personnage, un objet, une scène…",
  },
  video: {
    ambiance: "l'ambiance",
    ambianceLabel: "Ambiance",
    subject: "le sujet",
    subjectLabel: "Sujet",
    subjectHeading: "Que se passe-t-il dans votre scène ?",
    subjectPlaceholder:
      "Ce qui se déroule dans cette ambiance — qui, quelle action, quel moment…",
  },
  text: {
    ambiance: "la structure",
    ambianceLabel: "Structure",
    subject: "le sujet",
    subjectLabel: "Sujet",
    subjectHeading: "Quel est votre sujet ?",
    subjectPlaceholder:
      "Ce à quoi adapter cette structure — votre métier, votre secteur, votre parcours…",
  },
};

export function getWording(category: Category): CategoryWording {
  return WORDING[category];
}

/** The three library-page entry points, labelled per category. */
export function getFlowLabel(flow: AmbianceFlow, category: Category): string {
  const w = WORDING[category];
  switch (flow) {
    case "refine-ambiance":
      return `Affiner ${w.ambiance}`;
    case "keep-ambiance":
      return `Conserver ${w.ambiance} + créer ${w.subject}`;
    case "refine-and-subject":
      return `Affiner ${w.ambiance} + créer ${w.subject}`;
  }
}

export function getFlowDescription(flow: AmbianceFlow, category: Category): string {
  const w = WORDING[category];
  switch (flow) {
    case "refine-ambiance":
      return `Ajustez ${w.ambiance} à votre goût, sans repartir de zéro.`;
    case "keep-ambiance":
      return `Gardez ${w.ambiance} tel quel et passez directement à ${w.subject}.`;
    case "refine-and-subject":
      return `Ajustez ${w.ambiance}, puis enchaînez sur ${w.subject}.`;
  }
}

export const FLOW_ORDER: AmbianceFlow[] = [
  "refine-ambiance",
  "keep-ambiance",
  "refine-and-subject",
];

/**
 * Named blocks in a library prompt, e.g. "[Genre & era]", "[Voice & flow]".
 * Each one becomes one targeted refining question, so the user tunes the block
 * they care about instead of re-answering the whole prompt.
 */
export function parseAmbianceBlocks(
  prompt: string
): Array<{ tag: string; body: string }> {
  const blocks: Array<{ tag: string; body: string }> = [];
  const re = /^[ \t]*\[([^\]\n]+)\][ \t]*:?[ \t]*(.*)$/gm;

  let match: RegExpExecArray | null;
  const found: Array<{ tag: string; start: number; end: number; inline: string }> = [];
  while ((match = re.exec(prompt)) !== null) {
    found.push({
      tag: match[1].trim(),
      start: match.index,
      end: match.index + match[0].length,
      inline: match[2].trim(),
    });
  }

  for (let i = 0; i < found.length; i++) {
    const next = found[i + 1];
    const trailing = prompt
      .slice(found[i].end, next ? next.start : prompt.length)
      .trim();
    const body = [found[i].inline, trailing].filter(Boolean).join("\n").trim();
    blocks.push({ tag: found[i].tag, body });
  }

  return blocks;
}

/**
 * Internal instruction that seeds the existing refining engine with a library
 * prompt instead of a blank field. Never shown to the user.
 *
 * The point the model must not miss: the user clicked THIS prompt, so they want
 * its broad strokes. Questions offer light per-block variants, never a reset.
 */
export function buildAmbianceRefineInstruction(
  category: Category,
  ambiancePrompt: string
): string {
  const w = WORDING[category];
  const blocks = parseAmbianceBlocks(ambiancePrompt);

  const blockGuidance = blocks.length
    ? `Ce prompt est découpé en blocs nommés. Traite CHAQUE bloc ci-dessous comme un axe d'affinage distinct et pose une question ciblée par bloc qui mérite un arbitrage :
${blocks.map((b) => `- [${b.tag}] — valeur actuelle : ${b.body || "(vide)"}`).join("\n")}

Chaque question doit nommer la valeur actuelle du bloc et proposer des variantes LÉGÈRES autour d'elle. Exemple de la forme attendue : « garder l'influence East Coast 90s, ou une variante plus [proche] ? ». Les suggestions restent dans le voisinage immédiat de la valeur actuelle.`
    : `Ce prompt n'a pas de blocs nommés. Découpe-le toi-même en axes cohérents (${
        category === "music"
          ? "genre, instrumentation, voix, mix, tempo"
          : "style, lumière, couleurs, cadrage, matière"
      }) et pose une question ciblée par axe qui mérite un arbitrage.`;

  return `Voici un prompt ${w.ambiance === "le style" ? "de style" : "d'ambiance"} ${category}. L'utilisateur l'a choisi délibérément : il en veut les grandes lignes. Interroge-le pour vérifier que c'est bien ce qu'il veut et affine-le.

${blockGuidance}

RÈGLES ABSOLUES :
- Ne remets JAMAIS le prompt à zéro et ne propose jamais de changer de direction. Aucune question du type « préférez-vous plutôt un autre genre ? ».
- Reste sur la couche ${w.ambiance} uniquement. Ne demande RIEN sur ${
    category === "music"
      ? "le thème, l'histoire ou les paroles"
      : "le sujet, le personnage ou ce qui est représenté"
  } — cette couche est traitée séparément, plus tard.
- N'explique jamais à l'utilisateur comment un prompt est construit et n'emploie aucun vocabulaire de prompt engineering dans les questions. Parle du résultat, pas de la technique.
- Ne mentionne jamais la technologie sous-jacente. Le produit s'appelle Voxstel.

Prompt ${w.ambiance === "le style" ? "de style" : "d'ambiance"} à affiner :
"""
${ambiancePrompt}
"""`;
}

/**
 * Internal instruction for the subject step. The ambiance is frozen here: it is
 * given as read-only context so the subject sits inside it, and the model is
 * told in the strongest terms not to reopen it.
 */
export function buildSubjectInstruction(
  category: Category,
  lockedAmbiance: string
): string {
  const w = WORDING[category];

  return `L'utilisateur a déjà arrêté ${w.ambiance} — c'est FIGÉ et NON NÉGOCIABLE. Tu ne peux plus le modifier, le questionner ni le rouvrir. Il t'est donné uniquement comme contexte, pour que ${w.subject} s'y intègre naturellement.

${w.ambianceLabel} figé${category === "music" ? "" : "e"} :
"""
${lockedAmbiance}
"""

Ton rôle porte EXCLUSIVEMENT sur ${w.subject} : ${
    category === "music"
      ? "le thème du morceau, son déroulé et ses paroles"
      : category === "text"
        ? "le métier, le secteur et le parcours auxquels adapter la structure"
        : "ce qui est représenté dans la scène (personnage, objet, action, pose, précision technique)"
  }.

RÈGLES ABSOLUES :
- Ne pose AUCUNE question qui rouvrirait ${w.ambiance} (${
    category === "music"
      ? "genre, instrumentation, voix, mix, tempo"
      : "style, lumière, couleurs, grain, esthétique"
  }). Ces choix sont faits.
- N'explique jamais comment un prompt est construit et n'emploie aucun vocabulaire de prompt engineering. Parle du résultat, pas de la technique.
- Ne mentionne jamais la technologie sous-jacente. Le produit s'appelle Voxstel.`;
}
