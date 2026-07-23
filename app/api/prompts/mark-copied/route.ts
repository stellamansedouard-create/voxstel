import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";

// Reconnects prompts_history.was_copied — added 22/07/2026. The column has
// existed since early on but nothing in the app ever wrote to it (verified:
// zero matches for "was_copied" across the whole codebase before this file).
// The two classic-generator result screens (PromptResult.tsx, LayeredResult.tsx)
// copy to the clipboard client-side only, with no server call — so every
// generation looked identical in prompts_history whether the user actually
// took their prompt anywhere or not. This is the missing write path.
export async function POST(req: NextRequest) {
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "id requis" }, { status: 400 });
    }

    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Service-role client bypasses RLS — the explicit .eq("user_id", ...) is
    // what actually scopes this update to rows the caller owns, so a user
    // can't mark someone else's history row as copied by guessing an id.
    const { error } = await createServerSupabase()
      .from("prompts_history")
      .update({ was_copied: true })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[prompts/mark-copied] update failed:", error.message);
      return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("prompts/mark-copied error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
