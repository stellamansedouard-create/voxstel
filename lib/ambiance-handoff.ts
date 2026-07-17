"use client";

// Hands a library page's ambiance prompt to the generator across the
// navigation. sessionStorage rather than a query param: ambiance prompts are
// multi-line and far too long for a URL. Mirrors the existing
// vx_pending_description handoff in GeneratorFlow.
import type { LibraryHandoff } from "@/types";

const KEY = "vx_library_handoff";

export function writeHandoff(handoff: LibraryHandoff): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(handoff));
  } catch {
    // Private mode / storage disabled — the generator falls back to its
    // normal blank-field flow, which is a degraded but working path.
  }
}

/** Reads and clears the handoff — it must not survive a reload or a back nav. */
export function consumeHandoff(): LibraryHandoff | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);

    const parsed = JSON.parse(raw) as Partial<LibraryHandoff>;
    if (
      typeof parsed?.ambiancePrompt !== "string" ||
      !parsed.ambiancePrompt.trim() ||
      typeof parsed?.category !== "string" ||
      typeof parsed?.tool !== "string" ||
      typeof parsed?.flow !== "string"
    ) {
      return null;
    }
    return parsed as LibraryHandoff;
  } catch {
    return null;
  }
}
