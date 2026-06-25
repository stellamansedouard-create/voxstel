import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Voxstel",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Politique de confidentialité
          </h1>
          <p className="text-sm text-muted italic mb-6">
            Dernière mise à jour : 24 juin 2026
          </p>
          <p className="text-sm text-muted leading-relaxed mb-10">
            Chez Voxstel, la protection de vos données personnelles est une priorité. Cette
            politique de confidentialité vous explique quelles données nous collectons, pourquoi,
            et comment nous les protégeons, conformément au Règlement Général sur la Protection
            des Données (RGPD).
          </p>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">
              1. Qui est responsable du traitement de vos données ?
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Le responsable du traitement des données collectées sur Voxstel est :
            </p>
            <div className="bg-card border border-border rounded-xl p-5 text-sm space-y-1">
              <p className="font-semibold text-foreground">Edouard Stellamans</p>
              <p className="text-muted">SIREN : 842 574 956</p>
              <a
                href="mailto:essasdev@gmail.com"
                className="text-accent hover:underline inline-block"
              >
                essasdev@gmail.com
              </a>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-4">
              2. Quelles données collectons-nous ?
            </h2>
            <h3 className="text-sm font-semibold text-foreground mb-2">Données de compte</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted mb-5">
              <li>Adresse email</li>
              <li>Mot de passe (chiffré, jamais stocké en clair)</li>
              <li>
                Si connexion via Google : nom, photo de profil, adresse email (fournis par Google)
              </li>
            </ul>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Données d&apos;utilisation
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted mb-5">
              <li>
                Historique des prompts générés (catégorie, IA cible, questions/réponses, prompt
                final généré en anglais et français)
              </li>
              <li>Plan d&apos;abonnement souscrit et statut du quota mensuel</li>
              <li>
                Si vous utilisez la fonctionnalité de référence (upload d&apos;image ou de texte) :
                le contenu est analysé à la volée et n&apos;est jamais stocké, ni sur nos serveurs,
                ni dans notre base de données.
              </li>
            </ul>
            <h3 className="text-sm font-semibold text-foreground mb-2">Données de paiement</h3>
            <p className="text-sm text-muted leading-relaxed mb-5">
              Voxstel ne stocke aucune donnée bancaire. Les paiements sont gérés intégralement par
              notre prestataire Stripe, qui dispose de ses propres certifications de sécurité
              (PCI-DSS).
            </p>
            <h3 className="text-sm font-semibold text-foreground mb-2">Données techniques</h3>
            <p className="text-sm text-muted leading-relaxed">
              Adresse IP, type de navigateur, données de connexion (à des fins de sécurité et de
              bon fonctionnement du service).
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-4">
              3. Pourquoi collectons-nous ces données ?
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-6 font-semibold text-foreground">Donnée</th>
                    <th className="text-left py-3 font-semibold text-foreground">Finalité</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-6 text-muted align-top">Email, mot de passe</td>
                    <td className="py-3 text-muted">Créer et sécuriser votre compte</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-6 text-muted align-top">Historique des prompts</td>
                    <td className="py-3 text-muted">
                      Vous permettre de retrouver vos générations passées, gérer votre quota
                    </td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-6 text-muted align-top">
                      Plan d&apos;abonnement
                    </td>
                    <td className="py-3 text-muted">
                      Facturation, gestion des accès aux fonctionnalités
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-6 text-muted align-top">Données techniques</td>
                    <td className="py-3 text-muted">
                      Sécurité, prévention de la fraude, amélioration du service
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              4. Qui a accès à vos données ?
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Vos données sont traitées par Voxstel et par les sous-traitants suivants,
              strictement nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted mb-4">
              <li>
                <strong className="font-semibold text-foreground">Supabase, Inc.</strong> —
                hébergement de la base de données et authentification (données hébergées dans
                l&apos;Union Européenne, région eu-west-1)
              </li>
              <li>
                <strong className="font-semibold text-foreground">Vercel Inc.</strong> —
                hébergement du site web
              </li>
              <li>
                <strong className="font-semibold text-foreground">Anthropic</strong> — traitement
                des descriptions et questions/réponses pour générer les prompts (les contenus
                envoyés à l&apos;API ne sont pas utilisés par Anthropic pour entraîner ses modèles,
                conformément à sa politique d&apos;API commerciale)
              </li>
              <li>
                <strong className="font-semibold text-foreground">Stripe</strong> — traitement des
                paiements
              </li>
            </ul>
            <p className="text-sm text-muted leading-relaxed">
              Nous ne vendons, ne louons et ne partageons jamais vos données personnelles avec des
              tiers à des fins commerciales ou publicitaires.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              5. Combien de temps conservons-nous vos données ?
            </h2>
            <ul className="list-disc pl-5 space-y-2.5 text-sm text-muted">
              <li>
                <strong className="font-semibold text-foreground">Compte actif</strong> : vos
                données sont conservées tant que votre compte est actif.
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Après suppression de votre compte
                </strong>{" "}
                : vos données personnelles sont supprimées de nos bases dans un délai de 30 jours
                suivant votre demande, sauf obligation légale de conservation plus longue (données
                de facturation conservées 10 ans conformément aux obligations comptables françaises).
              </li>
              <li>
                <strong className="font-semibold text-foreground">Compte inactif</strong> : si vous
                n&apos;utilisez pas votre compte gratuit pendant 24 mois consécutifs, nous pourrons
                vous notifier puis supprimer votre compte et les données associées.
              </li>
            </ul>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">6. Vos droits</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Conformément au RGPD, vous disposez des droits suivants concernant vos données
              personnelles :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted mb-4">
              <li>
                <strong className="font-semibold text-foreground">
                  Droit d&apos;accès
                </strong>{" "}
                : obtenir une copie des données que nous détenons sur vous
              </li>
              <li>
                <strong className="font-semibold text-foreground">Droit de rectification</strong> :
                corriger des données inexactes
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Droit à l&apos;effacement
                </strong>{" "}
                : demander la suppression de vos données
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Droit à la limitation du traitement
                </strong>
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Droit à la portabilité
                </strong>{" "}
                : récupérer vos données dans un format réutilisable
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Droit d&apos;opposition
                </strong>
              </li>
            </ul>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Pour exercer ces droits, contactez-nous à :{" "}
              <a href="mailto:essasdev@gmail.com" className="text-accent hover:underline">
                essasdev@gmail.com
              </a>
              . Nous répondrons dans un délai maximum d&apos;un mois.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Vous disposez également du droit d&apos;introduire une réclamation auprès de la{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                CNIL (www.cnil.fr)
              </a>
              .
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">7. Sécurité</h2>
            <p className="text-sm text-muted leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour
              protéger vos données : chiffrement des mots de passe, connexions sécurisées (HTTPS),
              accès restreint aux données via des politiques de sécurité au niveau des lignes (Row
              Level Security) sur notre base de données.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">8. Cookies</h2>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel utilise des cookies strictement nécessaires au fonctionnement du service
              (maintien de votre session de connexion). Nous ne déposons pas de cookies
              publicitaires ou de tracking tiers sans votre consentement préalable.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              9. Transferts hors Union Européenne
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Certains de nos sous-traitants (Vercel, Anthropic, Stripe) sont basés aux
              États-Unis. Ces transferts de données sont encadrés par des garanties appropriées
              (clauses contractuelles types de la Commission Européenne, certifications du Data
              Privacy Framework UE-USA selon le prestataire).
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              10. Modification de cette politique
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Nous pouvons mettre à jour cette politique de confidentialité. En cas de modification
              substantielle, nous vous en informerons par email ou via une notification sur le Site.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">Contact</h2>
            <p className="text-sm text-muted">
              Pour toute question relative à cette politique de confidentialité :{" "}
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
