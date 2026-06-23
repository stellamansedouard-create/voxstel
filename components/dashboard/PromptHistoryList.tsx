"use client";

import { useState } from "react";
import Link from "next/link";

export interface PromptHistoryItem {
  id: string;
  category: string;
  tool: string;
  prompt_en: string;
  prompt_fr: string;
  created_at: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  image: "🖼️",
  video: "🎬",
  text: "✍️",
  music: "🎵",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function PromptHistoryList({ prompts }: { prompts: PromptHistoryItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!prompts.length) {
    return (
      <div className="text-center py-14">
        <div className="text-5xl mb-4">✨</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Aucun prompt généré pour l'instant
        </h3>
        <p className="text-muted mb-6 text-sm">
          Essayez le générateur — vos prompts apparaîtront ici.
        </p>
        <Link href="/generate/image" className="btn-primary inline-flex items-center gap-2">
          Essayer le générateur <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {prompts.map((prompt) => {
        const isExpanded = expandedId === prompt.id;
        const icon = CATEGORY_ICONS[prompt.category] ?? "✨";
        const excerpt = prompt.prompt_fr.slice(0, 120);

        return (
          <li key={prompt.id}>
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
              className="w-full text-left bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0 mt-0.5">{icon}</span>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground capitalize">
                        {prompt.category}
                      </span>
                      <span className="text-xs text-muted">·</span>
                      <span className="text-xs text-muted">{prompt.tool}</span>
                    </div>
                    {!isExpanded && (
                      <p className="text-sm text-muted leading-relaxed line-clamp-2">
                        {excerpt}{prompt.prompt_fr.length > 120 ? "…" : ""}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-muted hidden sm:block">
                    {formatDate(prompt.created_at)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {isExpanded && (
                <div
                  className="mt-4 pt-4 border-t border-border space-y-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs text-muted sm:hidden">{formatDate(prompt.created_at)}</p>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                      🇬🇧 English
                    </span>
                    <p className="text-sm text-foreground font-mono bg-card-hover rounded-xl p-3 break-words leading-relaxed whitespace-pre-wrap">
                      {prompt.prompt_en}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted block mb-2">
                      🇫🇷 Français
                    </span>
                    <p className="text-sm text-foreground bg-card-hover rounded-xl p-3 break-words leading-relaxed whitespace-pre-wrap">
                      {prompt.prompt_fr}
                    </p>
                  </div>
                </div>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
