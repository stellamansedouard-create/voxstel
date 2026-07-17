// G1 — the pillar page.
//
// PLACEHOLDER COPY. Every user-facing string below is provisional, lifted from
// the salve 1 brief so the page has something to hold. The final copywriting is
// being written separately — replace the strings, keep the structure.
import type { Metadata } from "next";
import Link from "next/link";
import { getLibraryCategories } from "@/lib/library";
import { getCategoryById } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Générateur de prompt IA en français — Voxstel";
const DESCRIPTION =
  "Décrivez votre idée en français : Voxstel vous pose les bonnes questions et génère un prompt calibré pour Midjourney, Sora, Suno, ChatGPT.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["générateur de prompt", "créer un prompt", "prompt ia"],
  alternates: { canonical: absoluteUrl("/generateur-de-prompt") },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Voxstel",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/generateur-de-prompt"),
  },
};

export default function GenerateurDePromptPage() {
  const categories = getLibraryCategories();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Le générateur de prompt qui transforme ton idée en prompt parfait
        </h1>

        <p className="text-muted mb-4">
          Tu décris ton idée en français, Voxstel te pose les bonnes questions et
          génère un prompt calibré pour Midjourney, Sora, Suno, ChatGPT.
        </p>
        <p className="text-foreground font-medium mb-10">
          Ne devine plus les mots. Voxstel maîtrise le langage des IA pour toi.
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Par où commencer
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {categories.map((id) => {
              const cat = getCategoryById(id);
              return (
                <li key={id}>
                  <Link
                    href="/bibliotheque"
                    className="h-full flex items-center gap-3 px-5 py-4 rounded-xl border border-border bg-white hover:border-accent hover:bg-accent/5 transition-all duration-150"
                  >
                    <span className="text-xl">{cat?.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {cat?.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <Link href="/generate" className="btn-primary inline-flex px-6 py-3">
          Créer mon premier prompt
        </Link>
      </main>
    </div>
  );
}
