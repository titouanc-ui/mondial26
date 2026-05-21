"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Menu, X, Trophy, User, Coins, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { getBanner } from "@/lib/shop/catalog";

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/stats", label: "Stats" },
  { href: "/classement", label: "Classement" },
  { href: "/quiz", label: "Quiz", highlight: true },
];

interface MiniProfile {
  pseudo: string;
  coins: number;
  avatar_url: string | null;
  equipped_frame: string | null;
  equipped_banner: string | null;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [profile, setProfile] = useState<MiniProfile | null>(null);

  const loadProfile = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setAuthed(false);
      setProfile(null);
      return;
    }
    setAuthed(true);
    const { data } = await supabase
      .from("profiles")
      .select("pseudo, coins, avatar_url, equipped_frame, equipped_banner")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      setProfile(data as MiniProfile);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowser();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void loadProfile();
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // Recharge le profil quand l'utilisateur revient sur l'onglet
  // (utile après un achat boutique → solde mis à jour)
  useEffect(() => {
    void loadProfile();
  }, [pathname, loadProfile]);

  const banner = getBanner(profile?.equipped_banner);

  return (
    <header className="sticky top-0 z-40 border-b border-border">
      {/* Top bar avec bannière en background */}
      <div className="relative overflow-hidden">
        {/* Couche bannière (colorée si équipée) */}
        {banner && (
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: banner.gradient }}
          />
        )}
        {/* Couche overlay sombre pour lisibilité — un peu plus transparente si bannière */}
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 backdrop-blur-xl",
            banner ? "bg-bg/72" : "bg-bg/80",
          )}
        />

        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0"
          onClick={() => setOpen(false)}
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent-red to-accent-blue text-white">
            <Trophy className="h-4 w-4" />
          </span>
          <span className="hidden xs:inline sm:inline">
            Mondial<span className="text-accent-red">26</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`) ||
              (link.href === "/quiz" && pathname === "/classement-joueurs");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active ? "text-text" : "text-text-muted hover:text-text",
                  link.highlight &&
                    !active &&
                    "text-accent-red hover:text-accent-red-hover",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-accent-red to-accent-blue" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Cluster droit : Buts + Boutique + Profil (visible si authentifié) */}
        <div className="flex items-center gap-2">
          {authed && profile && (
            <>
              {/* Solde de Buts */}
              <Link
                href="/boutique"
                className={cn(
                  "hidden sm:inline-flex items-center gap-1.5 rounded-full border border-accent-red/30 bg-accent-red/10 px-2.5 py-1.5 text-sm font-semibold text-text hover:bg-accent-red/15 transition-colors",
                  pathname.startsWith("/boutique") &&
                    "border-accent-red/60 bg-accent-red/15",
                )}
                title="Voir la boutique"
              >
                <Coins className="h-3.5 w-3.5 text-accent-red" />
                <span className="font-mono tabular">{profile.coins}</span>
                <span className="hidden md:inline text-xs font-medium text-text-muted">
                  Buts
                </span>
              </Link>

              {/* Bouton boutique mobile (icône seule) */}
              <Link
                href="/boutique"
                aria-label="Boutique"
                className={cn(
                  "sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent-red/30 bg-accent-red/10 text-accent-red",
                  pathname.startsWith("/boutique") && "bg-accent-red/20",
                )}
              >
                <Store className="h-4 w-4" />
              </Link>

              {/* Bouton profil avec avatar */}
              <Link
                href="/profil"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border bg-bg-card/60 pr-3 pl-1 py-1 text-sm font-medium transition-colors hover:bg-bg-card-hover",
                  pathname.startsWith("/profil") &&
                    "border-accent-blue/50 bg-bg-card",
                )}
                aria-label="Mon profil"
              >
                <ProfileAvatar
                  avatarUrl={profile.avatar_url}
                  pseudo={profile.pseudo}
                  frameId={profile.equipped_frame}
                  size={28}
                  className="!border-2"
                />
                <span className="hidden sm:inline">Profil</span>
              </Link>
            </>
          )}

          {/* Bouton mobile menu (toujours visible en md-) */}
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-bg-card transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border bg-bg-card">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`) ||
                (link.href === "/quiz" && pathname === "/classement-joueurs");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-bg-elevated text-text"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated",
                    link.highlight && !active && "text-accent-red",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            {authed && (
              <>
                <Link
                  href="/boutique"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith("/boutique")
                      ? "bg-bg-elevated text-text"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated",
                  )}
                >
                  <Store className="h-4 w-4" /> Boutique
                  {profile && (
                    <span className="ml-auto inline-flex items-center gap-1 text-accent-red font-mono">
                      <Coins className="h-3 w-3" /> {profile.coins}
                    </span>
                  )}
                </Link>
                <Link
                  href="/profil"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname.startsWith("/profil")
                      ? "bg-bg-elevated text-text"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated",
                  )}
                >
                  <User className="h-4 w-4" /> Mon profil
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
