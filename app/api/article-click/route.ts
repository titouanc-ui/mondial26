import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { checkAndUnlockAchievements } from "@/lib/achievements/check";

/**
 * Incrémente le compteur d'articles cliqués pour le joueur connecté.
 * Utilisé pour le succès "Reporter".
 *
 * Fire-and-forget côté client : pas besoin d'attendre la réponse pour
 * ouvrir l'article (le lien continue normalement).
 */
export async function POST() {
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
      .select("id, article_clicks")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!profile) return NextResponse.json({ ok: false }, { status: 200 });

    const p = profile as { id: string; article_clicks: number };
    await admin
      .from("profiles")
      .update({ article_clicks: (p.article_clicks ?? 0) + 1 })
      .eq("id", p.id);

    const newAchievements = await checkAndUnlockAchievements(p.id);
    return NextResponse.json({ ok: true, newAchievements });
  } catch (err) {
    console.error("[article-click]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
