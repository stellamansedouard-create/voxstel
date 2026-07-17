"use client";

// The three entry points from a library page into the generator.
import { useRouter } from "next/navigation";
import { FLOW_ORDER, getFlowDescription, getFlowLabel } from "@/lib/ambiance";
import { writeHandoff } from "@/lib/ambiance-handoff";
import type { LibraryPage } from "@/lib/library";
import type { AmbianceFlow } from "@/types";

interface AmbianceActionsProps {
  page: LibraryPage;
  /**
   * One line of microcopy beside the subject buttons. Placeholder wording for
   * now — final copy comes later, and it must never mention a price.
   */
  microcopy?: string;
}

export default function AmbianceActions({ page, microcopy }: AmbianceActionsProps) {
  const router = useRouter();

  function start(flow: AmbianceFlow) {
    writeHandoff({
      category: page.category,
      tool: page.tool,
      ambiancePrompt: page.ambiancePrompt,
      flow,
      pageSlug: page.slug,
      pageTitle: page.title,
    });
    router.push(`/generate/${page.category}`);
  }

  const fomo = microcopy ?? page.fomoMicrocopy;

  return (
    <div className="space-y-3">
      {FLOW_ORDER.map((flow) => {
        const isPrimary = flow === "refine-and-subject";
        const showFomo = flow !== "refine-ambiance" && Boolean(fomo);

        return (
          <div key={flow}>
            <button
              type="button"
              onClick={() => start(flow)}
              className={
                isPrimary
                  ? "btn-primary w-full flex flex-col items-center gap-0.5 py-3.5"
                  : "w-full flex flex-col items-start gap-0.5 px-5 py-3.5 rounded-xl border border-border bg-white text-left hover:border-accent hover:bg-accent/5 transition-all duration-150"
              }
            >
              <span className="text-sm font-medium">
                {getFlowLabel(flow, page.category)}
              </span>
              <span
                className={`text-xs font-normal ${
                  isPrimary ? "text-white/70" : "text-muted"
                }`}
              >
                {getFlowDescription(flow, page.category)}
              </span>
            </button>

            {showFomo && (
              <p className="text-xs text-muted mt-1.5 px-1">{fomo}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
