"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Crown, Medal, Trophy } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import type { LeaderboardEntry } from "@/lib/supabase/types";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Props {
  initial: LeaderboardEntry[];
}

const RANK_DECORATION = (rank: number) => {
  if (rank === 1)
    return {
      icon: <Crown className="h-4 w-4 text-accent-gold" />,
      bg: "from-accent-gold/15 to-transparent",
    };
  if (rank === 2)
    return {
      icon: <Medal className="h-4 w-4 text-gray-300" />,
      bg: "from-gray-300/10 to-transparent",
    };
  if (rank === 3)
    return {
      icon: <Medal className="h-4 w-4 text-amber-700" />,
      bg: "from-amber-700/10 to-transparent",
    };
  return { icon: null, bg: "" };
};

export function LeaderboardTable({ initial }: Props) {
  const [entries, setEntries] = useState(initial);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const supabase = getSupabaseBrowser();
    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_sessions" },
        async () => {
          const { data } = await supabase
            .from("leaderboard_global")
            .select("*")
            .limit(50);
          if (data) setEntries(data);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-bg-card/50 p-10 text-center text-text-muted">
        <Trophy className="h-8 w-8 mx-auto text-text-dim" />
        <p className="mt-3 text-sm">
          Personne n'a encore joué. Sois le premier à lancer un quiz !
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-dim text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left font-medium">#</th>
            <th className="px-3 py-3 text-left font-medium">Joueur</th>
            <th className="px-3 py-3 text-center font-medium tabular hidden sm:table-cell">
              Parties
            </th>
            <th className="px-3 py-3 text-right font-medium tabular hidden sm:table-cell">
              Dernière
            </th>
            <th className="px-3 py-3 text-right font-medium tabular">
              Meilleur
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => {
            const rank = i + 1;
            const deco = RANK_DECORATION(rank);
            return (
              <tr
                key={e.profile_id}
                className={cn(
                  "border-t border-border/40 transition-colors hover:bg-bg-card-hover/40",
                  deco.bg && `bg-gradient-to-r ${deco.bg}`,
                )}
              >
                <td className="px-3 py-3 tabular">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-bold">{rank}</span>
                    {deco.icon}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="truncate">{e.pseudo}</span>
                    {e.is_verified && (
                      <span
                        title="Compte vérifié"
                        className="inline-flex items-center"
                      >
                        <BadgeCheck className="h-3.5 w-3.5 text-accent-blue" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 text-center tabular hidden sm:table-cell text-text-muted">
                  {e.games_played}
                </td>
                <td className="px-3 py-3 text-right tabular hidden sm:table-cell text-text-dim text-xs">
                  {formatRelativeTime(e.last_played)}
                </td>
                <td className="px-3 py-3 text-right tabular font-mono font-bold text-accent-red">
                  {e.best_score}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
