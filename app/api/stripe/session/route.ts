import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";

/** Lets the post-checkout page confirm the real charged amount for the Purchase pixel event. */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser().catch(() => null);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "missing_session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.metadata?.user_id !== user.id) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if (session.payment_status !== "paid" || typeof session.amount_total !== "number" || !session.currency) {
      return NextResponse.json({ error: "not_paid" }, { status: 400 });
    }

    return NextResponse.json({
      value: session.amount_total / 100,
      currency: session.currency.toUpperCase(),
    });
  } catch (error) {
    console.error("stripe session retrieve error:", error);
    return NextResponse.json({ error: "retrieve_failed" }, { status: 500 });
  }
}
