export const QUIZ_QUESTION_COUNT = 10;
export const QUIZ_TIME_PER_QUESTION_MS = 15_000;
export const QUIZ_BASE_POINTS = 100;
export const QUIZ_MAX_SPEED_BONUS = 50;
export const QUIZ_MAX_POINTS_PER_QUESTION =
  QUIZ_BASE_POINTS + QUIZ_MAX_SPEED_BONUS;
export const QUIZ_MAX_SCORE =
  QUIZ_QUESTION_COUNT * QUIZ_MAX_POINTS_PER_QUESTION;

/**
 * Score pour une réponse.
 * - 0 si mauvaise réponse ou temps écoulé
 * - 100 (base) + jusqu'à 50 (bonus vitesse) si bonne réponse
 *
 * Le bonus vitesse décroît linéairement avec le temps écoulé,
 * et tombe à 0 quand on est au temps max.
 */
export function scoreAnswer(opts: {
  isCorrect: boolean;
  timeTakenMs: number;
}): number {
  if (!opts.isCorrect) return 0;
  const clamped = Math.max(0, Math.min(QUIZ_TIME_PER_QUESTION_MS, opts.timeTakenMs));
  const remaining = QUIZ_TIME_PER_QUESTION_MS - clamped;
  const bonus = Math.round(
    (remaining / QUIZ_TIME_PER_QUESTION_MS) * QUIZ_MAX_SPEED_BONUS,
  );
  return QUIZ_BASE_POINTS + bonus;
}

export function getRank(score: number): {
  label: string;
  color: string;
  emoji: string;
} {
  const pct = (score / QUIZ_MAX_SCORE) * 100;
  if (pct >= 90) return { label: "Légende", color: "accent-gold", emoji: "🏆" };
  if (pct >= 75)
    return { label: "Expert", color: "accent-red", emoji: "⚡" };
  if (pct >= 60)
    return { label: "Connaisseur", color: "accent-blue", emoji: "🔥" };
  if (pct >= 40)
    return { label: "Amateur éclairé", color: "accent-green", emoji: "👍" };
  if (pct >= 20)
    return { label: "Curieux", color: "text-muted", emoji: "🌱" };
  return { label: "Débutant", color: "text-muted", emoji: "🎲" };
}
