import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSession } from "@/lib/quiz/engine";
import { encodeSessionToken } from "@/lib/quiz/session-token";
import {
  QUIZ_QUESTION_COUNT,
  QUIZ_TIME_PER_QUESTION_MS,
} from "@/lib/quiz/scoring";

const StartSchema = z.object({
  theme: z.enum([
    "equipes",
    "joueurs",
    "historique",
    "matchs",
    "culture",
    "mix",
  ]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const parsed = StartSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Thème invalide", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const { clientQuestions, snapshot } = await buildSession(parsed.data.theme);
    const token = encodeSessionToken(snapshot);

    return NextResponse.json({
      sessionToken: token,
      questions: clientQuestions,
      config: {
        questionCount: QUIZ_QUESTION_COUNT,
        timePerQuestionMs: QUIZ_TIME_PER_QUESTION_MS,
      },
    });
  } catch (err) {
    console.error("[quiz/start]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}
