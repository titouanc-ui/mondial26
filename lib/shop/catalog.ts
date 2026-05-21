/**
 * Catalogue de la boutique Mondial 26.
 *
 * Conservé en code (pas en BDD) pour rester simple : pas d'admin tooling
 * nécessaire, le déploiement = la mise à jour du catalogue.
 */
import { TEAMS } from "@/lib/teams";

export type ItemType = "banner" | "frame" | "badge" | "icon";
export type Rarity = "common" | "rare" | "epic" | "legendary";

interface BaseItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  price: number;
  rarity: Rarity;
}

export interface BannerItem extends BaseItem {
  type: "banner";
  /** Code équipe associé (FRA, BRA, etc.) — pour récupérer les couleurs / drapeau */
  teamCode?: string;
  /** Dégradé CSS appliqué en background */
  gradient: string;
  flag?: string;
}

export interface FrameItem extends BaseItem {
  type: "frame";
  /** Classes Tailwind appliquées au wrapper de l'avatar */
  className: string;
  ringColor: string; // pour previsualisation
}

export interface BadgeItem extends BaseItem {
  type: "badge";
  tier: "bronze" | "silver" | "gold" | "platinum";
  /** Couleur du checkmark vérifié */
  color: string;
  /** Classe CSS qui ajoute un drop-shadow de halo (utilitaires dans globals.css). */
  glowClass?: string;
}

export interface IconItem extends BaseItem {
  type: "icon";
  imageUrl: string;
}

export type ShopItem = BannerItem | FrameItem | BadgeItem | IconItem;

// ============================================================
// CADRES — bois → platine, prix croissants
// ============================================================
export const FRAMES: FrameItem[] = [
  {
    id: "frame-default",
    type: "frame",
    name: "Sans cadre",
    description: "Le look par défaut, sobre.",
    price: 0,
    rarity: "common",
    className: "border-2 border-border",
    ringColor: "#232c47",
  },
  {
    id: "frame-bois",
    type: "frame",
    name: "Bois",
    description: "Pour les amateurs du foot de quartier.",
    price: 50,
    rarity: "common",
    className: "border-4 border-amber-900 shadow-md shadow-amber-950/50",
    ringColor: "#78350f",
  },
  {
    id: "frame-pierre",
    type: "frame",
    name: "Pierre",
    description: "Solide comme une défense italienne.",
    price: 100,
    rarity: "common",
    className: "border-4 border-stone-500 shadow-md shadow-stone-700/50",
    ringColor: "#78716c",
  },
  {
    id: "frame-fer",
    type: "frame",
    name: "Fer",
    description: "Le mental d'acier des grands buteurs.",
    price: 200,
    rarity: "rare",
    className: "border-4 border-zinc-600 shadow-md shadow-zinc-800/50",
    ringColor: "#52525b",
  },
  {
    id: "frame-bronze",
    type: "frame",
    name: "Bronze",
    description: "Une médaille de plus dans la vitrine.",
    price: 400,
    rarity: "rare",
    className: "border-4 border-amber-700 shadow-lg shadow-amber-800/40",
    ringColor: "#b45309",
  },
  {
    id: "frame-argent",
    type: "frame",
    name: "Argent",
    description: "Brillant comme un trophée.",
    price: 800,
    rarity: "epic",
    className:
      "border-4 border-gray-300 shadow-lg shadow-gray-400/50 ring-1 ring-white/20",
    ringColor: "#d1d5db",
  },
  {
    id: "frame-or",
    type: "frame",
    name: "Or",
    description: "Comme le Ballon d'Or, mais légal.",
    price: 1500,
    rarity: "epic",
    className:
      "border-4 border-yellow-400 shadow-xl shadow-yellow-500/40 ring-1 ring-yellow-300/50",
    ringColor: "#facc15",
  },
  {
    id: "frame-platine",
    type: "frame",
    name: "Platine",
    description: "Le summum. Pour les vrais GOAT.",
    price: 3000,
    rarity: "legendary",
    className:
      "border-4 border-[#e5e4e2] ring-2 ring-cyan-200/30 frame-glow-platine",
    ringColor: "#e5e4e2",
  },
];

