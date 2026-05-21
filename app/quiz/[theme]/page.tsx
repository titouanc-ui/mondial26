import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { getThemeMeta } from "@/lib/quiz/themes";
import type { Metadata } from "next";

export async function generateMetadata(
  props: PageProps<"/quiz/[theme]">,
): Promise<Metadata> {
  const { theme } = await props.params;
  const meta = getThemeMeta(theme);
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
  const meta = getThemeMeta(theme);
  if (!meta) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <QuizPlayer theme={theme} themeLabel={meta.label} />
    </div>
  );
}
