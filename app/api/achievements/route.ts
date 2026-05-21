import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { ACHIEVEMENTS, type Achievement } from "@/lib/achievements/catalog";
import {
  checkAndUnlockAchievements,
  loadAchievementCounters,
} from "@/lib/achievements/check";

/**
 * GET /api/achievements
 *
 * Renvoie l'état complet pour l'utilisateur connecté :
 * - Pour chaque succès : son statut (locked / unlocked / claimed)
 * - Pour les succès threshold : valeur courante + cible
 *
 * Refait une vérification serveur au passage (utile pour rattraper les
 * succès threshold qui ne sont pas liés à un événement déclencheur).
 */
export async function GET() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ error: "Supabase non configuré" }, { status: 503 });
  }

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Connecte-toi pour voir tes succès." },
      { status: 401 },
    );
  }

  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }
  const profileId = (profile as { id: string }).id;

  // Re-check pour rattraper les seuils threshold-only
  await checkAndUnlockAchievements(profileId);

  const snapshot = await loadAchievementCounters(profileId);

  const { data: rows } = await admin
    .from("user_achievements")
    .select("achievement_id, unlocked_at, claimed_at")
    .eq("profile_id", profileId);
  const stateById = new Map<
    string,
    { unlocked_at: string; claimed_at: string | null }
  >();
  for (const r of (rows ?? []) as {
    achievement_id: string;
    unlocked_at: string;
    claimed_at: string | null;
  }[]) {
    stateById.set(r.achievement_id, {
      unlocked_at: r.unlocked_at,
      claimed_at: r.claimed_at,
    });
  }

  const items = ACHIEVEMENTS.map((ach) => {
    const state = stateById.get(ach.id);
    const current =
      ach.type === "threshold" && snapshot
        ? snapshot.counters[ach.metric]
        : null;
    return {
      ...ach,
      current,
      unlocked: !!state,
      claimed: !!state?.claimed_at,
      unlocked_at: state?.unlocked_at ?? null,
      claimed_at: state?.claimed_at ?? null,
    };
  });

  return NextResponse.json({ items });
}
