import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-3">
              <span className="text-xl font-bold text-foreground">
                Vox<span className="text-accent">stel</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Générez des prompts professionnels pour toutes les IAs génératives.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Produit
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  href="/generate/image"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Générateur
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              Légal & Contact
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/cgu-cgv"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  CGU & CGV
                </Link>
              </li>
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Confidentialité
                </Link>
              </li>
              <li>
                <a
                  href="mailto:essasdev@gmail.com"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  essasdev@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Voxstel. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
