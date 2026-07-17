// Layer 1 — the ambiance. Free, reusable, never consumes anything.
//
// Takes the library page's ambiance prompt plus the user's refining answers and
// returns the refined ambiance. Refining stays strictly inside this layer: it
// may not drift into subject territory, which layer 2 owns.
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getWording, parseAmbianceBlocks } from "@/lib/ambiance";
import type { AITool, Category } from "@/types";

export interface RefineAmbianceParams {
  category: Category;
  tool: AITool;
  /** The library page prompt being refined. */
  ambiancePrompt: string;
  /** Question label -> answer, from the refining round. */
  answers: Record<string, string>;
}

/**
 * Applies the user's answers to the ambiance prompt, preserving its shape.
 * If nothing was answered the prompt is returned untouched — no model call.
 */
export async function refineAmbianceLayer({
  category,
  tool,
  ambiancePrompt,
  answers,
}: RefineAmbianceParams): Promise<string> {
  const applied = Object.entries(answers)
    .filter(([, v]) => v?.trim())
    .map(([k, v]) => `- ${k} : ${v}`)
    .join("\n");

  if (!applied) return ambiancePrompt;

  const toolMeta = getToolById(category, tool);
  const toolName = toolMeta?.name ?? tool;
  const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;
  const w = getWording(category);
  const hasBlocks = parseAmbianceBlocks(ambiancePrompt).length > 0;

  const message = await anthropic.messages.create({
    model: MODELS.haiku,
    max_tokens: 1500,
    system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte technique : ${promptContext}

Tu reçois un prompt ${w.ambiance === "le style" ? "de style" : "d'ambiance"} et les arbitrages de l'utilisateur. Applique-les et renvoie le prompt mis à jour.

RÈGLES ABSOLUES :
- Conserve la STRUCTURE d'origine à l'identique${hasBlocks ? " : mêmes blocs nommés, même ordre, aucun bloc ajouté ni supprimé" : ""}. Tu ajustes des valeurs, tu ne réécris pas le prompt.
- Ne change QUE ce que les arbitrages touchent. Tout le reste est repris mot pour mot.
- Reste sur la couche ${w.ambiance}. N'introduis ${
      category === "music"
        ? "aucun thème, aucune histoire, aucune parole"
        : "aucun sujet, aucun personnage, rien de ce qui serait représenté"
    } — cette couche est traitée séparément.
- Garde la langue d'origine du prompt.

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{ "ambiance": "le prompt mis à jour" }`,
    messages: [
      {
        role: "user",
        content: `Prompt d'origine :
"""
${ambiancePrompt}
"""

Arbitrages de l'utilisateur :
${applied}

Renvoie le prompt mis à jour.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  try {
    const cleaned = content.text
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "");
    const parsed = JSON.parse(cleaned) as { ambiance?: string };
    return parsed.ambiance?.trim() || ambiancePrompt;
  } catch {
    // Never lose the user's ambiance to a parse error — fall back to the
    // prompt they picked, which is still a usable free layer.
    console.error(
      "[refineAmbianceLayer] Failed to parse JSON. Raw:",
      content.text.slice(0, 500)
    );
    return ambiancePrompt;
  }
}
