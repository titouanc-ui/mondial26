import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import type { Metadata } from "next";

const THEMES: Record<string, { label: string; description: string }> = {
  mix: {
    label: "Mix de tout",
    description: "10 questions tirées de toutes les catégories.",
  },
  historique: {
    label: "Historique",
    description: "Les grandes heures du Mondial.",
  },
  equipes: {
    label: "Équipes",
    description: "Les 48 sélections de la CDM 2026.",
  },
  joueurs: {
    label: "Joueurs",
    description: "Stars, records, anecdotes.",
  },
  matchs: {
    label: "Matchs",
    description: "Résultats légendaires & faits marquants.",
  },
  culture: {
    label: "Culture",
    description: "Mascottes, ballons, organisation.",
  },
};

export async function generateMetadata(
  props: PageProps<"/quiz/[theme]">,
): Promise<Metadata> {
  const { theme } = await props.params;
  const meta = THEMES[theme];
  if (!meta) return { title: "Quiz" };
  return {
    title: `Quiz · ${meta.label}`,
    description: meta.description,
  };
}

export default async function QuizThemePage(
  props: PageProps<"/quiz/[theme]">,
) {
  const { theme } = await props.params;
  const meta = THEMES[theme];
  if (!meta) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <QuizPlayer theme={theme} themeLabel={meta.label} />
    </div>
  );
}
