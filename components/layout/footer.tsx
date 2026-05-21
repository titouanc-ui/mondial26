import Link from "next/link";
import { Trophy } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent-red to-accent-blue text-white">
                <Trophy className="h-4 w-4" />
              </span>
              <span>
                Mondial<span className="text-accent-red">26</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-text-muted">
              Tout le Mondial 2026 entre potes : news, stats live, classement
              et un quiz pour défier ton groupe.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:gap-12">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                Suivre
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/news"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/stats"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Stats live
                  </Link>
                </li>
                <li>
                  <Link
                    href="/classement"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Classement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                Jouer
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link
                    href="/quiz"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Quiz
                  </Link>
                </li>
                <li>
                  <Link
                    href="/classement-joueurs"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Top joueurs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                Infos
              </h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="text-text-muted">
                  USA · Canada · Mexique
                </li>
                <li className="text-text-muted">11 juin → 19 juillet 2026</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-text-dim">
          <p>
            Mondial 26 n'est pas affilié à la FIFA. Les actualités sont issues
            des flux publics des médias référencés. Les données de matchs
            proviennent de fournisseurs tiers.
          </p>
          <nav className="flex gap-4 shrink-0">
            <Link
              href="/confidentialite"
              className="hover:text-text transition-colors whitespace-nowrap"
            >
              Confidentialité
            </Link>
            <Link
              href="/conditions"
              className="hover:text-text transition-colors whitespace-nowrap"
            >
              Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
