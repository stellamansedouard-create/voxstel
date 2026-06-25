import { createServerSupabase } from "@/lib/supabase";

export type EventType = "prompt_generated" | "user_signup" | "plan_upgraded";

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
  if (error) console.error("[analytics] trackEvent:", error.message);
}
