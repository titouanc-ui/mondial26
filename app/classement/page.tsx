import Link from "next/link";
import { getFootballProvider } from "@/lib/data-providers";
import { PouleTable } from "@/components/classement/poule-table";
import { MatchCard } from "@/components/classement/match-card";
import { GitBranch } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Classement des poules",
  description:
    "Les 12 poules de qualification de la Coupe du Monde 2026, mises à jour en direct.",
};

export const revalidate = 300;

export default async function ClassementPage() {
  const provider = getFootballProvider();
  const [standings, matches] = await Promise.all([
    provider.getStandings(),
    provider.getMatches(),
  ]);

  const upcoming = matches
    .filter((m) => m.status === "SCHEDULED")
    .sort((a, b) => a.utcDate.localeCompare(b.utcDate))
    .slice(0, 6);

  const byDate = upcoming.reduce<Record<string, typeof upcoming>>((acc, m) => {
    const day = m.utcDate.slice(0, 10);
    (acc[day] ||= []).push(m);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Classement
          </h1>
          <p className="mt-2 text-text-muted">
            Phase de poules · 48 équipes réparties en 12 groupes de 4
          </p>
        </div>

        <Link
          href="/classement/phases-finales"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm font-medium hover:bg-bg-card-hover transition-colors"
        >
          <GitBranch className="h-4 w-4" />
          Phases finales
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {standings.length === 0 ? (
              <div className="sm:col-span-2 rounded-xl border border-border bg-bg-card/50 p-6 text-center text-text-muted">
                Les poules officielles seront affichées dès que les données
                seront disponibles.
              </div>
            ) : (
              standings.map((g) => (
                <PouleTable key={g.groupId} group={g} />
              ))
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-text-dim mb-3">
              Prochains matchs
            </h2>
            {Object.keys(byDate).length === 0 ? (
              <div className="rounded-xl border border-border bg-bg-card/50 p-4 text-sm text-text-muted">
                Aucun match programmé pour le moment.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(byDate).map(([day, list]) => (
                  <div key={day}>
                    <div className="text-xs font-semibold text-text-muted mb-2">
                      {formatDate(day, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                    <div className="space-y-2">
                      {list.map((m) => (
                        <MatchCard key={m.id} match={m} compact />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-accent-green/10 via-bg-card/50 to-bg-card p-4">
            <h3 className="text-sm font-bold">À retenir</h3>
            <ul className="mt-2 space-y-1.5 text-xs text-text-muted">
              <li>· Les 2 premiers de chaque groupe + les 8 meilleurs 3èmes sont qualifiés pour les 1/16 de finale</li>
              <li>· Format à 48 équipes pour la 1ère fois</li>
              <li>· 104 matchs au total</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
