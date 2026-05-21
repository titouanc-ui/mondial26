import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreSession } from "@/lib/quiz/engine";
import { decodeSessionToken } from "@/lib/quiz/session-token";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "@/lib/supabase/server";
import {
  getCurrentProfileId,
  setCurrentProfileId,
} from "@/lib/quiz/profile-cookie";

const SubmitSchema = z.object({
  sessionToken: z.string(),
  pseudo: z
    .string()
    .trim()
    .min(2, "Pseudo trop court (2 caractères min)")
    .max(20, "Pseudo trop long (20 caractères max)")
    .regex(
      /^[a-zA-Z0-9_\-\sàâäéèêëîïôöùûüÿçÀÂÄÉÈÊËÎÏÔÖÙÛÜŸÇ]+$/,
      "Pseudo invalide",
    )
    .optional(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answerIndex: z.number().int().min(0).max(3).nullable(),
      timeTakenMs: z.number().int().min(0).max(60_000),
    }),
  ),
  durationMs: z.number().int().min(0).max(30 * 60_000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Payload invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  // Décodage + vérification signature + TTL
  let snapshot;
  try {
    snapshot = decodeSessionToken(parsed.data.sessionToken);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Token invalide" },
      { status: 400 },
    );
  }

  // Scoring strictement côté serveur depuis le snapshot signé
  const result = scoreSession(snapshot, parsed.data.answers);

  // Si Supabase configuré → persistance score + leaderboard
  let savedProfileId: string | null = null;

  if (isSupabaseAdminConfigured()) {
    try {
      const admin = getSupabaseAdmin();
      let profileId: string | null = await getCurrentProfileId();

      // Pas de profil ? On en crée un — soit avec le pseudo fourni, soit anonyme
      // (le joueur peut le renommer ensuite depuis la page résultat).
      if (!profileId) {
        const autoPseudo =
          parsed.data.pseudo ??
          `Joueur-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        const { data: newProfile, error: profileErr } = await admin
          .from("profiles")
          .insert({ pseudo: autoPseudo, user_id: null })
          .select("id")
          .single();
        if (profileErr) throw profileErr;
        profileId = (newProfile as { id: string }).id;
        await setCurrentProfileId(profileId);
      } else if (parsed.data.pseudo) {
        // Profil existant + pseudo explicite → on le met à jour
        await admin
          .from("profiles")
          .update({ pseudo: parsed.data.pseudo })
          .eq("id", profileId)
          .is("user_id", null);
      }

      const { error: sessionErr } = await admin.from("quiz_sessions").insert({
        profile_id: profileId,
        theme: snapshot.theme,
        score: result.totalScore,
        correct_count: result.correctCount,
        duration_ms: parsed.data.durationMs,
        questions_snapshot: snapshot,
      });
      if (sessionErr) throw sessionErr;
      savedProfileId = profileId;

      // Crédit de Buts (monnaie virtuelle)
      // Barème : 10 Buts par bonne réponse + bonus 50 si parfait (10/10)
      // Max 150 Buts/partie. Suffisamment lent pour rendre les objets chers
      // (frame platine = 3000 Buts = ~30+ parties).
      const coinsEarned =
        result.correctCount * 10 + (result.correctCount === snapshot.questions.length ? 50 : 0);
      if (coinsEarned > 0) {
        const { data: profileRow } = await admin
          .from("profiles")
          .select("coins")
          .eq("id", profileId)
          .single();
        const currentCoins = (profileRow as { coins: number } | null)?.coins ?? 0;
        await admin
          .from("profiles")
          .update({ coins: currentCoins + coinsEarned })
          .eq("id", profileId);
        // Le client peut lire la nouvelle valeur via /profil ou via le Header.
        return NextResponse.json({
          score: result.totalScore,
          correctCount: result.correctCount,
          perQuestion: result.perQuestion,
          saved: true,
          profileId: savedProfileId,
          coinsEarned,
          coinsTotal: currentCoins + coinsEarned,
        });
      }
    } catch (err) {
      console.error("[quiz/submit] persistence failed:", err);
      // On renvoie quand même le score, juste sans persistance
    }
  }

  return NextResponse.json({
    score: result.totalScore,
    correctCount: result.correctCount,
    perQuestion: result.perQuestion,
    saved: Boolean(savedProfileId),
    profileId: savedProfileId,
  });
}
