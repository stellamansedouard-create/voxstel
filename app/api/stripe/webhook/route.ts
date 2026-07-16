import { NextRequest, NextResponse } from "next/server";
import {
  stripe,
  PLAN_BY_PRICE_ID,
  CREDITS_BY_PRICE_ID,
  PACK_REASON_BY_CREDITS,
} from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase";
import { grantCredits } from "@/lib/credits";
import { trackEvent } from "@/lib/analytics";
import { uploadPurchaseEvent } from "@/lib/ga4-conversion";
import { PRICING } from "@/lib/pricing";
import type Stripe from "stripe";
import type { PricingPlan } from "@/types";

type ReasonGrant = "purchase_pack_10" | "purchase_pack_50" | "purchase_pack_200";

// Stripe requires the raw body to verify the signature
export const runtime = "nodejs";

type SupabaseAdmin = ReturnType<typeof createServerSupabase>;

/** Price id is the source of truth for the plan — metadata can go stale after a portal-side plan swap. */
function planFromSubscription(subscription: Stripe.Subscription): PricingPlan | null {
  const priceId = subscription.items.data[0]?.price?.id;
  if (priceId && PLAN_BY_PRICE_ID[priceId]) return PLAN_BY_PRICE_ID[priceId];
  const metaPlan = subscription.metadata?.plan as PricingPlan | undefined;
  return metaPlan ?? null;
}

async function resolveUserId(
  supabase: SupabaseAdmin,
  subscription: Stripe.Subscription
): Promise<string | null> {
  if (subscription.metadata?.user_id) return subscription.metadata.user_id;
  return resolveUserIdByCustomerId(supabase, subscription.customer as string);
}

async function resolveUserIdByCustomerId(
  supabase: SupabaseAdmin,
  customerId: string | null
): Promise<string | null> {
  if (!customerId) return null;

  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  return data?.id ?? null;
}

