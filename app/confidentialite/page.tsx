import Link from "next/link";
import { Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Données collectées, durée de conservation et droits RGPD des utilisateurs de Mondial 26.",
};

const LAST_UPDATED = "21 mai 2026";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="inline-flex items-center gap-2 rounded-full bg-accent-blue/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-blue">
        <Shield className="h-3 w-3" /> Légal
      </div>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        Politique de confidentialité
      </h1>
      <p className="mt-2 text-sm text-text-muted">
        Dernière mise à jour : {LAST_UPDATED}
      </p>

      <div className="prose prose-invert mt-10 space-y-8 text-sm sm:text-base leading-relaxed">
        <section>
          <h2 className="text-xl font-bold mb-2">1. Qui sommes-nous ?</h2>
          <p className="text-text-muted">
            Mondial 26 est un site personnel et non commercial dédié à la Coupe
            du Monde de football 2026 : actualités, statistiques, classements et
            quiz. Il est édité par un particulier, Titouan Catteau, et hébergé
            sur Vercel (Vercel Inc., États-Unis).
          </p>
          <p className="text-text-muted mt-2">
            Pour toute question concernant tes données, contacte-nous via{" "}
            <a
              href="mailto:contact@mondial26.app"
              className="text-accent-blue hover:underline"
            >
              contact@mondial26.app
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">2. Données collectées</h2>
          <p className="text-text-muted">
            Mondial 26 propose deux modes d'utilisation : <strong>anonyme</strong>{" "}
            (avec un simple pseudo) ou <strong>authentifié</strong> via Google OAuth.
            Les données collectées varient en conséquence.
          </p>
          <h3 className="font-semibold mt-4 mb-1">Mode anonyme</h3>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Pseudo choisi par l'utilisateur (2 à 20 caractères)</li>
            <li>Scores et historique des parties de quiz</li>
            <li>Cookie de session anonyme (durée : 30 jours)</li>
          </ul>
          <h3 className="font-semibold mt-4 mb-1">Mode Google OAuth</h3>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>Adresse email Google (pour identifier le compte)</li>
            <li>Nom complet et photo de profil Google (optionnel, modifiables)</li>
            <li>Pseudo, bio, équipe favorite, avatar personnalisé</li>
            <li>Scores et historique de quiz, succès débloqués</li>
            <li>Inventaire des objets cosmétiques achetés (bannières, cadres, badges, icônes)</li>
            <li>
              Compteurs internes : nombre de parties jouées, points cumulés, Buts
              gagnés
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">3. Pourquoi ces données ?</h2>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>
              <strong>Faire fonctionner le service</strong> : authentification,
              affichage du classement, sauvegarde de la progression
            </li>
            <li>
              <strong>Personnaliser ton expérience</strong> : avatar, équipe
              favorite, cosmétiques équipés
            </li>
            <li>
              <strong>Mesurer la progression</strong> : succès, ligue, statistiques
              publiques (visibles par tous les joueurs)
            </li>
          </ul>
          <p className="text-text-muted mt-3">
            Aucune donnée n'est utilisée à des fins publicitaires. Aucun pixel de
            tracking tiers (Facebook, TikTok, etc.) n'est embarqué. Aucun
            cookie tiers de marketing n'est posé.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">4. Où sont stockées tes données ?</h2>
          <p className="text-text-muted">
            Les données sont stockées par Supabase (Supabase Inc.) sur une base
            PostgreSQL hébergée dans l'Union européenne. L'authentification Google
            transite par les serveurs de Google selon{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              leur politique de confidentialité
            </a>
            .
          </p>
          <p className="text-text-muted mt-2">
            Le site lui-même est hébergé par Vercel Inc. (États-Unis), via des
            CDN répartis géographiquement. Aucune donnée personnelle n'est
            stockée durablement chez Vercel : leur rôle se limite à servir les
            pages et les routes API.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">5. Durée de conservation</h2>
          <ul className="list-disc list-inside text-text-muted space-y-1">
            <li>
              <strong>Profils anonymes (pseudo)</strong> : conservés tant que le
              cookie est actif, supprimés automatiquement après 30 jours sans
              activité
            </li>
            <li>
              <strong>Profils Google authentifiés</strong> : conservés tant que
              le compte existe. Suppression sur demande (voir section 6)
            </li>
            <li>
              <strong>Logs serveurs</strong> : conservés 30 jours maximum, à des
              fins de sécurité et de débogage
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">6. Tes droits (RGPD)</h2>
          <p className="text-text-muted">
            Conformément au Règlement Général sur la Protection des Données, tu
            disposes des droits suivants :
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-1 mt-2">
            <li>
              <strong>Droit d'accès</strong> : obtenir une copie des données que
              nous détenons sur toi
            </li>
            <li>
              <strong>Droit de rectification</strong> : modifier ton pseudo, ta
              bio, ton équipe favorite directement depuis ton profil
            </li>
            <li>
              <strong>Droit à l'effacement</strong> : demander la suppression
              définitive de ton compte et de toutes les données associées
            </li>
            <li>
              <strong>Droit à la portabilité</strong> : recevoir tes données dans
              un format structuré
            </li>
            <li>
              <strong>Droit d'opposition</strong> : t'opposer au traitement de
              tes données
            </li>
          </ul>
          <p className="text-text-muted mt-3">
            Pour exercer ces droits, envoie une demande à{" "}
            <a
              href="mailto:contact@mondial26.app"
              className="text-accent-blue hover:underline"
            >
              contact@mondial26.app
            </a>{" "}
            avec ton pseudo ou ton email Google. Nous répondons sous 30 jours
            maximum.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">7. Cookies</h2>
          <p className="text-text-muted">
            Mondial 26 n'utilise que des cookies <strong>strictement
            nécessaires</strong> au fonctionnement du site :
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-1 mt-2">
            <li>
              <code className="text-xs">m26-profile</code> : identifiant
              anonyme pour sauvegarder ton pseudo et tes scores (30 jours)
            </li>
            <li>
              <code className="text-xs">sb-*</code> : cookies de session Supabase
              pour l'authentification Google (durée de la session)
            </li>
          </ul>
          <p className="text-text-muted mt-3">
            Aucun cookie publicitaire, aucun cookie d'analyse tiers (Google
            Analytics, etc.). Pas de bannière de consentement nécessaire : tu
            n'as rien à accepter au-delà des cookies techniques.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">8. Sécurité</h2>
          <p className="text-text-muted">
            Toutes les communications sont chiffrées en HTTPS. Les mots de passe
            ne sont jamais collectés directement par Mondial 26 (authentification
            déléguée à Google). L'accès aux données est restreint au strict
            minimum et protégé par Row Level Security côté base de données.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">9. Modifications de la politique</h2>
          <p className="text-text-muted">
            Cette politique peut être amenée à évoluer. La date de dernière mise
            à jour est indiquée en haut de page. Les utilisateurs ayant un compte
            Google seront notifiés par email en cas de changement substantiel.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">10. Réclamation</h2>
          <p className="text-text-muted">
            Si tu estimes que tes droits ne sont pas respectés, tu peux déposer
            une réclamation auprès de la CNIL :{" "}
            <a
              href="https://www.cnil.fr/fr/plaintes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              cnil.fr/plaintes
            </a>
            .
          </p>
        </section>

        <div className="pt-6 border-t border-border text-xs text-text-dim">
          Voir aussi :{" "}
          <Link href="/conditions" className="text-accent-blue hover:underline">
            Conditions d'utilisation
          </Link>
        </div>
      </div>
    </div>
  );
}
