import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

const Schema = z.object({
  amount: z.number().int().min(1).max(100_000),
});

/**
 * POST /api/admin/grant-coins
 *
 * Crédite des Buts au compte de l'admin (utile pour tester la boutique sans
 * jouer 50 quiz). Vérification email côté serveur via ADMIN_EMAILS.
 *
 * Rate limit : 1 grant / 5 sec — empêche de spammer le bouton.
 */
export async function POST(req: Request) {
  const rl = rateLimit(`admin-grant:${getClientIp(req)}`, {
    max: 1,
    windowMs: 5_000,
  });
  if (!rl.ok) return tooManyRequests(rl);

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
  if (!isAdminEmail(user.email)) {
    // Réponse volontairement générique : on ne révèle pas l'existence du
    // bouton aux non-admins (404 + log côté serveur).
    console.warn("[admin/grant-coins] tentative non-admin:", user.email);
    return NextResponse.json({ error: "Route inconnue" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
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

  // Crédit atomique via la RPC (déjà mise en place pour le quiz/claim).
  // points_total et coins_earned_total : on reste à 0 pour cet ajout admin,
  // ces compteurs servent à la progression légitime du joueur.
  const { data: creditRow, error: creditErr } = await admin.rpc(
    "credit_coins",
    {
      p_profile_id: profileId,
      p_coins_delta: parsed.data.amount,
      p_points_delta: 0,
      p_earned_delta: 0,
    },
  );
  if (creditErr) {
    console.error("[admin/grant-coins] credit_coins failed", creditErr);
    return NextResponse.json({ error: creditErr.message }, { status: 500 });
  }
  const credit = Array.isArray(creditRow) ? creditRow[0] : creditRow;
  const newCoins = (credit as { coins: number } | null)?.coins ?? null;

  return NextResponse.json({
    ok: true,
    granted: parsed.data.amount,
    coins: newCoins,
  });
}
