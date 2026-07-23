"use client";

import { useState } from "react";
import { getWording } from "@/lib/ambiance";
import { track } from "@/lib/analytics.client";
import type { Category, LayeredOutput } from "@/types";

interface LayeredResultProps {
  category: Category;
  /** null when the run stopped at the refined ambiance (layer 1 only). */
  output: LayeredOutput | null;
  /** The refined/kept ambiance — the layer-1 result. */
  ambiance: string;
  /**
   * id of the prompts_history row for THIS delivery — added 22/07/2026 so the
   * library/layered journey gets the same was_copied tracking as the classic
   * generator (components/generator/PromptResult.tsx). Both the ambiance-only
   * delivery (refine-ambiance flow) and the subject delivery are paid, so both
   * have a row and both need this. Undefined only if the API response somehow
   * omitted it — copy still works, it just isn't tracked server-side.
   */
  historyId?: string | null;
  onRestart: () => void;
  /** Continue from a refined ambiance into the subject. */
  onContinueToSubject?: () => void;
}

export default function LayeredResult({
  category,
  output,
  ambiance,
  historyId,
  onRestart,
  onContinueToSubject,
}: LayeredResultProps) {
  const w = getWording(category);

  return (
    <div className="animate-slide-up">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-2xl mb-4">
          <span className="text-2xl">✨</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">
          {output ? "Votre prompt est prêt" : `${w.ambianceLabel} affiné${w.ambianceAgr}`}
        </h2>
        <p className="text-sm text-muted">
          {output
            ? "Copiez-le dans votre outil et lancez la création."
            : `Vous pouvez la réutiliser autant de fois que vous voulez.`}
        </p>
      </div>

      {/* Layer 1 only — the refined ambiance */}
      {!output && (
        <CopyBlock
          label={w.ambianceLabel}
          value={ambiance}
          category={category}
          historyId={historyId}
          field="ambiance"
        />
      )}

      {/* Music keeps the two fields the tool itself expects */}
      {output?.kind === "music" && (
        <div className="space-y-4">
          <CopyBlock
            label="STYLE"
            value={output.style}
            hint="À coller dans le champ Style"
            category={category}
            historyId={historyId}
            field="style"
          />
          <CopyBlock
            label="PAROLES"
            value={output.lyrics}
            hint="À coller dans le champ Paroles"
            category={category}
            historyId={historyId}
            field="lyrics"
          />
        </div>
      )}

      {/* Everything else: one merged prompt */}
      {output?.kind === "merged" && (
        <MergedPrompt en={output.en} fr={output.fr} category={category} historyId={historyId} />
      )}

      {!output && onContinueToSubject && (
        <button onClick={onContinueToSubject} className="btn-primary w-full mt-6">
          Créer {w.subject} sur cette base →
        </button>
      )}

      <button onClick={onRestart} className="btn-secondary w-full mt-3">
        ← Créer un nouveau prompt
      </button>
    </div>
  );
}

function MergedPrompt({
  en,
  fr,
  category,
  historyId,
}: {
  en: string;
  fr: string;
  category: Category;
  historyId?: string | null;
}) {
  const [tab, setTab] = useState<"en" | "fr">("en");
  const active = tab === "en" ? en : fr;

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex border-b border-border">
        {(["en", "fr"] as const).map((lang) => (
          <button
            key={lang}
            onClick={() => setTab(lang)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              tab === lang
                ? "text-accent bg-accent/5 border-b-2 border-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {lang === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
          </button>
        ))}
      </div>
      <div className="p-5">
        <PromptBody value={active} category={category} historyId={historyId} lang={tab} field="merged" />
      </div>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  hint,
  category,
  historyId,
  field,
}: {
  label: string;
  value: string;
  hint?: string;
  category: Category;
  historyId?: string | null;
  field: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex items-baseline gap-2 px-5 py-3 border-b border-border">
        <span className="text-xs font-semibold text-foreground tracking-wide">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      <div className="p-5">
        <PromptBody value={value} category={category} historyId={historyId} field={field} />
      </div>
    </div>
  );
}

function PromptBody({
  value,
  category,
  historyId,
  lang,
  field,
}: {
  value: string;
  category: Category;
  historyId?: string | null;
  lang?: "en" | "fr";
  field?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Reconnects prompts_history.was_copied for the library/layered journey —
    // added 22/07/2026, same mechanism as the classic generator
    // (components/generator/PromptResult.tsx). Before this, every copy button
    // in this component only updated local UI state; nothing was ever written
    // back, so was_copied stayed false for every library-journey delivery
    // regardless of what the visitor actually did with the result.
    // Fire-and-forget: a dropped call must never block or error out the copy
    // the user just performed.
    if (historyId) {
      fetch("/api/prompts/mark-copied", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: historyId }),
        keepalive: true,
      }).catch(() => {});
    }
    track("prompt_copied", {
      promptCategory: category,
      metadata: { source: "library_journey", lang, field },
    });
  }

  return (
    <>
      <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">
        {value}
      </p>
      <button
        onClick={copy}
        className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
      >
        {copied ? "✓ Copié !" : "Copier"}
      </button>
    </>
  );
}
