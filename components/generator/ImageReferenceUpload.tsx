"use client";

import { useRef, useState } from "react";
import { useGeneratorStore } from "@/store/useGeneratorStore";
import PlanGate from "@/components/ui/PlanGate";

export default function ImageReferenceUpload() {
  return (
    <PlanGate plan="unlimited">
      <UploadWidget />
    </PlanGate>
  );
}

function UploadWidget() {
  const store = useGeneratorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const imageReference = store.imageReference;
  const hasAnalysis = (imageReference?.aspects.length ?? 0) > 0;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadError(`Fichier trop grand (max ${MAX_MB} Mo)`);
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    // Preview (local only — never sent to storage)
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Convert to base64 in-browser
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: store.tool,
          category: store.category,
          base64,
          mimeType: file.type,
        }),
      });

      if (!res.ok) throw new Error("analyze-image failed");
      const data = await res.json();

      store.setImageReference({
        aspects: data.aspects ?? [],
        selectedAspectIds: [],
      });
    } catch {
      setUploadError("Erreur lors de l'analyse. Réessayez.");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset input so the same file can be re-uploaded if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleClear() {
    store.clearImageReference();
    setPreviewUrl(null);
    setUploadError(null);
  }

  // Collapsed state — no image yet
  if (!hasAnalysis && !isUploading) {
    return (
      <div className="mt-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id="image-reference-input"
        />
        <label
          htmlFor="image-reference-input"
          className="inline-flex items-center gap-2 text-xs text-muted hover:text-accent cursor-pointer transition-colors group"
        >
          <span className="w-7 h-7 rounded-lg border border-border bg-white flex items-center justify-center group-hover:border-accent/50 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 11L5.5 7.5L8 10L10.5 7L14 11M2 13.5h12M9 3.5H7M8 2v3"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Ajouter une image de référence
          {uploadError && <span className="text-red-500 ml-1">{uploadError}</span>}
        </label>
      </div>
    );
  }

  // Loading state
  if (isUploading) {
    return (
      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        {previewUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Aperçu"
            className="w-10 h-10 rounded-lg object-cover border border-border flex-shrink-0"
          />
        )}
        <span className="w-3.5 h-3.5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        <span>Voxstel analyse l'image…</span>
      </div>
    );
  }

  // Analyzed state — show aspect chips
  const aspects = imageReference!.aspects;
  const selected = imageReference!.selectedAspectIds;

  return (
    <div className="mt-4 bg-white border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Image de référence"
              className="w-9 h-9 rounded-lg object-cover border border-border flex-shrink-0"
            />
          ) : (
            <span className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent text-base">
              🖼
            </span>
          )}
          <div>
            <p className="text-xs font-semibold text-foreground leading-tight">Image analysée</p>
            <p className="text-xs text-muted">Sélectionnez les aspects à utiliser</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-xs text-muted hover:text-foreground transition-colors"
          title="Retirer l'image"
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
              onClick={() => store.toggleImageAspect(aspect.id)}
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
          Cliquez sur les aspects que vous souhaitez intégrer dans le prompt.
        </p>
      )}
    </div>
  );
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Strip the "data:image/...;base64," prefix
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
