import Link from "next/link";
import { getFootballProvider } from "@/lib/data-providers";
import { MatchCard } from "@/components/classement/match-card";
import { Trophy, Target } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stats live",
  description:
    "Statistiques de matchs de la Coupe du Monde 2026 : matchs en direct, terminés et à venir, classement des buteurs.",
};

export const revalidate = 120;

export default async function StatsPage() {
  const provider = getFootballProvider();
  const [matches, scorers] = await Promise.all([
    provider.getMatches(),
    provider.getTopScorers(10).catch(() => []),
  ]);

  const live = matches.filter(
    (m) => m.status === "IN_PLAY" || m.status === "PAUSED",
  );
  const finished = matches
    .filter((m) => m.status === "FINISHED")
    .sort((a, b) => b.utcDate.localeCompare(a.utcDate))
    .slice(0, 6);
  const upcoming = matches
    .filter((m) => m.status === "SCHEDULED")
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        Stats live
      </h1>
      <p className="mt-2 text-text-muted">
        Tous les matchs, les résultats, les buteurs.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <span className="live-dot inline-block h-2 w-2 rounded-full bg-live" />
              <h2 className="text-lg font-bold uppercase tracking-wider">
                En direct
              </h2>
              <span className="text-xs text-text-dim">
                ({live.length} {live.length > 1 ? "matchs" : "match"})
              </span>
            </div>
            {live.length === 0 ? (
              <div className="rounded-xl border border-border bg-bg-card/50 p-6 text-center text-sm text-text-muted">
                Aucun match en cours pour le moment.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {live.map((m) => (
                  <Link key={m.id} href={`/stats/match/${m.id}`}>
                    <MatchCard match={m} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3">
              Résultats récents
            </h2>
            {finished.length === 0 ? (
              <div className="rounded-xl border border-border bg-bg-card/50 p-6 text-center text-sm text-text-muted">
                Aucun résultat à afficher.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {finished.map((m) => (
                  <Link key={m.id} href={`/stats/match/${m.id}`}>
                    <MatchCard match={m} />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-bold uppercase tracking-wider mb-3">
              À venir
            </h2>
            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-border bg-bg-card/50 p-6 text-center text-sm text-text-muted">
                Aucun match programmé.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {upcoming.map((m) => (
                  <Link key={m.id} href={`/stats/match/${m.id}`}>
                    <MatchCard match={m} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-bg-card/60 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-accent-gold" />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                Soulier d'Or
              </h2>
            </div>
            {scorers.length === 0 ? (
              <p className="text-sm text-text-muted">
                Le classement des buteurs s'affichera dès les premiers buts
                marqués.
              </p>
            ) : (
              <ol className="space-y-2">
                {scorers.map((s, i) => (
                  <li
                    key={s.player.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="tabular w-5 text-text-dim text-right">
                      {i + 1}
                    </span>
                    <span className="flex-1 truncate font-medium">
                      {s.player.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {s.player.teamName}
                    </span>
                    <span className="tabular font-mono font-bold text-accent-red w-8 text-right">
                      {s.goals}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-blue/10 via-bg-card/50 to-bg-card p-5">
            <Trophy className="h-5 w-5 text-accent-gold mb-2" />
            <h3 className="font-bold">Données live</h3>
            <p className="mt-1 text-xs text-text-muted">
              Les stats détaillées par match (possession, xG, tirs, lineups)
              s'enrichissent progressivement à mesure que la compétition
              avance.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
