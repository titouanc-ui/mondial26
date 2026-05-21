"use client";

import { useState } from "react";
import { History, Loader2 } from "lucide-react";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PlayerProfileModal } from "@/components/profile/player-profile-modal";
import { VerifiedPseudo } from "@/components/player/verified-pseudo";
import { useRealtimeList } from "@/lib/hooks/use-realtime-list";
import { formatRelativeTime } from "@/lib/utils";
import { THEME_LABEL_SHORT } from "@/lib/quiz/themes";
import type {
  QuizTheme,
  RecentSessionEntry,
} from "@/lib/supabase/types";

interface Props {
  limit?: number;
  title?: string;
}

/**
 * Affiche les N dernières parties jouées tous joueurs confondus,
 * avec avatar (cadre + badge équipés). Chargement client-side.
 *
 * Realtime debouncé via `useRealtimeList` — pas de spam de refetch.
 */
export function RecentSessionsLive({
  limit = 10,
  title = "Dernières parties",
}: Props) {
  const [openProfileId, setOpenProfileId] = useState<string | null>(null);

  const entries = useRealtimeList<RecentSessionEntry>({
    channelName: `recent-sessions-${limit}`,
    watchTable: "quiz_sessions",
    fetcher: (supabase) =>
      supabase
        .from("recent_sessions")
        .select(
          "session_id, score, correct_count, theme, played_at, profile_id, pseudo, is_verified, avatar_url, favorite_team, equipped_frame, equipped_badge",
        )
        .order("played_at", { ascending: false })
        .limit(limit),
  });

  return (
    <section className="rounded-2xl border border-border bg-bg-card/40 overflow-hidden">
      <header className="flex items-center gap-2 border-b border-border px-5 py-3">
        <History className="h-4 w-4 text-text-muted" />
        <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        <span className="ml-auto text-xs text-text-dim">temps réel</span>
      </header>

      {entries === null ? (
        <div className="flex items-center justify-center py-12 text-text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-text-muted">
          Aucune partie pour le moment. Sois le premier !
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {entries.map((e) => (
            <li
              key={e.session_id}
              onClick={() => setOpenProfileId(e.profile_id)}
              className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-bg-card-hover/40 transition-colors cursor-pointer"
            >
              <ProfileAvatar
                avatarUrl={e.avatar_url}
                pseudo={e.pseudo}
                frameId={e.equipped_frame}
                size={36}
                hideFlag
              />
              <div className="flex-1 min-w-0">
                <VerifiedPseudo
                  pseudo={e.pseudo}
                  isVerified={e.is_verified}
                  equippedBadge={e.equipped_badge}
                  favoriteTeam={e.favorite_team}
                  size="sm"
                  className="font-medium text-sm"
                />
                <div className="text-xs text-text-dim">
                  {THEME_LABEL_SHORT[e.theme as QuizTheme] ?? e.theme} ·{" "}
                  {formatRelativeTime(e.played_at)}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono tabular font-bold text-accent-red text-base">
                  {e.score}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-text-dim">
                  {e.correct_count}/10
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openProfileId && (
        <PlayerProfileModal
          profileId={openProfileId}
          onClose={() => setOpenProfileId(null)}
        />
      )}
    </section>
  );
}
