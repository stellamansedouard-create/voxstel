import { notFound } from "next/navigation";
import AmbianceActions from "@/components/library/AmbianceActions";
import { getWording } from "@/lib/ambiance";
import { LIBRARY_PAGES, getLibraryPage } from "@/lib/library";
import { getCategoryById } from "@/lib/metadata";

export function generateStaticParams() {
  return LIBRARY_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = getLibraryPage(params.slug);
  if (!page) return {};
  return {
    title: `${page.title} — Voxstel`,
    description: page.tagline,
    robots: { index: false, follow: false },
  };
}

export default function LibraryPageView({ params }: { params: { slug: string } }) {
  const page = getLibraryPage(params.slug);
  if (!page) notFound();

  const cat = getCategoryById(page.category);
  const w = getWording(page.category);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <a
          href="/library"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          ← Bibliothèque
        </a>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{cat?.icon}</span>
          <h1 className="text-2xl font-bold text-foreground">{page.title}</h1>
        </div>
        <p className="text-muted mb-8">{page.tagline}</p>

        <div className="bg-white rounded-2xl border border-border overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-semibold text-foreground tracking-wide">
              {w.ambianceLabel.toUpperCase()}
            </span>
          </div>
          <div className="p-5">
            <p className="text-sm text-foreground leading-relaxed font-mono whitespace-pre-wrap">
              {page.ambiancePrompt}
            </p>
          </div>
        </div>

        <AmbianceActions page={page} />
      </div>
    </div>
  );
}
