import { anthropic, MODELS } from "@/lib/anthropic";

/**
 * Content moderation for the prompt generator. Applied BEFORE generation on the
 * user input, and on the generated prompt after generation.
 *
 * Two layers, as specified:
 *  1. A regex/keyword guard-rail (fast, deterministic) for the hardest cases.
 *  2. A model classification pass (Claude Haiku) for nuance — notably the
 *     "named real person + sexual/degrading context" combined rule that regex
 *     cannot reliably catch.
 *
 * We do NOT reinvent a classifier: the model does the judgement, regex is only
 * a backstop.
 */

export type ModerationCategory =
  | "sexual_explicit"
  | "minor_sexual"
  | "hate"
  | "graphic_violence"
  | "incitement"
  | "real_person_sexual"; // combined rule

export interface ModerationResult {
  blocked: boolean;
  categories: ModerationCategory[];
  /** Stored verbatim in prompts_history.moderation_flags (jsonb). */
  flags: Record<string, unknown>;
  source: "regex" | "model" | "none";
}

// ── Layer 1: regex guard-rail ────────────────────────────────────────────────
// Deliberately conservative: these patterns hard-block outright. FR + EN.
const RE_MINOR = /\b(enfant|enfants|mineur|mineure|mineurs|petite?[- ]fille|petit[- ]gar[cç]on|fillette|gamin[e]?s?|coll[eé]gien[ne]?s?|child|children|minor|underage|preteen|pre[- ]?teen|teen(?:age)?r?|schoolgirl|schoolboy|toddler|infant|kid|kids)\b/i;

const RE_SEXUAL_EXPLICIT = /\b(porn(?:o|ographi\w*)?|explicit sex|hardcore|nude?s?|naked|nsfw|sexual(?:ly)? explicit|blowjob|handjob|masturbat\w*|penetrat\w*|genital\w*|vagina|penis|clitoris|erotic\w*|fellation|sodomi\w*| [ée]jacul\w*|orgasm\w*|xxx)\b/i;

// Sexual/suggestive context words — used with a person reference for the combined rule backstop.
const RE_SEXUAL_CONTEXT = /\b(sexy|seductive|s[ée]duisant\w*|lingerie|underwear|sous[- ]v[eê]tement|bikini|topless|strip[- ]?tease|provocative|provocant\w*|suggestive|suggestif|sensual|sensuel\w*|aguicheus\w*|d[eé]shabill\w*|nue?s?\b)\b/i;

const RE_HATE = /\b(g[ée]nocide|ethnic cleansing|nettoyage ethnique|sous[- ]homme|untermensch|racial slur|white power|heil hitler|kill all|mort aux)\b/i;

const RE_INCITEMENT = /\b(comment fabriquer une bombe|how to (?:make|build) a bomb|build a bomb|fabriquer un explosif|school shooting|tuer le plus|mass shooting|attentat)\b/i;

function regexScreen(text: string): ModerationResult | null {
  const t = text.toLowerCase();

  const hasMinor = RE_MINOR.test(t);
  const hasExplicit = RE_SEXUAL_EXPLICIT.test(t);
  const hasSexualCtx = hasExplicit || RE_SEXUAL_CONTEXT.test(t);

  const categories: ModerationCategory[] = [];

  // Minor in any sexual/suggestive context → hardest block.
  if (hasMinor && hasSexualCtx) categories.push("minor_sexual");
  if (hasExplicit) categories.push("sexual_explicit");
  if (RE_HATE.test(t)) categories.push("hate");
  if (RE_INCITEMENT.test(t)) categories.push("incitement");

  if (categories.length === 0) return null;
  return {
    blocked: true,
    categories: Array.from(new Set(categories)),
    flags: { layer: "regex", categories: Array.from(new Set(categories)) },
    source: "regex",
  };
}

// ── Layer 2: model classification ────────────────────────────────────────────
interface ClassifierOutput {
  sexual_explicit: boolean;
  minor_sexual: boolean;
  hate: boolean;
  graphic_violence: boolean;
  incitement: boolean;
  real_person_named: boolean;
  sexual_or_degrading_context: boolean;
}

