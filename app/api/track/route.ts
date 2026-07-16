import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent, isEventType } from "@/lib/analytics";

export const runtime = "nodejs";

interface TrackBody {
  event_type: string;
  prompt_category?: string | null;
  session_id?: string | null;
  referrer?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  metadata?: Record<string, unknown> | null;
  path?: string | null;
}

function deviceFromUA(ua: string | null): string {
  if (!ua) return "unknown";
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobi|iphone|android.+mobile|phone/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as TrackBody;

    if (!isEventType(body.event_type)) {
      return NextResponse.json({ error: "invalid_event_type" }, { status: 400 });
    }

    // Best-effort identity — anonymous visitors are expected and allowed.
    const user = await getCurrentUser().catch(() => null);
    const userId = user?.id ?? null;

    const supabase = createServerSupabase();
    const ua = req.headers.get("user-agent");
    const device = deviceFromUA(ua);
    const country = req.headers.get("x-vercel-ip-country");
    const sessionId = body.session_id ?? null;
    const metadata: Record<string, unknown> = { ...(body.metadata ?? {}), device };
    const path = body.path ?? (typeof metadata.path === "string" ? metadata.path : null);

    // 1) Always record the event (metadata never null — trackEvent enforces {}).
    await trackEvent({
      userId,
      eventType: body.event_type,
      promptCategory: body.prompt_category ?? null,
      utmSource: body.utm_source ?? null,
      utmMedium: body.utm_medium ?? null,
      utmCampaign: body.utm_campaign ?? null,
      referrer: body.referrer ?? null,
      sessionId,
      metadata,
    });

    // 2) Session upkeep + returning-user detection on page_view.
    if (body.event_type === "page_view" && sessionId) {
      await upsertSession(supabase, {
        sessionId,
        userId,
        device,
        referrer: body.referrer ?? null,
        landingPage: path,
      });
      if (userId) {
        await touchUserActivity(supabase, userId, {
          landingPage: path,
          device,
          country,
          sessionId,
        });
      }
    }

    // 3) Reflect value-delivery signals back onto the prompt row (owner-scoped).
    if (userId && typeof body.metadata?.prompt_id === "string") {
      const promptId = body.metadata.prompt_id as string;
      if (body.event_type === "prompt_copied") {
        await supabase
          .from("prompts_history")
          .update({ was_copied: true })
          .eq("id", promptId)
          .eq("user_id", userId);
      } else if (body.event_type === "prompt_regenerated") {
        await supabase
          .from("prompts_history")
          .update({ was_regenerated: true })
          .eq("id", promptId)
          .eq("user_id", userId);
      } else if (body.event_type === "prompt_made_public") {
        await supabase
          .from("prompts_history")
          .update({ is_public: true })
          .eq("id", promptId)
          .eq("user_id", userId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/track] error:", error);
    // Analytics must never surface as an app error to the browser.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

type Admin = ReturnType<typeof createServerSupabase>;

async function upsertSession(
  supabase: Admin,
  s: { sessionId: string; userId: string | null; device: string; referrer: string | null; landingPage: string | null }
) {
  const { data: existing } = await supabase
    .from("sessions")
    .select("id, page_count")
    .eq("session_id", s.sessionId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("sessions")
      .update({
        page_count: (existing.page_count ?? 0) + 1,
        ended_at: new Date().toISOString(),
        ...(s.userId ? { user_id: s.userId } : {}),
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("sessions").insert({
      session_id: s.sessionId,
      user_id: s.userId,
      device: s.device,
      referrer: s.referrer,
      landing_page: s.landingPage,
      page_count: 1,
    });
  }
}

// Emits user_returned when a known user comes back after a gap, then refreshes
// last_active_at. Also backfills landing/device/country if still empty.
async function touchUserActivity(
  supabase: Admin,
  userId: string,
  ctx: { landingPage: string | null; device: string; country: string | null; sessionId: string | null }
) {
  const { data: row } = await supabase
    .from("users")
    .select("created_at, last_active_at, landing_page, device_type, country")
    .eq("id", userId)
    .maybeSingle();
  if (!row) return;

  const now = new Date();
  const last = row.last_active_at ? new Date(row.last_active_at) : null;
  const RETURN_GAP_MS = 6 * 60 * 60 * 1000; // 6h since last activity = a "return"

  if (last && now.getTime() - last.getTime() > RETURN_GAP_MS) {
    const created = row.created_at ? new Date(row.created_at) : null;
    const daysSinceSignup = created
      ? Math.floor((now.getTime() - created.getTime()) / 86_400_000)
      : null;
    const daysSinceLastVisit = Math.floor((now.getTime() - last.getTime()) / 86_400_000);
    await trackEvent({
      userId,
      eventType: "user_returned",
      sessionId: ctx.sessionId,
      metadata: { days_since_signup: daysSinceSignup, days_since_last_visit: daysSinceLastVisit },
    });
  }

  await supabase
    .from("users")
    .update({
      last_active_at: now.toISOString(),
      ...(row.landing_page ? {} : ctx.landingPage ? { landing_page: ctx.landingPage } : {}),
      ...(row.device_type ? {} : { device_type: ctx.device }),
      ...(row.country || !ctx.country ? {} : { country: ctx.country }),
    })
    .eq("id", userId);
}
