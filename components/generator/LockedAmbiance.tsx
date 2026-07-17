"use client";

import { useState } from "react";
import { getWording } from "@/lib/ambiance";
import type { Category } from "@/types";

interface LockedAmbianceProps {
  category: Category;
  ambiance: string;
}

/** Read-only reminder of the frozen layer, collapsed by default. */
export default function LockedAmbiance({ category, ambiance }: LockedAmbianceProps) {
  const [open, setOpen] = useState(false);
  const w = getWording(category);

  return (
    <div className="rounded-xl border border-border bg-card-hover overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-sm">🔒</span>
        <span className="text-sm font-medium text-foreground">
          {w.ambianceLabel} verrouillé{w.ambianceAgr}
        </span>
        <span className="text-xs text-muted ml-auto">
          {open ? "Masquer" : "Voir"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-border pt-3">
          <p className="text-xs text-foreground/80 leading-relaxed font-mono whitespace-pre-wrap">
            {ambiance}
          </p>
        </div>
      )}
    </div>
  );
}
