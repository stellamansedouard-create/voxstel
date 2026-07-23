import { NextRequest, NextResponse } from "next/server";

// Short, presentable redirect for the Instagram bio link. The bio shows
// "voxstel.com/ig" — clean, on our own domain, no third-party shortener.
// It 302s to the real UTM-tagged URL so Supabase (sessions.utm_source,
// analytics_events.utm_source via lib/utm.client.ts) can attribute this
// traffic to Instagram specifically, without ever exposing the tagged
// query string in the public bio.
//
// If the campaign changes (e.g. distinguishing a Story link from the bio
// link), update the params here — the bio itself never needs editing again.
export async function GET(req: NextRequest) {
  const url = new URL("https://www.voxstel.com/");
  url.searchParams.set("utm_source", "instagram");
  url.searchParams.set("utm_medium", "bio");
  url.searchParams.set("utm_campaign", "profil");
  return NextResponse.redirect(url, 302);
}
