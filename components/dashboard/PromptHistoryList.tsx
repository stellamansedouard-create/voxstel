"use client";

import { useState } from "react";
import Link from "next/link";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard write can fail (permissions, insecure context) — no-op
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copier le prompt"
      className="inline-flex items-center gap-1.5 flex-shrink-0 rounded-lg bg-[#F8F6F0] text-[#1A1A1A] text-xs font-medium px-2.5 py-1.5 border border-border hover:border-accent transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copié
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </>
      )}
    </button>
  );
}

export interface PromptHistoryItem {
  id: string;
  category: string;
  tool: string;
  prompt_en: string;
  // Nullable: "music" generations and ambiance-only library deliveries write no
  // French translation (see lib/deliver.ts). A raw .slice() on this used to
  // crash the whole dashboard for any account owning one such row.
  prompt_fr: string | null;
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
        // prompt_fr can be null (music / ambiance-only). Fall back to the
        // English prompt for the collapsed excerpt so the card still renders.
        const excerptSource = prompt.prompt_fr ?? prompt.prompt_en ?? "";
        const excerpt = excerptSource.slice(0, 120);

        return (
          <li key={prompt.id}>
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-accent/20 transition-all duration-200">
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : prompt.id)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
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
                        {excerpt}{excerptSource.length > 120 ? "…" : ""}
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
              </button>

              {isExpanded && (
                <div
                  className="mt-4 pt-4 border-t border-border space-y-4 text-left"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-xs text-muted sm:hidden">{formatDate(prompt.created_at)}</p>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                        🇬🇧 English
                      </span>
                      <CopyButton text={prompt.prompt_en} />
                    </div>
                    <p className="text-sm text-foreground font-mono bg-card-hover rounded-xl p-3 break-words leading-relaxed whitespace-pre-wrap select-text">
                      {prompt.prompt_en}
                    </p>
                  </div>
                  {/* French block only when a translation exists — music and
                      ambiance-only deliveries have none. */}
                  {prompt.prompt_fr && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                          🇫🇷 Français
                        </span>
                        <CopyButton text={prompt.prompt_fr} />
                      </div>
                      <p className="text-sm text-foreground bg-card-hover rounded-xl p-3 break-words leading-relaxed whitespace-pre-wrap select-text">
                        {prompt.prompt_fr}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
