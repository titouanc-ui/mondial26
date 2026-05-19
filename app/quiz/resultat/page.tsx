import { ResultView } from "@/components/quiz/result-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ton score",
};

export default function ResultPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ResultView />
    </div>
  );
}
