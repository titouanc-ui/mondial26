"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, History, Loader2 } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { getBadge } from "@/lib/shop/catalog";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { RecentSessionEntry } from "@/lib/supabase/types";

const THEME_LABEL: Record<string, string> = {
  historique: "Histoire",
  equipes: "Équipes",
  joueurs: "Joueurs",
  matchs: "Matchs",
  culture: "Culture",
  france: "France",
  mix: "Mix",
};

interface Props {
  limit?: number;
  title?: string;
}

/**
 * Affiche les N dernières parties jouées tous joueurs confondus,
 * avec avatar (cadre + badge équipés). Chargement client-side.
 */
export function RecentSessionsLive({
  limit = 10,
  title = "Dernières parties",
}: Props) {
  const [entries, setEntries] = useState<RecentSessionEntry[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setEntries([]);
      return;
    }
    const supabase = getSupabaseBrowser();
    let cancelled = false;

    const fetchData = async () => {
      const { data } = await supabase
        .from("recent_sessions")
        .select("*")
        .order("played_at", { ascending: false })
        .limit(limit);
      if (!cancelled) setEntries((data as RecentSessionEntry[]) ?? []);
    };

    void fetchData();

    // Realtime : nouvelle session insérée → on rafraîchit
    const channel = supabase
      .channel("recent-sessions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "quiz_sessions" },
        () => {
          void fetchData();
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [limit]);

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
          {entries.map((e) => {
            const badge = getBadge(e.equipped_badge);
            const badgeColor = badge?.color ?? "#0033a0";
            const badgeGlow = badge?.glowClass ?? "";
            return (
              <li
                key={e.session_id}
                className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-bg-card-hover/40 transition-colors"
              >
                <ProfileAvatar
                  avatarUrl={e.avatar_url}
                  pseudo={e.pseudo}
                  frameId={e.equipped_frame}
                  size={36}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 font-medium text-sm truncate">
                    <span className="truncate">{e.pseudo}</span>
                    {e.is_verified && (
                      <BadgeCheck
                        className={cn("h-3.5 w-3.5 shrink-0", badgeGlow)}
                        style={{ color: badgeColor }}
                        strokeWidth={2.2}
                      />
                    )}
                  </div>
                  <div className="text-xs text-text-dim">
                    {THEME_LABEL[e.theme] ?? e.theme} ·{" "}
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
            );
          })}
        </ul>
      )}
    </section>
  );
}
