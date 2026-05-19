import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar } from "lucide-react";
import { getFootballProvider } from "@/lib/data-providers";
import { formatDate, formatTime } from "@/lib/utils";

export const revalidate = 60;

export default async function MatchPage(props: PageProps<"/stats/match/[id]">) {
  const { id } = await props.params;
  const provider = getFootballProvider();
  const match = await provider.getMatchById(id);
  if (!match) notFound();

  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const showScore = isLive || isFinished;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/stats"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux stats
      </Link>

      <div className="mt-4 rounded-2xl border border-border bg-bg-card/60 p-6 sm:p-8">
        <div className="text-center text-xs uppercase tracking-wider text-text-dim">
          {match.group ?? match.stage.replace(/_/g, " ")} ·{" "}
          {match.matchday && `Journée ${match.matchday}`}
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold">
              {match.homeTeam.shortName}
            </div>
            <div className="mt-1 text-xs font-mono text-text-dim">
              {match.homeTeam.tla}
            </div>
          </div>
          <div className="text-center">
            {showScore ? (
              <div className="font-mono tabular text-5xl sm:text-7xl font-bold">
                {match.score.home ?? 0}
                <span className="text-text-dim mx-2 sm:mx-4">·</span>
                {match.score.away ?? 0}
              </div>
            ) : (
              <div className="font-mono tabular text-3xl sm:text-5xl font-bold text-text-muted">
                {formatTime(match.utcDate)}
              </div>
            )}
            {isLive && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-live text-sm font-semibold">
                <span className="live-dot inline-block h-2 w-2 rounded-full bg-live" />
                {match.minute ? `${match.minute}'` : "LIVE"}
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-5xl font-bold">
              {match.awayTeam.shortName}
            </div>
            <div className="mt-1 text-xs font-mono text-text-dim">
              {match.awayTeam.tla}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(match.utcDate, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </span>
          {match.venue && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {match.venue}
            </span>
          )}
        </div>
      </div>

      {Object.keys(match.stats).length === 0 ? (
        <div className="mt-6 rounded-xl border border-border bg-bg-card/40 p-6 text-center text-sm text-text-muted">
          Les statistiques détaillées (possession, tirs, xG, lineups) seront
          disponibles dès l'activation de l'API premium.
        </div>
      ) : (
        <StatsBlock stats={match.stats} />
      )}
    </div>
  );
}

function StatsBlock({ stats }: { stats: import("@/lib/data-providers/types").MatchStats }) {
  const rows = [
    ["Possession", stats.possession],
    ["Tirs", stats.shots],
    ["Tirs cadrés", stats.shotsOnTarget],
    ["Corners", stats.corners],
    ["Fautes", stats.fouls],
    ["Cartons jaunes", stats.yellowCards],
    ["xG", stats.expectedGoals],
  ] as const;

  return (
    <div className="mt-6 rounded-2xl border border-border bg-bg-card/60 p-5">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
        Statistiques
      </h2>
      <div className="space-y-3">
        {rows
          .filter(([, v]) => v)
          .map(([label, v]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-sm">
                <span className="tabular font-mono text-text">{v!.home}</span>
                <span className="text-text-muted text-xs">{label}</span>
                <span className="tabular font-mono text-text">{v!.away}</span>
              </div>
              <div className="mt-1 flex h-1 rounded-full overflow-hidden bg-bg-elevated">
                <div
                  className="bg-accent-blue"
                  style={{
                    width: `${(v!.home / (v!.home + v!.away || 1)) * 100}%`,
                  }}
                />
                <div
                  className="bg-accent-red"
                  style={{
                    width: `${(v!.away / (v!.home + v!.away || 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
