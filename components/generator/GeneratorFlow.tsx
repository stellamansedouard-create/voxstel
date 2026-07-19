"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGeneratorStore } from "@/store/useGeneratorStore";
import { getCategoryById, getToolById } from "@/lib/metadata";
import { getStoredUTM } from "@/lib/utm.client";
import { consumeHandoff } from "@/lib/ambiance-handoff";
import LibraryJourney from "@/components/generator/LibraryJourney";
import Paywall from "@/components/generator/Paywall";
import ToolSelector from "@/components/generator/ToolSelector";
import UseCaseSelector from "@/components/generator/UseCaseSelector";
import FreeTextInput from "@/components/generator/FreeTextInput";
import PrecisionsScreen from "@/components/generator/PrecisionsScreen";
import PromptResult from "@/components/generator/PromptResult";
import Progress from "@/components/ui/Progress";
import Spinner from "@/components/ui/Spinner";
import type { AITool, Category, DirectQuestion, PreviousQAItem } from "@/types";

interface GeneratorFlowProps {
  category: Category;
}

const MAX_REFINEMENTS = 5;
const PROGRESS_LABELS = ["Type", "Outil IA", "Description", "Précisions", "Résultat"];
const PROGRESS_TOTAL = PROGRESS_LABELS.length;
const STEP_NUMBERS: Record<string, number> = {
  usecase: 1,
  tool: 2,
  description: 3,
  adaptive: 4,
  result: 5,
};

