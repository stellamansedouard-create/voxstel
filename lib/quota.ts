import { createServerSupabase } from "@/lib/supabase";
import { ensureUserRow } from "@/lib/auth";
import { PRICING } from "@/lib/pricing";
import type { PricingPlan } from "@/types";

interface UserQuotaRow {
  plan: PricingPlan;
  quota_used: number;
  quota_reset_date: string;
}

export interface QuotaStatus {
  allowed: boolean;
  plan: PricingPlan;
  quotaUsed: number;
  limit: number | null;
}

/**
 * Reads the user's quota via the service role key (bypasses RLS — the users
 * table has no UPDATE permission for authenticated clients).
 * Resets quota_used to 0 when a new calendar month has started since the
 * last reset date. Returns null if the row is still missing after a
 * self-heal attempt (email/password signups don't hit any server route
 * before this — see ensureUserRow in lib/auth.ts — so the row may not
 * exist yet on a user's very first quota-gated request).
 */
export async function checkQuota(userId: string, email?: string): Promise<QuotaStatus | null> {
  const supabase = createServerSupabase();

  let { data, error } = await supabase
    .from("users")
    .select("plan, quota_used, quota_reset_date")
    .eq("id", userId)
    .single();

  if ((error || !data) && email) {
    await ensureUserRow(userId, email);
    ({ data, error } = await supabase
      .from("users")
      .select("plan, quota_used, quota_reset_date")
      .eq("id", userId)
      .single());
  }

  if (error || !data) return null;

  const row = data as UserQuotaRow;
  const plan = row.plan;
  const limit = PRICING[plan]?.monthlyLimit ?? null;

  const resetDate = new Date(row.quota_reset_date);
  const now = new Date();
  const monthsElapsed =
    (now.getFullYear() - resetDate.getFullYear()) * 12 +
    (now.getMonth() - resetDate.getMonth());

  let quotaUsed = row.quota_used;

  if (monthsElapsed >= 1) {
    await supabase
      .from("users")
      .update({ quota_used: 0, quota_reset_date: now.toISOString() })
      .eq("id", userId);
    quotaUsed = 0;
  }

  return {
    allowed: limit === null || quotaUsed < limit,
    plan,
    quotaUsed,
    limit,
  };
}

/**
 * Increments quota_used by 1 via service role key.
 * Uses the value already fetched in checkQuota to avoid a second SELECT
 * (minimises the race window for concurrent calls from the same user).
 */
export async function incrementQuota(
  userId: string,
  currentUsed: number
): Promise<void> {
  const supabase = createServerSupabase();
  await supabase
    .from("users")
    .update({ quota_used: currentUsed + 1 })
    .eq("id", userId);
}
