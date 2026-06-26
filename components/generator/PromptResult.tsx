"use client";

import { useState } from "react";
import type { GeneratedPrompt, AITool } from "@/types";
import { CATEGORIES } from "@/lib/metadata";

interface PromptResultProps {
  prompt: GeneratedPrompt;
  tool: AITool;
  refinementsLeft: number;
  onRestart: () => void;
  onRenforce: () => void;
  onRecommencer: () => void;
}

function getToolName(toolId: AITool): string {
  for (const cat of CATEGORIES) {
    const found = cat.tools.find((t) => t.id === toolId);
    if (found) return found.name;
  }
  return toolId;
}

export default function PromptResult({
  prompt,
  tool,
  refinementsLeft,
  onRestart,
  onRenforce,
  onRecommencer,
}: PromptResultProps) {
  const [copied, setCopied] = useState<"en" | "fr" | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "fr">("en");
  const [showUnsatisfied, setShowUnsatisfied] = useState(false);

  async function copyToClipboard(text: string, lang: "en" | "fr") {
    await navigator.clipboard.writeText(text);
    setCopied(lang);
    setTimeout(() => setCopied(null), 2000);
  }

  const activePrompt = activeTab === "en" ? prompt.en : prompt.fr;
  const isCopied = copied === activeTab;

  return (
    <div className="animate-slide-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-accent/10 rounded-2xl mb-4">
          <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Votre prompt est prêt</h2>
        <p className="text-sm text-muted">
          Optimisé pour{" "}
          <span className="font-medium text-foreground">{getToolName(tool)}</span>
        </p>
      </div>

      {/* Prompt card */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden mb-4">
        <div className="flex border-b border-border">
          {(["en", "fr"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === lang
                  ? "text-accent bg-accent/5 border-b-2 border-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {lang === "en" ? "🇬🇧 English" : "🇫🇷 Français"}
              {lang === "en" && (
                <span className="text-[10px] font-semibold bg-accent/10 text-accent px-1.5 py-0.5 rounded-full leading-none hidden sm:inline">
                  recommandé
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">
            {activePrompt}
          </p>

          <button
            onClick={() => copyToClipboard(activePrompt, activeTab)}
            className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
          >
            {isCopied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copié !
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copier le prompt
              </>
            )}
          </button>
        </div>
      </div>

      {/* New prompt button */}
      <button onClick={onRestart} className="btn-secondary w-full mb-8">
        ← Créer un nouveau prompt
      </button>

      {/* Feedback section */}
      <div className="border-t border-border pt-6">
        {!showUnsatisfied ? (
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted">Le résultat vous plaît-il ?</p>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={onRestart}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:border-green-400 hover:bg-green-50 hover:text-green-700 transition-all duration-150"
              >
                <span className="text-base">👍</span> Oui
              </button>
              <button
                onClick={() => setShowUnsatisfied(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
              >
                <span className="text-base">👎</span> Non
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted mb-4">Comment améliorer le résultat ?</p>

            {/* Renforcer */}
            <button
              onClick={onRenforce}
              disabled={refinementsLeft <= 0}
              className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                refinementsLeft > 0
                  ? "bg-white border-border hover:border-accent hover:bg-accent/5 text-foreground hover:text-accent"
                  : "bg-card-hover border-border text-muted cursor-not-allowed opacity-60"
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-base">🔄</span>
                Renforcer ce prompt
              </span>
              <span className={`text-xs font-normal ${refinementsLeft > 0 ? "text-muted" : "text-muted/50"}`}>
                {refinementsLeft > 0
                  ? `${refinementsLeft} affinage${refinementsLeft > 1 ? "s" : ""} restant${refinementsLeft > 1 ? "s" : ""}`
                  : "Limite atteinte"}
              </span>
            </button>

            {/* Recommencer */}
            <button
              onClick={onRecommencer}
              className="w-full flex items-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-white text-sm font-medium text-foreground hover:border-border hover:bg-card-hover transition-all duration-150"
            >
              <span className="text-base">↩</span>
              Recommencer depuis zéro
              <span className="text-xs text-muted font-normal ml-auto">Garde {getToolName(tool)}</span>
            </button>

            {/* Back to feedback */}
            <button
              onClick={() => setShowUnsatisfied(false)}
              className="w-full text-center text-xs text-muted hover:text-foreground transition-colors pt-1"
            >
              ← Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
