// Défense en profondeur contre la génération de contenu interdit (sexuel,
// mineurs, violence graphique, haine, auto-mutilation) — protège le compte API
// Anthropic. Deux barrières partagent ce module : ENTRÉE (avant génération, sur
// la demande brute) et SORTIE (après génération, sur le prompt produit). Les
// deux appellent runGates(), qui enchaîne : pré-filtre local (coût nul) ->
// classifieur Haiku + renfort OpenAI facultatif. Un seul « bloqué » suffit.
//
// Fail-closed : si le classifieur plante (réseau/timeout), 1 retry puis REFUS.
// Mieux vaut refuser une génération légitime qu'exposer le compte API.
//
// Câblage : moderateInput() aux points d'entrée (route classique +
// deliverGeneratedPrompt) ; moderateOutput() dans chargeAndRecord AVANT le débit
// crédit, si bien qu'une génération bloquée ne coûte jamais de crédit.
import { anthropic, MODELS } from "@/lib/anthropic";
import { trackEvent } from "@/lib/analytics";

export type ModerationResult = {
  allowed: boolean;
  categories: string[]; // ex: ["sexual", "minors"]
  severity: "none" | "low" | "medium" | "high" | "critical";
  source: "prefilter" | "haiku" | "openai" | "error_failclosed";
  reason?: string; // court, pour le log — jamais renvoyé brut à l'utilisateur
};

/** Message de refus renvoyé à l'utilisateur (FR, vouvoiement, neutre). Ne
 *  jamais y inclure les categories/reason internes. */
export const REFUS_MESSAGE =
  "Cette demande ne peut pas être traitée : elle enfreint nos règles " +
  "d'utilisation. Aucun crédit ne vous a été débité. Reformulez votre demande " +
  "si vous pensez qu'il s'agit d'une erreur.";

/**
 * Levée quand une des deux barrières bloque. Portée jusqu'au handler de route,
 * qui la mappe en HTTP 422 + REFUS_MESSAGE. Le log analytics est déjà écrit au
 * point de blocage (voir logModerationBlocked), donc le handler n'a qu'à mapper.
 */
export class ContentBlockedError extends Error {
  constructor(
    public readonly stage: "input" | "output",
    public readonly result: ModerationResult
  ) {
    super("content_blocked");
    this.name = "ContentBlockedError";
  }
}

// --- Pré-filtre local : bloque l'évident sans appel réseau ------------------
// NB: le simple mot « enfant » ne doit PAS bloquer seul un contenu non sexuel
// (ex: dessin animé pour enfants). Le vrai jugement vient du classifieur ; le
// pré-filtre n'attrape que le grossier ou la combinaison dangereuse.
// Bornes sur une classe de lettres latines+FR plutôt que \b : \b est ASCII et
// rate les mots à accent initial (« érotique ») comme les flexions FR
// féminin/pluriel (« sexuelle », « twerke », « lycéenne »). Le prefilter doit
// les attraper sans dépendre du classifieur. (Pas de flag \u ni \p{L} : la cible
// tsc par défaut est ES5 — d'où la classe explicite [A-Za-zÀ-ÿ].)
const L = "A-Za-zÀ-ÿ";
const SEXUAL_RE = new RegExp(
  `(?<![${L}])(?:porn|xxx|nsfw|hentai|nue?s?|naked|nude|sexe|sexual|sexuel(?:le|les|s)?|twerk[${L}]*|[eé]roti(?:c|que)s?|explicit sex|sexe explicite)(?![${L}])`,
  "i"
);
// Élargi au-delà de « petite fille » : tout sujet d'âge ambigu (fille, garçon,
// jeune, gamin, gosse, écolier…) sans marqueur adulte. Combiné à un terme
// SEXUEL_RE explicite, le prefilter escalade en critical — ces cas sont déjà
// bloqués aujourd'hui, donc c'est une hausse de sévérité, pas un nouveau blocage.
// Le registre intime NON explicite + âge ambigu est tranché par le classifieur.
const MINOR_RE = new RegExp(
  `(?<![${L}])(?:enfants?|mineur(?:e|s|es)?|filles?|gar[çc]ons?|jeunes?|gamin(?:e)?s?|gosses?|[ée]col(?:ier|ière)s?|loli|shota|teens?|ado(?:lescent)?e?s?|lyc[ée]en(?:ne)?s?|coll[ée]gien(?:ne)?s?)(?![${L}])`,
  "i"
);

