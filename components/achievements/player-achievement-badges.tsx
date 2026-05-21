"use client";

import { useEffect, useState } from "react";
import { Award, Loader2 } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  ACHIEVEMENTS_BY_ID,
  RARITY_TEXT,
  type Achievement,
} from "@/lib/achievements/catalog";
import { cn } from "@/lib/utils";

interface Props {
  profileId: string;
  /** Si true, affiche tous les succès débloqués. Sinon, limite à `maxVisible` */
  showAll?: boolean;
  maxVisible?: number;
  compact?: boolean;
}

/**
 * Affiche les badges de succès débloqués pour un joueur donné.
 * Utilisé sur /profil (vue propriétaire) et dans la modale joueur (vue publique).
 */
export function PlayerAchievementBadges({
  profileId,
  showAll = false,
  maxVisible = 12,
  compact = false,
}: Props) {
  const [unlocked, setUnlocked] = useState<Achievement[] | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUnlocked([]);
      return;
    }
    const supabase = getSupabaseBrowser();
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from("user_achievements")
        .select("achievement_id, unlocked_at")
        .eq("profile_id", profileId)
        .order("unlocked_at", { ascending: false });
      if (cancelled) return;
      const ids = (data ?? []) as { achievement_id: string }[];
      const achievements = ids
        .map((r) => ACHIEVEMENTS_BY_ID[r.achievement_id])
        .filter((a): a is Achievement => !!a);
      setUnlocked(achievements);
    })();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  if (unlocked === null) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
      </div>
    );
  }

  if (unlocked.length === 0) {
    return (
      <p className="text-xs text-text-dim italic text-center py-2">
        Aucun succès débloqué pour le moment.
      </p>
    );
  }

  const visible = showAll ? unlocked : unlocked.slice(0, maxVisible);
  const hidden = Math.max(0, unlocked.length - visible.length);

  return (
    <div>
      <div
        className={cn(
          "grid gap-2",
          compact
            ? "grid-cols-5 sm:grid-cols-6"
            : "grid-cols-6 sm:grid-cols-8",
        )}
      >
        {visible.map((ach) => (
          <div
            key={ach.id}
            title={`${ach.name} — ${ach.description}`}
            className={cn(
              "aspect-square rounded-xl border-2 flex items-center justify-center text-2xl transition-transform hover:scale-110 cursor-help",
              ach.rarity === "legendary" &&
                "border-accent-gold/60 bg-gradient-to-br from-accent-gold/15 to-amber-700/10",
              ach.rarity === "epic" &&
                "border-purple-500/40 bg-purple-600/10",
              ach.rarity === "rare" &&
                "border-accent-blue/40 bg-accent-blue/10",
              ach.rarity === "common" && "border-border bg-bg-card/60",
            )}
          >
            <span className={cn("leading-none", RARITY_TEXT[ach.rarity])}>
              {ach.emoji}
            </span>
          </div>
        ))}
        {hidden > 0 && (
          <div className="aspect-square rounded-xl border-2 border-dashed border-border bg-bg-card/30 flex items-center justify-center text-xs text-text-muted font-semibold">
            +{hidden}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-text-dim">
        <Award className="h-3 w-3" />
        {unlocked.length} succès débloqué{unlocked.length > 1 ? "s" : ""}
      </div>
    </div>
  );
}
