import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phases finales",
  description:
    "L'arbre des phases finales de la Coupe du Monde 2026, des 16èmes à la finale.",
};

const ROUNDS = [
  { name: "1/16e", short: "16e", count: 16 },
  { name: "8e de finale", short: "8e", count: 8 },
  { name: "Quarts", short: "1/4", count: 4 },
  { name: "Demies", short: "1/2", count: 2 },
  { name: "Finale", short: "F", count: 1 },
];

export default function PhasesFinalesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        href="/classement"
        className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux poules
      </Link>

      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
        Arbre des phases finales
      </h1>
      <p className="mt-2 text-text-muted">
        Du tour des 1/16e à la finale. L'arbre se remplit automatiquement à
        l'issue de la phase de poules.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-bg-card/40 p-6 sm:p-10">
        <div className="flex items-center gap-3 text-text-muted">
          <Construction className="h-5 w-5 text-accent-gold" />
          <p className="text-sm">
            L'arbre interactif sera activé à l'issue de la phase de poules
            (~25 juin 2026). En attendant, voici la structure des tours à
            venir.
          </p>
        </div>

        <div className="mt-8 overflow-x-auto">
          <div className="flex gap-4 min-w-max">
            {ROUNDS.map((r) => (
              <div
                key={r.name}
                className="flex-1 min-w-32 rounded-xl border border-border bg-bg-card p-4"
              >
                <div className="text-xs uppercase tracking-wider text-text-dim">
                  {r.short}
                </div>
                <div className="mt-1 font-bold">{r.name}</div>
                <div className="mt-3 space-y-2">
                  {Array.from({ length: r.count }).map((_, i) => (
                    <div
                      key={i}
                      className="h-10 rounded-lg border border-border/50 bg-bg-elevated/40 flex items-center justify-center text-[10px] uppercase tracking-wider text-text-dim"
                    >
                      à jouer
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
