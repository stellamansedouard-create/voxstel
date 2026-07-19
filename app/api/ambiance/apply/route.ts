// INTERMEDIATE ambiance refine — never CHARGES anything.
// Reached only by the refine-and-subject flow, where the refined ambiance is
// not a delivery but a step feeding the (paid) subject. A refined ambiance that
// IS the delivered product goes through /api/deliver instead (paid). Raw copy
// of a page prompt never touches any API.
//
// It is free (no decrement) but NOT ungated: because this flow always ends in a
// paid subject delivery, a 0-credit user is walled off up front with a 402 so
// no engine call is burned for a run that can never complete. Checking the
// balance consumes nothing.
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getBalance } from "@/lib/credits";
import { refineAmbianceLayer } from "@/lib/ambiance-layer";
import type { AITool, Category } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const { category, tool, ambiancePrompt, answers } = (await req.json()) as {
      category: Category;
      tool: AITool;
      ambiancePrompt: string;
      answers: Record<string, string>;
    };

    if (!ambiancePrompt?.trim()) {
      return NextResponse.json({ error: "missing_ambiance" }, { status: 400 });
    }

    // Wall off a run that can never be delivered, before spending an engine
    // call. No decrement here — the charge happens once, on the subject.
    const { credits, unlimited } = await getBalance(user.id);
    if (!unlimited && credits < 1) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }

    const ambiance = await refineAmbianceLayer({
      category,
      tool,
      ambiancePrompt,
      answers: answers ?? {},
    });

    return NextResponse.json({ ambiance });
  } catch (error) {
    console.error("ambiance/apply error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'affinage" },
      { status: 500 }
    );
  }
}
