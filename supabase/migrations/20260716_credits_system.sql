-- Credits pivot — Prompt 1/4: crédits à l'acte + Stripe (paiement).
-- Run once in the Supabase SQL editor. Additive and reversible
-- (see 20260716_credits_system_down.sql).
--
-- Adds a per-user credit balance + a credit ledger, extends the existing
-- Stripe columns on `users`, and adds a Stripe webhook idempotence table.
-- Credit mutations go through the deduct_credit / grant_credits functions
-- below (called by lib/credits.ts via the service role), never from the client.
--
-- NOTE on coexistence with the legacy subscription system:
--   `subscription_status` already exists and is written by the existing
--   webhook with RAW Stripe statuses (active | canceled | past_due |
--   trialing | ...). We do NOT add a CHECK constraint on it — that would
--   break those writes. The credits-"unlimited" signal is gated on the
--   subscription PRICE (subscription_price_id ∈ UNLIMITED_PRICE_IDS in
--   lib/stripe.ts), not on `subscription_status` alone, so an existing
--   legacy `pro`/`active` subscriber is NOT mistaken for unlimited.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- users: credit balance + extra Stripe columns
-- ---------------------------------------------------------------------------
alter table public.users
  add column if not exists credits integer not null default 2,
  add column if not exists subscription_current_period_end timestamptz,
  add column if not exists subscription_price_id text;

-- Existing rows are filled with the default (2) automatically by ADD COLUMN.
-- Belt-and-suspenders in case the column already existed from a partial run:
update public.users set credits = 2 where credits is null;

-- subscription_status already exists (nullable, no default). Give it the
-- spec's default and make it NOT NULL, without a CHECK (see note above).
update public.users set subscription_status = 'none' where subscription_status is null;
alter table public.users
  alter column subscription_status set default 'none',
  alter column subscription_status set not null;

-- stripe_customer_id must be unique (multiple NULLs are allowed by Postgres).
create unique index if not exists users_stripe_customer_id_key
  on public.users (stripe_customer_id);

-- ---------------------------------------------------------------------------
-- credit_transactions: append-only ledger of every balance change
-- ---------------------------------------------------------------------------
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  delta integer not null,                 -- + granted, - consumed, 0 for unlimited
  balance_after integer,                  -- null for unlimited (no decrement)
  reason text not null,                   -- signup_bonus | purchase_pack_10 | purchase_pack_50
                                          -- | purchase_pack_200 | generation
                                          -- | generation_unlimited | refund | admin_adjust
  stripe_event_id text,                   -- null if not tied to a Stripe event
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists credit_transactions_user_id_created_at_idx
  on public.credit_transactions (user_id, created_at desc);

-- Hard idempotency guarantee for Stripe-driven grants: a given event id can
-- grant at most once (partial — the ledger has many rows with a null event id).
create unique index if not exists credit_transactions_stripe_event_id_key
  on public.credit_transactions (stripe_event_id)
  where stripe_event_id is not null;

alter table public.credit_transactions enable row level security;

-- Read-only, own rows. No insert/update/delete policy: all writes go through
-- the service role (deduct_credit / grant_credits), which bypasses RLS.
drop policy if exists "Users can view their own credit transactions" on public.credit_transactions;
create policy "Users can view their own credit transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- stripe_webhook_events: idempotence for the webhook handler
-- ---------------------------------------------------------------------------
create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);

alter table public.stripe_webhook_events enable row level security;
-- No policies at all — only the service role (webhook) touches this table.

-- ---------------------------------------------------------------------------
-- Atomic credit mutation functions
-- ---------------------------------------------------------------------------

-- Guarded decrement: the credits > 0 check and the -1 are the SAME statement,
-- so two concurrent generations can never both succeed on a 1-credit balance.
-- Returns the new balance, or NULL when the balance was 0 (caller raises
-- InsufficientCreditsError). The unlimited path is handled in lib/credits.ts
-- (a delta-0 'generation_unlimited' row, no decrement) — it never calls this.
create or replace function public.deduct_credit(
  p_user_id uuid,
  p_reason text default 'generation',
  p_metadata jsonb default '{}'::jsonb
) returns integer
language plpgsql
set search_path = public
as $$
declare
  v_balance integer;
begin
  update public.users
     set credits = credits - 1
   where id = p_user_id and credits > 0
   returning credits into v_balance;

  if not found then
    return null;
  end if;

  insert into public.credit_transactions (user_id, delta, balance_after, reason, metadata)
  values (p_user_id, -1, v_balance, p_reason, coalesce(p_metadata, '{}'::jsonb));

  return v_balance;
end;
$$;

-- Idempotent grant. If p_stripe_event_id already produced a ledger row, this
-- is a no-op returning the current balance. The increment + ledger insert run
-- in one subtransaction, so a concurrent duplicate that trips the unique index
-- rolls back the increment too (no double credit). Returns the new balance,
-- or NULL if the user does not exist.
create or replace function public.grant_credits(
  p_user_id uuid,
  p_amount integer,
  p_reason text,
  p_stripe_event_id text default null,
  p_metadata jsonb default '{}'::jsonb
) returns integer
language plpgsql
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_stripe_event_id is not null and exists (
    select 1 from public.credit_transactions where stripe_event_id = p_stripe_event_id
  ) then
    select credits into v_balance from public.users where id = p_user_id;
    return v_balance;
  end if;

  begin
    update public.users
       set credits = credits + p_amount
     where id = p_user_id
     returning credits into v_balance;

    if not found then
      return null;
    end if;

    insert into public.credit_transactions
      (user_id, delta, balance_after, reason, stripe_event_id, metadata)
    values
      (p_user_id, p_amount, v_balance, p_reason, p_stripe_event_id, coalesce(p_metadata, '{}'::jsonb));
  exception when unique_violation then
    -- Concurrent duplicate for the same stripe_event_id — the increment above
    -- is rolled back with this subtransaction. Return the settled balance.
    select credits into v_balance from public.users where id = p_user_id;
  end;

  return v_balance;
end;
$$;

-- Only the service role may run these. An authenticated client is additionally
-- blocked by the users-table RLS (no UPDATE policy), but revoke defensively so
-- a logged-in user can never call grant_credits to top up their own balance.
revoke all on function public.deduct_credit(uuid, text, jsonb) from public;
revoke all on function public.grant_credits(uuid, integer, text, text, jsonb) from public;
grant execute on function public.deduct_credit(uuid, text, jsonb) to service_role;
grant execute on function public.grant_credits(uuid, integer, text, text, jsonb) to service_role;
