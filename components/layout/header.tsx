"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/news", label: "News" },
  { href: "/stats", label: "Stats" },
  { href: "/classement", label: "Classement" },
  { href: "/quiz", label: "Quiz", highlight: true },
  { href: "/classement-joueurs", label: "Top joueurs" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
              pathname === link.href || pathname.startsWith(`${link.href}/`);
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
                pathname === link.href || pathname.startsWith(`${link.href}/`);
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
          </div>
        </nav>
      )}
    </header>
  );
}
