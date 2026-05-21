"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  RotateCcw,
  Trophy,
  Share2,
  Sparkles,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getRank, QUIZ_MAX_SCORE } from "@/lib/quiz/scoring";

interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  correctIndex: number;
  chosenIndex: number | null;
  points: number;
  explanation: string | null;
}

interface StoredResult {
  score: number;
  correctCount: number;
  perQuestion: QuestionResult[];
  saved: boolean;
  profileId: string | null;
  theme: string;
  themeLabel: string;
  coinsEarned?: number;
  coinsTotal?: number;
}

export function ResultView() {
  const router = useRouter();
  const [result, setResult] = useState<StoredResult | null>(null);
  const [pseudo, setPseudo] = useState("");
  const [savingPseudo, setSavingPseudo] = useState(false);
  const [pseudoError, setPseudoError] = useState<string | null>(null);
  const [pseudoSaved, setPseudoSaved] = useState(false);

  useEffect(() => {
    const raw =
      typeof window !== "undefined"
        ? sessionStorage.getItem("m26:lastResult")
        : null;
    if (!raw) {
      router.replace("/quiz");
      return;
    }
    try {
      setResult(JSON.parse(raw) as StoredResult);
    } catch {
      router.replace("/quiz");
    }
  }, [router]);

  if (!result) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  const rank = getRank(result.score);
  const total = result.perQuestion.length;

  const handleShare = async () => {
    const text = `J'ai marqué ${result.score} / ${QUIZ_MAX_SCORE} au quiz Mondial 26 (${rank.label} ${rank.emoji}). Bats mon score :`;
    const url =
      (typeof window !== "undefined"
        ? `${window.location.origin}/quiz/${result.theme}`
        : "https://mondial26.app/quiz");
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "Mondial 26", text, url });
        return;
      } catch {
        // fallback ci-dessous
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      alert("Texte copié dans le presse-papier !");
    } catch {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${url}`)}`);
    }
  };

  const submitPseudo = async () => {
    setPseudoError(null);
    if (pseudo.trim().length < 2) {
      setPseudoError("Pseudo trop court");
      return;
    }
    setSavingPseudo(true);
    try {
      const res = await fetch("/api/profile/pseudo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pseudo: pseudo.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Erreur");
      }
      setPseudoSaved(true);
    } catch (err) {
      setPseudoError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSavingPseudo(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-bg-card/60 p-6 sm:p-10 text-center">
        <div className="text-5xl">{rank.emoji}</div>
        <div className="mt-3 text-xs uppercase tracking-wider text-text-dim">
          {result.themeLabel}
        </div>
        <h1 className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight">
          <span className="font-mono tabular text-accent-red">{result.score}</span>
          <span className="text-text-dim text-3xl"> / {QUIZ_MAX_SCORE}</span>
        </h1>
        <div className="mt-2 text-lg font-semibold">{rank.label}</div>
        <div className="mt-1 text-sm text-text-muted">
          {result.correctCount} bonnes réponses sur {total}
        </div>

        {result.coinsEarned !== undefined && result.coinsEarned > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent-red/30 bg-accent-red/10 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-accent-red" />
            <span className="text-sm font-semibold">
              +{result.coinsEarned} Buts gagnés
            </span>
            {result.coinsTotal !== undefined && (
              <span className="text-xs text-text-muted">
                (solde {result.coinsTotal})
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/quiz/${result.theme}`}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-5 py-3 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Rejouer
          </Link>
          <Link
            href="/classement-joueurs"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold hover:bg-bg-card-hover transition-colors"
          >
            <Trophy className="h-4 w-4" /> Classement
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold hover:bg-bg-card-hover transition-colors"
          >
            <Share2 className="h-4 w-4" /> Partager
          </button>
        </div>
      </div>

      {!result.saved && (
        <div className="rounded-2xl border border-accent-red/30 bg-gradient-to-br from-accent-red/10 via-bg-card/60 to-bg-card p-6">
          {pseudoSaved ? (
            <div className="flex items-center gap-3 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm font-semibold">
                Score sauvegardé sous "{pseudo}" ! Tu peux le retrouver dans le
                classement.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent-red" />
                <h2 className="text-base font-bold">Sauvegarder ce score</h2>
              </div>
              <p className="mt-1 text-sm text-text-muted">
                Choisis un pseudo pour apparaître dans le classement des
                meilleurs joueurs.
              </p>
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <input
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={20}
                  placeholder="Ton pseudo (2-20 caractères)"
                  className="flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 text-sm placeholder-text-dim focus:outline-none focus:border-accent-red"
                  onKeyDown={(e) => e.key === "Enter" && submitPseudo()}
                />
                <button
                  type="button"
                  onClick={submitPseudo}
                  disabled={savingPseudo}
                  className="rounded-lg bg-accent-red px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors disabled:opacity-50"
                >
                  {savingPseudo ? "..." : "Sauvegarder"}
                </button>
              </div>
              {pseudoError && (
                <p className="mt-2 text-xs text-error">{pseudoError}</p>
              )}
              <p className="mt-3 text-xs text-text-dim">
                💡 Connecte-toi avec Google pour débloquer un badge vérifié, la
                boutique à points et l'historique de tes parties (bientôt
                disponible).
              </p>
            </>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-bg-card/40 p-5 sm:p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-dim mb-4">
          Détail des réponses
        </h2>
        <ol className="space-y-3">
          {result.perQuestion.map((q, i) => (
            <li
              key={q.questionId}
              className={cn(
                "rounded-xl border p-3 sm:p-4",
                q.isCorrect
                  ? "border-success/30 bg-success/5"
                  : "border-error/30 bg-error/5",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white text-xs font-bold",
                    q.isCorrect ? "bg-success" : "bg-error",
                  )}
                >
                  {q.isCorrect ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-text-dim">
                    Question {i + 1}
                  </div>
                  <div className="mt-0.5 text-sm">
                    <span className="text-text-muted">Bonne réponse : </span>
                    <span className="font-semibold">
                      {String.fromCharCode(65 + q.correctIndex)}
                    </span>
                    {q.chosenIndex !== null && q.chosenIndex !== q.correctIndex && (
                      <span className="text-text-dim">
                        {" "}
                        · tu as répondu{" "}
                        <span className="text-error">
                          {String.fromCharCode(65 + q.chosenIndex)}
                        </span>
                      </span>
                    )}
                    {q.chosenIndex === null && (
                      <span className="text-text-dim"> · pas de réponse</span>
                    )}
                  </div>
                  {q.explanation && (
                    <p className="mt-1.5 text-xs text-text-muted">
                      {q.explanation}
                    </p>
                  )}
                </div>
                <span className="font-mono tabular text-sm font-bold text-text-muted">
                  +{q.points}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
