import { createServerSupabase } from "@/lib/supabase";

/**
 * Full first-party event taxonomy. Kept in sync with the CHECK constraint on
 * public.analytics_events (see migration instrumentation_additive_schema).
 * Adding a value here without updating the DB constraint will make the INSERT
 * fail silently (logged, non-fatal).
 */
export const EVENT_TYPES = [
  // Tunnel visiteur
  "page_view",
  "category_selected",
  "input_submitted",
  "questions_shown",
  "question_answered",
  "questions_skipped",
  "generation_started",
  "prompt_generated",
  "prompt_copied",
  "prompt_regenerated",
  "prompt_made_public",
  // Tunnel monétisation
  "pricing_viewed",
  "quota_limit_hit",
  "upgrade_clicked",
  "checkout_started",
  "checkout_completed",
  // Tunnel compte
  "signup_started",
  "user_signup",
  "user_returned",
  // Cycle de vie abonnement / système
  "plan_upgraded",
  "plan_downgraded",
  "payment_failed",
  "moderation_blocked",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && (EVENT_TYPES as readonly string[]).includes(value);
}

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

/**
 * Inserts one event into analytics_events via the service-role client.
 * metadata is ALWAYS written as an object (defaults to {}) — the audit found
 * it NULL on 100% of rows, which is what this guarantees against going forward.
 */
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
    metadata: payload.metadata ?? {},
  });
  if (error) {
    console.error("[analytics] trackEvent failed — message:", error.message, "| code:", error.code, "| details:", error.details, "| event_type:", payload.eventType);
  }
}
