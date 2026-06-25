"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import type { PricingPlan } from "@/types";

export interface UserPlanState {
  plan: PricingPlan | null;
  isLoading: boolean;
}

/**
 * Fetches the current user's plan from the `users` table.
 * Returns null plan while unauthenticated or while loading.
 * Relies on the Supabase RLS policy allowing SELECT on users for auth.uid() = id.
 */
export function useUserPlan(): UserPlanState {
  const [state, setState] = useState<UserPlanState>({ plan: null, isLoading: true });

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ plan: null, isLoading: false });
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single();

      setState({
        plan: (data?.plan as PricingPlan | undefined) ?? "free",
        isLoading: false,
      });
    }

    load().catch(() => setState({ plan: null, isLoading: false }));
  }, []);

  return state;
}
