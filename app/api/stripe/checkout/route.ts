import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICES } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";
import { trackEvent } from "@/lib/analytics";
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

    // Backfill GA4 client_id / gclid from the vx_utm cookie. The OAuth
    // callback only writes these once, at first signup (first_visit_at null) —
    // any user who signed up before the consent fix (or via email/password
    // without the cookie populated yet) keeps ga_client_id = NULL forever,
    // and the server-side "purchase" upload (lib/ga4-conversion.ts) is then
    // silently skipped. The checkout request is the last moment to capture it.
    // Best-effort: a tracking backfill must never block a paying customer.
    try {
      const utmRaw = req.cookies.get("vx_utm")?.value;
      if (utmRaw) {
        const utm = JSON.parse(decodeURIComponent(utmRaw)) as {
          ga_client_id?: string;
          gclid?: string;
        };
        const backfill: Record<string, string> = {};
        if (utm.ga_client_id) backfill.ga_client_id = utm.ga_client_id;
        if (utm.gclid) backfill.gclid = utm.gclid;
        if (Object.keys(backfill).length > 0) {
          await supabase.from("users").update(backfill).eq("id", user.id);
        }
      }
    } catch {
      // malformed cookie — ignore
    }

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

    void trackEvent({
      userId: user.id,
      eventType: "checkout_started",
      metadata: { plan },
    }).catch((e) => console.error("[analytics]", e));

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe checkout error:", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
