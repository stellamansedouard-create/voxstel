import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
import type Stripe from "stripe";

// Stripe requires the raw body to verify the signature
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const newPlan = session.metadata?.plan;

    if (userId && newPlan) {
      const supabase = createServerSupabase();

      // Read old plan before overwriting it
      const { data: currentUser } = await supabase
        .from("users")
        .select("plan")
        .eq("id", userId)
        .single();
      const oldPlan = currentUser?.plan ?? null;

      await supabase
        .from("users")
        .update({ plan: newPlan })
        .eq("id", userId);

      await trackEvent({
        userId,
        eventType: "plan_upgraded",
        utmSource: session.metadata?.utm_source ?? null,
        utmMedium: session.metadata?.utm_medium ?? null,
        utmCampaign: session.metadata?.utm_campaign ?? null,
        metadata: { old_plan: oldPlan, new_plan: newPlan },
      });
    }
  }

  return NextResponse.json({ received: true });
}