// ============================================================
// BADGES — bronze → platine (pour comptes vérifiés)
// ============================================================
export const BADGES: BadgeItem[] = [
  {
    id: "badge-default",
    type: "badge",
    name: "Badge bleu (défaut)",
    description: "Le badge vérifié de base.",
    price: 0,
    rarity: "common",
    tier: "bronze",
    color: "#0033a0",
  },
  {
    id: "badge-bronze",
    type: "badge",
    name: "Badge bronze",
    description: "Première étoile à ton tableau.",
    price: 500,
    rarity: "rare",
    tier: "bronze",
    color: "#b45309",
    glowClass: "glow-badge-bronze",
  },
  {
    id: "badge-argent",
    type: "badge",
    name: "Badge argent",
    description: "Tu commences à te démarquer.",
    price: 1500,
    rarity: "epic",
    tier: "silver",
    color: "#d1d5db",
    glowClass: "glow-badge-silver",
  },
  {
    id: "badge-or",
    type: "badge",
    name: "Badge or",
    description: "Reconnaissance internationale.",
    price: 4000,
    rarity: "epic",
    tier: "gold",
    color: "#facc15",
    glowClass: "glow-badge-gold",
  },
  {
    id: "badge-platine",
    type: "badge",
    name: "Badge platine",
    description: "L'élite mondiale du pronostic.",
    price: 10000,
    rarity: "legendary",
    tier: "platinum",
    color: "#e5e4e2",
    glowClass: "glow-badge-platine",
  },
];

// ============================================================
// BANNIÈRES — une par grande nation
// ============================================================
function teamGradient(code: string): string {
  // Dégradés inspirés des couleurs nationales (palette simplifiée)
  const palette: Record<string, string> = {
    FRA: "linear-gradient(135deg,#002654 0%,#ffffff 50%,#ed2939 100%)",
    BRA: "linear-gradient(135deg,#009c3b 0%,#ffdf00 50%,#002776 100%)",
    ARG: "linear-gradient(135deg,#75aadb 0%,#ffffff 50%,#75aadb 100%)",
    GER: "linear-gradient(135deg,#000000 0%,#dd0000 50%,#ffce00 100%)",
    ESP: "linear-gradient(135deg,#aa151b 0%,#f1bf00 50%,#aa151b 100%)",
    ENG: "linear-gradient(135deg,#ffffff 0%,#ce1124 100%)",
    POR: "linear-gradient(135deg,#046a38 0%,#da291c 100%)",
    ITA: "linear-gradient(135deg,#008c45 0%,#f4f5f0 50%,#cd212a 100%)",
    NED: "linear-gradient(135deg,#ae1c28 0%,#ffffff 50%,#21468b 100%)",
    BEL: "linear-gradient(135deg,#000000 0%,#fae042 50%,#ed2939 100%)",
    USA: "linear-gradient(135deg,#bf0a30 0%,#ffffff 50%,#002868 100%)",
    CAN: "linear-gradient(135deg,#d80621 0%,#ffffff 50%,#d80621 100%)",
    MEX: "linear-gradient(135deg,#006847 0%,#ffffff 50%,#ce1126 100%)",
    URU: "linear-gradient(135deg,#7b3f00 0%,#fcd116 50%,#0038a8 100%)",
    COL: "linear-gradient(135deg,#fcd116 0%,#003893 50%,#ce1126 100%)",
    JPN: "linear-gradient(135deg,#bc002d 0%,#ffffff 100%)",
    KOR: "linear-gradient(135deg,#003478 0%,#ffffff 50%,#c60c30 100%)",
    MAR: "linear-gradient(135deg,#c1272d 0%,#006233 100%)",
    SEN: "linear-gradient(135deg,#00853f 0%,#fdef42 50%,#e31b23 100%)",
    CRO: "linear-gradient(135deg,#171796 0%,#ffffff 50%,#ff0000 100%)",
  };
  return (
    palette[code] ??
    "linear-gradient(135deg,#0033a0 0%,#141a2e 50%,#c8102e 100%)"
  );
}

const BANNER_TEAMS = [
  "FRA", "BRA", "ARG", "GER", "ESP", "ENG", "POR", "ITA", "NED", "BEL",
  "USA", "CAN", "MEX", "URU", "COL", "JPN", "KOR", "MAR", "SEN", "CRO",
];

