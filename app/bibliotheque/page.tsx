import type { Metadata } from "next";
import Link from "next/link";
import LibraryGrid from "@/components/library/LibraryGrid";
import {
  LIBRARY_PAGES,
  getLibraryCategories,
  getLibraryTools,
} from "@/lib/library";
import { absoluteUrl } from "@/lib/site";

const TITLE = "Bibliothèque de prompts IA gratuits en français — Voxstel";
const DESCRIPTION =
  "Des prompts IA complets, en français, à copier sans inscription : musique, image, texte, vidéo. Pour Suno, Midjourney, ChatGPT, Claude, Sora.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["bibliothèque de prompts", "prompts ia gratuits"],
  alternates: { canonical: absoluteUrl("/bibliotheque") },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Voxstel",
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl("/bibliotheque"),
  },
};

export default function BibliothequePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          La bibliothèque de prompts IA, en français
        </h1>
        <p className="text-muted mb-8">
          Copiez n'importe quel prompt, sans inscription. Gardez-le tel quel,
          ajustez-le, ou donnez-lui votre sujet.
        </p>

        <LibraryGrid
          pages={LIBRARY_PAGES}
          categories={getLibraryCategories()}
          tools={getLibraryTools()}
        />

        <aside className="mt-10 px-5 py-4 rounded-xl border border-border bg-white">
          <p className="text-sm text-muted">
            Besoin d'un prompt sur mesure ? Adapte n'importe lequel à ton projet
            avec{" "}
            <Link
              href="/generateur-de-prompt"
              className="text-accent hover:text-accent-dark font-medium transition-colors"
            >
              Voxstel
            </Link>
            .
          </p>
        </aside>
      </main>
    </div>
  );
}