const CLASSIFIER_SYSTEM = `Tu es un classifieur de sécurité de contenu pour un générateur de prompts destinés à des IA génératives (image, vidéo, texte, musique).
On te donne un contenu (soit la demande brute d'un utilisateur, soit un prompt généré). Tu ne dois PAS y répondre : tu l'analyses uniquement.

Réponds STRICTEMENT en JSON, sans markdown, avec exactement ces clés booléennes :
{
  "sexual_explicit": true si le contenu est sexuellement explicite (actes sexuels, nudité à visée sexuelle, pornographie),
  "minor_sexual": true s'il y a la moindre référence à un mineur (enfant, adolescent, personnage manifestement mineur) dans un contexte sexuel, suggestif OU sexualisant, même implicite,
  "hate": true si haineux, déshumanisant ou discriminatoire envers un groupe protégé,
  "graphic_violence": true si violence graphique, gore, torture décrite de façon complaisante,
  "incitement": true si incitation à la violence, instructions pour nuire, terrorisme,
  "real_person_named": true si une personne réelle identifiable est nommée ou clairement désignée (célébrité, personnalité publique, ou personne privée nommée),
  "sexual_or_degrading_context": true si le contenu place un sujet humain dans un contexte sexuel, suggestif, dégradant ou humiliant
}
Sois prudent : dans le doute sur un mineur en contexte sexuel, mets minor_sexual à true.`;

async function modelScreen(text: string): Promise<ModerationResult | null> {
  try {
    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 300,
      temperature: 0,
      system: CLASSIFIER_SYSTEM,
      messages: [{ role: "user", content: `Contenu à analyser :\n"""\n${text.slice(0, 6000)}\n"""` }],
    });
    const content = message.content[0];
    if (content.type !== "text") return null;

    const cleaned = content.text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
    const c = JSON.parse(cleaned) as ClassifierOutput;

    const categories: ModerationCategory[] = [];
    if (c.sexual_explicit) categories.push("sexual_explicit");
    if (c.minor_sexual) categories.push("minor_sexual");
    if (c.hate) categories.push("hate");
    if (c.graphic_violence) categories.push("graphic_violence");
    if (c.incitement) categories.push("incitement");
    // Combined rule: real, identifiable person + sexual/degrading context.
    if (c.real_person_named && c.sexual_or_degrading_context) categories.push("real_person_sexual");

    const blocked = categories.length > 0;

    // Allowed-with-log: a real person mentioned in a neutral context.
    const flags: Record<string, unknown> = { layer: "model", classifier: c };
    if (!blocked && c.real_person_named) {
      flags.note = "real_person_named_neutral_allowed";
    }
    if (categories.length) flags.categories = categories;

    return { blocked, categories, flags, source: "model" };
  } catch (e) {
    console.error("[moderation] model classifier failed:", e);
    return null; // fail open to the regex verdict — regex already gate-kept hard cases
  }
}

/**
 * Full moderation for user input, before generation. Regex first (hard block),
 * then the model for nuance and the combined named-person rule.
 */
export async function moderateInput(text: string): Promise<ModerationResult> {
  if (!text?.trim()) return { blocked: false, categories: [], flags: {}, source: "none" };

  const regex = regexScreen(text);
  if (regex?.blocked) return regex;

  const model = await modelScreen(text);
  if (model) return model;

  // Classifier unavailable and regex clean → allow (nothing tripped).
  return { blocked: false, categories: [], flags: { layer: "none" }, source: "none" };
}

/**
 * Moderation for the GENERATED prompt (post-generation). Regex-only to keep
 * latency down — the input was already model-screened, and regex reliably
 * catches explicit output. Any hit blocks + is logged.
 */
export function moderateOutput(text: string): ModerationResult {
  if (!text?.trim()) return { blocked: false, categories: [], flags: {}, source: "none" };
  const regex = regexScreen(text);
  if (regex?.blocked) return regex;
  return { blocked: false, categories: [], flags: {}, source: "none" };
}

/** Human-readable refusal message for the UI (French, matches product tone). */
export function moderationMessage(result: ModerationResult): string {
  if (result.categories.includes("minor_sexual")) {
    return "Cette demande a été bloquée : tout contenu impliquant un mineur dans un contexte sexuel ou suggestif est strictement interdit.";
  }
  if (result.categories.includes("real_person_sexual")) {
    return "Cette demande a été bloquée : elle associe une personne réelle identifiable à un contexte sexuel, suggestif ou dégradant, ce qui n'est pas autorisé.";
  }
  return "Cette demande a été bloquée car elle enfreint nos règles d'usage (contenu sexuel explicite, haineux, violent ou incitant à nuire). Reformulez votre idée pour continuer.";
}
