import { NextRequest, NextResponse } from "next/server";
import { anthropic, MODELS } from "@/lib/anthropic";
import { getToolById } from "@/lib/metadata";
import { getUseCaseById } from "@/lib/usecases";
import { getCurrentUser } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { assertCanGenerate, chargeAndRecord } from "@/lib/deliver";
import { InsufficientCreditsError } from "@/lib/credits";
import type { AITool, Category, GeneratedPrompt, ImageAspect } from "@/types";

interface TrackingPayload {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referrer?: string;
  session_id?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tool, category, useCase, description, usageContext, adaptiveAnswers, useSonnet, referenceAspects, _tracking } =
      await req.json() as {
        tool: AITool;
        category: string;
        useCase?: string;
        description: string;
        usageContext?: string;
        adaptiveAnswers: Record<string, string>;
        useSonnet?: boolean;
        referenceAspects?: ImageAspect[];
        _tracking?: TrackingPayload;
      };

    // Auth + quota check — must run before calling Anthropic
    const user = await getCurrentUser().catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Credits pre-check — same gate as the library journey (lib/deliver.ts):
    // read the balance BEFORE any Anthropic call. 0 credits (non-unlimited)
    // throws InsufficientCreditsError -> mapped to 402 in the catch below.
    // The classic generator now runs on credits, not the legacy monthly quota.
    await assertCanGenerate(user.id);

    const model = useSonnet ? MODELS.sonnet : MODELS.haiku;
    const toolMeta = getToolById(category, tool);
    const toolName = toolMeta?.name ?? tool;
    const promptContext = toolMeta?.promptContext ?? `Outil IA : ${tool}`;

    const useCaseMeta = useCase ? getUseCaseById(category, useCase) : undefined;
    const useCaseSystemBlock = useCaseMeta?.promptGuidance
      ? `\n\nType de création : ${useCaseMeta.label}. Consigne spécifique à ce type : ${useCaseMeta.promptGuidance}`
      : useCaseMeta
        ? `\n\nType de création : ${useCaseMeta.label}. Assure-toi que le prompt est cohérent avec ce type précis.`
        : "";

    const extras = Object.entries(adaptiveAnswers)
      .filter(([, v]) => v?.trim())
      .map(([k, v]) => `- ${k} : ${v}`)
      .join("\n");

    const selectedAspects = (referenceAspects ?? []).filter((a) => a?.label && a?.description);
    const referenceSection = selectedAspects.length
      ? `\nRéférence — aspects à intégrer dans le prompt :\n${selectedAspects
          .map((a) => `- ${a.label} : ${a.description}`)
          .join("\n")}`
      : "";

    const outputLanguageRule =
      category === "text" || category === "music"
        ? `\n\nRègle sur la langue de sortie du contenu généré : sauf indication contraire explicite de l'utilisateur (ex. "en anglais", "pour un client anglophone/US", "cible internationale", ou un texte déjà rédigé par l'utilisateur dans une autre langue), le contenu que ${toolName} doit produire est attendu en français par défaut. Ajoute une ligne explicite et distincte dans le prompt généré (ex. "Language: French" ou "Réponds en français", selon le style de structuration utilisé pour ${toolName}) indiquant la langue de sortie attendue — ne la noie pas dans le texte libre descriptif. Si l'utilisateur a explicitement indiqué une autre langue de sortie, respecte ce choix à la place et indique cette langue-là. Cette règle porte sur la langue du contenu que ${toolName} va générer, pas sur la langue du texte littéral déjà fourni par l'utilisateur (slogans, citations — voir règle ci-dessus).`
        : "";

    const message = await anthropic.messages.create({
      model,
      max_tokens: 3000,
      system: `Tu es un expert en prompt engineering pour l'IA "${toolName}".

Contexte technique : ${promptContext}${useCaseSystemBlock}

Crée un prompt professionnel, complet et directement utilisable dans ${toolName}.
Le prompt EN doit être riche, détaillé, et respecter la syntaxe exacte de ${toolName}.

Règle impérative sur le texte littéral : si l'utilisateur a fourni un texte destiné à apparaître tel quel dans le résultat (slogan, citation, titre exact, nom de marque, paroles de chanson, texte à afficher sur une image ou une vidéo — typiquement introduit entre guillemets ou par une formulation du type "avec le texte...", "qui dit...", "les paroles..."), ce texte doit être reproduit strictement à l'identique, dans sa langue et sa formulation d'origine, entre guillemets dans le prompt généré (y compris dans le champ "en"). Ne le traduis JAMAIS et ne le reformule JAMAIS, même si le reste du prompt "en" est rédigé en anglais. Seul le contenu librement descriptif (contexte, style, ambiance, instructions techniques) doit être traduit/rédigé en anglais dans le champ "en".${outputLanguageRule}

Réponds UNIQUEMENT avec du JSON valide, sans markdown :
{
  "en": "Prompt complet en anglais pour ${toolName}...",
  "fr": "Traduction française naturelle du prompt..."
}`,
      messages: [
        {
          role: "user",
          content: `Génère un prompt ${toolName}.

Description : "${description}"
${usageContext ? `\nContexte d'usage : ${usageContext}` : ""}${extras ? `\nPrécisions :\n${extras}` : ""}${referenceSection}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    let result: GeneratedPrompt;
    try {
      const cleaned = content.text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      result = JSON.parse(cleaned);
    } catch {
      console.error(
        "[generate-prompt] Failed to parse JSON. Raw response:",
        content.text.slice(0, 1000)
      );
      throw new Error("Failed to parse prompt JSON");
    }

    // Charge 1 credit + write prompts_history as one logical unit — the same
    // chargeAndRecord() the library journey uses (lib/deliver.ts). No layer /
    // source_page here (single blank-field prompt), so questions_answers stays
    // NULL, exactly as the previous raw insert left it. A failed history write
    // refunds the credit inside chargeAndRecord. historyId comes back so the
    // client can later mark this exact row was_copied=true (see
    // app/api/prompts/mark-copied) — that write-path didn't exist before
    // 22/07/2026, which is why was_copied was always false in practice.
    const { historyId } = await chargeAndRecord({
      userId: user.id,
      category: category as Category,
      tool,
      promptEn: result.en,
      promptFr: result.fr ?? null,
    });

    // Analytics — fire-and-forget
    void trackEvent({
      userId: user?.id ?? null,
      eventType: "prompt_generated",
      promptCategory: category,
      utmSource: _tracking?.utm_source ?? null,
      utmMedium: _tracking?.utm_medium ?? null,
      utmCampaign: _tracking?.utm_campaign ?? null,
      referrer: _tracking?.referrer ?? null,
      sessionId: _tracking?.session_id ?? null,
    }).catch((e) => console.error("[analytics]", e));

    return NextResponse.json({ ...result, historyId });
  } catch (error) {
    // 0 credits — from the pre-check, or lost to a concurrent generation at
    // charge time. Same 402 signal the library journey returns, so the front
    // shows the same paywall.
    if (error instanceof InsufficientCreditsError) {
      return NextResponse.json({ error: "insufficient_credits" }, { status: 402 });
    }
    console.error("generate-prompt error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du prompt" },
      { status: 500 }
    );
  }
}
