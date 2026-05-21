import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { checkAndUnlockAchievements } from "@/lib/achievements/check";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

/**
 * Incrémente le compteur d'articles cliqués pour le joueur connecté.
 * Utilisé pour le succès "Reporter".
 *
 * Fire-and-forget côté client : pas besoin d'attendre la réponse pour
 * ouvrir l'article (le lien continue normalement).
 *
 * Rate-limit : 1 clic / 3 sec / IP — empêche un script de farmer "Reporter".
 */
export async function POST(req: Request) {
  // Rate limit dès l'IP (avant tout I/O — moins coûteux qu'un check DB).
  const rl = rateLimit(`article-click:${getClientIp(req)}`, {
    max: 1,
    windowMs: 3_000,
  });
  if (!rl.ok) return tooManyRequests(rl);

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false }, { status: 200 });

    const admin = getSupabaseAdmin();
    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!profile) return NextResponse.json({ ok: false }, { status: 200 });

    const p = profile as { id: string };

    // Incrément atomique via RPC (évite read-modify-write)
    await admin.rpc("increment_profile_counter", {
      p_profile_id: p.id,
      p_column: "article_clicks",
      p_delta: 1,
    });

    const newAchievements = await checkAndUnlockAchievements(p.id);
    return NextResponse.json({ ok: true, newAchievements });
  } catch (err) {
    console.error("[article-click]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
