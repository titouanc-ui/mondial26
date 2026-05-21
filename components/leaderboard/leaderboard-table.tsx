"use client";

import { useState } from "react";
import { Crown, Medal, Trophy } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PlayerProfileModal } from "@/components/profile/player-profile-modal";
import { VerifiedPseudo } from "@/components/player/verified-pseudo";
import { useRealtimeList } from "@/lib/hooks/use-realtime-list";
import type { LeaderboardEntry } from "@/lib/supabase/types";
import { cn, formatRelativeTime } from "@/lib/utils";

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

/**
 * LeaderboardTable charge ses propres données côté client pour que la page
 * s'affiche instantanément (la requête Supabase server-side ralentissait
 * la TTFB de plusieurs secondes).
 *
 * Realtime debouncé (2 sec) : si plusieurs sessions sont insérées coup sur
 * coup (soir de quiz à plusieurs), on ne refait qu'un seul refetch.
 */
export function LeaderboardTable() {
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);

  const entries = useRealtimeList<LeaderboardEntry>({
    channelName: "leaderboard",
    watchTable: "quiz_sessions",
    fetcher: (supabase) =>
      supabase
        .from("leaderboard_global")
        .select(
          "profile_id, pseudo, is_verified, avatar_url, favorite_team, equipped_frame, equipped_badge, best_score, games_played, last_played",
        )
        .order("best_score", { ascending: false })
        .order("last_played", { ascending: false })
        .limit(50),
  });

  if (entries === null) {
    return <LeaderboardSkeleton />;
  }

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
    <>
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-dim text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left font-medium w-12">#</th>
            <th className="px-3 py-3 text-left font-medium">Joueur</th>
            <th className="px-3 py-3 text-center font-medium tabular hidden sm:table-cell">
              Parties
            </th>
            <th className="px-3 py-3 text-right font-medium tabular hidden md:table-cell">
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
                onClick={() => setOpenProfileId(e.profile_id)}
                className={cn(
                  "border-t border-border/40 transition-colors hover:bg-bg-card-hover/40 cursor-pointer",
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
                  <div className="flex items-center gap-2.5 font-medium min-w-0">
                    <ProfileAvatar
                      avatarUrl={e.avatar_url}
                      pseudo={e.pseudo}
                      frameId={e.equipped_frame}
                      size={32}
                      hideFlag
                    />
                    <VerifiedPseudo
                      pseudo={e.pseudo}
                      isVerified={e.is_verified}
                      equippedBadge={e.equipped_badge}
                      favoriteTeam={e.favorite_team}
                      size="md"
                    />
                  </div>
                </td>
                <td className="px-3 py-3 text-center tabular hidden sm:table-cell text-text-muted">
                  {e.games_played}
                </td>
                <td className="px-3 py-3 text-right tabular hidden md:table-cell text-text-dim text-xs">
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

    {openProfileId && (
      <PlayerProfileModal
        profileId={openProfileId}
        onClose={() => setOpenProfileId(null)}
      />
    )}
    </>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-card/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-dim text-xs uppercase tracking-wider">
            <th className="px-3 py-3 text-left font-medium w-12">#</th>
            <th className="px-3 py-3 text-left font-medium">Joueur</th>
            <th className="px-3 py-3 text-right font-medium tabular">
              Meilleur
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 8 }).map((_, i) => (
            <tr key={i} className="border-t border-border/40">
              <td className="px-3 py-3">
                <div className="h-3 w-4 rounded skeleton" />
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full skeleton" />
                  <div className="h-3 w-24 rounded skeleton" />
                </div>
              </td>
              <td className="px-3 py-3 text-right">
                <div className="ml-auto h-3 w-10 rounded skeleton" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
