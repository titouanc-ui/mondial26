import Link from "next/link";
import { redirect } from "next/navigation";
import { Trophy, Coins, Gamepad2, Star } from "lucide-react";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/auth/google-button";
import { LogoutButton } from "@/components/auth/logout-button";
import { ProfileForm } from "@/components/profile/profile-form";
import { TEAMS } from "@/lib/teams";
import type { Profile } from "@/lib/supabase/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon profil",
  description:
    "Personnalise ton profil joueur, ton équipe favorite et consulte tes Buts gagnés.",
};

export const dynamic = "force-dynamic";

interface ProfileStats {
  bestScore: number;
  gamesPlayed: number;
  totalCorrect: number;
}

async function loadStats(profileId: string): Promise<ProfileStats> {
  if (!isSupabaseAdminConfigured()) {
    return { bestScore: 0, gamesPlayed: 0, totalCorrect: 0 };
  }
  const admin = getSupabaseAdmin();
  const { data } = await admin
    .from("quiz_sessions")
    .select("score, correct_count")
    .eq("profile_id", profileId);
  const rows = (data ?? []) as { score: number; correct_count: number }[];
  return {
    bestScore: rows.reduce((m, r) => Math.max(m, r.score), 0),
    gamesPlayed: rows.length,
    totalCorrect: rows.reduce((s, r) => s + r.correct_count, 0),
  };
}

export default async function ProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Profil indisponible</h1>
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

  // Pas connecté → CTA Google
  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-blue/10 via-bg-card/60 to-bg-card p-8 text-center">
          <Star className="mx-auto h-10 w-10 text-accent-blue" />
          <h1 className="mt-4 text-2xl font-bold">Ton profil joueur</h1>
          <p className="mt-2 text-text-muted">
            Connecte-toi avec Google pour personnaliser ton avatar, choisir ton
            équipe favorite et accumuler des <strong>Buts</strong> à dépenser
            dans la boutique (bientôt).
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <GoogleSignInButton
              next="/profil"
              label="Se connecter avec Google"
            />
          </div>
          <p className="mt-4 text-xs text-text-muted">
            Pas encore prêt ?{" "}
            <Link href="/quiz" className="underline hover:text-text">
              Joue d'abord en pseudo
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Connecté → on charge le profil
  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Profil indisponible</h1>
        <p className="mt-2 text-text-muted">
          Service role manquant côté serveur.
        </p>
      </div>
    );
  }

  const admin = getSupabaseAdmin();
  const { data: profileData } = await admin
    .from("profiles")
    .select(
      "id, pseudo, user_id, is_verified, points_total, coins, avatar_url, favorite_team, bio, created_at, updated_at",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  // Cas rare : authentifié mais pas encore de profil → on en crée un
  let profile = profileData as Profile | null;
  if (!profile) {
    const pseudoBase =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Joueur";
    const { data: newProfile } = await admin
      .from("profiles")
      .insert({
        pseudo: String(pseudoBase).slice(0, 20),
        user_id: user.id,
      })
      .select("*")
      .single();
    profile = newProfile as Profile;
  }

  if (!profile) {
    redirect("/?auth=error");
  }

  const stats = await loadStats(profile.id);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Mon profil
          </h1>
          <p className="mt-2 text-text-muted">
            Personnalise ton profil, ton équipe favorite et suis ta progression.
          </p>
        </div>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
        >
          <Gamepad2 className="h-4 w-4" /> Jouer
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Formulaire d'édition */}
        <ProfileForm
          profile={{
            pseudo: profile.pseudo,
            bio: profile.bio,
            favorite_team: profile.favorite_team,
            avatar_url: profile.avatar_url,
          }}
          teams={TEAMS}
        />

        {/* Sidebar : stats + monnaie */}
        <aside className="space-y-4">
          {/* Pièces "Buts" */}
          <div className="rounded-2xl border border-accent-red/30 bg-gradient-to-br from-accent-red/15 via-bg-card/60 to-bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-accent-red" />
                <h2 className="font-bold">Mes Buts</h2>
              </div>
              <span className="text-xs text-text-muted">Monnaie</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold tracking-tight text-text">
                {profile.coins}
              </span>
              <span className="text-sm text-text-muted">Buts</span>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Dépense tes Buts dans la <strong>boutique</strong> (bientôt) :
              avatars, thèmes, boosts de score…
            </p>
          </div>

          {/* Stats quiz */}
          <div className="rounded-2xl border border-border bg-bg-card/40 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="h-4 w-4 text-accent-blue" />
              <h2 className="font-bold">Mes stats</h2>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-text-muted">Meilleur score</dt>
                <dd className="font-mono font-semibold">
                  {stats.bestScore} pts
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-muted">Parties jouées</dt>
                <dd className="font-mono font-semibold">{stats.gamesPlayed}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-muted">Bonnes réponses</dt>
                <dd className="font-mono font-semibold">
                  {stats.totalCorrect}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-text-muted">Score cumulé</dt>
                <dd className="font-mono font-semibold">
                  {profile.points_total}
                </dd>
              </div>
            </dl>
            <Link
              href="/classement-joueurs"
              className="mt-4 block text-center text-xs text-accent-blue hover:underline"
            >
              Voir le classement →
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-bg-card/40 p-4">
            <LogoutButton />
          </div>
        </aside>
      </div>
    </div>
  );
}
