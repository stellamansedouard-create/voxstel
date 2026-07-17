# Credits pivot — Prompt 1/4 setup & test

Plumbing for pay-per-generation credits + Stripe. **No paywall / no generator
wiring yet** (that's Prompt 4). This delivers: the migration, `lib/credits.ts`,
`lib/stripe.ts` mappings, `POST /api/checkout`, and the extended
`POST /api/stripe/webhook`.

## 1. Stripe — create the prices (Test mode first, then Live)

Create these prices in the Stripe Dashboard (or CLI). Prices are immutable, so
the new 19€/mo unlimited is a **new** price — the old 17,99€ one stays untouched.

| Product   | Type              | Amount | Env var                  |
| --------- | ----------------- | ------ | ------------------------ |
| Pack 10   | One-time          | 4,90 € | `STRIPE_PRICE_PACK_10`   |
| Pack 50   | One-time          | 19 €   | `STRIPE_PRICE_PACK_50`   |
| Pack 200  | One-time          | 49 €   | `STRIPE_PRICE_PACK_200`  |
| Unlimited | Recurring monthly | 19 €   | `STRIPE_PRICE_UNLIMITED` |

- `STRIPE_PRICE_UNLIMITED` is **repointed** to the new 19€/mo price. The three
  legacy price ids (8,99 → pro, 17,99 → unlimited, 29,99 → promax) stay mapped
  to their real plans for webhook resolution only (hard-coded in `lib/stripe.ts`
  → `LEGACY_PRICE_IDS`; add the **production** ids there too if they differ from
  the test ones). None of them grant credits-unlimited.
- **No tax**: `automatic_tax` is disabled everywhere (franchise en base,
  art. 293 B CGI). Do not enable Stripe Tax.

## 2. Environment variables (Vercel + `.env.local`)

New:

```
STRIPE_PRICE_PACK_10=price_...
STRIPE_PRICE_PACK_50=price_...
STRIPE_PRICE_PACK_200=price_...
```

Changed:

```
STRIPE_PRICE_UNLIMITED=price_...   # repoint to the new 19€/mo recurring price
```

Already present, unchanged: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`STRIPE_PRICE_PRO`, `STRIPE_PRICE_PROMAX`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

⚠️ **Webhook domain**: register the Stripe webhook on the exact canonical prod
domain (`www.voxstel.com` vs `voxstel.com`). A mismatch causes a silent 308
redirect and dropped events.

## 3. Apply the migration

Deliver-file-only (not auto-applied). Run in the Supabase SQL editor:

- Up: `supabase/migrations/20260716_credits_system.sql`
- Down (rollback): `supabase/migrations/20260716_credits_system_down.sql`

After the up migration, verify the backfill:

```sql
select count(*) filter (where credits = 2) as at_two, count(*) as total from public.users;
-- expect at_two = total (15)
```

## 4. Local test with the Stripe CLI

```bash
# 1. Forward events to the local webhook (note the printed whsec_… → STRIPE_WEBHOOK_SECRET)
stripe listen --forward-to localhost:3000/api/stripe/webhook

# 2. In another shell, run the app
npm run dev
```

### Pack purchase (credits + idempotence)

The cleanest end-to-end test hits `POST /api/checkout` (needs an authenticated
session) and pays with Stripe's test card `4242 4242 4242 4242`. To exercise the
webhook + idempotence directly instead:

```bash
# Grab a real completed session id from a test checkout, then replay its event.
# Re-sending the SAME event id must NOT double the credits (idempotence).
stripe events resend <evt_id>
```

Verify:

```sql
-- +10 on the ledger, users.credits incremented by exactly 10
select delta, balance_after, reason, stripe_event_id
from public.credit_transactions order by created_at desc limit 3;

-- event recorded once, processed_at set
select event_id, type, processed_at from public.stripe_webhook_events order by received_at desc limit 3;
```

Resend the same event → **no** second `+10` row, balance unchanged.

### Subscription (unlimited)

Subscribe via `POST /api/checkout` with `{ "product": "unlimited" }` and the test
card. Then:

```sql
select subscription_status, subscription_price_id, subscription_current_period_end
from public.users where id = '<user_id>';
-- subscription_status = 'active', subscription_price_id = new unlimited price id
```

Cancel it (`stripe subscription cancel <sub_id>` or the Dashboard) →
`customer.subscription.deleted` → `subscription_status = 'canceled'`,
`subscription_price_id = null`.

### Credit service sanity (optional, via a scratch script or SQL)

```sql
-- 0-credit metered user → InsufficientCreditsError (deduct_credit returns NULL)
select public.deduct_credit('<user_with_0_credits>');   -- returns NULL

-- unlimited user is gated on the PRICE, not just status:
--   getBalance().unlimited === (status='active' AND price ∈ UNLIMITED_PRICE_IDS)
-- so the legacy pro/active subscriber is NOT treated as unlimited.
```

## Known follow-ups (out of scope for this prompt)

- `lib/pricing.ts` still lists `unlimited` at 17,99 — update to 19 with the
  pricing-page rework (Prompt 2–4). The webhook already reports the real Stripe
  amount for GA4/analytics, so conversions are correct in the meantime.
- The legacy `/pricing` UI may still surface an "unlimited" button pointing at
  the retired `/api/stripe/checkout` path (now returns `invalid_plan` for
  `unlimited`). Reworked in a later prompt.
- No paywall / no `deductCredit` wiring in the generator yet (Prompt 4).
