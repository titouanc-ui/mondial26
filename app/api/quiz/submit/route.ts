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
import { rateLimit, getClientIp, tooManyRequests } from "@/lib/rate-limit";
import { QUIZ_TIME_PER_QUESTION_MS } from "@/lib/quiz/scoring";

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
  // Rate limit anti-spam : 3 submits / 30 sec / IP.
  // Empêche de farmer le leaderboard avec un script.
  const rl = rateLimit(`quiz-submit:${getClientIp(req)}`, {
    max: 3,
    windowMs: 30_000,
  });
  if (!rl.ok) return tooManyRequests(rl);

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

  // Sanity check : durée plausible. Lire+répondre une question prend au
  // minimum ~1 sec — sous ce seuil c'est forcément un bot.
  const minPlausibleMs = snapshot.questions.length * 1_000;
  if (parsed.data.durationMs < minPlausibleMs) {
    return NextResponse.json(
      { error: "Soumission trop rapide pour être plausible." },
      { status: 400 },
    );
  }
  // Garde-fou max : on accepte au plus 2× le temps total alloué
  // (le timer client garantit déjà ça, mais on borne aussi côté serveur).
  const maxPlausibleMs =
    snapshot.questions.length * QUIZ_TIME_PER_QUESTION_MS * 2;
  if (parsed.data.durationMs > maxPlausibleMs) {
    return NextResponse.json(
      { error: "Session expirée." },
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

      // MAJ du profil — atomique via RPC pour éviter les race conditions
      // (deux quiz soumis quasi simultanément ne s'écrasent plus l'un l'autre).
      // - Crédit de Buts : 10 par bonne réponse + bonus 50 si parfait (max 150)
      // - Score cumulé : on ajoute le score de la partie au total lifetime
      const coinsEarned =
        result.correctCount * 10 + (result.correctCount === snapshot.questions.length ? 50 : 0);

      const { data: creditRow, error: creditErr } = await admin.rpc(
        "credit_coins",
        {
          p_profile_id: profileId,
          p_coins_delta: coinsEarned,
          p_points_delta: result.totalScore,
          p_earned_delta: coinsEarned,
        },
      );
      if (creditErr) throw creditErr;
      const credit = Array.isArray(creditRow) ? creditRow[0] : creditRow;
      const newCoins = (credit as { coins: number } | null)?.coins ?? 0;
      const newPoints =
        (credit as { points_total: number } | null)?.points_total ?? 0;

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
