import Link from "next/link";
import { Brain, BadgeCheck, CheckCircle2 } from "lucide-react";
import {
  getSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { RecentSessionsLive } from "@/components/quiz/recent-sessions";
import { GoogleSignInButton } from "@/components/auth/google-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { QuizTabs } from "@/components/quiz/quiz-tabs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top joueurs",
  description:
    "Le classement des meilleurs joueurs du quiz Mondial 26 — temps réel.",
};

export const dynamic = "force-dynamic";

/**
 * Charge UNIQUEMENT l'état utilisateur côté serveur (rapide : 1 query auth).
 * Le leaderboard et les dernières parties sont chargés côté client pour
 * que la page s'affiche instantanément (skeleton → données).
 */
async function loadCurrentUser(): Promise<{
  authed: boolean;
  pseudo: string | null;
}> {
  if (!isSupabaseConfigured()) return { authed: false, pseudo: null };
  try {
    const supabase = await getSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { authed: false, pseudo: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("pseudo")
      .eq("user_id", user.id)
      .maybeSingle();

    const pseudo =
      (profile as { pseudo?: string } | null)?.pseudo ??
      (user.user_metadata?.full_name as string | undefined) ??
      (user.email?.split("@")[0] ?? null);

    return { authed: true, pseudo };
  } catch (err) {
    console.error("[current-user]", err);
    return { authed: false, pseudo: null };
  }
}

export default async function LeaderboardPage() {
  const currentUser = await loadCurrentUser();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-red">
            <Brain className="h-3 w-3" /> Quiz
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Top joueurs
          </h1>
          <p className="mt-2 text-text-muted">
            Les 50 meilleurs scores au quiz Mondial 26.
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
        >
          <Brain className="h-4 w-4" /> Tenter le record
        </Link>
      </div>

      <QuizTabs className="mt-8" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-8">
          <LeaderboardTable />
          <RecentSessionsLive />
        </div>

        <aside className="space-y-4">
          {currentUser.authed ? (
            <div className="rounded-2xl border border-accent-blue/30 bg-gradient-to-br from-accent-blue/10 via-bg-card/60 to-bg-card p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-blue" />
                <h2 className="font-bold">Compte vérifié</h2>
              </div>
              <p className="mt-2 text-sm">
                Connecté en tant que{" "}
                <span className="font-semibold text-text">
                  {currentUser.pseudo ?? "toi"}
                </span>
                <BadgeCheck className="inline h-3.5 w-3.5 ml-1 text-accent-blue" />
              </p>
              <p className="mt-1 text-xs text-text-muted">
                Tes prochains scores apparaîtront avec ton badge vérifié dans
                le classement.
              </p>
              <div className="mt-4">
                <LogoutButton />
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-blue/10 via-bg-card/60 to-bg-card p-5">
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-accent-blue" />
                <h2 className="font-bold">Compte vérifié</h2>
              </div>
              <p className="mt-2 text-sm text-text-muted">
                Connecte-toi avec Google pour ajouter un badge vérifié à ton
                pseudo, gagner des Buts et collectionner des cosmétiques dans
                la boutique.
              </p>
              <div className="mt-4">
                <GoogleSignInButton
                  next="/classement-joueurs"
                  label="Se connecter avec Google"
                />
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-bg-card/40 p-5 text-xs text-text-muted">
            <h3 className="text-sm font-bold text-text mb-2">Règles</h3>
            <ul className="space-y-1.5">
              <li>· Le meilleur score de chaque joueur est conservé</li>
              <li>· Plus tu réponds vite, plus tu marques</li>
              <li>· Bonus vitesse jusqu'à +50 pts par bonne réponse</li>
              <li>· Score max : 1500 pts</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
