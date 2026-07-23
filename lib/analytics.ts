import { createServerSupabase } from "@/lib/supabase";

export type EventType =
  | "prompt_generated"
  | "user_signup"
  | "plan_upgraded"
  | "plan_downgraded"
  | "payment_failed"
  // Emitted by the credits checkout (/api/checkout) and Stripe webhook. The
  // instrumentation branch's fuller taxonomy is a superset of these two.
  | "checkout_started"
  | "checkout_completed"
  // --- Funnel events (client-side, /api/analytics/events) -----------------
  // Reconnected 22/07/2026 — these existed in an earlier version of the
  // generator and were dropped during the Bibliothèque/Crédits refactor. The
  // analytics_events rows from that era are still in the table (see
  // AnalyticsCharts/kpis), this just wires real call sites back up so new
  // rows accumulate again. See lib/analytics.client.ts for the browser side.
  | "category_selected"
  | "input_submitted"
  | "questions_shown"
  | "generation_started"
  | "prompt_copied"
  | "upgrade_clicked"
  | "pricing_viewed"
  // New — not part of the old taxonomy. Fired via sendBeacon on tab
  // close/hide with the last known step, so a drop-off has a concrete
  // "left here" instead of just silence in the funnel counts.
  | "step_abandoned";

export interface TrackEventPayload {
  userId?: string | null;
  eventType: EventType;
  promptCategory?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  referrer?: string | null;
  sessionId?: string | null;
  metadata?: Record<string, unknown> | null;
}

export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  const supabase = createServerSupabase();
  const { error } = await supabase.from("analytics_events").insert({
    user_id: payload.userId ?? null,
    event_type: payload.eventType,
    prompt_category: payload.promptCategory ?? null,
    utm_source: payload.utmSource ?? null,
    utm_medium: payload.utmMedium ?? null,
    utm_campaign: payload.utmCampaign ?? null,
    referrer: payload.referrer ?? null,
    session_id: payload.sessionId ?? null,
    metadata: payload.metadata ?? null,
  });
  if (error) {
    console.error("[analytics] trackEvent failed — message:", error.message, "| code:", error.code, "| details:", error.details);
  } else {
    console.log("[analytics] trackEvent ok — event_type:", payload.eventType, "user_id:", payload.userId);
  }
}
