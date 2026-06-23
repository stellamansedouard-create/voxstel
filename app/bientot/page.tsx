import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bientôt disponible — Voxstel",
};

export default function BientotPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-24">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">
            🔐
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Bientôt disponible
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            La création de compte et la connexion arrivent très prochainement.
            En attendant, vous pouvez utiliser le générateur de prompts sans compte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/generate/image"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Essayer le générateur <span aria-hidden>→</span>
            </Link>
            <Link
              href="/"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              <span aria-hidden>←</span> Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
