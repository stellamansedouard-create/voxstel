import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getCurrentUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const supabase = createServerSupabase();
    const { data } = await supabase
      .from("users")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (!data?.stripe_customer_id) {
      return NextResponse.json({ error: "no_subscription" }, { status: 400 });
    }

    const origin = req.nextUrl.origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("stripe portal error:", error);
    return NextResponse.json({ error: "portal_failed" }, { status: 500 });
  }
}
