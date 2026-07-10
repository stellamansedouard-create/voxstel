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

        <div className="border-t border-border pt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Voxstel. Tous droits réservés.
          </p>
          <a
            href="https://www.instagram.com/voxstelpro/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A] hover:text-[#C8910A] transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
            </svg>
            Suivez-nous sur Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
