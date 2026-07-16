import { NextRequest, NextResponse } from "next/server";
import { stripe, PRICE_BY_PRODUCT, isCreditProduct } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";

/**
 * Credits checkout — packs (one-shot payment) and the 19€/mo unlimited
 * subscription. Distinct from the legacy /api/stripe/checkout (plan-based).
 *
 * Input: { product: 'pack_10' | 'pack_50' | 'pack_200' | 'unlimited' }
 * Returns: { url } — the Stripe Checkout Session URL.
 *
 * Crediting / subscription state is applied by the webhook on
 * checkout.session.completed, never here.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { product } = (await req.json()) as { product?: unknown };
    if (!isCreditProduct(product)) {
      return NextResponse.json({ error: "invalid_product" }, { status: 400 });
    }

    const priceId = PRICE_BY_PRODUCT[product];
    const isSubscription = product === "unlimited";
    const supabase = createServerSupabase();

    // Resolve or create the Stripe customer for this user.
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
      mode: isSubscription ? "subscription" : "payment",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      // TVA non applicable (franchise en base, art. 293 B du CGI) — prix finaux.
      automatic_tax: { enabled: false },
      metadata: {
        user_id: user.id,
        product,
        // The webhook's subscription branch resolves a plan from metadata.plan.
        ...(isSubscription ? { plan: "unlimited" } : {}),
      },
      ...(isSubscription
        ? { subscription_data: { metadata: { user_id: user.id, plan: "unlimited" } } }
        : {}),
    });

    if (!session.url) {
      return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
    }

    void trackEvent({
      userId: user.id,
      eventType: "checkout_started",
      metadata: { product },
    }).catch((e) => console.error("[analytics]", e));

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("checkout error:", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
