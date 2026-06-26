import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function DELETE() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  // Delete user data in dependency order
  const tables = ["prompts_history", "analytics_events"] as const;
  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("user_id", user.id);
    if (error) {
      console.error(`[account/delete] ${table} delete error:`, error.message);
      return NextResponse.json({ error: `Failed to delete ${table}` }, { status: 500 });
    }
  }

  const { error: userRowError } = await supabase
    .from("users")
    .delete()
    .eq("id", user.id);
  if (userRowError) {
    console.error("[account/delete] users row delete error:", userRowError.message);
    return NextResponse.json({ error: "Failed to delete user row" }, { status: 500 });
  }

  // Delete Supabase auth user — requires service role admin client
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { error: authError } = await adminClient.auth.admin.deleteUser(user.id);
  if (authError) {
    console.error("[account/delete] auth.admin.deleteUser error:", authError.message);
    return NextResponse.json({ error: "Failed to delete auth account" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
