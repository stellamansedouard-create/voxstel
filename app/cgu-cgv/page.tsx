import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CGU & CGV — Voxstel",
};

export default function CguCgvPage() {
  return (
    <>
      <main className="min-h-screen bg-background pt-24 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Conditions Générales d&apos;Utilisation et de Vente
          </h1>
          <p className="text-sm text-muted italic mb-10">
            Dernière mise à jour : 24 juin 2026
          </p>

          <section>
            <h2 className="text-base font-bold text-foreground mb-3">1. Objet</h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Les présentes Conditions Générales d&apos;Utilisation et de Vente (ci-après
              « CGU/CGV ») régissent l&apos;utilisation du service Voxstel, accessible à
              l&apos;adresse voxstel.com (ci-après « le Service »), édité par Edouard Stellamans
              (SIREN : 842 574 956).
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel est un générateur de prompts optimisés pour des outils d&apos;intelligence
              artificielle générative (image, vidéo, texte/code, musique). En créant un compte ou
              en utilisant le Service, vous acceptez sans réserve les présentes CGU/CGV.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              2. Description du service
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Voxstel permet à l&apos;utilisateur de décrire en langage naturel ce qu&apos;il
              souhaite créer, et génère un prompt optimisé adapté à l&apos;outil
              d&apos;intelligence artificielle de son choix (Midjourney, DALL-E 3, Sora, Claude,
              Suno, etc.), en anglais et en français.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel n&apos;est affilié à aucun des outils d&apos;IA cités et ne garantit pas le
              résultat obtenu en utilisant le prompt généré sur ces plateformes tierces.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              3. Création de compte
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              L&apos;utilisation de certaines fonctionnalités du Service nécessite la création
              d&apos;un compte. Vous vous engagez à fournir des informations exactes et à les
              maintenir à jour. Vous êtes responsable de la confidentialité de vos identifiants
              de connexion.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-4">
              4. Plans et tarifs
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 font-semibold text-foreground">Plan</th>
                    <th className="text-left py-3 pr-4 font-semibold text-foreground">Tarif</th>
                    <th className="text-left py-3 pr-4 font-semibold text-foreground">
                      Prompts/mois
                    </th>
                    <th className="text-left py-3 font-semibold text-foreground">
                      Fonctionnalités
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-foreground">Free</td>
                    <td className="py-3 pr-4 text-muted">Gratuit</td>
                    <td className="py-3 pr-4 text-muted">5</td>
                    <td className="py-3 text-muted">Catégories Image et Texte</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-foreground">Pro</td>
                    <td className="py-3 pr-4 text-muted">8,99 €/mois</td>
                    <td className="py-3 pr-4 text-muted">50</td>
                    <td className="py-3 text-muted">Toutes catégories</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-medium text-foreground">Illimité</td>
                    <td className="py-3 pr-4 text-muted">17,99 €/mois</td>
                    <td className="py-3 pr-4 text-muted">Illimité</td>
                    <td className="py-3 text-muted">Toutes catégories + upload de référence</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-medium text-foreground">Pro Max</td>
                    <td className="py-3 pr-4 text-muted">29,99 €/mois</td>
                    <td className="py-3 pr-4 text-muted">Illimité</td>
                    <td className="py-3 text-muted">
                      Toutes catégories + référence + génération avancée
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Les tarifs sont indiqués en euros, toutes taxes comprises (TTC) le cas échéant selon
              le statut fiscal applicable. Voxstel se réserve le droit de modifier ses tarifs à
              tout moment ; toute modification sera communiquée aux abonnés actifs avant son entrée
              en vigueur, et ne s&apos;appliquera pas avant le renouvellement suivant de leur
              abonnement.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              5. Abonnement, paiement et renouvellement
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Les abonnements payants sont facturés mensuellement via notre prestataire de
              paiement Stripe. L&apos;abonnement se renouvelle automatiquement chaque mois sauf
              résiliation de votre part avant la date de renouvellement.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Vous pouvez résilier votre abonnement à tout moment depuis votre espace personnel.
              La résiliation prend effet à la fin de la période déjà payée ; aucun remboursement
              au prorata n&apos;est effectué pour la période en cours, sauf disposition légale
              contraire.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              6. Droit de rétractation
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Conformément à l&apos;article L221-28 du Code de la consommation, le droit de
              rétractation ne s&apos;applique pas aux contenus numériques fournis sur un support
              immatériel dont l&apos;exécution a commencé avec votre accord préalable exprès, et
              renoncement exprès à votre droit de rétractation, ce que vous acceptez en
              souscrivant à un abonnement payant et en commençant à utiliser le Service.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              7. Quotas et usage du service
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Chaque plan dispose d&apos;un quota mensuel de générations de prompts, réinitialisé
              chaque mois. Les affinages d&apos;un même résultat (fonctionnalités « Approfondir »
              / « Renforcer ») sont gratuits dans la limite de 5 par résultat généré, et ne
              décomptent pas du quota mensuel.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel se réserve le droit de suspendre ou limiter l&apos;accès au Service en cas
              d&apos;usage abusif, frauduleux, ou de tentative de contournement des quotas
              (notamment par la création de comptes multiples).
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              8. Propriété des contenus générés
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Les prompts générés via Voxstel vous appartiennent et vous pouvez les utiliser
              librement, y compris à des fins commerciales, sur les plateformes d&apos;intelligence
              artificielle de votre choix.
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel ne revendique aucun droit de propriété sur les prompts générés pour votre
              compte, ni sur les créations (images, vidéos, textes, musiques) que vous pourriez
              produire en utilisant ces prompts sur des outils tiers.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              9. Obligations de l&apos;utilisateur
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Vous vous engagez à :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted mb-3">
              <li>Ne pas utiliser le Service à des fins illégales ou contraires aux bonnes mœurs</li>
              <li>
                Ne pas tenter de contourner les limitations techniques du Service (quotas, plans)
              </li>
              <li>
                Ne pas utiliser le Service pour générer des prompts visant à créer des contenus
                illégaux, diffamatoires, ou portant atteinte aux droits de tiers
              </li>
            </ul>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel se réserve le droit de suspendre tout compte ne respectant pas ces
              obligations.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              10. Disponibilité du service
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel s&apos;efforce d&apos;assurer une disponibilité continue du Service mais ne
              garantit pas une disponibilité ininterrompue. Des interruptions peuvent survenir pour
              maintenance, mise à jour, ou pour des raisons indépendantes de notre volonté (panne
              de nos prestataires techniques tiers).
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              11. Limitation de responsabilité
            </h2>
            <p className="text-sm text-muted leading-relaxed mb-3">
              Voxstel agit en tant qu&apos;intermédiaire technique générant des prompts optimisés.
              Voxstel ne saurait être tenu responsable :
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted">
              <li>
                Des résultats obtenus en utilisant les prompts générés sur des plateformes
                d&apos;IA tierces
              </li>
              <li>
                De l&apos;indisponibilité ou des dysfonctionnements de ces plateformes tierces
              </li>
              <li>
                De l&apos;usage que vous faites des contenus générés à l&apos;aide de ces prompts
              </li>
            </ul>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              12. Modification des CGU/CGV
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Voxstel se réserve le droit de modifier les présentes CGU/CGV à tout moment. Les
              utilisateurs seront informés de toute modification substantielle par email ou
              notification sur le Site. La poursuite de l&apos;utilisation du Service après
              notification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">
              13. Droit applicable et litiges
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Les présentes CGU/CGV sont soumises au droit français. En cas de litige, et après
              tentative de résolution amiable, les tribunaux français seront seuls compétents, sous
              réserve des dispositions impératives applicables aux consommateurs.
            </p>
          </section>

          <section className="mt-8 pt-8 border-t border-border">
            <h2 className="text-base font-bold text-foreground mb-3">Contact</h2>
            <p className="text-sm text-muted">
              Pour toute question relative aux présentes CGU/CGV :{" "}
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
