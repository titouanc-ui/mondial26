import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/server";
import { SEED_QUESTIONS } from "./seed-questions";
import type { QuizQuestion, QuizTheme } from "@/lib/supabase/types";
import { QUIZ_QUESTION_COUNT, scoreAnswer } from "./scoring";

/**
 * Forme de question envoyée au client (sans la bonne réponse).
 * Le mapping "answer_index → is_correct" reste côté serveur,
 * via le snapshot stocké dans la session.
 */
export interface ClientQuestion {
  id: string;
  theme: QuizTheme;
  difficulty: 1 | 2 | 3;
  question: string;
  answers: { text: string }[];
}

export interface SessionSnapshot {
  questions: Array<{
    id: string;
    question: string;
    answers: { text: string; is_correct: boolean }[];
    correctIndex: number;
    explanation: string | null;
  }>;
  theme: QuizTheme | "mix";
  createdAt: number;
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function loadQuestionPool(
  theme: QuizTheme | "mix",
): Promise<Array<Pick<QuizQuestion, "id" | "theme" | "difficulty" | "question" | "answers" | "explanation">>> {
  if (isSupabaseAdminConfigured()) {
    const admin = getSupabaseAdmin();
    const query = admin
      .from("quiz_questions")
      .select("id, theme, difficulty, question, answers, explanation")
      .eq("active", true);

    const { data, error } = theme === "mix" ? await query : await query.eq("theme", theme);

    if (error) {
      console.error("[quiz] supabase load failed, falling back to seed:", error);
    } else if (data && data.length >= QUIZ_QUESTION_COUNT) {
      return data;
    }
  }

  // Fallback: banque locale
  const pool =
    theme === "mix"
      ? SEED_QUESTIONS
      : SEED_QUESTIONS.filter((q) => q.theme === theme);

  return pool.map((q, i) => ({
    id: `seed-${i}`,
    theme: q.theme,
    difficulty: q.difficulty,
    question: q.question,
    answers: q.answers,
    explanation: q.explanation,
  }));
}

export async function buildSession(theme: QuizTheme | "mix"): Promise<{
  clientQuestions: ClientQuestion[];
  snapshot: SessionSnapshot;
}> {
  const pool = await loadQuestionPool(theme);
  if (pool.length === 0) {
    throw new Error(`Aucune question disponible pour le thème "${theme}"`);
  }

  const picked = shuffle(pool).slice(0, QUIZ_QUESTION_COUNT);

  const snapshotQuestions: SessionSnapshot["questions"] = [];
  const clientQuestions: ClientQuestion[] = [];

  for (const q of picked) {
    const shuffledAnswers = shuffle(q.answers);
    const correctIndex = shuffledAnswers.findIndex((a) => a.is_correct);

    snapshotQuestions.push({
      id: q.id,
      question: q.question,
      answers: shuffledAnswers,
      correctIndex,
      explanation: q.explanation,
    });

    clientQuestions.push({
      id: q.id,
      theme: q.theme,
      difficulty: q.difficulty,
      question: q.question,
      answers: shuffledAnswers.map((a) => ({ text: a.text })),
    });
  }

  return {
    clientQuestions,
    snapshot: { questions: snapshotQuestions, theme, createdAt: Date.now() },
  };
}

export interface ClientAnswer {
  questionId: string;
  answerIndex: number | null;
  timeTakenMs: number;
}

export interface ScoredResult {
  totalScore: number;
  correctCount: number;
  perQuestion: Array<{
    questionId: string;
    isCorrect: boolean;
    correctIndex: number;
    chosenIndex: number | null;
    points: number;
    explanation: string | null;
  }>;
}

export function scoreSession(
  snapshot: SessionSnapshot,
  answers: ClientAnswer[],
): ScoredResult {
  const perQuestion: ScoredResult["perQuestion"] = [];
  let totalScore = 0;
  let correctCount = 0;

  for (const q of snapshot.questions) {
    const submitted = answers.find((a) => a.questionId === q.id);
    const chosenIndex = submitted?.answerIndex ?? null;
    const isCorrect = chosenIndex === q.correctIndex;
    const points = scoreAnswer({
      isCorrect,
      timeTakenMs: submitted?.timeTakenMs ?? Number.POSITIVE_INFINITY,
    });

    if (isCorrect) correctCount += 1;
    totalScore += points;
    perQuestion.push({
      questionId: q.id,
      isCorrect,
      correctIndex: q.correctIndex,
      chosenIndex,
      points,
      explanation: q.explanation,
    });
  }

  return { totalScore, correctCount, perQuestion };
}
