/**
 * Vérification serveur des succès :
 * - Calcule les compteurs courants du joueur depuis la BDD
 * - Compare avec les seuils du catalogue
 * - Insère dans `user_achievements` les nouvellement débloqués
 * - À appeler après quiz, achat boutique, MAJ profil, clic article
 *
 * Le crédit en Buts se fait au moment de la RÉCLAMATION (claim), pas du
 * déblocage. L'utilisateur voit "+X Buts à réclamer" sur la page Succès.
 */

import { getSupabaseAdmin } from "@/lib/supabase/server";
import {
  ACHIEVEMENTS,
  type Achievement,
  type AchievementMetric,
} from "./catalog";

export interface EventHints {
  /** Le joueur vient de jouer un quiz (timestamp = maintenant). */
  quizJustPlayed?: boolean;
}

interface Counters {
  best_score: number;
  points_total: number;
  coins: number;
  coins_earned_total: number;
  games_played: number;
  frames_owned: number;
  badges_owned: number;
  banners_owned: number;
  icons_owned: number;
  article_clicks: number;
}

interface ProfileSnapshot {
  favorite_team: string | null;
  avatar_url: string | null;
  bio: string | null;
}

async function loadCounters(
  profileId: string,
): Promise<{ counters: Counters; profile: ProfileSnapshot } | null> {
  const admin = getSupabaseAdmin();

  const { data: profile } = await admin
    .from("profiles")
    .select(
      "coins, coins_earned_total, points_total, article_clicks, favorite_team, avatar_url, bio",
    )
    .eq("id", profileId)
    .maybeSingle();

  if (!profile) return null;
  const p = profile as {
    coins: number;
    coins_earned_total: number;
    points_total: number;
    article_clicks: number;
    favorite_team: string | null;
    avatar_url: string | null;
    bio: string | null;
  };

  // Sessions agrégées (best_score, games_played)
  const { data: sessions } = await admin
    .from("quiz_sessions")
    .select("score")
    .eq("profile_id", profileId);
  const rows = (sessions ?? []) as { score: number }[];
  const best_score = rows.reduce((m, s) => Math.max(m, s.score), 0);
  const games_played = rows.length;

  // Inventaire par type
  const { data: inv } = await admin
    .from("user_inventory")
    .select("item_type")
    .eq("profile_id", profileId);
  const counts = { frame: 0, badge: 0, banner: 0, icon: 0 };
  for (const r of (inv ?? []) as { item_type: keyof typeof counts }[]) {
    counts[r.item_type]++;
  }

  return {
    counters: {
      best_score,
      points_total: p.points_total ?? 0,
      coins: p.coins ?? 0,
      coins_earned_total: p.coins_earned_total ?? 0,
      games_played,
      frames_owned: counts.frame,
      badges_owned: counts.badge,
      banners_owned: counts.banner,
      icons_owned: counts.icon,
      article_clicks: p.article_clicks ?? 0,
    },
    profile: {
      favorite_team: p.favorite_team,
      avatar_url: p.avatar_url,
      bio: p.bio,
    },
  };
}

function getMetric(metric: AchievementMetric, c: Counters): number {
  return c[metric] ?? 0;
}

function isUnlocked(
  ach: Achievement,
  counters: Counters,
  profile: ProfileSnapshot,
  hints: EventHints,
): boolean {
  if (ach.type === "threshold") {
    return getMetric(ach.metric, counters) >= ach.target;
  }
  switch (ach.event) {
    case "night_quiz": {
      if (!hints.quizJustPlayed) return false;
      const h = new Date().getHours();
      return h >= 22 || h < 6;
    }
    case "morning_quiz": {
      if (!hints.quizJustPlayed) return false;
      const h = new Date().getHours();
      return h >= 5 && h < 8;
    }
    case "fav_team_fr":
      return profile.favorite_team === "FRA";
    case "avatar_uploaded":
      return !!profile.avatar_url;
    case "bio_written":
      return !!(profile.bio && profile.bio.trim().length > 0);
    default:
      return false;
  }
}

/**
 * Vérifie et débloque les succès pour un profil.
 * @returns ids des succès nouvellement débloqués
 */
export async function checkAndUnlockAchievements(
  profileId: string,
  hints: EventHints = {},
): Promise<string[]> {
  const admin = getSupabaseAdmin();
  const snapshot = await loadCounters(profileId);
  if (!snapshot) return [];

  // Déjà débloqués
  const { data: existing } = await admin
    .from("user_achievements")
    .select("achievement_id")
    .eq("profile_id", profileId);
  const alreadyUnlocked = new Set(
    (existing ?? []).map((r) => (r as { achievement_id: string }).achievement_id),
  );

  // Test chaque succès non encore débloqué
  const newly: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(ach.id)) continue;
    if (isUnlocked(ach, snapshot.counters, snapshot.profile, hints)) {
      newly.push(ach.id);
    }
  }

  if (newly.length === 0) return [];

  // Insert
  const { error } = await admin.from("user_achievements").insert(
    newly.map((id) => ({ profile_id: profileId, achievement_id: id })),
  );
  if (error) {
    console.error("[achievements/check] insert failed", error);
    return [];
  }
  return newly;
}

/** Renvoie les compteurs (utilisés par la page Succès pour la barre de progression) */
export async function loadAchievementCounters(
  profileId: string,
): Promise<{ counters: Counters; profile: ProfileSnapshot } | null> {
  return loadCounters(profileId);
}
