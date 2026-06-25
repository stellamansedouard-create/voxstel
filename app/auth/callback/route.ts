import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ensureUserRow } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const cookieStore = cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Ensure user row exists in public.users (fallback — DB trigger is primary)
      await ensureUserRow(data.user.id, data.user.email ?? "");

      // Track user_signup only on the very first confirmation (first_visit_at is null)
      try {
        const adminSupabase = createServerSupabase();
        const { data: userRow } = await adminSupabase
          .from("users")
          .select("first_visit_at")
          .eq("id", data.user.id)
          .single();

        if (!userRow?.first_visit_at) {
          const utmRaw = cookieStore.get("vx_utm")?.value;
          const utm = utmRaw ? JSON.parse(decodeURIComponent(utmRaw)) : {};

          await Promise.all([
            adminSupabase.from("users").update({
              utm_source: utm.utm_source ?? null,
              utm_medium: utm.utm_medium ?? null,
              utm_campaign: utm.utm_campaign ?? null,
              referrer: utm.referrer ?? null,
              first_visit_at: utm.first_visit_at ?? new Date().toISOString(),
            }).eq("id", data.user.id),

            trackEvent({
              userId: data.user.id,
              eventType: "user_signup",
              utmSource: utm.utm_source ?? null,
              utmMedium: utm.utm_medium ?? null,
              utmCampaign: utm.utm_campaign ?? null,
              referrer: utm.referrer ?? null,
            }),
          ]);
        }
      } catch (e) {
        console.error("[analytics] user_signup:", e);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
