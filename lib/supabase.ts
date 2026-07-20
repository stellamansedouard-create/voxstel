import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

// Service role client — API routes that need admin access
export function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * The one browser auth client. Client components only.
 *
 * Memoised on purpose: a second GoTrueClient on the same storage key runs its
 * own autoRefreshToken timer, and Supabase rotates refresh tokens as
 * single-use — so two refreshers race and the loser invalidates the session.
 * Kept lazy rather than a module-level const because this module is also
 * imported by server code, where there is no cookie store to bind to.
 */
function makeBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let browserClient: ReturnType<typeof makeBrowserClient> | undefined;

export function createBrowserSupabaseClient() {
  if (!browserClient) browserClient = makeBrowserClient();
  return browserClient;
}
