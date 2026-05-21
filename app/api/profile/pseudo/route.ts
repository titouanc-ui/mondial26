import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import {
  getCurrentProfileId,
  setCurrentProfileId,
} from "@/lib/quiz/profile-cookie";
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";

const Schema = z.object({
  pseudo: z
    .string()
    .trim()
    .min(2)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_\-\sàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ]+$/,
      "Pseudo invalide",
    ),
});

export async function POST(req: Request) {
  // Rate limit anti-spam : 5 changements / minute / IP.
  // Bloque la création massive de profils anonymes.
  const rl = rateLimit(`profile-pseudo:${getClientIp(req)}`, {
    max: 5,
    windowMs: 60_000,
  });
  if (!rl.ok) return tooManyRequests(rl);

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase non configuré — les scores ne peuvent pas être sauvegardés en mode démo.",
      },
      { status: 503 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Pseudo invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdmin();
  const pseudo = parsed.data.pseudo;
  const profileId = await getCurrentProfileId();

  try {
    if (profileId) {
      const { error } = await admin
        .from("profiles")
        .update({ pseudo })
        .eq("id", profileId)
        .is("user_id", null);
      if (error) throw error;
    } else {
      const { data, error } = await admin
        .from("profiles")
        .insert({ pseudo, user_id: null })
        .select("id")
        .single();
      if (error) throw error;
      await setCurrentProfileId(data.id);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[profile/pseudo]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur" },
      { status: 500 },
    );
  }
}
