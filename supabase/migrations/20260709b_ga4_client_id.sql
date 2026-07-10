-- GA4 Measurement Protocol pivot — run once in the Supabase SQL editor.
-- Captures the GA4 client_id (from the _ga cookie, see lib/utm.client.ts's
-- captureGA4ClientId) alongside the existing UTM/gclid columns on `users`.
-- Needed to stitch the server-side "purchase" event (app/api/stripe/webhook,
-- via lib/ga4-conversion.ts) back to the browser session GA4 already knows.

alter table public.users
  add column if not exists ga_client_id text;
