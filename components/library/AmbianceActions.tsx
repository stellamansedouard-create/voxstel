"use client";

// The three entry points from a library page into the generator.
import { useRouter } from "next/navigation";
import { FLOW_ORDER, getFlowDescription, getFlowLabel } from "@/lib/ambiance";
import { writeHandoff } from "@/lib/ambiance-handoff";
import type { LibraryButton, LibraryPage } from "@/lib/library";
import type { AmbianceFlow } from "@/types";

interface AmbianceActionsProps {
  page: LibraryPage;
  /**
   * One line of microcopy beside the subject buttons. Placeholder wording for
   * now — final copy comes later, and it must never mention a price.
   */
  microcopy?: string;
}

/**
 * A page's own buttons win; a page without any falls back to the generic
 * per-category labels. Either way the flows are the same three — the label is
 * copy, the flow is behaviour.
 */
function resolveButtons(page: LibraryPage): LibraryButton[] {
  if (page.buttons?.length) return page.buttons;
  return FLOW_ORDER.map((flow) => ({
    label: getFlowLabel(flow, page.category),
    flow,
  }));
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

  const buttons = resolveButtons(page);
  const fomo = microcopy ?? page.fomoMicrocopy;

  // The subject is what the buttons are here to sell, so the last button that
  // reaches it leads. A page with only refine-ambiance buttons has no primary.
  const primaryIndex = buttons.reduce(
    (last, b, i) => (b.flow === "refine-ambiance" ? last : i),
    -1
  );

  return (
    <div className="space-y-3">
      {buttons.map((button, i) => {
        const isPrimary = i === primaryIndex;

        return (
          <div key={`${button.flow}-${i}`}>
            <button
              type="button"
              onClick={() => start(button.flow)}
              className={
                isPrimary
                  ? "btn-primary w-full flex flex-col items-center gap-0.5 py-3.5"
                  : "w-full flex flex-col items-start gap-0.5 px-5 py-3.5 rounded-xl border border-border bg-white text-left hover:border-accent hover:bg-accent/5 transition-all duration-150"
              }
            >
              <span className="text-sm font-medium">{button.label}</span>
              <span
                className={`text-xs font-normal ${
                  isPrimary ? "text-white/70" : "text-muted"
                }`}
              >
                {getFlowDescription(button.flow, page.category)}
              </span>
            </button>

            {isPrimary && fomo && (
              <p className="text-xs text-muted mt-1.5 px-1">{fomo}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