// --- Classifieur Haiku ------------------------------------------------------
const CLASSIFIER_SYSTEM = `Tu es un filtre de sécurité pour un générateur de prompts IA.
On te donne un texte (demande utilisateur ou prompt généré). Tu réponds UNIQUEMENT en JSON strict, sans texte autour :
{"allowed": boolean, "categories": string[], "severity": "none"|"low"|"medium"|"high"|"critical", "reason": string}

Tu BLOQUES (allowed=false) si le texte a pour objet principal :
- contenu sexuel explicite ou pornographique, nudité à visée sexuelle, actes sexuels ; categories inclut "sexual", severity "high" ou plus.
- contenu intime, sexuel ou romantique-physique MÊME NON EXPLICITE, dès lors que l'intimité est le sujet principal de la scène : baiser sur un lit ou dans une chambre, scène décrite comme « intime », « passionnée », « sensuelle », « tendre intime », étreinte ou câlin au lit, gros plans sur des moments intimes, ambiance de séduction ou de désir. categories inclut "sexual", severity "medium" au minimum (plus haute si la charge sexuelle augmente).
- violence graphique/gore, torture, contenu haineux ciblant un groupe protégé.
- instructions d'auto-mutilation/suicide, fabrication d'armes/drogues, activités clairement illégales.

RÈGLE MINEURS (tolérance zéro). Un cadre intime ou sexuel (au sens des deux premiers points ci-dessus) combiné à un sujet dont l'âge est ambigu doit être BLOQUÉ. L'âge est ambigu dès que le sujet est désigné par un terme comme « fille », « filles », « garçon », « jeune », « ado », « lycéen(ne) », « collégien(ne) », « gamin(e) », ou par une apparence enfantine, SANS marqueur d'âge adulte explicite (« femme », « homme », « adulte », « majeur », ou un âge chiffré >= 18). Dans ce cas : allowed=false, severity="critical", categories inclut "minors". En cas d'ambiguïté d'âge combinée à un cadre sexuel/intime, penche TOUJOURS vers le blocage ; au moindre indice de minorité, "critical".

Tu AUTORISES (allowed=true) :
- contenu créatif, professionnel, artistique, marketing, éducatif, divertissement grand public.
- affection incidente et NON sexuelle où l'intimité n'est PAS le sujet : un baiser lors d'une scène de mariage ou dans la rue, un couple adulte se tenant la main, un câlin familial ou amical, une accolade — tant que la scène ne tourne pas autour de l'intimité physique et ne porte pas de charge sexuelle.

En cas de doute entre "autorisé" et un registre intime/sexuel, penche vers le blocage. Sois particulièrement strict sur les mineurs.`;

export async function classifyWithHaiku(text: string): Promise<ModerationResult> {
  const msg = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 300,
    system: CLASSIFIER_SYSTEM,
    messages: [{ role: "user", content: text.slice(0, 6000) }],
  });
  const raw =
    msg.content.find((c): c is { type: "text"; text: string } => c.type === "text")
      ?.text ?? "{}";
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const parsed = JSON.parse(cleaned) as Partial<ModerationResult>;
  return {
    allowed: !!parsed.allowed,
    categories: parsed.categories ?? [],
    severity: parsed.severity ?? "none",
    source: "haiku",
    reason: parsed.reason,
  };
}

