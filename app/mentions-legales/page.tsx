import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales — Voxstel",
};

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Mentions légales
          </h1>
          <p className="text-sm text-muted italic mb-10">
            Dernière mise à jour : 5 juillet 2026
          </p>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              Hébergement
            </h2>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Hébergement du site web
            </h3>
            <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-1 mb-5">
              <p className="font-semibold text-foreground">Vercel Inc.</p>
              <p className="text-muted">340 S Lemon Ave #4133, Walnut, CA 91789 — États-Unis</p>
              <p className="text-muted">Site web : vercel.com</p>
              <p className="text-muted">Email : privacy@vercel.com</p>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Hébergement de la base de données
            </h3>
            <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-1">
              <p className="font-semibold text-foreground">Supabase, Inc.</p>
              <p className="text-muted">Site web : supabase.com</p>
              <p className="text-muted">
                Données hébergées dans la région : eu-west-1 (Irlande, Union Européenne)
              </p>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              Propriété intellectuelle
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              L&apos;ensemble du contenu du Site (textes, graphismes, logos, icônes, structure,
              base de données) est la propriété exclusive d&apos;Edouard Stellamans, à
              l&apos;exception des marques, logos ou contenus appartenant à d&apos;autres
              sociétés partenaires ou auteurs.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Toute reproduction, distribution, modification, adaptation, retransmission ou
              publication, même partielle, de ces différents éléments est strictement interdite
              sans l&apos;accord exprès par écrit de l&apos;éditeur du Site.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              Limitation de responsabilité
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Voxstel s&apos;efforce d&apos;assurer au mieux de ses possibilités l&apos;exactitude
              et la mise à jour des informations diffusées sur ce site. Toutefois, Voxstel ne peut
              garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations
              mises à disposition sur ce site.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Les contenus générés par l&apos;outil (prompts) sont fournis à titre indicatif et
              leur efficacité dépend des outils d&apos;intelligence artificielle tiers (Midjourney,
              DALL-E, Claude, etc.) auprès desquels ils sont utilisés. Voxstel ne contrôle pas ces
              outils tiers et ne saurait être tenu responsable des résultats obtenus.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              Édition du site
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Le site <strong className="font-semibold text-foreground">voxstel.com</strong>{" "}
              (ci-après « le Site ») est édité par :
            </p>
            <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-1">
              <p className="text-muted">STELLAMANS Edouard</p>
              <p className="text-muted">Entrepreneur individuel (micro-entreprise)</p>
              <p className="text-muted">SIREN : 842 574 956</p>
              <p className="text-muted">SIRET : 842 574 956 00038</p>
              <p className="text-muted">Code APE : 6201Z - Programmation informatique</p>
              <p className="text-muted">
                Adresse : 6 Mail Pierre Charlot, 41000 Blois, France
              </p>
              <a
                href="mailto:essasdev@gmail.com"
                className="text-accent hover:underline inline-block"
              >
                essasdev@gmail.com
              </a>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              Droit applicable
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Les présentes mentions légales sont soumises au droit français. En cas de litige, et
              à défaut de résolution amiable, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">Contact</h2>
            <p className="text-sm text-muted">
              Pour toute question relative aux présentes mentions légales, contactez-nous à :{" "}
              <a href="mailto:essasdev@gmail.com" className="text-accent hover:underline">
                essasdev@gmail.com
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
