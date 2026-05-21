import Link from "next/link";
import { Trophy, Coins, Gamepad2, Star, AlertCircle, Store } from "lucide-react";
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
import { getBanner } from "@/lib/shop/catalog";
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
  const { data: profileData, error: fetchErr } = await admin
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Erreur SQL (typiquement : colonnes manquantes parce que la migration 0002 n'a pas été exécutée)
  if (fetchErr) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h1 className="font-bold">Migration SQL manquante</h1>
          </div>
          <p className="text-sm text-text-muted">
            La table <code>profiles</code> n'a pas encore les nouvelles colonnes
            (<code>avatar_url</code>, <code>favorite_team</code>, <code>bio</code>,{" "}
            <code>coins</code>). Exécute la migration{" "}
            <code>supabase/migrations/0002_profile_extended.sql</code> dans
            Supabase Studio &gt; SQL Editor.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-bg p-3 text-xs text-text-dim border border-border">
            {fetchErr.message}
          </pre>
        </div>
      </div>
    );
  }

  // Cas rare : authentifié mais pas encore de profil → on en crée un
  let profile = profileData as Profile | null;
  if (!profile) {
    const pseudoBase =
      (user.user_metadata?.full_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "Joueur";
    const { data: newProfile, error: createErr } = await admin
      .from("profiles")
      .insert({
        pseudo: String(pseudoBase).slice(0, 20),
        user_id: user.id,
      })
      .select("*")
      .single();
    if (createErr) {
      return (
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-2xl border border-error/30 bg-error/10 p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-error" />
              <h1 className="font-bold">Impossible de créer le profil</h1>
            </div>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-bg p-3 text-xs text-text-dim border border-border">
              {createErr.message}
            </pre>
          </div>
        </div>
      );
    }
    profile = newProfile as Profile;
  }

  // Valeurs par défaut si la migration n'a partiellement pas tourné
  const safeProfile = {
    ...profile,
    coins: profile.coins ?? 0,
    avatar_url: profile.avatar_url ?? null,
    favorite_team: profile.favorite_team ?? null,
    bio: profile.bio ?? null,
    equipped_banner: profile.equipped_banner ?? null,
    equipped_frame: profile.equipped_frame ?? null,
    equipped_badge: profile.equipped_badge ?? null,
    equipped_icon: profile.equipped_icon ?? null,
  };

  const stats = await loadStats(safeProfile.id);
  const banner = getBanner(safeProfile.equipped_banner);

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

      {/* Bannière personnalisée */}
      {banner && (
        <div
          className="mt-8 relative h-32 sm:h-40 w-full rounded-2xl overflow-hidden border border-border"
          style={{ background: banner.gradient }}
        >
          {banner.flag && (
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl sm:text-7xl drop-shadow-lg opacity-70">
              {banner.flag}
            </span>
          )}
          <div className="absolute left-5 bottom-3 text-xs uppercase tracking-wider text-white/80 font-semibold drop-shadow">
            {banner.name}
          </div>
        </div>
      )}

      <div className={`${banner ? "mt-6" : "mt-8"} grid gap-8 lg:grid-cols-[1fr_320px]`}>
        {/* Formulaire d'édition */}
        <ProfileForm
          profile={{
            pseudo: safeProfile.pseudo,
            bio: safeProfile.bio,
            favorite_team: safeProfile.favorite_team,
            avatar_url: safeProfile.avatar_url,
            equipped_frame: safeProfile.equipped_frame,
            equipped_icon: safeProfile.equipped_icon,
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
                {safeProfile.coins}
              </span>
              <span className="text-sm text-text-muted">Buts</span>
            </div>
            <p className="mt-2 text-xs text-text-muted">
              Dépense tes Buts dans la boutique : bannières, cadres, badges,
              icônes.
            </p>
            <Link
              href="/boutique"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent-red px-3 py-2 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
            >
              <Store className="h-4 w-4" /> Ouvrir la boutique
            </Link>
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
                  {safeProfile.points_total}
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
