-- Google Ads pivot — run once in the Supabase SQL editor.
-- Captures the Google Click ID alongside the existing UTM columns on `users`,
-- needed to attribute the server-side "Achat" offline conversion (see
-- app/api/stripe/webhook) back to the ad click that drove the signup.

alter table public.users
  add column if not exists gclid text;
