"use client";

// The free ambiance prompt, copiable with no account and no auth wall — the
// friction here is what brings the traffic.
import { useState } from "react";
import { track } from "@/lib/analytics.client";

interface CopyablePromptProps {
  label: string;
  /** The English prompt. Always what gets copied — see `copy()`. */
  value: string;
  /**
   * French rendering, shown by default when present so a visitor who does not
   * read English can still judge the ambiance. Absent on pages whose
   * translation has not landed yet: the toggle then does not render at all.
   */
  valueFr?: string;
  /**
   * Whether English is genuinely the better language to copy. True for the
   * generative tools (Suno, Midjourney, Sora) whose parsing is measurably
   * better in English. False for the text category, where the target is an
   * LLM that handles French just as well — recommending English there would
   * push the visitor toward a version they understand less, for no gain.
   */
  recommendEnglish?: boolean;
}

export default function CopyablePrompt({
  label,
  value,
  valueFr,
  recommendEnglish = true,
}: CopyablePromptProps) {
  const [copied, setCopied] = useState(false);
  // French first: the visitor has to understand what they are looking at
  // before they can decide whether they want to refine it.
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const showingFr = Boolean(valueFr) && lang === "fr";

  async function copy() {
    try {
      // Always the English one, whatever is on screen. The French text is a
      // reading aid; English is what Suno/Midjourney/etc. actually parse.
      await navigator.clipboard.writeText(value);
      track("prompt_copied", { metadata: { label } });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, permission denied). The prompt is
      // selectable text on screen, so the user can still copy it by hand.
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="flex items-baseline justify-between gap-2 px-5 py-3 border-b border-border">
        <span className="text-xs font-semibold text-foreground tracking-wide">
          {label.toUpperCase()}
        </span>
        <span className="text-xs text-muted">Gratuit, sans inscription</span>
      </div>

      {valueFr && (
        <div className="flex border-b border-border">
          {(["fr", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                lang === code
                  ? "text-accent bg-accent/5 border-b-2 border-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {code === "fr" ? "🇫🇷 Français" : "🇬🇧 English"}
                {code === "en" && recommendEnglish && (
                  <span className="text-[10px] font-semibold bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                    Recommandé
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        <pre className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">
          {showingFr ? valueFr : value}
        </pre>
        <button
          type="button"
          onClick={copy}
          className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
        >
          {copied ? "✓ Copié !" : "Copier le prompt"}
        </button>
        {showingFr && (
          <p className="text-xs text-muted mt-1.5">
            {recommendEnglish
              ? "Le prompt copié sera en anglais, recommandé pour de meilleurs résultats."
              : "Le prompt copié sera en anglais."}
          </p>
        )}
      </div>
    </div>
  );
}
