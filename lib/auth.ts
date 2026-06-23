// Server-only auth utilities — do not import in client components
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";

/** Server Supabase client — uses session cookies for RLS, call from server components / route handlers */
export function getAuthServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server components cannot set cookies — middleware handles the refresh
          }
        },
      },
    }
  );
}

/** Returns the currently authenticated user, or null */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = getAuthServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

/**
 * Idempotent — inserts the user row into public.users if it doesn't exist yet.
 * Uses the service role key so it bypasses RLS.
 * Called from the OAuth callback and (as fallback) from the signup form.
 */
export async function ensureUserRow(userId: string, email: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.from("users").upsert(
    {
      id: userId,
      email,
      plan: "free",
      quota_used: 0,
      quota_reset_date: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: true }
  );
}
