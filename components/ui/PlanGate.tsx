"use client";

import Link from "next/link";
import { useUserPlan } from "@/hooks/useUserPlan";
import type { PricingPlan } from "@/types";

const PLAN_ORDER: PricingPlan[] = ["free", "pro", "unlimited", "promax"];

interface PlanGateProps {
  plan: PricingPlan;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PlanGate({ plan, children, fallback }: PlanGateProps) {
  const { plan: userPlan, isLoading } = useUserPlan();

  if (isLoading) return null;

  const requiredIndex = PLAN_ORDER.indexOf(plan);
  const currentIndex = PLAN_ORDER.indexOf(userPlan ?? "free");

  if (currentIndex >= requiredIndex) return <>{children}</>;

  if (fallback !== undefined) return <>{fallback}</>;

  return (
    <div className="mt-4">
      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent transition-colors group"
      >
        <span className="w-7 h-7 rounded-lg border border-dashed border-border bg-white flex items-center justify-center text-muted/40 text-[11px] group-hover:border-accent/40 transition-colors">
          🔒
        </span>
        Disponible à partir du plan Illimité
      </Link>
    </div>
  );
}
