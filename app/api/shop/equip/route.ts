import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import { getItem, type ItemType } from "@/lib/shop/catalog";

const Schema = z.object({
  type: z.enum(["banner", "frame", "badge", "icon"]),
  // null pour "désequiper"
  itemId: z.string().nullable(),
});

const TYPE_TO_SLOT: Record<ItemType, string> = {
  banner: "equipped_banner",
  frame: "equipped_frame",
  badge: "equipped_badge",
  icon: "equipped_icon",
};

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

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: profileRow } = await admin
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!profileRow) {
    return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });
  }
  const profileId = (profileRow as { id: string }).id;

  // Validation du type/possession
  if (parsed.data.itemId) {
    const item = getItem(parsed.data.itemId);
    if (!item) {
      return NextResponse.json({ error: "Objet inconnu" }, { status: 404 });
    }
    if (item.type !== parsed.data.type) {
      return NextResponse.json(
        { error: "Type ne correspond pas." },
        { status: 400 },
      );
    }
    // Item gratuit "default" → toujours équipable
    if (item.price > 0) {
      const { data: owned } = await admin
        .from("user_inventory")
        .select("item_id")
        .eq("profile_id", profileId)
        .eq("item_id", item.id)
        .maybeSingle();
      if (!owned) {
        return NextResponse.json(
          { error: "Tu ne possèdes pas cet objet." },
          { status: 403 },
        );
      }
    }
  }

  const slot = TYPE_TO_SLOT[parsed.data.type];
  const { error: updErr } = await admin
    .from("profiles")
    .update({ [slot]: parsed.data.itemId })
    .eq("id", profileId);

  if (updErr) {
    console.error("[shop/equip]", updErr);
    return NextResponse.json({ error: updErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
