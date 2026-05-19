"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QUIZ_TIME_PER_QUESTION_MS,
  QUIZ_BASE_POINTS,
  QUIZ_MAX_SPEED_BONUS,
  scoreAnswer,
} from "@/lib/quiz/scoring";

interface ClientQuestion {
  id: string;
  theme: string;
  difficulty: 1 | 2 | 3;
  question: string;
  answers: { text: string }[];
}

interface QuizPlayerProps {
  theme: string;
  themeLabel: string;
}

type Phase =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | {
      kind: "playing";
      questions: ClientQuestion[];
      sessionToken: string;
      currentIdx: number;
      answers: Array<{
        questionId: string;
        answerIndex: number | null;
        timeTakenMs: number;
      }>;
      questionStartedAt: number;
      lastChoice: { index: number; lockedAt: number } | null;
      runningScore: number;
      sessionStartedAt: number;
    }
  | { kind: "submitting" };

export function QuizPlayer({ theme, themeLabel }: QuizPlayerProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [remainingMs, setRemainingMs] = useState(QUIZ_TIME_PER_QUESTION_MS);
  const submittedRef = useRef(false);

  // Démarre la session côté serveur
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/quiz/start", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ theme }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = (await res.json()) as {
          sessionToken: string;
          questions: ClientQuestion[];
        };
        if (cancelled) return;
        setPhase({
          kind: "playing",
          questions: data.questions,
          sessionToken: data.sessionToken,
          currentIdx: 0,
          answers: [],
          questionStartedAt: performance.now(),
          lastChoice: null,
          runningScore: 0,
          sessionStartedAt: performance.now(),
        });
      } catch (err) {
        if (cancelled) return;
        setPhase({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Erreur de chargement",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  // Timer par question
  useEffect(() => {
    if (phase.kind !== "playing" || phase.lastChoice !== null) return;
    const interval = setInterval(() => {
      const elapsed = performance.now() - phase.questionStartedAt;
      setRemainingMs(Math.max(0, QUIZ_TIME_PER_QUESTION_MS - elapsed));
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  // Timeout : si on n'a pas répondu, on enregistre "pas de réponse"
  useEffect(() => {
    if (phase.kind !== "playing" || phase.lastChoice !== null) return;
    if (remainingMs > 0) return;
    handleChoice(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs, phase.kind]);

  const submitSession = useCallback(
    async (
      answers: Array<{
        questionId: string;
        answerIndex: number | null;
        timeTakenMs: number;
      }>,
      sessionToken: string,
      sessionStartedAt: number,
    ) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setPhase({ kind: "submitting" });
      try {
        const res = await fetch("/api/quiz/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            sessionToken,
            answers,
            durationMs: Math.round(performance.now() - sessionStartedAt),
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? `HTTP ${res.status}`);
        }
        const data = await res.json();
        sessionStorage.setItem(
          "m26:lastResult",
          JSON.stringify({ ...data, theme, themeLabel }),
        );
        router.push("/quiz/resultat");
      } catch (err) {
        setPhase({
          kind: "error",
          message:
            err instanceof Error ? err.message : "Erreur d'envoi du score",
        });
        submittedRef.current = false;
      }
    },
    [router, theme, themeLabel],
  );

  const handleChoice = useCallback(
    (chosenIndex: number | null) => {
      if (phase.kind !== "playing" || phase.lastChoice !== null) return;
      const timeTakenMs = Math.round(
        Math.min(
          QUIZ_TIME_PER_QUESTION_MS,
          performance.now() - phase.questionStartedAt,
        ),
      );
      const q = phase.questions[phase.currentIdx];
      const newAnswers = [
        ...phase.answers,
        { questionId: q.id, answerIndex: chosenIndex, timeTakenMs },
      ];

      // Score visuel local (juste pour la jauge) - le vrai score est calculé serveur
      const isLastQuestionLocal =
        phase.currentIdx === phase.questions.length - 1;

      setPhase({
        ...phase,
        answers: newAnswers,
        lastChoice:
          chosenIndex === null
            ? { index: -1, lockedAt: Date.now() }
            : { index: chosenIndex, lockedAt: Date.now() },
      });

      setTimeout(() => {
        if (isLastQuestionLocal) {
          submitSession(newAnswers, phase.sessionToken, phase.sessionStartedAt);
        } else {
          setPhase((p) => {
            if (p.kind !== "playing") return p;
            return {
              ...p,
              currentIdx: p.currentIdx + 1,
              answers: newAnswers,
              questionStartedAt: performance.now(),
              lastChoice: null,
              runningScore:
                p.runningScore +
                scoreAnswer({
                  isCorrect: false, // placeholder, vrai score serveur
                  timeTakenMs,
                }),
            };
          });
          setRemainingMs(QUIZ_TIME_PER_QUESTION_MS);
        }
      }, 1100);
    },
    [phase, submitSession],
  );

  if (phase.kind === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-muted">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="mt-3 text-sm">Chargement des questions…</p>
      </div>
    );
  }

  if (phase.kind === "submitting") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-text-muted">
        <Loader2 className="h-8 w-8 animate-spin text-accent-red" />
        <p className="mt-3 text-sm">Calcul du score…</p>
      </div>
    );
  }

  if (phase.kind === "error") {
    return (
      <div className="rounded-2xl border border-error/40 bg-error/10 p-8 text-center">
        <p className="text-error font-semibold">Aïe, ça a coincé.</p>
        <p className="mt-2 text-sm text-text-muted">{phase.message}</p>
        <Link
          href="/quiz"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-red hover:text-accent-red-hover"
        >
          <ArrowLeft className="h-4 w-4" /> Retour aux thèmes
        </Link>
      </div>
    );
  }

  const q = phase.questions[phase.currentIdx];
  const total = phase.questions.length;
  const pctRemaining = (remainingMs / QUIZ_TIME_PER_QUESTION_MS) * 100;
  const projectedPoints = phase.lastChoice
    ? 0
    : QUIZ_BASE_POINTS +
      Math.round((pctRemaining / 100) * QUIZ_MAX_SPEED_BONUS);

  const timerColor =
    pctRemaining > 60
      ? "bg-accent-green"
      : pctRemaining > 30
        ? "bg-warning"
        : "bg-accent-red";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
        >
          <ArrowLeft className="h-4 w-4" /> Quitter
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-text-muted">
            Question{" "}
            <span className="font-bold text-text tabular">
              {phase.currentIdx + 1}
            </span>
            <span className="text-text-dim"> / {total}</span>
          </span>
          {!phase.lastChoice && (
            <span className="inline-flex items-center gap-1 rounded-full bg-bg-card border border-border px-2 py-0.5 text-xs">
              <Sparkles className="h-3 w-3 text-accent-gold" />
              <span className="font-mono tabular font-semibold">
                +{projectedPoints}
              </span>
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-bg-card/80 p-5 sm:p-8">
        <div className="flex items-center justify-between text-xs text-text-dim uppercase tracking-wider mb-2">
          <span>{themeLabel}</span>
          <span>
            {["", "Facile", "Moyen", "Difficile"][q.difficulty] ?? ""}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-balance">
          {q.question}
        </h2>

        <div className="mt-4 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
          <div
            className={cn("h-full transition-all duration-100 ease-linear", timerColor)}
            style={{ width: `${pctRemaining}%` }}
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {q.answers.map((a, i) => {
            const chosen = phase.lastChoice?.index === i;
            const anyChosen = phase.lastChoice !== null;
            return (
              <button
                key={i}
                type="button"
                disabled={anyChosen}
                onClick={() => handleChoice(i)}
                className={cn(
                  "group text-left rounded-xl border border-border bg-bg-elevated p-4 transition-all",
                  !anyChosen && "hover:border-accent-red hover:bg-bg-card-hover",
                  chosen && "border-accent-red bg-accent-red/15",
                  anyChosen && !chosen && "opacity-60",
                )}
              >
                <span className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs font-bold tabular",
                      chosen
                        ? "border-accent-red bg-accent-red text-white"
                        : "border-border text-text-dim",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm sm:text-base font-medium">
                    {a.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {phase.lastChoice && (
          <p className="mt-4 text-center text-sm text-text-muted">
            {phase.currentIdx === total - 1
              ? "Calcul du score…"
              : "Question suivante…"}
          </p>
        )}
      </div>
    </div>
  );
}
