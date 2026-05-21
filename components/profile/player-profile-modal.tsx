"use client";

import { useEffect, useId, useRef, useState } from "react";
import { X, Loader2, Trophy, Award } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { PlayerAchievementBadges } from "@/components/achievements/player-achievement-badges";
import { VerifiedPseudo } from "@/components/player/verified-pseudo";
import { getBanner } from "@/lib/shop/catalog";
import { getTeam } from "@/lib/teams";
import type { Profile } from "@/lib/supabase/types";

interface Props {
  profileId: string;
  onClose: () => void;
}

/** Sous-ensemble public d'un Profile (pas de coins, user_id…). */
type PublicProfile = Pick<
  Profile,
  | "id"
  | "pseudo"
  | "is_verified"
  | "bio"
  | "favorite_team"
  | "avatar_url"
  | "equipped_banner"
  | "equipped_frame"
  | "equipped_badge"
  | "equipped_icon"
>;

interface PlayerStats {
  bestScore: number;
  gamesPlayed: number;
}

export function PlayerProfileModal({ profileId, onClose }: Props) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();

  // ESC pour fermer + focus trap : Tab/Shift+Tab restent dans la modale
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Focus initial sur le bouton fermer (élément interactif le plus sûr).
    closeBtnRef.current?.focus();

    // Bloque le scroll de la page derrière la modale
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      // Liste les éléments focusables dans la modale
      const focusables = root.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
      // Restaure le focus sur l'élément qui a ouvert la modale (ex: ligne du leaderboard)
      previouslyFocused?.focus?.();
    };
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

      // Vue agrégée plutôt que SELECT de toutes les sessions
      const { data: statsRow } = await supabase
        .from("profile_stats")
        .select("best_score, games_played")
        .eq("profile_id", profileId)
        .maybeSingle();
      if (cancelled) return;
      const s = statsRow as
        | { best_score: number; games_played: number }
        | null;
      setStats({
        bestScore: s?.best_score ?? 0,
        gamesPlayed: s?.games_played ?? 0,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const team = getTeam(profile?.favorite_team);
  const banner = getBanner(profile?.equipped_banner);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md rounded-2xl border border-border bg-bg-card overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Bannière en haut */}
        <div
          className="h-24 relative"
          style={{
            background:
              banner?.gradient ??
              "linear-gradient(135deg,#4a8fff 0%,#141a2e 50%,#c8102e 100%)",
          }}
        >
          {banner?.flag && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl drop-shadow-lg opacity-70">
              {banner.flag}
            </span>
          )}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 h-8 w-8 inline-flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/60"
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
                <div id={titleId} className="flex items-center justify-center">
                  <VerifiedPseudo
                    pseudo={profile.pseudo}
                    isVerified={profile.is_verified}
                    equippedBadge={profile.equipped_badge}
                    size="md"
                    pseudoClassName="text-xl font-bold"
                  />
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
