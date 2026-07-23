// THE delivery seam (Prompt 4). deliverGeneratedPrompt() is the single entry
// point for BOTH engine outputs the library journey can hand to the user:
//
//   layer: "ambiance"  the refined ambiance, when the run stops there
//                       (refine-ambiance flow). NOT the intermediate refine of
//                       the refine-and-subject flow — that stays free and never
//                       reaches this function.
//   layer: "subject"   the final subject prompt (keep-ambiance /
//                       refine-and-subject / continue-from-ambiance).
//
// The product boundary (frozen, non-negotiable):
//   FREE  = copy-pasting a library page's raw prompt (never touches the engine,
//           never reaches this seam).
//   PAID  = every delivered generation, ambiance-refined OR subject.
//
// Billing unit = one DELIVERED prompt, never one question round. A refining run
// may ask 8 questions before delivering: it is still exactly 1 credit, charged
// once here at the successful delivery — not at each intermediate exchange.
import {
  deductCredit,
  getBalance,
  grantCredits,
  InsufficientCreditsError,
} from "@/lib/credits";
import { refineAmbianceLayer } from "@/lib/ambiance-layer";
import { generateSubjectPrompt } from "@/lib/subject-layer";
import { createServerSupabase } from "@/lib/supabase";
import type { AITool, AmbianceLayer, Category, LayeredOutput } from "@/types";

/** The Q&A of the rounds that led to this delivery, persisted for measurement. */
export interface QAEntry {
  question: string;
  theme: string;
  answer: string;
  layer: "ambiance" | "subject";
}

interface DeliverBase {
  userId: string;
  category: Category;
  tool: AITool;
  /** Library page the run started from, kept in questions_answers for attribution. */
  sourcePageSlug?: string | null;
  questionsAnswers?: QAEntry[];
  useSonnet?: boolean;
}

export interface DeliverAmbianceInput extends DeliverBase {
  layer: "ambiance";
  /** The (possibly page-seeded) ambiance prompt being refined. */
  ambiancePrompt: string;
  /** Question label -> answer from the ambiance round. */
  answers: Record<string, string>;
}

export interface DeliverSubjectInput extends DeliverBase {
  layer: "subject";
  /** Must be locked before it reaches here. */
  ambiance: AmbianceLayer;
  subject: string;
  subjectAnswers: Record<string, string>;
}

export type DeliverGeneratedPromptInput =
  | DeliverAmbianceInput
  | DeliverSubjectInput;

export interface DeliverGeneratedPromptResult {
  layer: "ambiance" | "subject";
  /** Set for layer "subject". */
  output: LayeredOutput | null;
  /** Set for layer "ambiance" — the refined ambiance text. */
  ambiance: string | null;
  /** New credit balance after the charge; null for unlimited users. */
  balance: number | null;
  /** id of the prompts_history row just written — see ChargeAndRecordResult. */
  historyId: string;
}

/**
 * The one gated delivery point. In order:
 *   1. Check the balance BEFORE spending an engine call. 0 credits (and not
 *      unlimited) -> throw InsufficientCreditsError; nothing is generated,
 *      decremented or recorded.
 *   2. Generate.
 *   3. On success, charge 1 credit + write one prompts_history row as a single
 *      logical unit (see chargeAndRecord).
 */
/**
 * Shared pre-gate for EVERY paid generation entry point — the library journey
 * (deliverGeneratedPrompt) and the classic /generate/* generator
 * (app/api/generate-prompt). Reads the balance and refuses BEFORE any model
 * call when a metered user is out of credits. Read-only — decrements nothing.
 * Throws InsufficientCreditsError (routes map it to HTTP 402 -> paywall).
 */
export async function assertCanGenerate(userId: string): Promise<void> {
  const { credits, unlimited } = await getBalance(userId);
  if (!unlimited && credits < 1) throw new InsufficientCreditsError();
}

