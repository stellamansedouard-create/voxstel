"use client";

// The free ambiance prompt, copiable with no account and no auth wall — the
// friction here is what brings the traffic.
import { useState } from "react";

interface CopyablePromptProps {
  label: string;
  value: string;
}

export default function CopyablePrompt({ label, value }: CopyablePromptProps) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
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
      <div className="p-5">
        <pre className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">
          {value}
        </pre>
        <button
          type="button"
          onClick={copy}
          className="mt-4 flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
        >
          {copied ? "✓ Copié !" : "Copier le prompt"}
        </button>
      </div>
    </div>
  );
}