export const BANNERS: BannerItem[] = [
  {
    id: "banner-default",
    type: "banner",
    name: "Bannière par défaut",
    description: "Le look maison.",
    price: 0,
    rarity: "common",
    gradient: "linear-gradient(135deg,#0033a0 0%,#141a2e 50%,#c8102e 100%)",
  },
  ...BANNER_TEAMS.map((code): BannerItem => {
    const team = TEAMS.find((t) => t.code === code);
    return {
      id: `banner-${code.toLowerCase()}`,
      type: "banner",
      name: `Bannière ${team?.name ?? code}`,
      description: `Aux couleurs de ${team?.name ?? code}.`,
      price: 200,
      rarity: "rare",
      teamCode: code,
      gradient: teamGradient(code),
      flag: team?.flag,
    };
  }),
];

// ============================================================
// ICÔNES — en attente d'images de l'utilisateur
// ============================================================
export const ICONS: IconItem[] = [];

// ============================================================
// Accès par id (utilisé partout pour résoudre un slot équipé)
// ============================================================
export const ALL_ITEMS: ShopItem[] = [
  ...FRAMES,
  ...BADGES,
  ...BANNERS,
  ...ICONS,
];

export const ITEMS_BY_ID: Record<string, ShopItem> = Object.fromEntries(
  ALL_ITEMS.map((it) => [it.id, it]),
);

export function getItem(id: string | null | undefined): ShopItem | null {
  if (!id) return null;
  return ITEMS_BY_ID[id] ?? null;
}

export function getFrame(id: string | null | undefined): FrameItem | null {
  const it = getItem(id);
  return it && it.type === "frame" ? it : null;
}

export function getBanner(id: string | null | undefined): BannerItem | null {
  const it = getItem(id);
  return it && it.type === "banner" ? it : null;
}

export function getBadge(id: string | null | undefined): BadgeItem | null {
  const it = getItem(id);
  return it && it.type === "badge" ? it : null;
}

export function getIcon(id: string | null | undefined): IconItem | null {
  const it = getItem(id);
  return it && it.type === "icon" ? it : null;
}

export const RARITY_STYLE: Record<Rarity, { label: string; className: string }> =
  {
    common: { label: "Commun", className: "text-text-muted" },
    rare: { label: "Rare", className: "text-accent-blue" },
    epic: { label: "Épique", className: "text-purple-400" },
    legendary: { label: "Légendaire", className: "text-accent-gold" },
  };

// ============================================================
// PROGRESSIONS — paliers séquentiels (chaque palier débloque le suivant)
// L'item "default" (gratuit) n'est pas dans la séquence.
// ============================================================
export const FRAME_PROGRESSION: string[] = [
  "frame-bois",
  "frame-pierre",
  "frame-fer",
  "frame-bronze",
  "frame-argent",
  "frame-or",
  "frame-platine",
];

export const BADGE_PROGRESSION: string[] = [
  "badge-bronze",
  "badge-argent",
  "badge-or",
  "badge-platine",
];

const PROGRESSIONS_BY_TYPE: Partial<Record<ItemType, string[]>> = {
  frame: FRAME_PROGRESSION,
  badge: BADGE_PROGRESSION,
};

/**
 * Renvoie l'id du palier qu'il faut posséder avant d'acheter `itemId`.
 * `null` si c'est le 1er palier, ou si l'item n'est pas dans une progression.
 */
export function getRequiredPredecessor(itemId: string): string | null {
  for (const seq of Object.values(PROGRESSIONS_BY_TYPE)) {
    if (!seq) continue;
    const idx = seq.indexOf(itemId);
    if (idx > 0) return seq[idx - 1];
    if (idx === 0) return null;
  }
  return null;
}

/**
 * Liste les paliers manquants à acheter avant `itemId` (progression complète requise).
 * Renvoie [] si tout est OK ou si l'item n'est pas dans une progression.
 */
export function getMissingPredecessors(
  itemId: string,
  ownedIds: ReadonlySet<string> | Set<string>,
): string[] {
  for (const seq of Object.values(PROGRESSIONS_BY_TYPE)) {
    if (!seq) continue;
    const idx = seq.indexOf(itemId);
    if (idx === -1) continue;
    return seq.slice(0, idx).filter((id) => !ownedIds.has(id));
  }
  return [];
}
