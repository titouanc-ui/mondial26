/**
 * Catalogue des succès Mondial 26.
 *
 * Deux types :
 * - `threshold` : compteur > seuil (ex. best_score >= 1000)
 * - `event`     : événement ponctuel (ex. quiz joué entre 22h-6h)
 *
 * Conservé en code (pas en BDD) — pas de back-office, déploiement = mise à jour.
 */

export type Rarity = "common" | "rare" | "epic" | "legendary";

export type AchievementMetric =
  | "best_score"          // pic de score sur une partie
  | "points_total"        // somme des scores (lifetime)
  | "coins"               // solde actuel de Buts
  | "coins_earned_total"  // Buts gagnés au total (jamais décrémenté)
  | "games_played"        // nombre de quiz joués
  | "frames_owned"        // cadres possédés dans l'inventaire
  | "badges_owned"        // badges possédés
  | "banners_owned"       // bannières possédées
  | "icons_owned"         // icônes possédées
  | "article_clicks";     // clics sur articles de news

export type AchievementEvent =
  | "night_quiz"       // quiz joué entre 22h-6h
  | "morning_quiz"     // quiz joué entre 5h-8h
  | "fav_team_fr"      // équipe favorite = France
  | "avatar_uploaded"  // photo de profil uploadée
  | "bio_written";     // bio non vide

interface BaseAchievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  rarity: Rarity;
  reward: number; // Buts gagnés à la réclamation
}

export interface ThresholdAchievement extends BaseAchievement {
  type: "threshold";
  metric: AchievementMetric;
  target: number;
}

export interface EventAchievement extends BaseAchievement {
  type: "event";
  event: AchievementEvent;
}

export type Achievement = ThresholdAchievement | EventAchievement;

