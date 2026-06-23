"use client";

import { useGeneratorStore } from "@/store/useGeneratorStore";
import type { DirectQuestion, PrecisionCategory, AITool, Category } from "@/types";
import DirectQuestions from "./DirectQuestions";
import CategorySelector from "./CategorySelector";
import ReferenceUpload from "./ReferenceUpload";

interface PrecisionsScreenProps {
  description: string;
  directQuestions: DirectQuestion[];
  directAnswers: Record<string, string>;
  categories: PrecisionCategory[];
  answeredCategories: string[];
  adaptiveAnswers: Record<string, string>;
  tool: AITool;
  generatorCategory: Category;
  onDirectAnswer: (id: string, value: string) => void;
  onAdaptiveAnswer: (id: string, value: string) => void;
  onMarkCategoryAnswered: (id: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function PrecisionsScreen({
  description,
  directQuestions,
  directAnswers,
  categories,
  answeredCategories,
  adaptiveAnswers,
  tool,
  generatorCategory,
  onDirectAnswer,
  onAdaptiveAnswer,
  onMarkCategoryAnswered,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PrecisionsScreenProps) {
  const { isRefinement, previousQA } = useGeneratorStore();

  const hasDirectQuestions = directQuestions.length > 0;
  const hasCategories = categories.length > 0;
  const hasPreviousQA = isRefinement && previousQA.length > 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Description figée */}
      <div className="flex gap-3 bg-card-hover border border-border rounded-xl px-4 py-3.5">
        <span className="text-2xl text-border leading-none select-none mt-0.5 flex-shrink-0">&ldquo;</span>
        <p className="text-sm text-foreground leading-relaxed line-clamp-4 italic">{description}</p>
      </div>

      {/* Réponses précédentes modifiables (mode Renforcer) */}
      {hasPreviousQA && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Vos précisions précédentes — modifiez si besoin
          </p>
          <div className="space-y-2">
            {previousQA.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-xl border border-border px-4 py-2.5"
              >
                <span className="text-xs text-muted flex-none max-w-[140px] truncate" title={item.label}>
                  {item.label}
                </span>
                <div className="w-px h-4 bg-border flex-none" />
                <input
                  type="text"
                  value={
                    item.type === "direct"
                      ? (directAnswers[item.id] ?? item.value)
                      : (adaptiveAnswers[item.id] ?? item.value)
                  }
                  onChange={(e) => {
                    if (item.type === "direct") onDirectAnswer(item.id, e.target.value);
                    else onAdaptiveAnswer(item.id, e.target.value);
                  }}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-foreground min-w-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions directes */}
      {hasDirectQuestions && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            {isRefinement ? "Nouvelles pistes à explorer" : "Quelques précisions rapides"}
          </p>
          <DirectQuestions
            questions={directQuestions}
            answers={directAnswers}
            onAnswer={onDirectAnswer}
          />
        </div>
      )}

      {/* Référence optionnelle */}
      <ReferenceUpload />

      {/* Catégories optionnelles */}
      {hasCategories && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <p className="text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap">
              Aller plus loin
            </p>
            <div className="flex-1 h-px bg-border" />
          </div>
          <CategorySelector
            description={description}
            categories={categories}
            answeredCategories={answeredCategories}
            adaptiveAnswers={adaptiveAnswers}
            tool={tool}
            generatorCategory={generatorCategory}
            onAnswer={onAdaptiveAnswer}
            onMarkAnswered={onMarkCategoryAnswered}
          />
        </div>
      )}

      {/* Boutons — toujours visibles */}
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onBack} className="btn-secondary flex-none px-5">
          ← Retour
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="btn-primary flex-1"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Génération…
            </span>
          ) : (
            "✨ Générer mon prompt"
          )}
        </button>
      </div>
    </div>
  );
}
