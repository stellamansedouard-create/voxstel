"use client";

import { useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGeneratorStore } from "@/store/useGeneratorStore";
import { getCategoryById, getToolById } from "@/lib/metadata";
import { getStoredUTM } from "@/lib/utm.client";
import ToolSelector from "@/components/generator/ToolSelector";
import FreeTextInput from "@/components/generator/FreeTextInput";
import PrecisionsScreen from "@/components/generator/PrecisionsScreen";
import PromptResult from "@/components/generator/PromptResult";
import Progress from "@/components/ui/Progress";
import Spinner from "@/components/ui/Spinner";
import type { AITool, Category, DirectQuestion, PrecisionCategory, PreviousQAItem } from "@/types";

interface GeneratorFlowProps {
  category: Category;
}

const MAX_REFINEMENTS = 5;
const PROGRESS_LABELS = ["Outil IA", "Description", "Précisions", "Résultat"];
const STEP_NUMBERS: Record<string, number> = {
  tool: 1,
  description: 2,
  adaptive: 3,
  result: 4,
};

export default function GeneratorFlow({ category }: GeneratorFlowProps) {
  const store = useGeneratorStore();
  const router = useRouter();
  const pathname = usePathname();
  const categoryMeta = getCategoryById(category);

  useEffect(() => {
    if (store.step === "category" || store.category !== category) {
      store.setCategory(category);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTool = useCallback(
    (tool: AITool) => store.setTool(tool),
    [store]
  );

  const handleDescriptionSubmit = useCallback(async () => {
    if (!store.description.trim() || !store.tool) return;
    store.setLoading(true);
    store.setError(null);

    try {
      const res = await fetch("/api/analyze-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: store.tool, category, description: store.description, usageContext: store.usageContext || undefined }),
      });
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!res.ok) throw new Error("analyze failed");

      const data: {
        questions: DirectQuestion[];
        categories: PrecisionCategory[];
        readyToGenerate: boolean;
      } = await res.json();

      const hasContent =
        (data.questions?.length ?? 0) > 0 || (data.categories?.length ?? 0) > 0;

      if (data.readyToGenerate || !hasContent) {
        await runGeneratePrompt({});
      } else {
        store.setAdaptiveData({
          directQuestions: data.questions ?? [],
          categories: data.categories ?? [],
        });
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
      const allAnswers = { ...store.directAnswers, ...store.adaptiveAnswers };
      await runGeneratePrompt(allAnswers);
    } catch {
      store.setError("Erreur lors de la génération. Veuillez réessayer.");
    } finally {
      store.setLoading(false);
    }
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

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
        ...store.categories
          .filter((c) => store.answeredCategories.includes(c.id))
          .map((c) => ({
            id: c.id,
            label: c.label,
            value: store.adaptiveAnswers[c.id] ?? "",
            type: "category" as const,
          })),
        // Also carry over previous refinement Q&A that were modified
        ...store.previousQA.filter(
          (prev) =>
            !store.directQuestions.some((q) => q.id === prev.id) &&
            !store.categories.some((c) => c.id === prev.id)
        ),
      ];

      const res = await fetch("/api/analyze-refinement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: store.tool,
          category,
          description: store.description,
          usageContext: store.usageContext || undefined,
          generatedPromptEn: store.generatedPrompt?.en ?? "",
          previousQA,
        }),
      });
      if (!res.ok) throw new Error("refinement analysis failed");

      const data: { questions: DirectQuestion[]; categories: PrecisionCategory[] } =
        await res.json();

      store.setRefinementData({
        previousQA,
        newDirectQuestions: data.questions ?? [],
        newCategories: data.categories ?? [],
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

  async function runGeneratePrompt(adaptiveAnswers: Record<string, string>) {
    // Collect selected reference aspects for the active category
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
        tool: store.tool,
        category,
        description: store.description,
        usageContext: store.usageContext || undefined,
        adaptiveAnswers,
        useSonnet: false,
        referenceAspects: referenceAspects.length ? referenceAspects : undefined,
        _tracking: getStoredUTM(),
      }),
    });
    if (res.status === 401) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!res.ok) throw new Error("generation failed");
    store.setGeneratedPrompt(await res.json());
  }

  if (!categoryMeta) return null;

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
              <Progress current={currentStep} total={4} labels={PROGRESS_LABELS} />
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
            {store.step === "tool" && (
              <ToolSelector category={categoryMeta} onSelect={handleSelectTool} />
            )}

            {store.step === "description" && toolMeta && (
              <FreeTextInput
                tool={toolMeta}
                category={category}
                value={store.description}
                onChange={store.setDescription}
                usageContext={store.usageContext}
                onUsageContextChange={store.setUsageContext}
                onSubmit={handleDescriptionSubmit}
                onBack={store.goBack}
              />
            )}

            {store.step === "adaptive" && (
              <PrecisionsScreen
                description={store.description}
                directQuestions={store.directQuestions}
                directAnswers={store.directAnswers}
                categories={store.categories}
                answeredCategories={store.answeredCategories}
                adaptiveAnswers={store.adaptiveAnswers}
                tool={store.tool!}
                generatorCategory={category}
                onDirectAnswer={store.setDirectAnswer}
                onAdaptiveAnswer={store.setAdaptiveAnswer}
                onMarkCategoryAnswered={store.markCategoryAnswered}
                onSubmit={handleAdaptiveSubmit}
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