export const ACHIEVEMENTS: Achievement[] = [
  // ── Score sur une partie (best_score) ─────────────────────
  { id: "score-500",  type: "threshold", metric: "best_score", target: 500,  name: "Buteur",        description: "Atteindre 500 points en une partie",  emoji: "⚽", rarity: "common",    reward: 50 },
  { id: "score-800",  type: "threshold", metric: "best_score", target: 800,  name: "Attaquant",     description: "Atteindre 800 points en une partie",  emoji: "🎯", rarity: "common",    reward: 100 },
  { id: "score-1000", type: "threshold", metric: "best_score", target: 1000, name: "Star",          description: "Atteindre 1 000 points",              emoji: "⭐", rarity: "rare",      reward: 200 },
  { id: "score-1100", type: "threshold", metric: "best_score", target: 1100, name: "Phénomène",     description: "Atteindre 1 100 points",              emoji: "🔥", rarity: "rare",      reward: 300 },
  { id: "score-1200", type: "threshold", metric: "best_score", target: 1200, name: "Galactique",    description: "Atteindre 1 200 points",              emoji: "🌟", rarity: "epic",      reward: 500 },
  { id: "score-1300", type: "threshold", metric: "best_score", target: 1300, name: "Légende",       description: "Atteindre 1 300 points",              emoji: "👑", rarity: "epic",      reward: 800 },
  { id: "score-1400", type: "threshold", metric: "best_score", target: 1400, name: "GOAT",          description: "Atteindre 1 400 points",              emoji: "🐐", rarity: "legendary", reward: 1500 },
  { id: "score-1500", type: "threshold", metric: "best_score", target: 1500, name: "Perfection",    description: "Score parfait : 1 500 points",        emoji: "💎", rarity: "legendary", reward: 3000 },

  // ── Score cumulé (points_total) ───────────────────────────
  { id: "cumul-1k",   type: "threshold", metric: "points_total", target: 1000,  name: "Apprenti",    description: "1 000 points cumulés au total",   emoji: "🥉", rarity: "common", reward: 50 },
  { id: "cumul-5k",   type: "threshold", metric: "points_total", target: 5000,  name: "Confirmé",    description: "5 000 points cumulés au total",   emoji: "🥈", rarity: "rare",   reward: 100 },
  { id: "cumul-10k",  type: "threshold", metric: "points_total", target: 10000, name: "Expert",      description: "10 000 points cumulés au total",  emoji: "🥇", rarity: "epic",   reward: 250 },
  { id: "cumul-25k",  type: "threshold", metric: "points_total", target: 25000, name: "Maître",      description: "25 000 points cumulés au total",  emoji: "🏆", rarity: "epic",   reward: 500 },
  { id: "cumul-50k",  type: "threshold", metric: "points_total", target: 50000, name: "Encyclopédie",description: "50 000 points cumulés au total",  emoji: "📚", rarity: "legendary", reward: 1000 },

  // ── Parties jouées ────────────────────────────────────────
  { id: "games-1",   type: "threshold", metric: "games_played", target: 1,   name: "Premier match", description: "Jouer ta première partie",    emoji: "🎬", rarity: "common",    reward: 20 },
  { id: "games-10",  type: "threshold", metric: "games_played", target: 10,  name: "Régulier",      description: "Jouer 10 parties",            emoji: "🎮", rarity: "common",    reward: 50 },
  { id: "games-50",  type: "threshold", metric: "games_played", target: 50,  name: "Vétéran",       description: "Jouer 50 parties",            emoji: "🎖️", rarity: "rare",      reward: 150 },
  { id: "games-100", type: "threshold", metric: "games_played", target: 100, name: "Marathon",      description: "Jouer 100 parties",           emoji: "🏃", rarity: "epic",      reward: 300 },
  { id: "games-500", type: "threshold", metric: "games_played", target: 500, name: "Insatiable",    description: "Jouer 500 parties",           emoji: "⚡", rarity: "legendary", reward: 1000 },

  // ── Buts (monnaie) ────────────────────────────────────────
  { id: "rich-10k",     type: "threshold", metric: "coins",              target: 10000, name: "Riche",        description: "Posséder 10 000 Buts simultanément", emoji: "💰", rarity: "epic",      reward: 500 },
  { id: "millionaire",  type: "threshold", metric: "coins_earned_total", target: 50000, name: "Millionnaire", description: "Avoir gagné 50 000 Buts au total",   emoji: "💎", rarity: "legendary", reward: 2000 },

  // ── Collection cosmétiques ────────────────────────────────
  { id: "collector-frames",  type: "threshold", metric: "frames_owned",  target: 7,  name: "Collectionneur de cadres",   description: "Posséder les 7 cadres",  emoji: "🖼️", rarity: "epic",      reward: 500 },
  { id: "collector-badges",  type: "threshold", metric: "badges_owned",  target: 4,  name: "Collectionneur de badges",   description: "Posséder les 4 badges",  emoji: "🏵️", rarity: "legendary", reward: 1000 },
  { id: "collector-banners", type: "threshold", metric: "banners_owned", target: 5,  name: "Patriote",                   description: "Posséder 5 bannières",   emoji: "🚩", rarity: "rare",      reward: 300 },
  { id: "collector-icons",   type: "threshold", metric: "icons_owned",   target: 10, name: "Iconographe",                description: "Posséder 10 icônes",     emoji: "🎨", rarity: "epic",      reward: 500 },

  // ── Engagement & événements ───────────────────────────────
  { id: "reporter",    type: "threshold", metric: "article_clicks", target: 5,            name: "Reporter",     description: "Cliquer sur 5 articles de news",          emoji: "📰", rarity: "rare",   reward: 100 },
  { id: "sleepwalker", type: "event",     event: "night_quiz",                            name: "Somnambule",   description: "Faire un quiz entre 22h et 6h du matin", emoji: "🌙", rarity: "rare",   reward: 100 },
  { id: "early-bird",  type: "event",     event: "morning_quiz",                          name: "Lève-tôt",     description: "Faire un quiz entre 5h et 8h",            emoji: "🌅", rarity: "rare",   reward: 100 },
  { id: "tricolore",   type: "event",     event: "fav_team_fr",                           name: "Tricolore",    description: "Choisir la France comme équipe favorite", emoji: "🇫🇷", rarity: "common", reward: 50 },
  { id: "photogenic",  type: "event",     event: "avatar_uploaded",                       name: "Photogénique", description: "Uploader une photo de profil",            emoji: "📸", rarity: "common", reward: 50 },
  { id: "biographer",  type: "event",     event: "bio_written",                           name: "Biographe",    description: "Écrire une bio sur son profil",           emoji: "✏️", rarity: "common", reward: 30 },
];

