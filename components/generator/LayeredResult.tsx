"use client";

import { useState } from "react";
import { getWording } from "@/lib/ambiance";
import type { Category, LayeredOutput } from "@/types";

interface LayeredResultProps {
  category: Category;
  /** null when the run stopped at the refined ambiance (layer 1 only). */
  output: LayeredOutput | null;
  /** The refined/kept ambiance — the layer-1 result. */
  ambiance: string;
  onRestart: () => void;
  /** Continue from a refined ambiance into the subject. */
  onContinueToSubject?: () => void;
}

export default function LayeredResult({
  category,
  output,
  ambiance,
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
      {!output && <CopyBlock label={w.ambianceLabel} value={ambiance} />}

      {/* Music keeps the two fields the tool itself expects */}
      {output?.kind === "music" && (
        <div className="space-y-4">
          <CopyBlock label="STYLE" value={output.style} hint="À coller dans le champ Style" />
          <CopyBlock label="PAROLES" value={output.lyrics} hint="À coller dans le champ Paroles" />
        </div>
      )}

      {/* Everything else: one merged prompt */}
      {output?.kind === "merged" && <MergedPrompt en={output.en} fr={output.fr} />}

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

function MergedPrompt({ en, fr }: { en: string; fr: string }) {
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
        <PromptBody value={active} />
      </div>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex items-baseline gap-2 px-5 py-3 border-b border-border">
        <span className="text-xs font-semibold text-foreground tracking-wide">{label}</span>
        {hint && <span className="text-xs text-muted">{hint}</span>}
      </div>
      <div className="p-5">
        <PromptBody value={value} />
      </div>
    </div>
  );
}

function PromptBody({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
