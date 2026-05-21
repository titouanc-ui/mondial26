"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Trophy, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

const TABS = [
  { href: "/quiz", label: "Jouer", icon: Gamepad2 },
  { href: "/classement-joueurs", label: "Top joueurs", icon: Trophy },
  { href: "/quiz/succes", label: "Succès", icon: Award },
];

export function QuizTabs({ className }: Props) {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "flex items-center gap-1 border-b border-border",
        className,
      )}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active =
          tab.href === "/quiz"
            ? pathname === "/quiz"
            : pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors",
              active
                ? "text-text"
                : "text-text-muted hover:text-text",
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {active && (
              <span className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-accent-red to-accent-blue" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
