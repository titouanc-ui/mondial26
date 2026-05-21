import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { TEAMS_BY_CODE } from "@/lib/teams";
import { checkAndUnlockAchievements } from "@/lib/achievements/check";

const Schema = z.object({
  pseudo: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_\-\sàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ]+$/,
      "Pseudo invalide",
    )
    .optional(),
  favorite_team: z
    .string()
    .min(2)
    .max(3)
    .nullable()
    .optional()
    .refine(
      (v) => v == null || v in TEAMS_BY_CODE,
      "Équipe inconnue",
    ),
  bio: z.string().max(200).nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
});

export async function POST(req: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase non configuré" },
      { status: 503 },
    );
  }

  // Le profil doit être lié à un compte Google authentifié
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Tu dois être connecté avec Google pour modifier ton profil." },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Champs invalides", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();

  // Récupère le profil lié à ce user_id
  const { data: profile, error: fetchErr } = await admin
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchErr) {
    console.error("[profile/update]", fetchErr);
    return NextResponse.json({ error: "Profil introuvable" }, { status: 500 });
  }
  if (!profile) {
    return NextResponse.json(
      { error: "Aucun profil lié à ce compte. Recharge la page." },
      { status: 404 },
    );
  }

  // Construit le payload de l'update (uniquement les champs fournis)
  const update: Record<string, unknown> = {};
  if (parsed.data.pseudo !== undefined) update.pseudo = parsed.data.pseudo;
  if (parsed.data.favorite_team !== undefined)
    update.favorite_team = parsed.data.favorite_team;
  if (parsed.data.bio !== undefined) update.bio = parsed.data.bio;
  if (parsed.data.avatar_url !== undefined)
    update.avatar_url = parsed.data.avatar_url;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ ok: true, noop: true });
  }

  const { error: updErr } = await admin
    .from("profiles")
    .update(update)
    .eq("id", (profile as { id: string }).id);

  if (updErr) {
    console.error("[profile/update]", updErr);
    // Cas particulier : pseudo déjà pris (unique au lower(pseudo) ?)
    return NextResponse.json(
      { error: updErr.message ?? "Échec de la mise à jour" },
      { status: 500 },
    );
  }

  // Check des succès (Tricolore, Photogénique, Biographe)
  const newAchievements = await checkAndUnlockAchievements(
    (profile as { id: string }).id,
  );

  return NextResponse.json({ ok: true, newAchievements });
}
