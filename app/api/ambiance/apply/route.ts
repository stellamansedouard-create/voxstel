// Layer 1 delivery — free, ungated, never consumes anything.
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
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
