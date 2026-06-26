"use client";

import type { DirectQuestion } from "@/types";

interface DirectQuestionsProps {
  questions: DirectQuestion[];
  answers: Record<string, string>;
  onAnswer: (id: string, value: string) => void;
}

export default function DirectQuestions({ questions, answers, onAnswer }: DirectQuestionsProps) {
  if (questions.length === 0) return null;

  const hasThemes = questions.some((q) => q.theme);

  if (!hasThemes) {
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

  // Group by theme, preserving insertion order
  const groups: { theme: string; questions: DirectQuestion[] }[] = [];
  const seen = new Map<string, number>();

  for (const q of questions) {
    const theme = q.theme ?? "";
    if (seen.has(theme)) {
      groups[seen.get(theme)!].questions.push(q);
    } else {
      seen.set(theme, groups.length);
      groups.push({ theme, questions: [q] });
    }
  }

  return (
    <div className="space-y-8">
      {groups.map(({ theme, questions: qs }) => (
        <div key={theme}>
          {theme && (
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent whitespace-nowrap">
                {theme}
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>
          )}
          <div className="space-y-4">
            {qs.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                value={answers[q.id] ?? ""}
                onChange={(v) => onAnswer(q.id, v)}
              />
            ))}
          </div>
        </div>
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
