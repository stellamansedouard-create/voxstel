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

  // No visual hierarchy between the three: they are equivalent, and which one
  // fits depends on what the user actually needs. Singling one out with a solid
  // fill reads as "this is the better choice", which is false. Brand colour
  // stays via the gold liseré carried by ALL three, never by one.
  return (
    <div className="space-y-3">
      {buttons.map((button, i) => (
        <div key={`${button.flow}-${i}`}>
          <button
            type="button"
            onClick={() => start(button.flow)}
            className="relative w-full flex flex-col items-start gap-0.5 px-5 py-3.5 rounded-xl border border-border bg-white text-left overflow-hidden hover:border-accent hover:bg-accent/5 transition-all duration-150"
          >
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-1"
              style={{ backgroundColor: "#C8910A" }}
            />
            <span className="text-sm font-medium">{button.label}</span>
            <span className="text-xs font-normal text-muted">
              {getFlowDescription(button.flow, page.category)}
            </span>
          </button>

          {i === buttons.length - 1 && fomo && (
            <p className="text-xs text-muted mt-1.5 px-1">{fomo}</p>
          )}
        </div>
      ))}
    </div>
  );
}
