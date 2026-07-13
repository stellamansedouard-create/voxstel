"use client";

import { useRef, useState } from "react";
import { useGeneratorStore } from "@/store/useGeneratorStore";

const ACCEPTED_EXTENSIONS = [
  ".txt", ".md", ".markdown",
  ".js", ".jsx", ".ts", ".tsx",
  ".py", ".go", ".rs", ".java", ".rb", ".php", ".c", ".cpp", ".h",
  ".css", ".html", ".json", ".yaml", ".yml", ".toml", ".sql",
];

const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(",");
const MAX_BYTES = 500 * 1024; // 500 KB

export default function TextReferenceUpload() {
  return <UploadWidget />;
}

function UploadWidget() {
  const store = useGeneratorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const textReference = store.textReference;
  const hasAnalysis = (textReference?.aspects.length ?? 0) > 0;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_BYTES) {
      setUploadError("Fichier trop grand (max 500 Ko)");
      return;
    }

    setUploadError(null);
    setIsUploading(true);
    setFileName(file.name);

    try {
      const content = await readFileAsText(file);

      const res = await fetch("/api/analyze-text-reference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: store.tool,
          category: store.category,
          content,
          usageContext: store.usageContext || undefined,
        }),
      });

      if (!res.ok) throw new Error("analyze-text-reference failed");
      const data = await res.json();

      store.setTextReference({
        aspects: data.aspects ?? [],
        selectedAspectIds: [],
      });
    } catch {
      setUploadError("Erreur lors de l'analyse. Réessayez.");
      setFileName(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleClear() {
    store.clearTextReference();
    setFileName(null);
    setUploadError(null);
  }

  // Collapsed state
  if (!hasAnalysis && !isUploading) {
    return (
      <div className="mt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleFileChange}
          className="hidden"
          id="text-reference-input"
        />
        <label
          htmlFor="text-reference-input"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent cursor-pointer transition-colors group"
        >
          <span className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center group-hover:border-accent/50 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 2h7l3 3v9a1 1 0 01-1 1H3a1 1 0 01-1-1V3a1 1 0 011-1z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M10 2v3h3M5 8h6M5 10.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
          Ajouter un fichier de référence
          {uploadError && <span className="text-red-500 ml-1">{uploadError}</span>}
        </label>
      </div>
    );
  }

  // Loading state
  if (isUploading) {
    return (
      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <span className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span>Voxstel analyse le fichier{fileName ? ` "${fileName}"` : ""}…</span>
      </div>
    );
  }

  // Analyzed state — show aspect chips
  const aspects = textReference!.aspects;
  const selected = textReference!.selectedAspectIds;

  return (
    <div className="mt-4 bg-white border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-base">
            📄
          </span>
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">
              {fileName ?? "Fichier analysé"}
            </p>
            <p className="text-xs text-muted">Sélectionnez les aspects à utiliser</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-muted hover:text-foreground transition-colors"
          title="Retirer le fichier"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {aspects.map((aspect) => {
          const isSelected = selected.includes(aspect.id);
          return (
            <button
              key={aspect.id}
              type="button"
              onClick={() => store.toggleTextAspect(aspect.id)}
              title={aspect.description}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                isSelected
                  ? "bg-accent text-white border-accent"
                  : "bg-white text-foreground border-border hover:border-accent hover:text-accent"
              }`}
            >
              {isSelected && "✓ "}
              {aspect.label}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="text-xs text-muted italic">
          Cliquez sur les aspects stylistiques à intégrer dans le prompt.
        </p>
      )}
    </div>
  );
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
}
