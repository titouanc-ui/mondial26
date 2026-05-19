import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  BarChart3,
  Trophy,
  Brain,
  Sparkles,
} from "lucide-react";
import { Countdown } from "@/components/home/countdown";

const SECTIONS = [
  {
    href: "/news",
    title: "News",
    description:
      "L'actu du Mondial agrégée depuis L'Équipe, RMC, So Foot et les autres grands médias français.",
    icon: Newspaper,
    color: "from-accent-blue to-accent-blue-hover",
  },
  {
    href: "/stats",
    title: "Stats live",
    description:
      "Statistiques détaillées des matchs : possession, tirs, xG, lineups. Mis à jour en direct.",
    icon: BarChart3,
    color: "from-accent-green to-accent-green-hover",
  },
  {
    href: "/classement",
    title: "Classements",
    description:
      "Les 12 poules de qualification puis l'arbre des phases finales, actualisés en temps réel.",
    icon: Trophy,
    color: "from-accent-gold to-yellow-600",
  },
  {
    href: "/quiz",
    title: "Quiz",
    description:
      "10 questions, 4 propositions, un timer qui fait grimper le score. Défie tes potes et grimpe au classement.",
    icon: Brain,
    color: "from-accent-red to-accent-red-hover",
    featured: true,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section className="pt-12 sm:pt-20 pb-12 sm:pb-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-red/30 bg-accent-red/10 px-3 py-1 text-xs font-medium text-accent-red">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-red opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-red" />
              </span>
              Coupe du Monde 2026 · USA · Canada · Mexique
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
              Tout le Mondial,
              <br />
              <span className="bg-gradient-to-r from-accent-red via-white to-accent-blue bg-clip-text text-transparent">
                entre potes.
              </span>
            </h1>

            <p className="mt-5 text-lg text-text-muted max-w-xl text-balance">
              News, stats live, classements et un quiz fait pour défier ton
              groupe. Grimpe au classement, deviens le pronostiqueur de la
              bande.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-5 py-3 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                Lancer un quiz
              </Link>
              <Link
                href="/classement"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-5 py-3 text-sm font-semibold text-text hover:bg-bg-card-hover transition-colors"
              >
                Voir les poules
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:pl-8">
            <div className="rounded-2xl border border-border bg-bg-card/60 backdrop-blur-sm p-5 sm:p-6">
              <p className="text-xs uppercase tracking-wider text-text-dim">
                Coup d'envoi
              </p>
              <p className="mt-1 text-base font-semibold">
                Mexique · Estadio Azteca · 11 juin 2026 · 20h locales
              </p>
              <div className="mt-5">
                <Countdown />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Tout ce qu'il te faut
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.href}
                href={s.href}
                className="group relative flex flex-col rounded-2xl border border-border bg-bg-card/70 p-5 hover:border-border-strong hover:bg-bg-card transition-all"
              >
                {s.featured && (
                  <span className="absolute -top-2 right-4 inline-flex items-center gap-1 rounded-full bg-accent-red px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    <Sparkles className="h-3 w-3" /> Top
                  </span>
                )}
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${s.color} text-white`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-text-muted flex-1">
                  {s.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-text-muted group-hover:text-text">
                  Découvrir
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-10 sm:py-14">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-bg-card via-bg-card/60 to-bg-card p-6 sm:p-10">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-accent-red/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-red">
                <Brain className="h-3 w-3" /> Quiz du jour
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                T'as plus rapide que tes potes ?
              </h2>
              <p className="mt-3 text-text-muted">
                10 questions sur les équipes, les joueurs, l'histoire de la
                CDM. 15 secondes par question, plus tu réponds vite, plus tu
                marques. Score final, classement, fierté.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-5 py-3 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors"
                >
                  Jouer maintenant
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/classement-joueurs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-5 py-3 text-sm font-semibold text-text hover:bg-bg-card-hover transition-colors"
                >
                  Voir le classement
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Questions / partie", value: "10" },
                { label: "Sec par question", value: "15" },
                { label: "Score max", value: "1500" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-bg/70 p-4"
                >
                  <div className="font-mono tabular text-3xl font-bold text-accent-red">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-text-dim">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
