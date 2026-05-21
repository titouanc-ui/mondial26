"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/stats", label: "Stats" },
  { href: "/classement", label: "Classement" },
  { href: "/quiz", label: "Quiz", highlight: true },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = getSupabaseBrowser();
    supabase.auth.getUser().then(({ data }) => {
      setAuthed(!!data.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight"
          onClick={() => setOpen(false)}
        >
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-accent-red to-accent-blue text-white">
            <Trophy className="h-4 w-4" />
          </span>
          <span>
            Mondial<span className="text-accent-red">26</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              pathname.startsWith(`${link.href}/`) ||
              // /classement-joueurs est rattaché à la section Quiz
              (link.href === "/quiz" && pathname === "/classement-joueurs");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-text"
                    : "text-text-muted hover:text-text",
                  link.highlight && !active && "text-accent-red hover:text-accent-red-hover",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-gradient-to-r from-accent-red to-accent-blue" />
                )}
              </Link>
            );
          })}
          {authed && (
            <Link
              href="/profil"
              className={cn(
                "ml-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-bg-card/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-bg-card-hover",
                pathname.startsWith("/profil") && "border-accent-blue/50 text-text",
              )}
              aria-label="Mon profil"
            >
              <User className="h-4 w-4" />
              <span>Profil</span>
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-text-muted hover:text-text hover:bg-bg-card transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
