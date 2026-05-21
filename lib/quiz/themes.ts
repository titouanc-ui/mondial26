/**
 * Source unique de vérité pour les thèmes du quiz.
 * Utilisé par :
 *   - app/quiz/page.tsx (hub avec les tuiles)
 *   - app/quiz/[theme]/page.tsx (page de jeu + metadata)
 *   - app/api/quiz/start/route.ts (validation zod)
 *   - components/quiz/recent-sessions.tsx (label dans la liste live)
 *   - components/quiz/result-view.tsx (label dans le résultat)
 */
import {
  Brain,
  Flag,
  Globe,
  History,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { QuizTheme } from "@/lib/supabase/types";

export interface QuizThemeMeta {
  id: QuizTheme;
  label: string;
  /** Description courte (page de jeu) */
  description: string;
  /** Description marketing (hub) — par défaut = description si non fournie */
  hubDesc?: string;
  icon: LucideIcon;
  gradient: string;
  /** Petit badge optionnel affiché en haut de la tuile (« Recommandé », « Spécial »…) */
  badge?: string;
}

export const QUIZ_THEMES: readonly QuizThemeMeta[] = [
  {
    id: "mix",
    label: "Mix",
    description: "10 questions tirées de toutes les catégories.",
    hubDesc: "Toutes catégories, pour s'échauffer",
    icon: Sparkles,
    gradient: "from-accent-red to-accent-blue",
    badge: "Recommandé",
  },
  {
    id: "historique",
    label: "Historique",
    description: "Les grandes heures du Mondial.",
    hubDesc: "Les grandes heures du Mondial",
    icon: History,
    gradient: "from-accent-gold to-yellow-600",
  },
  {
    id: "equipes",
    label: "Équipes",
    description: "Les 48 sélections de la CDM 2026.",
    hubDesc: "Les 48 sélections de la CDM 2026",
    icon: Globe,
    gradient: "from-accent-blue to-accent-blue-hover",
  },
  {
    id: "joueurs",
    label: "Joueurs",
    description: "Stars, records, anecdotes.",
    hubDesc: "Stars, records, anecdotes",
    icon: Users,
    gradient: "from-accent-green to-accent-green-hover",
  },
  {
    id: "matchs",
    label: "Matchs",
    description: "Résultats légendaires & faits marquants.",
    hubDesc: "Résultats légendaires & faits marquants",
    icon: Trophy,
    gradient: "from-accent-red to-accent-red-hover",
  },
  {
    id: "culture",
    label: "Culture",
    description: "Mascottes, ballons, organisation.",
    hubDesc: "Mascottes, ballons, organisation",
    icon: Brain,
    gradient: "from-purple-600 to-pink-600",
  },
  {
    id: "france",
    label: "Équipe de France",
    description: "Les Bleus en CDM, de 1998 à 2022.",
    hubDesc: "Les Bleus en CDM, de 1998 à 2022",
    icon: Flag,
    gradient: "from-blue-700 via-white to-red-600",
    badge: "Spécial",
  },
] as const;

export const QUIZ_THEMES_BY_ID: Record<QuizTheme, QuizThemeMeta> =
  Object.fromEntries(QUIZ_THEMES.map((t) => [t.id, t])) as Record<
    QuizTheme,
    QuizThemeMeta
  >;

export function getThemeMeta(id: string | null | undefined): QuizThemeMeta | null {
  if (!id) return null;
  return (QUIZ_THEMES_BY_ID as Record<string, QuizThemeMeta | undefined>)[id] ??
    null;
}

/** Liste des ids de thème (typés) — pratique pour zod / vérifications */
export const QUIZ_THEME_IDS: readonly QuizTheme[] = QUIZ_THEMES.map((t) => t.id);

/** Label court pour affichage compact (recent-sessions, result-view…) */
export const THEME_LABEL_SHORT: Record<QuizTheme, string> = {
  mix: "Mix",
  historique: "Histoire",
  equipes: "Équipes",
  joueurs: "Joueurs",
  matchs: "Matchs",
  culture: "Culture",
  france: "France",
};