async function upsertSubscriptionRow(
  supabase: SupabaseAdmin,
  userId: string,
  subscription: Stripe.Subscription,
  plan: PricingPlan
) {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      plan,
      status: subscription.status,
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
  if (error) {
    console.error(
      "[stripe/webhook] subscriptions upsert failed — message:", error.message,
      "| code:", error.code, "| details:", error.details, "| hint:", error.hint,
      "| stripe_subscription_id:", subscription.id
    );
  }
}

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

  const supabase = createServerSupabase();

  // Idempotence: record the event id first. On conflict (a Stripe retry of an
  // event we already recorded) nothing is inserted — return 200 without
  // reprocessing. NOTE: this is insert-first, so an event whose handler crashes
  // mid-way is not reprocessed on retry; the money-moving grants are
  // additionally idempotent via credit_transactions.stripe_event_id, and the
  // subscription writes are upserts, so this is safe. `processed_at` (set at the
  // end) lets an operator spot any event that never finished.
  const { data: idem, error: idemError } = await supabase
    .from("stripe_webhook_events")
    .upsert(
      { event_id: event.id, type: event.type },
      { onConflict: "event_id", ignoreDuplicates: true }
    )
    .select("event_id");

  if (!idemError && (!idem || idem.length === 0)) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (idemError) {
    // Don't drop the event on a bookkeeping failure — log and process (handlers
    // are idempotent). Worst case is a possible reprocess, not a lost payment.
    console.error(
      "[stripe/webhook] idempotence insert failed — message:",
      idemError.message, "| code:", idemError.code, "| event_id:", event.id
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id ?? session.client_reference_id ?? undefined;

      // --- Credit pack (one-shot payment) ---------------------------------
      if (session.mode === "payment") {
        if (userId) {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
            limit: 10,
          });
          const packLine = lineItems.data.find(
            (li) => li.price?.id && CREDITS_BY_PRICE_ID[li.price.id] !== undefined
          );
          const priceId = packLine?.price?.id;
          const perUnit = priceId ? CREDITS_BY_PRICE_ID[priceId] : undefined;

          if (perUnit) {
            const credits = perUnit * (packLine?.quantity ?? 1);
            const reason = (PACK_REASON_BY_CREDITS[perUnit] ?? "purchase_pack_10") as ReasonGrant;

            await grantCredits(userId, credits, reason, event.id, {
              session_id: session.id,
              price_id: priceId,
            });

            const { data: currentUser } = await supabase
              .from("users")
              .select("ga_client_id")
              .eq("id", userId)
              .single();

            await trackEvent({
              userId,
              eventType: "checkout_completed",
              metadata: {
                product: session.metadata?.product ?? null,
                credits,
                amount: session.amount_total != null ? session.amount_total / 100 : null,
                currency: (session.currency ?? "eur").toUpperCase(),
              },
            });

            if (session.amount_total != null) {
              await uploadPurchaseEvent({
                clientId: currentUser?.ga_client_id,
                value: session.amount_total / 100,
                currency: (session.currency ?? "eur").toUpperCase(),
                transactionId: session.id,
              });
            }
          } else {
            console.warn(
              "[stripe/webhook] payment checkout with no recognized pack price —",
              "session_id:", session.id, "| user_id:", userId
            );
          }
        }
        break;
      }

      // --- Subscription (unlimited) ---------------------------------------
      const newPlan = session.metadata?.plan as PricingPlan | undefined;

      if (userId && newPlan && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );
        const subPriceId = subscription.items.data[0]?.price?.id ?? null;

        const { data: currentUser } = await supabase
          .from("users")
          .select("plan, ga_client_id")
          .eq("id", userId)
          .single();
        const oldPlan = currentUser?.plan ?? null;

        const { error: usersUpdateError } = await supabase
          .from("users")
          .update({
            plan: newPlan,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            subscription_price_id: subPriceId,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          })
          .eq("id", userId);
        if (usersUpdateError) {
          console.error(
            "[stripe/webhook] users update failed (checkout.session.completed) — message:",
            usersUpdateError.message, "| code:", usersUpdateError.code, "| user_id:", userId
          );
        }

        await upsertSubscriptionRow(supabase, userId, subscription, newPlan);

        // Report the amount actually charged by Stripe, not the PRICING table:
        // STRIPE_PRICE_UNLIMITED is repointed to the new 19€/mo price while
        // PRICING.unlimited still reads 17,99 (its update ships with the pricing
        // page rework). Falls back to PRICING if the Stripe amount is absent.
        const subPrice = subscription.items.data[0]?.price;
        const purchaseValue =
          subPrice?.unit_amount != null ? subPrice.unit_amount / 100 : PRICING[newPlan].price;
        const purchaseCurrency = (subPrice?.currency ?? PRICING[newPlan].currency).toUpperCase();

        await trackEvent({
          userId,
          eventType: "plan_upgraded",
          utmSource: session.metadata?.utm_source ?? null,
          utmMedium: session.metadata?.utm_medium ?? null,
          utmCampaign: session.metadata?.utm_campaign ?? null,
          metadata: { old_plan: oldPlan, new_plan: newPlan },
        });

        await trackEvent({
          userId,
          eventType: "checkout_completed",
          metadata: {
            plan: newPlan,
            amount: purchaseValue,
            currency: purchaseCurrency,
          },
        });

        await uploadPurchaseEvent({
          clientId: currentUser?.ga_client_id,
          value: purchaseValue,
          currency: purchaseCurrency,
          transactionId: session.id,
        });
      }
      break;
    }

    // `created` shares this handler: a subscription started outside Checkout
    // (Stripe Dashboard, direct API) only emits `created`, and without it
    // subscription_price_id would stay NULL — getBalance() gates unlimited on
    // that field, so the subscriber would fail closed despite having paid.
    // `updated` fires on renewals, plan swaps via the customer portal, and when
    // a cancellation is scheduled for end-of-period (status stays "active" with
    // cancel_at_period_end = true until the period actually ends).
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(supabase, subscription);
      const plan = planFromSubscription(subscription);

      if (userId && plan) {
        await upsertSubscriptionRow(supabase, userId, subscription, plan);

        const isActive =
          subscription.status === "active" || subscription.status === "trialing";

        const { error: usersUpdateError } = await supabase
          .from("users")
          .update({
            plan: isActive ? plan : "free",
            subscription_status: subscription.status,
            subscription_price_id: subscription.items.data[0]?.price?.id ?? null,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
            subscription_cancel_at: subscription.cancel_at
              ? new Date(subscription.cancel_at * 1000).toISOString()
              : null,
          })
          .eq("id", userId);
        if (usersUpdateError) {
          console.error(
            "[stripe/webhook] users update failed (customer.subscription.updated) — message:",
            usersUpdateError.message, "| code:", usersUpdateError.code, "| user_id:", userId
          );
        }
      }
      break;
    }

    // Fires once the subscription is actually terminated (period end reached,
    // or immediate cancellation) — downgrade to free.
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = await resolveUserId(supabase, subscription);
      const oldPlan = planFromSubscription(subscription);

      if (userId) {
        const { error: subsUpdateError } = await supabase
          .from("subscriptions")
          .update({ status: "canceled", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", subscription.id);
        if (subsUpdateError) {
          console.error(
            "[stripe/webhook] subscriptions update failed (customer.subscription.deleted) — message:",
            subsUpdateError.message, "| code:", subsUpdateError.code,
            "| stripe_subscription_id:", subscription.id
          );
        }

        const { error: usersUpdateError } = await supabase
          .from("users")
          .update({
            plan: "free",
            subscription_status: "canceled",
            subscription_price_id: null,
            subscription_current_period_end: null,
            subscription_cancel_at: null,
          })
          .eq("id", userId);
        if (usersUpdateError) {
          console.error(
            "[stripe/webhook] users update failed (customer.subscription.deleted) — message:",
            usersUpdateError.message, "| code:", usersUpdateError.code, "| user_id:", userId
          );
        }

        await trackEvent({
          userId,
          eventType: "plan_downgraded",
          metadata: { old_plan: oldPlan, new_plan: "free" },
        });
      }
      break;
    }

    // Fires on every failed renewal attempt (including Stripe's automatic
    // dunning retries). No emailing system exists yet — this only logs a
    // clear trace so failures are visible/queryable, both in Vercel logs
    // and in analytics_events.
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = (invoice.customer as string | null) ?? null;

      const { data: userRow, error: userLookupError } = customerId
        ? await supabase
            .from("users")
            .select("id, email")
            .eq("stripe_customer_id", customerId)
            .single()
        : { data: null, error: null };

      if (userLookupError) {
        console.error(
          "[stripe/webhook] user lookup failed (invoice.payment_failed) — message:",
          userLookupError.message, "| code:", userLookupError.code, "| customer_id:", customerId
        );
      }

      console.warn(
        "[stripe/webhook] PAYMENT FAILED —",
        "user_id:", userRow?.id ?? "unknown",
        "| email:", userRow?.email ?? "unknown",
        "| customer_id:", customerId,
        "| amount_due:", invoice.amount_due, invoice.currency,
        "| attempt:", invoice.attempt_count,
        "| next_attempt:", invoice.next_payment_attempt
          ? new Date(invoice.next_payment_attempt * 1000).toISOString()
          : "none (final attempt)",
        "| invoice_id:", invoice.id
      );

      if (userRow?.id) {
        await trackEvent({
          userId: userRow.id,
          eventType: "payment_failed",
          metadata: {
            amount_due: invoice.amount_due,
            currency: invoice.currency,
            attempt_count: invoice.attempt_count,
            invoice_id: invoice.id,
          },
        });
      }
      break;
    }

    default:
      break;
  }

  await supabase
    .from("stripe_webhook_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("event_id", event.id);

  return NextResponse.json({ received: true });
}
