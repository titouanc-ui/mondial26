import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { getItem, getMissingPredecessors, ITEMS_BY_ID } from "@/lib/shop/catalog";
import { checkAndUnlockAchievements } from "@/lib/achievements/check";

const Schema = z.object({
  itemId: z.string().min(1).max(60),
});

export async function POST(req: Request) {
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
    return NextResponse.json(
      { error: "Connecte-toi pour acheter dans la boutique." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const item = getItem(parsed.data.itemId);
  if (!item) {
    return NextResponse.json({ error: "Objet inconnu" }, { status: 404 });
  }
  if (item.price < 0) {
    return NextResponse.json({ error: "Objet non achetable" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();

  // Profil
  const { data: profileRow, error: pErr } = await admin
    .from("profiles")
    .select("id, coins, is_verified")
    .eq("user_id", user.id)
    .maybeSingle();
  if (pErr || !profileRow) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 500 });
  }
  const profile = profileRow as { id: string; coins: number; is_verified: boolean };

  // Garde-fou : badge réservé aux comptes vérifiés
  if (item.type === "badge" && !profile.is_verified) {
    return NextResponse.json(
      { error: "Les badges sont réservés aux comptes vérifiés." },
      { status: 403 },
    );
  }

  // Déjà possédé ?
  const { data: owned } = await admin
    .from("user_inventory")
    .select("item_id")
    .eq("profile_id", profile.id)
    .eq("item_id", item.id)
    .maybeSingle();
  if (owned) {
    return NextResponse.json(
      { error: "Tu possèdes déjà cet objet." },
      { status: 409 },
    );
  }

  // Progression séquentielle : pour les cadres et les badges, il faut posséder
  // tous les paliers précédents avant de pouvoir acheter celui-ci.
  if (item.type === "frame" || item.type === "badge") {
    const { data: allOwned } = await admin
      .from("user_inventory")
      .select("item_id")
      .eq("profile_id", profile.id);
    const ownedSet = new Set(
      (allOwned ?? []).map((r) => (r as { item_id: string }).item_id),
    );
    const missing = getMissingPredecessors(item.id, ownedSet);
    if (missing.length > 0) {
      const blocker = ITEMS_BY_ID[missing[0]];
      return NextResponse.json(
        {
          error: `Tu dois d'abord débloquer "${blocker?.name ?? missing[0]}".`,
          missing,
        },
        { status: 403 },
      );
    }
  }

  // Pré-check rapide pour un message d'erreur clair (la décision atomique
  // est faite par spend_coins ci-dessous — pas de TOCTOU possible).
  if (profile.coins < item.price) {
    return NextResponse.json(
      { error: `Il te manque ${item.price - profile.coins} Buts.` },
      { status: 402 },
    );
  }

  // Débit atomique via RPC : la fonction n'opère que si coins >= price,
  // sinon elle lève 'insufficient_funds'. Plus aucun risque de double-spend.
  const { data: newCoinsRaw, error: spendErr } = await admin.rpc("spend_coins", {
    p_profile_id: profile.id,
    p_amount: item.price,
  });
  if (spendErr) {
    if (spendErr.message?.includes("insufficient_funds")) {
      return NextResponse.json(
        { error: `Il te manque ${item.price - profile.coins} Buts.` },
        { status: 402 },
      );
    }
    console.error("[shop/buy] spend_coins failed", spendErr);
    return NextResponse.json(
      { error: "Échec du débit, réessaie." },
      { status: 500 },
    );
  }
  const newCoins = (newCoinsRaw as number) ?? profile.coins - item.price;

  const { error: invErr } = await admin.from("user_inventory").insert({
    profile_id: profile.id,
    item_id: item.id,
    item_type: item.type,
  });
  if (invErr) {
    // Rollback : on recrédite atomiquement.
    await admin.rpc("credit_coins", {
      p_profile_id: profile.id,
      p_coins_delta: item.price,
      p_points_delta: 0,
      p_earned_delta: 0,
    });
    console.error("[shop/buy] inventory insert failed", invErr);
    return NextResponse.json(
      { error: "Échec de l'achat, fonds restaurés." },
      { status: 500 },
    );
  }

  // Check des succès (Collectionneur*, Riche, etc.)
  const newAchievements = await checkAndUnlockAchievements(profile.id);

  return NextResponse.json({
    ok: true,
    item_id: item.id,
    coins: newCoins,
    newAchievements,
  });
}
