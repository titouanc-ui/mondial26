import Link from "next/link";
import { Store, Coins, AlertCircle } from "lucide-react";
import {
  getSupabaseServer,
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { GoogleSignInButton } from "@/components/auth/google-button";
import { ShopGrid } from "@/components/shop/shop-grid";
import { BANNERS, FRAMES, BADGES, ICONS } from "@/lib/shop/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Boutique",
  description:
    "Dépense tes Buts dans la boutique Mondial 26 : bannières, cadres, badges, icônes.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Boutique indisponible</h1>
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

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-accent-red/10 via-bg-card/60 to-bg-card p-8 text-center">
          <Store className="mx-auto h-10 w-10 text-accent-red" />
          <h1 className="mt-4 text-2xl font-bold">Boutique</h1>
          <p className="mt-2 text-text-muted">
            Connecte-toi avec Google pour gagner des <strong>Buts</strong> en
            jouant au quiz et les dépenser en bannières, cadres, badges et
            icônes.
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <GoogleSignInButton
              next="/boutique"
              label="Se connecter avec Google"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!isSupabaseAdminConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Boutique indisponible</h1>
        <p className="mt-2 text-text-muted">Service role manquant côté serveur.</p>
      </div>
    );
  }

  const admin = getSupabaseAdmin();
  const { data: profile, error: pErr } = await admin
    .from("profiles")
    .select(
      "id, coins, is_verified, equipped_banner, equipped_frame, equipped_badge, equipped_icon",
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (pErr) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <h1 className="font-bold">Migration SQL manquante</h1>
          </div>
          <p className="text-sm text-text-muted">
            Exécute la migration{" "}
            <code>supabase/migrations/0003_shop.sql</code> dans Supabase Studio.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-bg p-3 text-xs text-text-dim border border-border">
            {pErr.message}
          </pre>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Profil introuvable</h1>
        <p className="mt-2 text-text-muted">
          Reconnecte-toi pour initialiser ton profil.
        </p>
      </div>
    );
  }

  const profileTyped = profile as {
    id: string;
    coins: number;
    is_verified: boolean;
    equipped_banner: string | null;
    equipped_frame: string | null;
    equipped_badge: string | null;
    equipped_icon: string | null;
  };

  const { data: inv } = await admin
    .from("user_inventory")
    .select("item_id")
    .eq("profile_id", profileTyped.id);

  const ownedIds = new Set((inv ?? []).map((r) => (r as { item_id: string }).item_id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-red">
            <Store className="h-3 w-3" /> Boutique
          </div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            Personnalise ton profil.
          </h1>
          <p className="mt-2 text-text-muted">
            Dépense tes <strong>Buts</strong> en cosmétiques. Gagne-en en
            jouant au quiz.
          </p>
        </div>

        {/* Solde */}
        <div className="flex items-center gap-2 rounded-full border border-accent-red/30 bg-accent-red/10 px-4 py-2">
          <Coins className="h-5 w-5 text-accent-red" />
          <span className="font-mono text-2xl font-bold tabular">
            {profileTyped.coins}
          </span>
          <span className="text-sm font-medium text-text-muted">Buts</span>
        </div>
      </div>

      <div className="mt-8">
        <ShopGrid
          coins={profileTyped.coins}
          isVerified={profileTyped.is_verified}
          ownedIds={Array.from(ownedIds)}
          equipped={{
            banner: profileTyped.equipped_banner,
            frame: profileTyped.equipped_frame,
            badge: profileTyped.equipped_badge,
            icon: profileTyped.equipped_icon,
          }}
          catalog={{
            banners: BANNERS,
            frames: FRAMES,
            badges: BADGES,
            icons: ICONS,
          }}
        />
      </div>

      <p className="mt-12 text-center text-xs text-text-dim">
        Comment gagner des Buts ?{" "}
        <Link href="/quiz" className="underline hover:text-text">
          Joue au quiz
        </Link>{" "}
        — chaque partie te rapporte des Buts en fonction de ton score.
      </p>
    </div>
  );
}