export default function GeneratorFlow({ category }: GeneratorFlowProps) {
  const store = useGeneratorStore();
  const router = useRouter();
  const pathname = usePathname();
  const categoryMeta = getCategoryById(category);
  const didInitRef = useRef(false);
  // Set when /api/generate-prompt returns 402 (0 credits). The store state
  // (step + answers) is untouched, so backing out restores the run in place.
  const [paywalled, setPaywalled] = useState(false);

  useEffect(() => {
    // Runs once per mount. StrictMode invokes effects twice and the handoff is
    // consume-once, so without this the second pass would fall through to the
    // blank-field branch and knock the seeded run off its step.
    if (didInitRef.current) return;
    didInitRef.current = true;

    // Seeded from a library page — takes precedence over the blank-field flow.
    const handoff = consumeHandoff();
    if (handoff && handoff.category === category) {
      store.startFromLibrary(handoff);
      return;
    }

    // Reached the generator without a handoff: any journey left in the store is
    // from a previous run and must not resurface here.
    if (useGeneratorStore.getState().ambiance) {
      store.reset();
      store.setCategory(category);
      return;
    }

    // After login redirect: replay analyze-description automatically with saved values
    const pendingRaw = localStorage.getItem("vx_pending_description");
    if (pendingRaw) {
      try {
        const pending = JSON.parse(pendingRaw) as {
          useCase: string | null;
          tool: AITool;
          description: string;
          usageContext: string;
        };
        localStorage.removeItem("vx_pending_description");
        // Restore visible state (spinner + description pre-filled)
        store.restoreState({
          category,
          useCase: pending.useCase ?? null,
          tool: pending.tool,
          description: pending.description,
          usageContext: pending.usageContext,
          step: "description",
          isLoading: true,
          error: null,
        });
        // Auto-replay using pending values directly — avoids stale store closure
        autoAnalyzeAndAdvance(pending);
        return;
      } catch {
        localStorage.removeItem("vx_pending_description");
      }
    }
    if (store.step === "category" || store.category !== category) {
      store.setCategory(category);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectUseCase = useCallback(
    (useCaseId: string) => store.setUseCase(useCaseId),
    [store]
  );

  const handleSelectTool = useCallback(
    (tool: AITool) => store.setTool(tool),
    [store]
  );

  // Entry pre-gate, mirroring the library journey: at 0 credits, wall off
  // BEFORE the question engine (/api/analyze-description) spends an Anthropic
  // call. Read-only. Fails open on a read error so a transient blip can't block
  // a paying user — the server-side gate on /api/generate-prompt still enforces.
  const outOfCredits = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/credits/balance");
      if (res.ok) {
        const bal = (await res.json()) as { credits: number; unlimited: boolean };
        return !bal.unlimited && bal.credits < 1;
      }
    } catch {
      // network hiccup -> fall through, server gate still protects generation
    }
    return false;
  }, []);

  const handleDescriptionSubmit = useCallback(async () => {
    if (!store.description.trim() || !store.tool) return;
    store.setLoading(true);
    store.setError(null);

    if (await outOfCredits()) {
      setPaywalled(true);
      store.setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/analyze-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: store.tool, category, useCase: store.useCase || undefined, description: store.description, usageContext: store.usageContext || undefined }),
      });
      if (res.status === 401) {
        localStorage.setItem("vx_pending_description", JSON.stringify({
          useCase: store.useCase,
          tool: store.tool,
          description: store.description,
          usageContext: store.usageContext,
        }));
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!res.ok) throw new Error("analyze failed");

      const data: {
        questions: DirectQuestion[];
        readyToGenerate: boolean;
      } = await res.json();

      const hasContent = (data.questions?.length ?? 0) > 0;

      if (data.readyToGenerate || !hasContent) {
        await runGeneratePrompt({});
      } else {
        store.setAdaptiveData({ directQuestions: data.questions ?? [] });
      }
    } catch {
      store.setError("Erreur lors de l'analyse. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }, [store, category]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdaptiveSubmit = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const allAnswers = { ...store.directAnswers, ...store.refinePrecisionAnswers };
      await runGeneratePrompt(allAnswers);
    } catch {
      store.setError("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefinePrecision = useCallback(async () => {
    store.setLoading(true);
    store.setError(null);
    try {
      const previousQA = store.directQuestions.map((q) => ({
        question: q.label,
        theme: q.theme ?? "",
        answer: store.directAnswers[q.id] ?? "",
      }));

      const res = await fetch("/api/refine-precision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: store.tool,
          category,
          useCase: store.useCase || undefined,
          description: store.description,
          usageContext: store.usageContext || undefined,
          previousQA,
        }),
      });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!res.ok) throw new Error("refine-precision failed");

      const data: { questions: DirectQuestion[] } = await res.json();
      store.setRefinePrecisionData(data.questions ?? []);
    } catch {
      store.setError("Erreur lors de l'affinage. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }, [store, category]); // eslint-disable-line react-hooks/exhaustive-deps

  // "Renforcer" — async: calls analyze-refinement with full context, then shows editable PrecisionsScreen
  const handleRenforce = useCallback(async () => {
    if (store.refinementCount >= MAX_REFINEMENTS) return;
    store.setLoading(true);
    store.setError(null);

    try {
      // Build previousQA from everything answered in the current session
      const previousQA: PreviousQAItem[] = [
        ...store.directQuestions
          .filter((q) => store.directAnswers[q.id])
          .map((q) => ({
            id: q.id,
            label: q.label,
            value: store.directAnswers[q.id],
            type: "direct" as const,
          })),
        // Also carry over previous refinement Q&A that were modified
        ...store.previousQA.filter(
          (prev) => !store.directQuestions.some((q) => q.id === prev.id)
        ),
      ];

      const res = await fetch("/api/analyze-refinement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: store.tool,
          category,
          useCase: store.useCase || undefined,
          description: store.description,
          usageContext: store.usageContext || undefined,
          generatedPromptEn: store.generatedPrompt?.en ?? "",
          previousQA,
        }),
      });
      if (!res.ok) throw new Error("refinement analysis failed");

      const data: { questions: DirectQuestion[] } = await res.json();

      store.setRefinementData({
        previousQA,
        newDirectQuestions: data.questions ?? [],
      });
    } catch {
      store.setError("Erreur lors de l'analyse de renforcement. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }, [store, category]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRecommencer = useCallback(() => {
    store.restartDescription();
  }, [store]);

  // explicit overrides allow calling this safely from useEffect closures with stale store snapshots
  async function runGeneratePrompt(
    adaptiveAnswers: Record<string, string>,
    explicit?: { tool: AITool; description: string; usageContext: string }
  ) {
    const tool = explicit?.tool ?? store.tool;
    const description = explicit?.description ?? store.description;
    const usageContext = explicit?.usageContext ?? store.usageContext;

    let referenceAspects: import("@/types").ImageAspect[] = [];
    if (category === "image" && store.imageReference) {
      referenceAspects = store.imageReference.aspects.filter((a) =>
        store.imageReference!.selectedAspectIds.includes(a.id)
      );
    } else if (category === "text" && store.textReference) {
      referenceAspects = store.textReference.aspects.filter((a) =>
        store.textReference!.selectedAspectIds.includes(a.id)
      );
    }

    const res = await fetch("/api/generate-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tool,
        category,
        useCase: store.useCase || undefined,
        description,
        usageContext: usageContext || undefined,
        adaptiveAnswers,
        useSonnet: false,
        referenceAspects: referenceAspects.length ? referenceAspects : undefined,
        _tracking: getStoredUTM(),
      }),
    });
    if (res.status === 401) {
      localStorage.setItem("vx_pending_description", JSON.stringify({ useCase: store.useCase, tool, description, usageContext }));
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    // 0 credits — same 402 the library journey returns. Show the paywall
    // instead of a generic error; the in-progress run is preserved.
    if (res.status === 402) {
      setPaywalled(true);
      return;
    }
    if (!res.ok) throw new Error("generation failed");
    store.setGeneratedPrompt(await res.json());
  }

  // Called on mount when returning from login — uses pending values directly to avoid stale closure
  async function autoAnalyzeAndAdvance(pending: { useCase?: string | null; tool: AITool; description: string; usageContext: string }) {
    if (await outOfCredits()) {
      setPaywalled(true);
      store.setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/analyze-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: pending.tool,
          category,
          useCase: pending.useCase || undefined,
          description: pending.description,
          usageContext: pending.usageContext || undefined,
        }),
      });
      if (res.status === 401) {
        // Replay ran before the session was actually established — re-save
        // the draft and send back to login instead of dead-ending on an error.
        localStorage.setItem("vx_pending_description", JSON.stringify(pending));
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!res.ok) throw new Error("analyze failed");

      const data: { questions: DirectQuestion[]; readyToGenerate: boolean } =
        await res.json();

      const hasContent = (data.questions?.length ?? 0) > 0;

      if (data.readyToGenerate || !hasContent) {
        await runGeneratePrompt({}, pending);
      } else {
        store.setAdaptiveData({ directQuestions: data.questions ?? [] });
      }
    } catch {
      store.setError("Erreur lors de l'analyse. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }

  if (!categoryMeta) return null;

  // 0 credits: the paywall replaces the flow, the run is kept in the store so
  // backing out lands the user right back where they were.
  if (paywalled) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Paywall onBack={() => setPaywalled(false)} />
        </div>
      </div>
    );
  }

  // Library-seeded run: the ambiance/subject journey replaces the step flow.
  if (store.ambiance) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-20">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            ← Changer de catégorie
          </a>
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">{categoryMeta.icon}</span>
            <h1 className="text-xl font-bold text-foreground">
              Générateur — {categoryMeta.label}
            </h1>
          </div>
          <LibraryJourney category={category} />
        </div>
      </div>
    );
  }

  const currentStep = STEP_NUMBERS[store.step] ?? 1;
  const toolMeta = store.tool ? getToolById(category, store.tool) : null;
  const refinementsLeft = MAX_REFINEMENTS - store.refinementCount;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-20">

        {/* Navigation + progress */}
        <div className="mb-8">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            ← Changer de catégorie
          </a>

          {store.step !== "result" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{categoryMeta.icon}</span>
                <h1 className="text-xl font-bold text-foreground">
                  Générateur — {categoryMeta.label}
                </h1>
                {toolMeta && (
                  <span className="text-sm text-muted">/ {toolMeta.name}</span>
                )}
              </div>
              <Progress current={currentStep} total={PROGRESS_TOTAL} labels={PROGRESS_LABELS} />
            </>
          )}
        </div>

        {/* Error banner */}
        {store.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-red-500 flex-shrink-0 mt-0.5">⚠</span>
            <div>
              <p className="text-sm text-red-700">{store.error}</p>
              <button
                onClick={() => store.setError(null)}
                className="text-xs text-red-500 underline hover:no-underline mt-1"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Global loading */}
        {store.isLoading && (
          <div className="flex items-center justify-center py-20">
            <Spinner
              size="lg"
              label={
                store.step === "description"
                  ? "Voxstel analyse votre description..."
                  : store.step === "result"
                  ? "Recherche de nouvelles pistes..."
                  : "Génération de votre prompt..."
              }
            />
          </div>
        )}

        {/* Steps */}
        {!store.isLoading && (
          <>
            {store.step === "usecase" && (
              <UseCaseSelector category={categoryMeta} onSelect={handleSelectUseCase} />
            )}

            {store.step === "tool" && (
              <ToolSelector category={categoryMeta} onSelect={handleSelectTool} />
            )}

            {store.step === "description" && toolMeta && (
              <FreeTextInput
                tool={toolMeta}
                category={category}
                value={store.description}
                onChange={store.setDescription}
                onSubmit={handleDescriptionSubmit}
                onBack={store.goBack}
              />
            )}

            {store.step === "adaptive" && (
              <PrecisionsScreen
                description={store.description}
                directQuestions={store.directQuestions}
                directAnswers={store.directAnswers}
                tool={store.tool!}
                generatorCategory={category}
                onDirectAnswer={store.setDirectAnswer}
                onRefinePrecisionAnswer={store.setRefinePrecisionAnswer}
                onSubmit={handleAdaptiveSubmit}
                onRefinePrecision={handleRefinePrecision}
                onBack={store.goBack}
                isSubmitting={store.isLoading}
              />
            )}

            {store.step === "result" && store.generatedPrompt && store.tool && (
              <PromptResult
                key={store.generatedPrompt.en}
                prompt={store.generatedPrompt}
                tool={store.tool}
                refinementsLeft={refinementsLeft}
                onRestart={() => {
                  store.reset();
                  store.setCategory(category);
                }}
                onRenforce={handleRenforce}
                onRecommencer={handleRecommencer}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
