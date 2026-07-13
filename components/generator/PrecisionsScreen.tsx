"use client";

import { useGeneratorStore } from "@/store/useGeneratorStore";
import type { DirectQuestion, AITool, Category } from "@/types";
import DirectQuestions from "./DirectQuestions";

interface PrecisionsScreenProps {
  description: string;
  directQuestions: DirectQuestion[];
  directAnswers: Record<string, string>;
  tool: AITool;
  generatorCategory: Category;
  onDirectAnswer: (id: string, value: string) => void;
  onRefinePrecisionAnswer: (id: string, value: string) => void;
  onSubmit: () => void;
  onRefinePrecision: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export default function PrecisionsScreen({
  description,
  directQuestions,
  directAnswers,
  tool: _tool,
  generatorCategory: _generatorCategory,
  onDirectAnswer,
  onRefinePrecisionAnswer,
  onSubmit,
  onRefinePrecision,
  onBack,
  isSubmitting = false,
}: PrecisionsScreenProps) {
  const {
    isRefinement,
    previousQA,
    usageContext,
    refinePrecisionQuestions,
    refinePrecisionAnswers,
    hasUsedRefinePrecision,
  } = useGeneratorStore();

  const hasDirectQuestions = directQuestions.length > 0;
  const hasPreviousQA = isRefinement && previousQA.length > 0;

  // After refine-precision was used and returned questions → show refine round
  const showRefineRound = hasUsedRefinePrecision && refinePrecisionQuestions.length > 0;
  // After refine-precision was used and returned nothing → toast was shown, button hidden
  const refineReturnedEmpty = hasUsedRefinePrecision && refinePrecisionQuestions.length === 0;

  // Show the refine button only on the first round (not in Renforcer mode, not already used)
  const showRefineButton = !isRefinement && !hasUsedRefinePrecision;

  function handleRefineClick() {
    onRefinePrecision();
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Toast: refine returned nothing */}
      {refineReturnedEmpty && (
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
          <p className="text-sm text-green-700">
            Tout est déjà bien précisé — vous pouvez générer votre prompt.
          </p>
        </div>
      )}

      {/* Description figée */}
      <div className="flex gap-3 bg-card-hover border border-border rounded-xl px-4 py-3.5">
        <span className="text-2xl text-border leading-none select-none mt-0.5 flex-shrink-0">&ldquo;</span>
        <div>
          <p className="text-sm text-foreground leading-relaxed line-clamp-4 italic">{description}</p>
          {usageContext && (
            <p className="text-xs text-muted mt-1.5">
              Contexte : <span className="font-medium text-foreground/80">{usageContext}</span>
            </p>
          )}
        </div>
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
                  value={directAnswers[item.id] ?? item.value}
                  onChange={(e) => onDirectAnswer(item.id, e.target.value)}
                  className="flex-1 text-sm bg-transparent focus:outline-none text-foreground min-w-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions : premier tour (masqué si le round d'affinage a produit des questions) */}
      {!showRefineRound && hasDirectQuestions && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            {isRefinement ? "Nouvelles pistes à explorer" : "Précisez votre intention"}
          </p>
          <DirectQuestions
            questions={directQuestions}
            answers={directAnswers}
            onAnswer={onDirectAnswer}
          />
        </div>
      )}

      {/* Questions du round d'affinage (remplace l'affichage du premier tour) */}
      {showRefineRound && (
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            Affinage supplémentaire
          </p>
          <DirectQuestions
            questions={refinePrecisionQuestions}
            answers={refinePrecisionAnswers}
            onAnswer={onRefinePrecisionAnswer}
          />
        </div>
      )}

      {/* Boutons */}
      <div className="flex flex-col gap-3 pt-1">
        <div className="flex gap-3">
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

        {/* Bouton Affinage supplémentaire — premier tour uniquement, non utilisé */}
        {showRefineButton && (
          <button
            type="button"
            onClick={handleRefineClick}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-accent/40 text-accent text-sm font-medium transition-all duration-150 hover:bg-accent/5 hover:border-accent"
          >
            <span>Affinage supplémentaire</span>
          </button>
        )}
      </div>
    </div>
  );
}
