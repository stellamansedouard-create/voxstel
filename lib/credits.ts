// Credit service — service role only. Do not import in client components.
// All balance mutations go through the atomic deduct_credit / grant_credits
// Postgres functions (see supabase/migrations/20260716_credits_system.sql).
import { createServerSupabase } from "@/lib/supabase";
import { UNLIMITED_PRICE_IDS } from "@/lib/stripe";

/** Thrown by deductCredit when a non-unlimited user has 0 credits. */
export class InsufficientCreditsError extends Error {
  constructor() {
    super("insufficient_credits");
    this.name = "InsufficientCreditsError";
  }
}

export interface CreditBalance {
  credits: number;
  /** true when the user holds the new unlimited subscription (no decrement). */
  unlimited: boolean;
}

type ReasonDeduct = "generation";
type ReasonGrant =
  | "signup_bonus"
  | "purchase_pack_10"
  | "purchase_pack_50"
  | "purchase_pack_200"
  | "refund"
  | "admin_adjust";

/**
 * Reads the user's balance. `unlimited` is gated on the subscription PRICE, not
 * on subscription_status alone — the legacy webhook writes 'active' into
 * subscription_status for old pro/promax plans too, so bare status is
 * ambiguous. See UNLIMITED_PRICE_IDS in lib/stripe.ts.
 */
export async function getBalance(userId: string): Promise<CreditBalance> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("users")
    .select("credits, subscription_status, subscription_price_id")
    .eq("id", userId)
    .single();

  const credits = (data?.credits as number | null) ?? 0;
  const unlimited =
    data?.subscription_status === "active" &&
    typeof data?.subscription_price_id === "string" &&
    UNLIMITED_PRICE_IDS.has(data.subscription_price_id);

  return { credits, unlimited };
}

export async function hasCredit(userId: string): Promise<boolean> {
  const { credits, unlimited } = await getBalance(userId);
  return unlimited || credits > 0;
}

/**
 * Consumes one credit, atomically.
 *   - unlimited user  -> logs a delta-0 'generation_unlimited' row, no decrement,
 *                        returns null (no numeric balance).
 *   - otherwise       -> guarded -1 via deduct_credit(); throws
 *                        InsufficientCreditsError when the balance is 0.
 * Returns the new balance (number) for metered users, or null for unlimited.
 */
export async function deductCredit(
  userId: string,
  reason: ReasonDeduct = "generation",
  metadata?: Record<string, unknown>
): Promise<number | null> {
  const supabase = createServerSupabase();

  const { unlimited } = await getBalance(userId);
  if (unlimited) {
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      delta: 0,
      balance_after: null,
      reason: "generation_unlimited",
      metadata: metadata ?? {},
    });
    return null;
  }

  const { data, error } = await supabase.rpc("deduct_credit", {
    p_user_id: userId,
    p_reason: reason,
    p_metadata: metadata ?? {},
  });
  if (error) throw error;
  if (data === null || data === undefined) throw new InsufficientCreditsError();

  return data as number;
}

/**
 * Grants credits, idempotently. When `stripeEventId` is provided and a ledger
 * row already carries it, this is a no-op (returns the current balance) — safe
 * to call on Stripe webhook retries. Returns the new balance, or null if the
 * user row does not exist.
 */
export async function grantCredits(
  userId: string,
  amount: number,
  reason: ReasonGrant,
  stripeEventId?: string,
  metadata?: Record<string, unknown>
): Promise<number | null> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase.rpc("grant_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_stripe_event_id: stripeEventId ?? null,
    p_metadata: metadata ?? {},
  });
  if (error) throw error;
  return (data as number | null) ?? null;
}