// --- Renfort OpenAI (facultatif, gratuit) -----------------------------------
// Actif seulement si OPENAI_API_KEY est présent. Très fiable sur sexuel/mineurs.
async function classifyWithOpenAI(text: string): Promise<ModerationResult | null> {
  if (!process.env.OPENAI_API_KEY) return null;
  const r = await fetch("https://api.openai.com/v1/moderations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "omni-moderation-latest",
      input: text.slice(0, 6000),
    }),
  });
  if (!r.ok) return null;
  const data = await r.json();
  const res = data.results?.[0];
  if (!res) return null;
  const cats = Object.entries(res.categories || {})
    .filter(([, v]) => v)
    .map(([k]) => k);
  const minors = cats.some((c) => c.includes("minor"));
  return {
    allowed: !res.flagged,
    categories: cats,
    severity: minors ? "critical" : res.flagged ? "high" : "none",
    source: "openai",
  };
}

// --- Orchestrateur ----------------------------------------------------------
async function runGates(text: string): Promise<ModerationResult> {
  // Pré-filtre : bloque si (terme mineur ET terme sexuel) — tolérance zéro —,
  // ou terme sexuel explicite seul. Sinon on laisse le classifieur trancher.
  const sexual = SEXUAL_RE.test(text);
  const minorHint = MINOR_RE.test(text);
  if (sexual && minorHint) {
    return {
      allowed: false,
      categories: ["sexual", "minors"],
      severity: "critical",
      source: "prefilter",
      reason: "prefilter: sexual+minor",
    };
  }
  if (sexual) {
    return {
      allowed: false,
      categories: ["sexual"],
      severity: "high",
      source: "prefilter",
      reason: "prefilter: explicit",
    };
  }

  try {
    const [haiku, openai] = await Promise.all([
      classifyWithHaiku(text),
      classifyWithOpenAI(text),
    ]);
    const results = [haiku, openai].filter(Boolean) as ModerationResult[];
    const blocked = results.find((r) => !r.allowed);
    return (
      blocked ?? { allowed: true, categories: [], severity: "none", source: "haiku" }
    );
  } catch (e) {
    // 1 retry puis fail-closed.
    try {
      return await classifyWithHaiku(text);
    } catch {
      return {
        allowed: false,
        categories: ["error"],
        severity: "high",
        source: "error_failclosed",
        reason: String(e).slice(0, 200),
      };
    }
  }
}

export const moderateInput = (text: string) => runGates(text);
export const moderateOutput = (text: string) => runGates(text);

// --- Log de blocage ---------------------------------------------------------
/**
 * Trace un blocage dans analytics_events (event_type 'moderation_blocked',
 * déjà whitelisté par le check-constraint). Les categories/reason internes
 * restent dans metadata, jamais renvoyées à l'utilisateur. Fire-and-forget côté
 * appelant : l'échec du log ne doit pas empêcher le refus.
 */
export async function logModerationBlocked(params: {
  userId: string | null;
  sessionId: string | null;
  category: string | null;
  stage: "input" | "output";
  result: ModerationResult;
}): Promise<void> {
  const { userId, sessionId, category, stage, result } = params;
  await trackEvent({
    userId,
    eventType: "moderation_blocked",
    promptCategory: category,
    sessionId,
    metadata: {
      stage,
      categories: result.categories,
      severity: result.severity,
      source: result.source,
      reason: result.reason ?? null,
    },
  });
}

/**
 * Barrière d'ENTRÉE : modère la demande brute, log + lève ContentBlockedError si
 * bloquée. À appeler AVANT toute génération, à chaque point d'entrée payant.
 * Renvoie le résultat (autorisé) pour qu'il soit tracé dans moderation_flags.
 */
export async function assertInputAllowed(
  text: string,
  ctx: { userId: string | null; sessionId: string | null; category: string | null }
): Promise<ModerationResult> {
  const mod = await moderateInput(text);
  if (!mod.allowed) {
    await logModerationBlocked({ ...ctx, stage: "input", result: mod }).catch(
      (e) => console.error("[moderation] log input failed:", e)
    );
    throw new ContentBlockedError("input", mod);
  }
  return mod;
}
