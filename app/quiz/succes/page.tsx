import { Award } from "lucide-react";
import { QuizTabs } from "@/components/quiz/quiz-tabs";
import { AchievementList } from "@/components/achievements/achievement-list";
import { GoogleSignInButton } from "@/components/auth/google-button";
import {
  getSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Succès",
  description:
    "Débloque des succès en jouant au quiz Mondial 26 et gagne des Buts.",
};

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Succès indisponibles</h1>
        <p className="mt-2 text-text-muted">
          Le site n'est pas connecté à Supabase.
        </p>
      </div>
    );
  }

  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-red">
          <Award className="h-3 w-3" /> Quiz
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          Succès
        </h1>
        <p className="mt-2 text-text-muted">
          Débloque des succès en jouant, en achetant dans la boutique et en
          étant actif sur le site. Collecte tes Buts dès qu'un succès est prêt.
        </p>
      </div>

      <QuizTabs className="mt-8" />

      <div className="mt-6">
        {!user ? (
          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-red/10 via-bg-card/60 to-bg-card p-8 text-center">
            <Award className="mx-auto h-10 w-10 text-accent-red" />
            <h2 className="mt-4 text-xl font-bold">Tes succès t'attendent</h2>
            <p className="mt-2 text-text-muted">
              Connecte-toi avec Google pour suivre tes succès et collecter
              les Buts associés.
            </p>
            <div className="mt-6 max-w-xs mx-auto">
              <GoogleSignInButton
                next="/quiz/succes"
                label="Se connecter avec Google"
              />
            </div>
          </div>
        ) : (
          <AchievementList />
        )}
      </div>
    </div>
  );
}
