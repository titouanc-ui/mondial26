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
import { checkAndUnlockAchievements } from "@/lib/achievements/check";

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

      // MAJ du profil :
      // - Crédit de Buts : 10 par bonne réponse + bonus 50 si parfait (max 150)
      // - Score cumulé : on ajoute le score de la partie au total lifetime
      const coinsEarned =
        result.correctCount * 10 + (result.correctCount === snapshot.questions.length ? 50 : 0);

      const { data: profileRow } = await admin
        .from("profiles")
        .select("coins, coins_earned_total, points_total")
        .eq("id", profileId)
        .single();
      const current = profileRow as {
        coins: number;
        coins_earned_total: number;
        points_total: number;
      } | null;
      const newCoins = (current?.coins ?? 0) + coinsEarned;
      const newPoints = (current?.points_total ?? 0) + result.totalScore;
      const newEarnedTotal = (current?.coins_earned_total ?? 0) + coinsEarned;

      await admin
        .from("profiles")
        .update({
          coins: newCoins,
          points_total: newPoints,
          coins_earned_total: newEarnedTotal,
        })
        .eq("id", profileId);

      // Check des succès (best_score, cumul, somnambule, lève-tôt, etc.)
      const newAchievements = await checkAndUnlockAchievements(profileId, {
        quizJustPlayed: true,
      });

      return NextResponse.json({
        score: result.totalScore,
        correctCount: result.correctCount,
        perQuestion: result.perQuestion,
        saved: true,
        profileId: savedProfileId,
        coinsEarned,
        coinsTotal: newCoins,
        pointsTotal: newPoints,
        newAchievements,
      });
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
