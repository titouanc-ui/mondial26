import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import {
  getCurrentProfileId,
  setCurrentProfileId,
} from "@/lib/quiz/profile-cookie";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/quiz";

  if (!code) {
    return NextResponse.redirect(`${origin}/?auth=missing_code`);
  }

  const supabase = await getSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback]", error);
    return NextResponse.redirect(`${origin}/?auth=error`);
  }

  // Récupère l'utilisateur authentifié et :
  // - soit on lie le profil pseudo existant (cookie) à ce user_id
  // - soit on crée un nouveau profil vérifié
  if (isSupabaseAdminConfigured()) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const admin = getSupabaseAdmin();
        const existingProfileId = await getCurrentProfileId();

        // Y a-t-il déjà un profil lié à ce user_id ?
        const { data: existingForUser } = await admin
          .from("profiles")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingForUser) {
          await setCurrentProfileId(existingForUser.id);
        } else if (existingProfileId) {
          // Upgrade : le profil pseudo devient vérifié
          await admin
            .from("profiles")
            .update({ user_id: user.id })
            .eq("id", existingProfileId)
            .is("user_id", null);
        } else {
          // Nouveau profil vérifié
          const pseudoBase =
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            user.email?.split("@")[0] ??
            "Joueur";
          const pseudo = String(pseudoBase).slice(0, 20);
          const { data: newProfile, error: createErr } = await admin
            .from("profiles")
            .insert({ pseudo, user_id: user.id })
            .select("id")
            .single();
          if (createErr) throw createErr;
          await setCurrentProfileId(newProfile.id);
        }
      }
    } catch (err) {
      console.error("[auth/callback] profile linking failed:", err);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
