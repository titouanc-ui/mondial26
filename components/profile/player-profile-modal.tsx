"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Trophy, BadgeCheck, Award } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PlayerAchievementBadges } from "@/components/achievements/player-achievement-badges";
import { getBadge, getBanner } from "@/lib/shop/catalog";
import { getTeam } from "@/lib/teams";
import { cn } from "@/lib/utils";

interface Props {
  profileId: string;
  onClose: () => void;
}

interface PublicProfile {
  id: string;
  pseudo: string;
  is_verified: boolean;
  bio: string | null;
  favorite_team: string | null;
  avatar_url: string | null;
  equipped_banner: string | null;
  equipped_frame: string | null;
  equipped_badge: string | null;
  equipped_icon: string | null;
}

interface PlayerStats {
  bestScore: number;
  gamesPlayed: number;
}

export function PlayerProfileModal({ profileId, onClose }: Props) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ESC pour fermer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Fetch profil public + stats
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError("Profil indisponible (Supabase non configuré).");
      return;
    }
    const supabase = getSupabaseBrowser();
    let cancelled = false;

    (async () => {
      const { data, error: pErr } = await supabase
        .from("profiles")
        .select(
          "id, pseudo, is_verified, bio, favorite_team, avatar_url, equipped_banner, equipped_frame, equipped_badge, equipped_icon",
        )
        .eq("id", profileId)
        .maybeSingle();
      if (cancelled) return;
      if (pErr || !data) {
        setError("Profil introuvable.");
        return;
      }
      setProfile(data as PublicProfile);

      const { data: sessions } = await supabase
        .from("quiz_sessions")
        .select("score")
        .eq("profile_id", profileId);
      if (cancelled) return;
      const rows = (sessions ?? []) as { score: number }[];
      setStats({
        bestScore: rows.reduce((m, r) => Math.max(m, r.score), 0),
        gamesPlayed: rows.length,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const team = getTeam(profile?.favorite_team);
  const badge = getBadge(profile?.equipped_badge);
  const badgeColor = badge?.color ?? "#4a8fff";
  const badgeGlow = badge?.glowClass ?? "";
  const banner = getBanner(profile?.equipped_banner);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bannière en haut */}
        <div
          className="h-24 relative"
          style={{
            background:
              banner?.gradient ??
              "linear-gradient(135deg,#0033a0 0%,#141a2e 50%,#c8102e 100%)",
          }}
        >
          {banner?.flag && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl drop-shadow-lg opacity-70">
              {banner.flag}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Avatar centré débordant la bannière */}
        <div className="px-6 pb-6 -mt-12">
          {error ? (
            <div className="text-center text-sm text-error py-8">{error}</div>
          ) : !profile ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <ProfileAvatar
                  avatarUrl={profile.avatar_url}
                  pseudo={profile.pseudo}
                  frameId={profile.equipped_frame}
                  favoriteTeam={profile.favorite_team}
                  iconId={profile.equipped_icon}
                  size={96}
                />
              </div>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <h2 className="text-xl font-bold">{profile.pseudo}</h2>
                  {profile.is_verified && (
                    <BadgeCheck
                      className={cn("h-4 w-4 shrink-0", badgeGlow)}
                      style={{ color: badgeColor }}
                      strokeWidth={2.2}
                    />
                  )}
                </div>
                {team && (
                  <div className="mt-1 inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <span className="text-base leading-none">{team.flag}</span>
                    <span>{team.name}</span>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mt-4 text-sm text-text-muted text-center italic">
                  « {profile.bio} »
                </p>
              )}

              {stats && (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border bg-bg/40 p-3 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs uppercase tracking-wider text-text-dim">
                      <Trophy className="h-3 w-3" />
                      Meilleur
                    </div>
                    <div className="mt-1 font-mono tabular text-2xl font-bold text-accent-red">
                      {stats.bestScore}
                    </div>
                  </div>
                  <div className="rounded-xl border border-border bg-bg/40 p-3 text-center">
                    <div className="text-xs uppercase tracking-wider text-text-dim">
                      Parties
                    </div>
                    <div className="mt-1 font-mono tabular text-2xl font-bold">
                      {stats.gamesPlayed}
                    </div>
                  </div>
                </div>
              )}

              {/* Succès débloqués */}
              <div className="mt-6">
                <h3 className="text-xs uppercase tracking-wider text-text-dim mb-2 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Succès
                </h3>
                <PlayerAchievementBadges
                  profileId={profile.id}
                  maxVisible={12}
                  compact
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
