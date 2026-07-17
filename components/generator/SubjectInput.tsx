"use client";

import { useEffect, useRef, useState } from "react";
import { getWording } from "@/lib/ambiance";
import type { Category } from "@/types";
import LockedAmbiance from "./LockedAmbiance";

interface SubjectInputProps {
  category: Category;
  /** Frozen — shown read-only so the user sees what the subject lands in. */
  lockedAmbiance: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export default function SubjectInput({
  category,
  lockedAmbiance,
  value,
  onChange,
  onSubmit,
  isLoading = false,
}: SubjectInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const w = getWording(category);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim().length >= 3) {
      e.preventDefault();
      onSubmit();
    }
  }

  const canSubmit = value.trim().length >= 3;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {w.subjectHeading}
        </h2>
        <p className="text-muted">
          {w.ambianceLabel} verrouillé{w.ambianceAgr} — Voxstel le garde{" "}
          {w.ambianceAsIs} et construit {w.subject} autour.
        </p>
      </div>

      <LockedAmbiance category={category} ambiance={lockedAmbiance} />

      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 mt-6 ${
          isFocused
            ? "border-accent shadow-[0_0_0_3px_rgba(200,145,10,0.12)]"
            : "border-border"
        } bg-white`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={w.subjectPlaceholder}
          rows={4}
          className="w-full bg-transparent px-5 pt-5 pb-3 text-foreground placeholder:text-muted resize-none focus:outline-none text-base leading-relaxed"
          style={{ minHeight: "120px" }}
        />
        <div className="flex items-center justify-between px-5 pb-4 border-t border-border pt-3">
          <span className={`text-xs ${canSubmit ? "text-accent" : "text-muted"}`}>
            {value.length} caractères{!canSubmit ? " (minimum 3)" : ""}
          </span>
          <span className="text-xs text-muted">⌘ + Entrée pour continuer</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit || isLoading}
        className="btn-primary w-full mt-6"
      >
        {isLoading ? "Analyse en cours..." : "Continuer →"}
      </button>
    </div>
  );
}
