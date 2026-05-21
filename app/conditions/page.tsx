import Link from "next/link";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation",
  description:
    "Règles d'utilisation du service Mondial 26 : quiz, classement, boutique de cosmétiques.",
};

const LAST_UPDATED = "21 mai 2026";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent-blue/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-blue">
        <FileText className="h-3 w-3" /> Légal
      </div>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        Conditions d'utilisation
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Dernière mise à jour : {LAST_UPDATED}
      </p>

      <div className="prose prose-invert mt-10 space-y-8 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Présentation du service</h2>
          <p className="text-text-muted">
            Mondial 26 est un site personnel et non commercial proposant des
            actualités, statistiques live, classements et un quiz interactif
            autour de la Coupe du Monde de football 2026. L'accès au site est
            gratuit et ne nécessite pas de compte pour la consultation.
          </p>
          <p className="text-text-muted mt-2">
            En utilisant Mondial 26, tu acceptes les présentes conditions. Si tu
            n'es pas d'accord avec l'une d'entre elles, merci de ne pas utiliser
            le service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Modes d'utilisation</h2>
          <p className="text-text-muted">
            Deux modes sont proposés :
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-1 mt-2">
            <li>
              <strong>Mode anonyme</strong> : choix d'un pseudo, sauvegarde de
              tes scores localement et dans le classement
            </li>
            <li>
              <strong>Mode authentifié</strong> : connexion via Google OAuth pour
              débloquer le badge vérifié, la boutique de cosmétiques (Buts), les
              succès et la personnalisation du profil
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Pseudo et contenu utilisateur</h2>
          <p className="text-text-muted">
            Tu es libre de choisir ton pseudo, ta bio et ton équipe favorite,
            sous réserve de respecter les règles suivantes :
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-1 mt-2">
            <li>Pas d'insultes, de propos racistes, sexistes, homophobes</li>
            <li>Pas d'usurpation d'identité (joueurs, célébrités, autres utilisateurs)</li>
            <li>Pas de contenu commercial ou publicitaire</li>
            <li>Pas de liens vers des contenus illégaux ou choquants</li>
            <li>Pas de pseudo ou bio à caractère pornographique</li>
          </ul>
          <p className="text-text-muted mt-3">
            Tout contenu enfreignant ces règles pourra être modifié ou supprimé,
            et le compte associé pourra être suspendu ou supprimé sans préavis.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Quiz et anti-triche</h2>
          <p className="text-text-muted">
            Le quiz Mondial 26 est conçu pour le fair-play : les scores sont
            calculés intégralement côté serveur à partir d'un jeton signé, et
            une vérification de plausibilité est appliquée à chaque soumission.
          </p>
          <p className="text-text-muted mt-2">
            Toute tentative de contournement (manipulation du client, automatisation,
            scripts, exploitation de bugs) est interdite. En cas de détection,
            les scores frauduleux seront supprimés et le compte pourra être
            définitivement banni du classement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Buts et boutique</h2>
          <p className="text-text-muted">
            Les <strong>Buts</strong> sont une monnaie virtuelle interne à
            Mondial 26, gagnée en jouant des quiz et en débloquant des succès.
            Ils permettent d'acheter des objets cosmétiques (bannières, cadres,
            badges, icônes) qui ne donnent aucun avantage de gameplay.
          </p>
          <p className="text-text-muted mt-2">
            <strong>Les Buts n'ont aucune valeur monétaire réelle</strong>, ne
            peuvent pas être achetés, échangés contre de l'argent ni transférés
            entre comptes. Ils sont liés à un compte unique et perdus à la
            suppression de celui-ci.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Sources des données</h2>
          <p className="text-text-muted">
            Les actualités proviennent des flux RSS publics de médias français
            (L'Équipe, RMC Sport, So Foot, Foot Mercato, Le Monde, France
            Bleu). Le contenu reste la propriété de ces médias ; Mondial 26 se
            contente d'afficher un titre, une description courte et un lien
            vers la source.
          </p>
          <p className="text-text-muted mt-2">
            Les données de matchs et statistiques proviennent de fournisseurs
            tiers (Football-Data.org, API-Football). Aucune garantie n'est
            donnée sur leur exactitude ou leur disponibilité.
          </p>
          <p className="text-text-muted mt-2">
            Mondial 26 n'est <strong>pas affilié à la FIFA</strong>, à l'UEFA, à
            une fédération ou à un club. Toutes les marques et logos cités
            restent la propriété de leurs ayants droit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Disponibilité du service</h2>
          <p className="text-text-muted">
            Le service est fourni "tel quel", sans garantie de disponibilité
            permanente. Des interruptions peuvent survenir pour maintenance, mise
            à jour ou cause technique. L'éditeur ne peut être tenu responsable
            d'éventuelles pertes de données, de scores ou de Buts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Suppression de compte</h2>
          <p className="text-text-muted">
            Tu peux demander la suppression de ton compte à tout moment en
            écrivant à{" "}
            <a
              href="mailto:titouan.c@tteau.com"
              className="text-accent-blue hover:underline"
            >
              titouan.c@tteau.com
            </a>
            . Toutes tes données personnelles seront effacées sous 30 jours, y
            compris tes scores, ton inventaire et tes Buts.
          </p>
          <p className="text-text-muted mt-2">
            L'éditeur se réserve le droit de suspendre ou supprimer un compte en
            cas de manquement aux présentes conditions, après avertissement
            préalable lorsque la situation le permet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">9. Propriété intellectuelle</h2>
          <p className="text-text-muted">
            Le design, le code source, les illustrations et les questions du
            quiz Mondial 26 sont la propriété de l'éditeur. Toute reproduction
            ou réutilisation sans autorisation préalable est interdite.
          </p>
          <p className="text-text-muted mt-2">
            Le contenu généré par les utilisateurs (pseudo, bio, avatar) reste
            la propriété de leurs auteurs, mais tu accordes à Mondial 26 le
            droit non-exclusif de l'afficher dans le cadre du service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">10. Droit applicable</h2>
          <p className="text-text-muted">
            Les présentes conditions sont régies par le droit français. Tout
            litige relatif à leur interprétation ou à leur exécution relève des
            tribunaux français compétents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">11. Contact</h2>
          <p className="text-text-muted">
            Pour toute question concernant ces conditions, écris-nous à{" "}
            <a
              href="mailto:titouan.c@tteau.com"
              className="text-accent-blue hover:underline"
            >
              titouan.c@tteau.com
            </a>
            .
          </p>
        </section>

        <div className="pt-6 border-t border-border text-xs text-text-dim">
          Voir aussi :{" "}
          <Link
            href="/confidentialite"
            className="text-accent-blue hover:underline"
          >
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
}