export const ACHIEVEMENTS_BY_ID: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export function getAchievement(id: string): Achievement | null {
  return ACHIEVEMENTS_BY_ID[id] ?? null;
}

export const RARITY_BORDER: Record<Rarity, string> = {
  common: "border-border",
  rare: "border-accent-blue/40 ring-1 ring-accent-blue/20",
  epic: "border-purple-500/50 ring-1 ring-purple-500/20",
  legendary:
    "border-accent-gold/60 ring-2 ring-accent-gold/30 shadow-lg shadow-accent-gold/15",
};

export const RARITY_BG: Record<Rarity, string> = {
  common: "bg-bg-card/40",
  rare: "bg-gradient-to-br from-accent-blue/10 to-bg-card/60",
  epic: "bg-gradient-to-br from-purple-600/15 to-bg-card/60",
  legendary: "bg-gradient-to-br from-accent-gold/15 via-amber-500/5 to-bg-card/70",
};

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
};

export const RARITY_TEXT: Record<Rarity, string> = {
  common: "text-text-muted",
  rare: "text-accent-blue",
  epic: "text-purple-400",
  legendary: "text-accent-gold",
};

// ============================================================
// Chaînes de progression
// ============================================================
// Les succès threshold qui partagent la même métrique et constituent
// une montée en niveau (ex. score 500 → 800 → 1000 → … → 1500) sont
// regroupés dans une seule "chaîne" dans l'UI : on ne montre qu'une
// carte avec les tiers précédents en petit + le tier en cours en grand.
//
// Les succès non listés ici restent affichés individuellement.

export type ChainId = "score" | "cumul" | "games";

export const ACHIEVEMENT_CHAINS: Record<
  ChainId,
  { title: string; tierIds: string[]; emoji: string }
> = {
  score: {
    title: "Record sur une partie",
    emoji: "🎯",
    tierIds: [
      "score-500",
      "score-800",
      "score-1000",
      "score-1100",
      "score-1200",
      "score-1300",
      "score-1400",
      "score-1500",
    ],
  },
  cumul: {
    title: "Score cumulé",
    emoji: "📚",
    tierIds: ["cumul-1k", "cumul-5k", "cumul-10k", "cumul-25k", "cumul-50k"],
  },
  games: {
    title: "Parties jouées",
    emoji: "🎮",
    tierIds: ["games-1", "games-10", "games-50", "games-100", "games-500"],
  },
};

/** Map inverse : achievementId → chainId. Pratique pour filtrer. */
export const ACHIEVEMENT_TO_CHAIN: Record<string, ChainId> = (() => {
  const map: Record<string, ChainId> = {};
  for (const [chainId, chain] of Object.entries(ACHIEVEMENT_CHAINS) as [
    ChainId,
    (typeof ACHIEVEMENT_CHAINS)[ChainId],
  ][]) {
    for (const id of chain.tierIds) {
      map[id] = chainId;
    }
  }
  return map;
})();

/** Vrai si l'id appartient à une chaîne de progression. */
export function isChainedAchievement(id: string): boolean {
  return id in ACHIEVEMENT_TO_CHAIN;
}
