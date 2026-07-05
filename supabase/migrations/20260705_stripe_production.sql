-- Stripe production migration — run once in the Supabase SQL editor.
-- Adds Stripe customer/subscription tracking to `users` and a `subscriptions`
-- history table, kept in sync by app/api/stripe/webhook.

create extension if not exists pgcrypto;

alter table public.users
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists subscription_cancel_at timestamptz;

create index if not exists users_stripe_customer_id_idx
  on public.users (stripe_customer_id);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null unique,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx
  on public.subscriptions (user_id);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can view their own subscriptions" on public.subscriptions;
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- No insert/update/delete policy — writes go through the service role key
-- (app/api/stripe/webhook), which bypasses RLS entirely.
