// Read-only balance for the current user. Used by the library journey to wall
// off a 0-credit user at ENTRY — before the question engine spends a call —
// rather than only at the final delivery. No mutation, no decrement.
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBalance } from "@/lib/credits";

export async function GET() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { credits, unlimited } = await getBalance(user.id);
  return NextResponse.json({ credits, unlimited });
}
