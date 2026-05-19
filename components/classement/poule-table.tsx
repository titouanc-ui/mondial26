import type { GroupStanding } from "@/lib/data-providers/types";
import { cn } from "@/lib/utils";

interface PouleTableProps {
  group: GroupStanding;
}

export function PouleTable({ group }: PouleTableProps) {
  return (
    <div className="rounded-2xl border border-border bg-bg-card/60 overflow-hidden">
      <div className="flex items-center justify-between border-b border-border bg-bg-elevated/60 px-4 py-3">
        <h3 className="text-sm font-bold uppercase tracking-wider">
          {group.groupName}
        </h3>
        <span className="text-xs text-text-dim">
          {group.standings.reduce((acc, s) => acc + s.playedGames, 0) / 2} /{" "}
          6 matchs
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-dim text-xs uppercase">
            <th className="px-3 py-2 text-left font-medium">#</th>
            <th className="px-3 py-2 text-left font-medium">Équipe</th>
            <th className="px-2 py-2 text-center font-medium tabular">J</th>
            <th className="px-2 py-2 text-center font-medium tabular hidden sm:table-cell">
              G
            </th>
            <th className="px-2 py-2 text-center font-medium tabular hidden sm:table-cell">
              N
            </th>
            <th className="px-2 py-2 text-center font-medium tabular hidden sm:table-cell">
              P
            </th>
            <th className="px-2 py-2 text-center font-medium tabular">+/-</th>
            <th className="px-3 py-2 text-right font-medium tabular">Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.standings.map((row) => (
            <tr
              key={row.team.id}
              className={cn(
                "border-t border-border/50 transition-colors hover:bg-bg-card-hover/50",
                row.position <= 2 &&
                  "bg-gradient-to-r from-accent-green/5 to-transparent",
              )}
            >
              <td className="px-3 py-2.5 tabular">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      row.position === 1 && "bg-accent-gold",
                      row.position === 2 && "bg-accent-green",
                      row.position > 2 && "bg-text-dim",
                    )}
                  />
                  {row.position}
                </div>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center gap-2 font-medium">
                  <span className="font-mono text-xs text-text-dim w-9">
                    {row.team.tla}
                  </span>
                  <span>{row.team.shortName}</span>
                </div>
              </td>
              <td className="px-2 py-2.5 text-center tabular">
                {row.playedGames}
              </td>
              <td className="px-2 py-2.5 text-center tabular hidden sm:table-cell text-success">
                {row.won}
              </td>
              <td className="px-2 py-2.5 text-center tabular hidden sm:table-cell text-text-muted">
                {row.draw}
              </td>
              <td className="px-2 py-2.5 text-center tabular hidden sm:table-cell text-error">
                {row.lost}
              </td>
              <td
                className={cn(
                  "px-2 py-2.5 text-center tabular text-xs",
                  row.goalDifference > 0 && "text-success",
                  row.goalDifference < 0 && "text-error",
                )}
              >
                {row.goalDifference > 0 ? "+" : ""}
                {row.goalDifference}
              </td>
              <td className="px-3 py-2.5 text-right tabular font-bold">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
