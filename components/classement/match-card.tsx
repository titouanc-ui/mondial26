import type { Match } from "@/lib/data-providers/types";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  compact?: boolean;
}

export function MatchCard({ match, compact }: MatchCardProps) {
  const isLive = match.status === "IN_PLAY" || match.status === "PAUSED";
  const isFinished = match.status === "FINISHED";
  const showScore = isLive || isFinished;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-bg-card/70 transition-colors hover:bg-bg-card",
        compact ? "px-3 py-2.5" : "px-4 py-3",
      )}
    >
      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-text-dim">
        <span>{match.group ?? match.stage.replace(/_/g, " ")}</span>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 text-live font-semibold">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live" />
            {match.minute ? `${match.minute}'` : "LIVE"}
          </span>
        ) : isFinished ? (
          <span className="text-text-muted">Terminé</span>
        ) : (
          <span>{formatTime(match.utcDate)}</span>
        )}
      </div>

      <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-[11px] text-text-dim w-9 shrink-0">
            {match.homeTeam.tla}
          </span>
          <span className="font-medium truncate">
            {match.homeTeam.shortName}
          </span>
        </div>
        <div className="font-mono tabular text-lg font-bold whitespace-nowrap text-center min-w-14">
          {showScore ? (
            <>
              {match.score.home ?? 0}
              <span className="text-text-dim mx-1.5">·</span>
              {match.score.away ?? 0}
            </>
          ) : (
            <span className="text-text-dim text-sm">vs</span>
          )}
        </div>
        <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
          <span className="font-mono text-[11px] text-text-dim w-9 shrink-0 text-right">
            {match.awayTeam.tla}
          </span>
          <span className="font-medium truncate">
            {match.awayTeam.shortName}
          </span>
        </div>
      </div>
    </div>
  );
}