export async function deliverGeneratedPrompt(
  input: DeliverGeneratedPromptInput
): Promise<DeliverGeneratedPromptResult> {
  // 1. Gate first — never burn an engine call for a user who cannot be charged.
  await assertCanGenerate(input.userId);

  // 2. Generate (no charge yet — a failed model call must cost nothing).
  let output: LayeredOutput | null = null;
  let ambiance: string | null = null;
  let promptEn: string;
  let promptFr: string | null;

  if (input.layer === "ambiance") {
    ambiance = await refineAmbianceLayer({
      category: input.category,
      tool: input.tool,
      ambiancePrompt: input.ambiancePrompt,
      answers: input.answers ?? {},
    });
    promptEn = ambiance;
    promptFr = null;
  } else {
    output = await generateSubjectPrompt({
      category: input.category,
      tool: input.tool,
      ambiance: { ...input.ambiance, locked: true },
      subject: input.subject,
      subjectAnswers: input.subjectAnswers ?? {},
      useSonnet: input.useSonnet,
    });
    // Music keeps two fields; flatten them for the single-column history.
    promptEn =
      output.kind === "music"
        ? `[STYLE]\n${output.style}\n\n[LYRICS]\n${output.lyrics}`
        : output.en;
    promptFr = output.kind === "music" ? null : output.fr || null;
  }

  // 3. Charge exactly once + record, together.
  const { balance, historyId } = await chargeAndRecord({
    userId: input.userId,
    layer: input.layer,
    category: input.category,
    tool: input.tool,
    sourcePageSlug: input.sourcePageSlug ?? null,
    questionsAnswers: input.questionsAnswers ?? [],
    promptEn,
    promptFr,
  });

  return { layer: input.layer, output, ambiance, balance, historyId };
}

export interface ChargeAndRecordParams {
  userId: string;
  category: Category;
  tool: AITool;
  promptEn: string;
  promptFr: string | null;
  /** Library journey only — omitted by the classic generator (single prompt). */
  layer?: "ambiance" | "subject";
  sourcePageSlug?: string | null;
  questionsAnswers?: QAEntry[];
}

export interface ChargeAndRecordResult {
  /** New credit balance after the charge; null for unlimited users. */
  balance: number | null;
  /** id of the prompts_history row just inserted — lets the caller thread it
   *  back to the client so a later "copy" action can mark was_copied=true on
   *  the SAME row, instead of guessing which row a copy click refers to. */
  historyId: string;
}

/**
 * The single charge-and-record unit, shared by BOTH generators. Consumes 1
 * credit AND writes the prompts_history row as one logical unit: either both
 * land or neither does. deductCredit() (Prompt 1) is reused as-is — it
 * atomically decrements and appends to credit_transactions. If the history
 * insert then fails, the credit is refunded via grantCredits(), so there is
 * never a decremented credit without a matching history row, nor the reverse.
 *
 * Unlimited users are not decremented (deductCredit logs a delta-0 row and
 * returns null); there is nothing to refund for them, so compensation is
 * skipped when balance is null.
 *
 * The library journey passes layer/source_page/qa (persisted in
 * questions_answers); the classic generator passes none, so questions_answers
 * stays NULL exactly as its previous raw insert left it.
 *
 * Returns the new balance (number, or null for unlimited users) AND the
 * inserted row's id — added 22/07/2026 so was_copied can be reconnected
 * end-to-end (see app/api/prompts/mark-copied/route.ts).
 */
export async function chargeAndRecord(
  p: ChargeAndRecordParams
): Promise<ChargeAndRecordResult> {
  const balance = await deductCredit(p.userId, "generation", {
    category: p.category,
    tool: p.tool,
    layer: p.layer ?? null,
    source_page: p.sourcePageSlug ?? null,
  });

  // Library deliveries carry journey attribution; the classic generator has
  // none, so its questions_answers is NULL (unchanged from the old insert).
  const hasJourneyMeta =
    p.layer !== undefined ||
    (p.sourcePageSlug ?? null) !== null ||
    (p.questionsAnswers?.length ?? 0) > 0;

  const { data, error } = await createServerSupabase()
    .from("prompts_history")
    .insert({
      user_id: p.userId,
      category: p.category,
      tool: p.tool,
      prompt_en: p.promptEn,
      prompt_fr: p.promptFr,
      // No dedicated layer/source_page columns — carry both in the JSON, using
      // the shape questions_answers already uses elsewhere.
      questions_answers: hasJourneyMeta
        ? {
            layer: p.layer ?? null,
            source_page: p.sourcePageSlug ?? null,
            qa: p.questionsAnswers ?? [],
          }
        : null,
    })
    .select("id")
    .single();

  if (error || !data) {
    // Undo the decrement so the credit ⇔ history invariant holds. Only a
    // metered user was actually decremented (balance is a number).
    if (balance !== null) {
      await grantCredits(p.userId, 1, "refund", undefined, {
        reason: "prompts_history_insert_failed",
        layer: p.layer,
      }).catch((e) =>
        console.error("[deliver] refund after history failure failed:", e)
      );
    }
    console.error(
      "[deliver] prompts_history INSERT failed — message:",
      error?.message,
      "| code:",
      error?.code,
      "| details:",
      error?.details
    );
    throw new Error("history_write_failed");
  }

  return { balance, historyId: data.id as string };
}
