"use client";

import { useState, useRef, useEffect } from "react";
import type { Category, ToolMeta } from "@/types";
import ReferenceUpload from "./ReferenceUpload";

interface FreeTextInputProps {
  tool: ToolMeta;
  category: Category;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const TOOL_EXAMPLES: Record<string, string> = {
  midjourney: "Ex : \"Un renard roux dans une forêt\"",
  dalle3: "Ex : \"Une ville futuriste sous la pluie\"",
  firefly: "Ex : \"Un bouquet de fleurs dans un vase\"",
  imagen: "Ex : \"Une femme qui sourit dans un café\"",
  stablediffusion: "Ex : \"Un dragon sur une montagne enneigée\"",
  leonardoai: "Ex : \"Un guerrier dans une forêt enchantée\"",
  ideogram: "Ex : \"Une affiche de film d'horreur\"",
  sora: "Ex : \"Un astronaute qui boit un café sur la lune\"",
  runway: "Ex : \"Une cascade dans la jungle\"",
  pika: "Ex : \"Un robot qui danse dans une rue\"",
  lumaai: "Ex : \"Des vagues qui s'écrasent sur des rochers\"",
  klingai: "Ex : \"Un chef qui cuisine dans sa cuisine\"",
  veo: "Ex : \"Des chevaux qui galopent dans un champ\"",
  geminivideo: "Ex : \"Un chat qui joue avec une pelote de laine\"",
  claude: "Ex : \"Un article de blog sur la méditation\"",
  gpt4: "Ex : \"Un plan marketing pour une startup\"",
  gemini: "Ex : \"Une analyse des tendances de l'IA\"",
  llama: "Ex : \"Une explication simple de la relativité\"",
  mistral: "Ex : \"Un résumé clair d'un contrat\"",
  deepseek: "Ex : \"Une fonction Python pour détecter les doublons\"",
  suno: "Ex : \"Une chanson pop mélancolique\"",
  udio: "Ex : \"Un morceau de jazz pour un soir d'hiver\"",
  stableaudio: "Ex : \"Une musique épique pour une bataille\"",
  aiva: "Ex : \"Une composition pour quatuor à cordes\"",
};

const DEFAULT_PLACEHOLDER = "Décrivez librement ce que vous voulez créer.";

export default function FreeTextInput({
  tool,
  category,
  value,
  onChange,
  onSubmit,
  onBack,
  isLoading = false,
}: FreeTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  function autoResize(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 300) + "px";
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange(e.target.value);
    autoResize(e.target);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim().length >= 10) {
      e.preventDefault();
      onSubmit();
    }
  }

  const canSubmit = value.trim().length >= 10;

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Décrivez votre vision
        </h2>
        <p className="text-muted">
          Parlez librement — Voxstel analysera votre description et vous posera
          uniquement les questions nécessaires pour{" "}
          <span className="font-medium text-foreground">{tool.name}</span>.
        </p>
      </div>

      <div
        className={`relative rounded-2xl border-2 transition-all duration-200 ${
          isFocused
            ? "border-accent shadow-[0_0_0_3px_rgba(200,145,10,0.12)]"
            : "border-border"
        } bg-white`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={DEFAULT_PLACEHOLDER}
          rows={5}
          className="w-full bg-transparent px-5 pt-5 pb-3 text-foreground placeholder:text-muted resize-none focus:outline-none text-base leading-relaxed"
          style={{ minHeight: "140px" }}
        />

        <div className="px-5 pb-4">
          <p className="text-xs text-muted/60 italic">
            {TOOL_EXAMPLES[tool.id] ?? "Décrivez votre projet en détail..."}
          </p>
        </div>

        <div className="flex items-center justify-between px-5 pb-4 border-t border-border pt-3">
          <span className={`text-xs ${value.length < 10 ? "text-muted" : "text-accent"}`}>
            {value.length} caractères{value.length < 10 ? " (minimum 10)" : ""}
          </span>
          <span className="text-xs text-muted">⌘ + Entrée pour continuer</span>
        </div>
      </div>

      {/* Référence optionnelle (image pour Image, fichier texte pour Texte/Code) */}
      <ReferenceUpload />

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="btn-secondary flex-none px-5">
          ← Retour
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          className="btn-primary flex-1"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analyse en cours...
            </span>
          ) : (
            "Analyser ma description →"
          )}
        </button>
      </div>
    </div>
  );
}
