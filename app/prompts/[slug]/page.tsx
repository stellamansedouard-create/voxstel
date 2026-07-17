import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AmbianceActions from "@/components/library/AmbianceActions";
import CopyablePrompt from "@/components/library/CopyablePrompt";
import RenderSlot from "@/components/library/RenderSlot";
import { getWording } from "@/lib/ambiance";
import { LIBRARY_PAGES, getLibraryPage } from "@/lib/library";
import { getCategoryById, getToolById } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";

/** Every prompt page is generated at build time — static, indexable HTML. */
export function generateStaticParams() {
  return LIBRARY_PAGES.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const page = getLibraryPage(params.slug);
  if (!page) return {};

  const url = absoluteUrl(`/prompts/${page.slug}`);
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    keywords: page.targetKeywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "fr_FR",
      siteName: "Voxstel",
      title: page.seoTitle,
      description: page.seoDescription,
      url,
    },
  };
}

export default function PromptPage({ params }: { params: { slug: string } }) {
  const page = getLibraryPage(params.slug);
  if (!page) notFound();

  const cat = getCategoryById(page.category);
  const tool = getToolById(page.category, page.tool);
  const w = getWording(page.category);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-2xl mx-auto px-4 py-20">
        <Link
          href="/bibliotheque"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          ← Bibliothèque
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{cat?.icon}</span>
          <h1 className="text-2xl font-bold text-foreground">{page.title}</h1>
        </div>
        <p className="text-muted mb-8">
          {page.tagline}
          {tool && (
            <span className="block text-sm mt-1">
              Écrit pour {tool.name}.
            </span>
          )}
        </p>

        <RenderSlot asset={page.renderAsset} />

        <section className="mb-8">
          <h2 className="sr-only">{w.ambianceLabel}</h2>
          <CopyablePrompt label={w.ambianceLabel} value={page.ambiancePrompt} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Et maintenant, {w.subject} ?
          </h2>
          <AmbianceActions page={page} />
        </section>
      </main>
    </div>
  );
}
