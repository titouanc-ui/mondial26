import { NextResponse } from "next/server";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 2 * 1024 * 1024; // 2 Mo

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
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: "Fichier trop volumineux (2 Mo max)" },
      { status: 400 },
    );
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Format non supporté (JPEG, PNG, WebP uniquement)" },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  // Path: {user_id}/avatar-{ts}.{ext}  → permet d'éviter le cache navigateur via le nom
  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: uploadErr } = await admin.storage
    .from("avatars")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadErr) {
    console.error("[profile/avatar] upload", uploadErr);
    return NextResponse.json(
      { error: uploadErr.message ?? "Upload échoué" },
      { status: 500 },
    );
  }

  const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = pub.publicUrl;

  // Update du profil
  const { data: profile } = await admin
    .from("profiles")
    .select("id, avatar_url")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }

  // Si l'ancien avatar était dans notre bucket, on le supprime
  const old = (profile as { avatar_url: string | null }).avatar_url;
  if (old && old.includes("/avatars/")) {
    const oldPath = old.split("/avatars/")[1];
    if (oldPath) {
      await admin.storage
        .from("avatars")
        .remove([oldPath])
        .catch(() => null);
    }
  }

  const profileId = (profile as { id: string }).id;

  const { error: updErr } = await admin
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", profileId);

  if (updErr) {
    console.error("[profile/avatar] update", updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  // Check succès Photogénique
  const { checkAndUnlockAchievements } = await import(
    "@/lib/achievements/check"
  );
  const newAchievements = await checkAndUnlockAchievements(profileId);

  return NextResponse.json({ ok: true, avatar_url: avatarUrl, newAchievements });
}
