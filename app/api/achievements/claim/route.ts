import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { getAchievement } from "@/lib/achievements/catalog";

/**
 * POST /api/achievements/claim
 *
 * Réclame tous les succès débloqués mais pas encore réclamés.
 * Crédite les Buts correspondants en une transaction.
 *
 * Body : aucun (claim all eligible).
 */
export async function POST() {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configuré" },
      { status: 503 },
    );
  }

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  const { data: profile } = await admin
    .from("profiles")
    .select("id, coins, coins_earned_total")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }
  const p = profile as {
    id: string;
    coins: number;
    coins_earned_total: number;
  };

  // Succès débloqués + non réclamés
  const { data: claimable } = await admin
    .from("user_achievements")
    .select("achievement_id")
    .eq("profile_id", p.id)
    .is("claimed_at", null);

  const ids = (claimable ?? []).map(
    (r) => (r as { achievement_id: string }).achievement_id,
  );

  if (ids.length === 0) {
    return NextResponse.json({
      ok: true,
      claimed: [],
      coinsEarned: 0,
      coinsTotal: p.coins,
    });
  }

  // Calcule le total des récompenses
  let coinsEarned = 0;
  const claimed: { id: string; reward: number }[] = [];
  for (const id of ids) {
    const ach = getAchievement(id);
    if (!ach) continue;
    coinsEarned += ach.reward;
    claimed.push({ id, reward: ach.reward });
  }

  // Marque les succès comme réclamés
  const now = new Date().toISOString();
  const { error: updErr } = await admin
    .from("user_achievements")
    .update({ claimed_at: now })
    .eq("profile_id", p.id)
    .in("achievement_id", ids);
  if (updErr) {
    console.error("[achievements/claim]", updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // Crédite les Buts
  const newCoins = (p.coins ?? 0) + coinsEarned;
  const newEarnedTotal = (p.coins_earned_total ?? 0) + coinsEarned;
  await admin
    .from("profiles")
    .update({ coins: newCoins, coins_earned_total: newEarnedTotal })
    .eq("id", p.id);

  return NextResponse.json({
    ok: true,
    claimed,
    coinsEarned,
    coinsTotal: newCoins,
  });
}
