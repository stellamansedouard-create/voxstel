"use client";

import type { DirectQuestion } from "@/types";

interface DirectQuestionsProps {
  questions: DirectQuestion[];
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
}

export default function DirectQuestions({ questions, answers, onAnswer }: DirectQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="space-y-4">
      {questions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          value={answers[q.id] ?? ""}
          onChange={(v) => onAnswer(q.id, v)}
        />
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  value,
  onChange,
}: {
  question: DirectQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  function handleSuggestion(s: string) {
    onChange(value === s ? "" : s);
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
      <label className="block text-sm font-semibold text-foreground">
        {question.label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Votre réponse, ou choisissez ci-dessous…"
        className="input-field text-sm"
      />

      {question.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-0.5">
          {question.suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleSuggestion(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                value === s
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-foreground border-border hover:border-accent hover:text-accent"
              }`}
            >
              {value === s && "✓ "}
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
