"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Crown, Medal, Trophy } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PlayerProfileModal } from "@/components/profile/player-profile-modal";
import { getBadge } from "@/lib/shop/catalog";
import { getTeam } from "@/lib/teams";
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
 */
export function LeaderboardTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setEntries([]);
      return;
    }

    const supabase = getSupabaseBrowser();
    let cancelled = false;

    const fetchEntries = async () => {
      const { data } = await supabase
        .from("leaderboard_global")
        .select("*")
        .limit(50);
      if (!cancelled) setEntries((data as LeaderboardEntry[]) ?? []);
    };

    void fetchEntries();

    const channel = supabase
      .channel("leaderboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_sessions" },
        () => {
          void fetchEntries();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

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
            const badge = getBadge(e.equipped_badge);
            const badgeColor = badge?.color ?? "#4a8fff";
            const badgeGlow = badge?.glowClass ?? "";
            const team = getTeam(e.favorite_team);
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
                  <div className="flex items-center gap-2.5 font-medium">
                    <ProfileAvatar
                      avatarUrl={e.avatar_url}
                      pseudo={e.pseudo}
                      frameId={e.equipped_frame}
                      size={32}
                      hideFlag
                    />
                    <span className="truncate">{e.pseudo}</span>
                    {team && (
                      <span
                        className="text-base leading-none shrink-0"
                        title={team.name}
                      >
                        {team.flag}
                      </span>
                    )}
                    {e.is_verified && (
                      <span
                        title="Compte vérifié"
                        className="inline-flex items-center"
                      >
                        <BadgeCheck
                          className={cn("h-4 w-4 shrink-0", badgeGlow)}
                          style={{ color: badgeColor }}
                          strokeWidth={2.2}
                        />
                      </span>
                    )}
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
