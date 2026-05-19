import Link from "next/link";
import { Brain, BadgeCheck } from "lucide-react";
import {
  getSupabaseServer,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table";
import { GoogleSignInButton } from "@/components/auth/google-button";
import type { LeaderboardEntry } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top joueurs",
  description:
    "Le classement des meilleurs joueurs du quiz Mondial 26 — temps réel.",
};

export const dynamic = "force-dynamic";

async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase
      .from("leaderboard_global")
      .select("*")
      .limit(50);
    if (error) {
      console.error("[leaderboard]", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[leaderboard]", err);
    return [];
  }
}

export default async function LeaderboardPage() {
  const initial = await loadLeaderboard();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
        <LeaderboardTable initial={initial} />

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-blue/10 via-bg-card/60 to-bg-card p-5">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-accent-blue" />
              <h2 className="font-bold">Compte vérifié</h2>
            </div>
            <p className="mt-2 text-sm text-text-muted">
              Connecte-toi avec Google pour ajouter un badge vérifié à ton
              pseudo et accumuler des points pour la boutique (bientôt).
            </p>
            <div className="mt-4">
              <GoogleSignInButton
                next="/classement-joueurs"
                label="Se connecter avec Google"
              />
            </div>
          </div>

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
