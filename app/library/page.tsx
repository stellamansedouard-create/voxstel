import Link from "next/link";
import { LIBRARY_PAGES } from "@/lib/library";
import { getCategoryById } from "@/lib/metadata";

export const metadata = {
  title: "Bibliothèque — Voxstel",
  robots: { index: false, follow: false },
};

export default function LibraryIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">Bibliothèque</h1>
        <p className="text-muted mb-8">
          Choisissez une base, gardez-la ou ajustez-la, puis donnez-lui votre
          sujet.
        </p>

        <div className="space-y-3">
          {LIBRARY_PAGES.map((page) => {
            const cat = getCategoryById(page.category);
            return (
              <Link
                key={page.slug}
                href={`/library/${page.slug}`}
                className="block px-5 py-4 rounded-xl border border-border bg-white hover:border-accent hover:bg-accent/5 transition-all duration-150"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{cat?.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {page.title}
                  </span>
                </div>
                <p className="text-sm text-muted">{page.tagline}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
