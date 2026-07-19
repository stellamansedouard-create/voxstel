import Link from "next/link";
import { CATEGORIES } from "@/lib/metadata";

export default function GenerateCategoryPage() {
  return (
    <>
      <main className="min-h-screen bg-background pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-3 block">
              Générateur de prompts
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Que voulez-vous créer ?
            </h1>
            <p className="text-muted text-base">
              Choisissez une catégorie pour commencer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/generate/${cat.id}`}
                className="group bg-card border border-border rounded-2xl p-6 hover:border-accent hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                    {cat.icon}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors mb-1">
                      {cat.label}
                    </h2>
                    <p className="text-sm text-muted leading-relaxed">
                      {cat.tools.length} outils disponibles
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                  <span className="text-sm font-semibold text-accent">Générer un prompt</span>
                  <span className="text-accent" aria-hidden>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
