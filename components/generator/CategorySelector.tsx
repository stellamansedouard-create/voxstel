"use client";

import { useState, useRef, useEffect } from "react";
import type { PrecisionCategory, AITool, Category } from "@/types";

interface ActiveQuestion {
  topicId: string;
  label: string;
  suggestions: string[];
}

interface CategorySelectorProps {
  description: string;
  categories: PrecisionCategory[];
  answeredCategories: string[];
  adaptiveAnswers: Record<string, string>;
  tool: AITool;
  generatorCategory: Category;
  onAnswer: (categoryId: string, value: string) => void;
  onMarkAnswered: (categoryId: string) => void;
}

export default function CategorySelector({
  description,
  categories,
  answeredCategories,
  adaptiveAnswers,
  tool,
  generatorCategory,
  onAnswer,
  onMarkAnswered,
}: CategorySelectorProps) {
  const [activeQuestion, setActiveQuestion] = useState<ActiveQuestion | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showAll, setShowAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeQuestion) {
      inputRef.current?.focus();
    }
  }, [activeQuestion]);

  const available = categories.filter((c) => !answeredCategories.includes(c.id));
  const priority = available.filter((c) => c.priority);
  const others = available.filter((c) => !c.priority);
  const visibleOthers = showAll ? others : [];

  async function handleCategoryClick(cat: PrecisionCategory) {
    if (activeQuestion?.topicId === cat.id) {
      setActiveQuestion(null);
      setCurrentAnswer("");
      return;
    }

    setQuestionLoading(true);
    setActiveQuestion(null);
    setCurrentAnswer(adaptiveAnswers[cat.id] ?? "");

    try {
      const res = await fetch("/api/get-category-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          generatorCategory,
          description,
          topicId: cat.id,
          topicLabel: cat.label,
          existingAnswers: adaptiveAnswers,
        }),
      });
      const data = await res.json();
      setActiveQuestion({ topicId: cat.id, label: data.label, suggestions: data.suggestions ?? [] });
    } catch {
      setActiveQuestion({ topicId: cat.id, label: `Précisez : ${cat.label}`, suggestions: [] });
    } finally {
      setQuestionLoading(false);
    }
  }

  function handleConfirm() {
    if (!activeQuestion) return;
    if (currentAnswer.trim()) {
      onAnswer(activeQuestion.topicId, currentAnswer.trim());
    }
    onMarkAnswered(activeQuestion.topicId);
    setActiveQuestion(null);
    setCurrentAnswer("");
  }

  function handleCancel() {
    setActiveQuestion(null);
    setCurrentAnswer("");
  }

  function handleSuggestion(s: string) {
    setCurrentAnswer((prev) => (prev === s ? "" : s));
  }

  const chipBase =
    "px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-150 focus:outline-none";

  const allExplored = available.length === 0;

  if (categories.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Category chips */}
      {!allExplored && (
        <div>
          <div className="flex flex-wrap gap-2">
            {priority.map((cat) => {
              const isActive = activeQuestion?.topicId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  disabled={questionLoading && !isActive}
                  className={`${chipBase} ${
                    isActive
                      ? "bg-accent text-white border-accent shadow-sm"
                      : "bg-accent/10 text-accent border-accent/25 hover:bg-accent/20 hover:border-accent/50"
                  }`}
                >
                  <span className="mr-1 opacity-70">★</span>
                  {cat.label}
                </button>
              );
            })}

            {visibleOthers.map((cat) => {
              const isActive = activeQuestion?.topicId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  disabled={questionLoading && !isActive}
                  className={`${chipBase} ${
                    isActive
                      ? "bg-foreground text-white border-foreground"
                      : "bg-white text-muted border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {others.length > 0 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-2.5 text-xs text-accent hover:text-accent-dark font-medium transition-colors"
            >
              {showAll
                ? "← Masquer"
                : `+ ${others.length} autre${others.length > 1 ? "s" : ""} option${others.length > 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      )}

      {/* Question loading indicator */}
      {questionLoading && (
        <div className="flex items-center gap-2 text-sm text-muted py-1 animate-pulse">
          <span className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          Génération de la question...
        </div>
      )}

      {/* Active question zone */}
      {activeQuestion && !questionLoading && (
        <div className="bg-white border-2 border-accent/20 rounded-2xl p-5 animate-slide-up">
          <p className="text-sm font-semibold text-foreground mb-3">
            {activeQuestion.label}
          </p>

          <input
            ref={inputRef}
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") handleCancel();
            }}
            placeholder="Votre réponse, ou choisissez ci-dessous…"
            className="input-field text-sm mb-3"
          />

          {activeQuestion.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeQuestion.suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSuggestion(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                    currentAnswer === s
                      ? "bg-accent text-white border-accent"
                      : "bg-white text-foreground border-border hover:border-accent hover:text-accent"
                  }`}
                >
                  {currentAnswer === s && "✓ "}
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirm}
              className="btn-primary text-sm py-2 px-5"
            >
              Confirmer →
            </button>
          </div>
        </div>
      )}

      {/* Answered summary */}
      {answeredCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {answeredCategories.map((id) => {
            const cat = categories.find((c) => c.id === id);
            const answer = adaptiveAnswers[id];
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200"
              >
                <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6l3 3 5-5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {cat?.label ?? id}
                {answer && (
                  <span className="text-green-600/70 max-w-[100px] truncate">: {answer}</span>
                )}
              </span>
            );
          })}
        </div>
      )}

      {allExplored && answeredCategories.length > 0 && (
        <p className="text-xs text-muted text-center py-1">
          Toutes les catégories ont été précisées ✓
        </p>
      )}
    </div>
  );
}
