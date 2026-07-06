import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import type { PricingPlan } from "@/types";

const CHECKOUT_PLANS = ["pro", "unlimited", "promax"] as const satisfies readonly PricingPlan[];
type CheckoutPlan = (typeof CHECKOUT_PLANS)[number];

function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return typeof value === "string" && (CHECKOUT_PLANS as readonly string[]).includes(value);
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { plan } = (await req.json()) as { plan?: unknown };
    if (!isCheckoutPlan(plan)) {
      return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
    }

    const priceId = STRIPE_PRICES[plan];
    const supabase = createServerSupabase();

    const { data: userRow } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = userRow?.stripe_customer_id as string | null | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      customerId = customer.id;
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const origin = req.nextUrl.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      allow_promotion_codes: true,
      metadata: { user_id: user.id, plan },
      subscription_data: {
        metadata: { user_id: user.id, plan },
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout error:", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
