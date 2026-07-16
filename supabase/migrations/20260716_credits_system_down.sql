-- Down migration for 20260716_credits_system.sql. Run in the Supabase SQL
-- editor to fully revert the credits pivot plumbing.
--
-- Reverses to the pre-migration state: subscription_status back to a nullable
-- column with no default, Stripe columns and credit tables dropped, functions
-- dropped. It does NOT try to restore any 'none' values written to
-- subscription_status back to NULL (they are harmless).

drop function if exists public.grant_credits(uuid, integer, text, text, jsonb);
drop function if exists public.deduct_credit(uuid, text, jsonb);

drop table if exists public.stripe_webhook_events;
drop table if exists public.credit_transactions;

drop index if exists public.users_stripe_customer_id_key;

alter table public.users
  alter column subscription_status drop not null,
  alter column subscription_status drop default;

alter table public.users
  drop column if exists subscription_price_id,
  drop column if exists subscription_current_period_end,
  drop column if exists credits;
