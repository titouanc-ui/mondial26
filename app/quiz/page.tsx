import Link from "next/link";
import {
  Brain,
  Globe,
  History,
  Trophy,
  Users,
  Sparkles,
  ListChecks,
  Flag,
} from "lucide-react";
import { QuizTabs } from "@/components/quiz/quiz-tabs";
import { RecentSessionsLive } from "@/components/quiz/recent-sessions";
import { countByTheme } from "@/lib/quiz/seed-questions";
import {
  QUIZ_QUESTION_COUNT,
  QUIZ_TIME_PER_QUESTION_MS,
} from "@/lib/quiz/scoring";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
  description:
    "10 questions, 4 propositions, un timer qui fait grimper le score. Défie tes potes au quiz de la Coupe du Monde 2026.",
};

const THEMES = [
  {
    id: "mix",
    label: "Mix",
    desc: "Toutes catégories, pour s'échauffer",
    icon: Sparkles,
    gradient: "from-accent-red to-accent-blue",
    badge: "Recommandé",
  },
  {
    id: "historique",
    label: "Historique",
    desc: "Les grandes heures du Mondial",
    icon: History,
    gradient: "from-accent-gold to-yellow-600",
  },
  {
    id: "equipes",
    label: "Équipes",
    desc: "Les 48 sélections de la CDM 2026",
    icon: Globe,
    gradient: "from-accent-blue to-accent-blue-hover",
  },
  {
    id: "joueurs",
    label: "Joueurs",
    desc: "Stars, records, anecdotes",
    icon: Users,
    gradient: "from-accent-green to-accent-green-hover",
  },
  {
    id: "matchs",
    label: "Matchs",
    desc: "Résultats légendaires & faits marquants",
    icon: Trophy,
    gradient: "from-accent-red to-accent-red-hover",
  },
  {
    id: "culture",
    label: "Culture",
    desc: "Mascottes, ballons, organisation",
    icon: Brain,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    id: "france",
    label: "Équipe de France",
    desc: "Les Bleus en CDM, de 1998 à 2022",
    icon: Flag,
    gradient: "from-blue-700 via-white to-red-600",
    badge: "Spécial",
  },
] as const;

export default function QuizHubPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-red">
          <Brain className="h-3 w-3" /> Quiz
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          Choisis ton thème.
        </h1>
        <p className="mt-2 text-text-muted">
          {QUIZ_QUESTION_COUNT} questions ·{" "}
          {QUIZ_TIME_PER_QUESTION_MS / 1000} sec par question · plus tu
          réponds vite, plus tu marques.
        </p>
      </div>

      <QuizTabs className="mt-8" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          const count =
            theme.id === "mix"
              ? countByTheme("all")
              : countByTheme(theme.id);
          return (
            <Link
              key={theme.id}
              href={`/quiz/${theme.id}`}
              className="group relative flex flex-col rounded-2xl border border-border bg-bg-card/70 p-5 hover:border-border-strong hover:bg-bg-card transition-all"
            >
              {"badge" in theme && theme.badge && (
                <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-accent-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  <Sparkles className="h-3 w-3" />
                  {theme.badge}
                </span>
              )}
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${theme.gradient} text-white`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold">{theme.label}</h2>
              <p className="mt-1 text-sm text-text-muted flex-1">
                {theme.desc}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-text-dim">
                  <ListChecks className="h-3 w-3" />
                  {count} questions disponibles
                </span>
                <span className="font-medium text-text group-hover:text-accent-red transition-colors">
                  Jouer →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3 max-w-3xl">
        {[
          { label: "Questions / partie", value: QUIZ_QUESTION_COUNT },
          { label: "Sec / question", value: QUIZ_TIME_PER_QUESTION_MS / 1000 },
          { label: "Score max", value: 1500 },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-bg-card/50 p-4 text-center"
          >
            <div className="font-mono tabular text-3xl font-bold text-text">
              {s.value}
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-text-dim">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Dernières parties — chargement client */}
      <div className="mt-12">
        <RecentSessionsLive />
      </div>
    </div>
  );
}
