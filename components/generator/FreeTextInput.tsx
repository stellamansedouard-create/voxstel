"use client";

import { useState, useRef, useEffect } from "react";
import type { ToolMeta } from "@/types";
import ReferenceUpload from "./ReferenceUpload";

interface FreeTextInputProps {
  tool: ToolMeta;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const TOOL_EXAMPLES: Record<string, string> = {
  midjourney:
    "Ex : \"Un renard roux assis sur un livre ancien dans une forêt brumeuse, atmosphère mystérieuse au coucher du soleil...\"",
  dalle3:
    "Ex : \"Une ville futuriste la nuit sous la pluie, néons colorés reflétés dans les flaques, style cyberpunk...\"",
  firefly:
    "Ex : \"Un bouquet de fleurs sauvages dans un vase en verre dépoli, lumière naturelle douce, fond clair...\"",
  imagen:
    "Ex : \"Portrait d'une femme souriante dans un café parisien vintage, bokeh, lumière du matin...\"",
  stablediffusion:
    "Ex : \"Un dragon majestueux perché sur une montagne enneigée sous un ciel étoilé, style fantasy...\"",
  leonardoai:
    "Ex : \"Un guerrier en armure dorée dans une forêt enchantée, lumières féériques, très détaillé...\"",
  ideogram:
    "Ex : \"Un poster vintage de film d'horreur avec le titre 'The Last Night' en grandes lettres rouges...\"",
  sora: "Ex : \"Un astronaute marche lentement sur la lune, caméra qui le suit en tracking shot, lumière rasante...\"",
  runway: "Ex : \"Une cascade tropicale avec des oiseaux colorés qui s'envolent, plan large panoramique...\"",
  pika: "Ex : \"Un robot dansant dans une rue de Tokyo la nuit, lumières néon, mouvement fluide...\"",
  lumaai: "Ex : \"Des vagues océaniques qui s'écrasent sur des rochers au coucher de soleil, ralenti...\"",
  klingai: "Ex : \"Un chef cuisinier qui jongle avec des légumes dans une cuisine moderne, souriant...\"",
  veo: "Ex : \"Un troupeau de chevaux galopant dans un champ au lever du soleil, filmé par drone...\"",
  claude:
    "Ex : \"Écris un article de blog de 800 mots sur les bienfaits de la méditation pour les débutants, ton chaleureux...\"",
  gpt4: "Ex : \"Crée un plan de marketing digital pour une startup B2B SaaS avec un budget limité...\"",
  gemini:
    "Ex : \"Analyse les tendances du marché de l'IA en 2025 et propose 3 opportunités d'investissement...\"",
  llama:
    "Ex : \"Tu es un tuteur bienveillant. Explique la relativité générale à un lycéen sans jargon...\"",
  mistral:
    "Ex : \"Traduis ce contrat légal en langage clair et identifie les clauses potentiellement risquées...\"",
  deepseek:
    "Ex : \"Écris une fonction Python optimisée pour détecter les doublons dans une liste de millions d'éléments...\"",
  suno: "Ex : \"Une chanson pop mélancolique sur un voyage en train sous la pluie, voix féminine douce, tempo lent...\"",
  udio: "Ex : \"Un morceau de jazz fusion avec piano, basse électrique et batterie, ambiance nocturne de club...\"",
  stableaudio:
    "Ex : \"Musique épique orchestrale pour une scène de bataille fantasy, cordes et percussions, très intense...\"",
  aiva: "Ex : \"Une composition pour quatuor à cordes, style romantique tardif, thème mélancolique qui évolue vers l'espoir...\"",
};

const DEFAULT_PLACEHOLDER =
  "Décrivez librement ce que vous voulez créer. Plus vous êtes précis, meilleur sera le prompt généré...";

export default function FreeTextInput({
  tool,
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
