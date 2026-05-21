"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Coins,
  Lock,
  Check,
  Loader2,
  Sparkles,
  Trophy,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RARITY_BORDER,
  RARITY_BG,
  RARITY_LABEL,
  RARITY_TEXT,
  ACHIEVEMENT_CHAINS,
  ACHIEVEMENT_TO_CHAIN,
  isChainedAchievement,
  type Achievement,
  type ChainId,
  type Rarity,
} from "@/lib/achievements/catalog";

type ProgressAchievement = Achievement & {
  current: number | null;
  unlocked: boolean;
  claimed: boolean;
};

type RowState = "claimed" | "ready" | "locked";

export function AchievementList() {
  const router = useRouter();
  const [items, setItems] = useState<ProgressAchievement[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/achievements", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setItems(data.items as ProgressAchievement[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de chargement");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const unclaimedCount = items?.filter((a) => a.unlocked && !a.claimed).length ?? 0;
  const unclaimedReward =
    items?.filter((a) => a.unlocked && !a.claimed).reduce((s, a) => s + a.reward, 0) ?? 0;

  const handleClaimAll = async () => {
    if (!items) return;
    setClaiming(true);
    setError(null);

    const previousItems = items;
    const expectedReward = unclaimedReward;
    setItems(
      items.map((a) =>
        a.unlocked && !a.claimed ? { ...a, claimed: true } : a,
      ),
    );
    setFlash(`+${expectedReward} Buts collectés !`);

    try {
      const res = await fetch("/api/achievements/claim", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setTimeout(() => setFlash(null), 3000);
      await load();
      router.refresh();
    } catch (err) {
      setItems(previousItems);
      setFlash(null);
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setClaiming(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-error/30 bg-error/10 p-6">
        <p className="flex items-center gap-2 text-error text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      </div>
    );
  }

  if (!items) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
      </div>
    );
  }

  // Sépare les succès chaînés (regroupés en ChainCard) des autres (AchievementRow)
  const itemsById = new Map(items.map((a) => [a.id, a]));
  const standaloneItems = items.filter((a) => !isChainedAchievement(a.id));

  // Tri des standalones : à-collecter > en cours > non démarrés > réclamés
  const sortedStandalone = [...standaloneItems].sort((a, b) => {
    const rank = (x: ProgressAchievement): number => {
      if (x.unlocked && !x.claimed) return 0;
      if (x.claimed) return 3;
      if (x.type === "threshold" && (x.current ?? 0) > 0) return 1;
      return 2;
    };
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    const aPct =
      a.type === "threshold" ? (a.current ?? 0) / a.target : 0;
    const bPct =
      b.type === "threshold" ? (b.current ?? 0) / b.target : 0;
    if (aPct !== bPct) return bPct - aPct;
    return b.reward - a.reward;
  });

  // Tri des chaînes : celles qui ont quelque chose à collecter d'abord,
  // puis celles avec progression > 0, puis le reste, puis les chaînes finies
  const chainEntries = (Object.keys(ACHIEVEMENT_CHAINS) as ChainId[])
    .map((chainId) => buildChainState(chainId, itemsById))
    .sort((a, b) => {
      if (a.hasUnclaimedUnlocked !== b.hasUnclaimedUnlocked) {
        return a.hasUnclaimedUnlocked ? -1 : 1;
      }
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return b.progressPct - a.progressPct;
    });

  const unlockedCount = items.filter((a) => a.unlocked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-4">
      {/* Header avec stats globales */}
      <div className="rounded-2xl border border-border bg-bg-card/40 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent-gold" />
              Mes succès
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {unlockedCount} sur {totalCount} débloqués ·{" "}
              {Math.round((unlockedCount / totalCount) * 100)}%
            </p>
          </div>
          {unclaimedCount > 0 && (
            <button
              type="button"
              onClick={handleClaimAll}
              disabled={claiming}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-red px-4 py-2 text-sm font-semibold text-white hover:bg-accent-red-hover transition-colors disabled:opacity-50"
            >
              {claiming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Coins className="h-4 w-4" />
              )}
              Tout collecter ({unclaimedCount}) · +{unclaimedReward} Buts
            </button>
          )}
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-red via-accent-gold to-accent-blue transition-all"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        {flash && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-success">
            <Sparkles className="h-4 w-4" /> {flash}
          </p>
        )}
      </div>

      {/* Chaînes de progression */}
      <div className="space-y-2.5">
        {chainEntries.map((c) => (
          <ChainCard key={c.chainId} state={c} />
        ))}
      </div>

      {/* Succès standalone (events + collections + monnaie) */}
      <div className="space-y-2.5">
        {sortedStandalone.map((ach) => (
          <AchievementRow key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// ChainCard — affiche une chaîne de progression (score / cumul / games)
// ============================================================

interface ChainState {
  chainId: ChainId;
  title: string;
  chainEmoji: string;
  tiers: ProgressAchievement[];
  unlockedTiers: ProgressAchievement[];
  /** Le tier "en cours" = le 1er non débloqué. Null si chaîne complète. */
  currentTier: ProgressAchievement | null;
  /** Progression brute current/target vers le currentTier (0..100). */
  progressPct: number;
  /** Vrai si tous les tiers sont débloqués. */
  completed: boolean;
  /** Au moins un tier débloqué non réclamé. */
  hasUnclaimedUnlocked: boolean;
  /** Total des récompenses non encore réclamées dans cette chaîne. */
  unclaimedReward: number;
}

function buildChainState(
  chainId: ChainId,
  itemsById: Map<string, ProgressAchievement>,
): ChainState {
  const chain = ACHIEVEMENT_CHAINS[chainId];
  const tiers = chain.tierIds
    .map((id) => itemsById.get(id))
    .filter((x): x is ProgressAchievement => !!x);

  const unlockedTiers = tiers.filter((t) => t.unlocked);
  const currentTier = tiers.find((t) => !t.unlocked) ?? null;

  let progressPct = 100;
  if (currentTier && currentTier.type === "threshold") {
    const target = currentTier.target;
    const current = currentTier.current ?? 0;
    progressPct = Math.min(100, Math.max(0, (current / target) * 100));
  }

  return {
    chainId,
    title: chain.title,
    chainEmoji: chain.emoji,
    tiers,
    unlockedTiers,
    currentTier,
    progressPct,
    completed: currentTier === null,
    hasUnclaimedUnlocked: unlockedTiers.some((t) => !t.claimed),
    unclaimedReward: unlockedTiers
      .filter((t) => !t.claimed)
      .reduce((s, t) => s + t.reward, 0),
  };
}

function ChainCard({ state }: { state: ChainState }) {
  const {
    title,
    tiers,
    unlockedTiers,
    currentTier,
    progressPct,
    completed,
    hasUnclaimedUnlocked,
    unclaimedReward,
  } = state;

  // Rareté visuelle de la chaîne = rareté max des tiers débloqués (sinon rare par défaut)
  const maxRarity: Rarity =
    unlockedTiers.length === 0
      ? "common"
      : maxRarityOf(unlockedTiers.map((t) => t.rarity));

  // Si une chaîne a au moins 1 tier débloqué non réclamé → ring rouge "ready"
  const ringClass = hasUnclaimedUnlocked
    ? "ring-2 ring-accent-red/40 shadow-lg shadow-accent-red/10"
    : completed
    ? "ring-2 ring-accent-gold/30"
    : "";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 transition-all",
        RARITY_BORDER[maxRarity],
        RARITY_BG[maxRarity],
        ringClass,
      )}
    >
      {/* En-tête de chaîne */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-text-muted font-semibold">
          <span className="text-base leading-none">{state.chainEmoji}</span>
          <span>{title}</span>
          <span className="text-text-dim">
            · {unlockedTiers.length}/{tiers.length}
          </span>
        </div>
        {hasUnclaimedUnlocked && (
          <span className="inline-flex items-center gap-1 rounded-md bg-accent-red/15 border border-accent-red/40 px-2 py-0.5 text-xs font-bold text-accent-red animate-pulse">
            <Coins className="h-3 w-3" />+{unclaimedReward} à collecter
          </span>
        )}
        {completed && !hasUnclaimedUnlocked && (
          <span className="inline-flex items-center gap-1 rounded-md bg-success/15 border border-success/30 px-2 py-0.5 text-xs font-semibold text-success">
            <Check className="h-3 w-3" /> Chaîne complète
          </span>
        )}
      </div>

      {/* Corps : tiers débloqués (chaîne d'emojis) + tier en cours */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Tiers débloqués */}
        {unlockedTiers.map((tier, idx) => (
          <div key={tier.id} className="flex items-center gap-1 sm:gap-2">
            <TierIcon tier={tier} />
            {idx < unlockedTiers.length - 1 && (
              <ChevronRight className="h-4 w-4 text-text-dim shrink-0" />
            )}
          </div>
        ))}

        {/* Flèche entre la chaîne et le tier en cours */}
        {unlockedTiers.length > 0 && currentTier && (
          <ChevronRight className="h-5 w-5 text-text-dim shrink-0" />
        )}

        {/* Tier en cours (carte plus grosse) */}
        {currentTier && (
          <CurrentTierCard tier={currentTier} />
        )}
      </div>

      {/* Barre de progression — uniquement si pas complète et tier threshold */}
      {currentTier && currentTier.type === "threshold" && (
        <div className="mt-4">
          <div className="relative h-3 rounded-full bg-bg/60 border border-border/60 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                progressPct >= 100
                  ? "bg-gradient-to-r from-accent-red via-accent-gold to-accent-blue"
                  : progressPct > 0
                  ? "bg-gradient-to-r from-accent-blue/70 to-accent-blue"
                  : "bg-text-dim/30",
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs">
            <span className="font-mono tabular text-text-muted">
              <span className="font-semibold text-text">
                {(currentTier.current ?? 0).toLocaleString("fr-FR")}
              </span>
              <span className="text-text-dim">
                {" "}
                / {currentTier.target.toLocaleString("fr-FR")}
              </span>
            </span>
            <span
              className={cn(
                "font-semibold tabular",
                progressPct >= 100
                  ? "text-accent-red"
                  : progressPct >= 75
                  ? "text-accent-gold"
                  : "text-text-dim",
              )}
            >
              {Math.round(progressPct)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/** Petit cercle emoji pour un tier déjà débloqué. */
function TierIcon({ tier }: { tier: ProgressAchievement }) {
  const isUnclaimed = !tier.claimed;
  return (
    <div className="relative shrink-0">
      <div
        title={`${tier.name} — ${tier.description}`}
        className={cn(
          "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl border-2 transition-transform hover:scale-110 cursor-help",
          tier.rarity === "legendary"
            ? "border-accent-gold/60 bg-gradient-to-br from-accent-gold/20 to-amber-700/10"
            : tier.rarity === "epic"
            ? "border-purple-500/50 bg-purple-600/15"
            : tier.rarity === "rare"
            ? "border-accent-blue/50 bg-accent-blue/15"
            : "border-border-strong bg-bg-card",
          isUnclaimed && "ring-2 ring-accent-red/50",
        )}
      >
        {tier.emoji}
      </div>
      {/* Indicateur "à collecter" */}
      {isUnclaimed && (
        <span
          aria-label={`+${tier.reward} Buts à collecter`}
          className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-accent-red text-[10px] font-bold text-white px-1 ring-2 ring-bg shadow"
        >
          +
        </span>
      )}
    </div>
  );
}

/** Carte du tier en cours — bigger, avec nom + rareté + récompense. */
function CurrentTierCard({ tier }: { tier: ProgressAchievement }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border-2 px-3 py-2 flex-1 min-w-0",
        tier.rarity === "legendary"
          ? "border-accent-gold/60 bg-gradient-to-br from-accent-gold/15 to-amber-700/5"
          : tier.rarity === "epic"
          ? "border-purple-500/50 bg-purple-600/10"
          : tier.rarity === "rare"
          ? "border-accent-blue/50 bg-accent-blue/10"
          : "border-border bg-bg-card/60",
      )}
    >
      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shrink-0 bg-bg/40 border border-border grayscale opacity-80">
        {tier.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-bold text-sm sm:text-base">{tier.name}</h3>
          <span
            className={cn(
              "text-[10px] uppercase tracking-wider font-bold",
              RARITY_TEXT[tier.rarity],
            )}
          >
            {RARITY_LABEL[tier.rarity]}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">
          {tier.description}
        </p>
      </div>
      <div className="inline-flex items-center gap-1 text-xs text-text-dim shrink-0">
        <Coins className="h-3 w-3" />
        <span className="font-mono tabular font-semibold">+{tier.reward}</span>
      </div>
    </div>
  );
}

function maxRarityOf(rarities: Rarity[]): Rarity {
  const order: Rarity[] = ["common", "rare", "epic", "legendary"];
  let max: Rarity = "common";
  for (const r of rarities) {
    if (order.indexOf(r) > order.indexOf(max)) max = r;
  }
  return max;
}

// ============================================================
// AchievementRow — pour les succès standalone (non chaînés)
// ============================================================

function AchievementRow({
  achievement,
}: {
  achievement: ProgressAchievement;
}) {
  const isThreshold = achievement.type === "threshold";
  const current = achievement.current ?? 0;
  const target = isThreshold ? achievement.target : 1;
  const pct = Math.min(100, (current / target) * 100);

  const state: RowState = achievement.claimed
    ? "claimed"
    : achievement.unlocked
    ? "ready"
    : "locked";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5 transition-all",
        RARITY_BORDER[achievement.rarity],
        RARITY_BG[achievement.rarity],
        state === "ready" &&
          "ring-2 ring-accent-red/40 shadow-lg shadow-accent-red/10",
        state === "locked" && "opacity-80",
        state === "claimed" && "opacity-75",
      )}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div
          className={cn(
            "h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shrink-0 border-2",
            achievement.rarity === "legendary"
              ? "border-accent-gold/50 bg-gradient-to-br from-accent-gold/20 to-amber-700/10"
              : achievement.rarity === "epic"
              ? "border-purple-500/40 bg-purple-600/15"
              : achievement.rarity === "rare"
              ? "border-accent-blue/40 bg-accent-blue/10"
              : "border-border bg-bg-card",
            state === "locked" && "grayscale opacity-60",
          )}
        >
          {state === "locked" && !isThreshold ? (
            <Lock className="h-6 w-6 text-text-muted" />
          ) : (
            achievement.emoji
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm sm:text-base">
              {achievement.name}
            </h3>
            <span
              className={cn(
                "text-[10px] uppercase tracking-wider font-bold",
                RARITY_TEXT[achievement.rarity],
              )}
            >
              {RARITY_LABEL[achievement.rarity]}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {achievement.description}
          </p>
        </div>

        <div className="shrink-0">
          {state === "claimed" ? (
            <div className="inline-flex items-center gap-1 rounded-md bg-success/15 border border-success/30 px-2.5 py-1 text-xs font-semibold text-success">
              <Check className="h-3 w-3" /> Réclamé
            </div>
          ) : state === "ready" ? (
            <div className="inline-flex items-center gap-1 rounded-md bg-accent-red/15 border border-accent-red/40 px-2.5 py-1 text-xs font-bold text-accent-red animate-pulse">
              <Coins className="h-3 w-3" />+{achievement.reward}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 text-xs text-text-dim">
              <Coins className="h-3 w-3" />
              <span className="font-mono tabular font-semibold">
                +{achievement.reward}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Barre de progression pour les threshold non réclamés */}
      {isThreshold && state !== "claimed" && (
        <div className="mt-4">
          <div className="relative h-3 rounded-full bg-bg/60 border border-border/60 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500 ease-out",
                state === "ready"
                  ? "bg-gradient-to-r from-accent-red via-accent-gold to-accent-blue"
                  : pct > 0
                  ? "bg-gradient-to-r from-accent-blue/70 to-accent-blue"
                  : "bg-text-dim/30",
              )}
              style={{ width: `${pct}%` }}
            />
            {state === "ready" && (
              <div className="absolute inset-0 rounded-full ring-1 ring-accent-red/40 animate-pulse pointer-events-none" />
            )}
          </div>
          <div className="flex items-center justify-between mt-1.5 text-xs">
            <span className="font-mono tabular text-text-muted">
              <span
                className={cn(
                  "font-semibold",
                  state === "ready" ? "text-accent-red" : "text-text",
                )}
              >
                {current.toLocaleString("fr-FR")}
              </span>
              <span className="text-text-dim">
                {" "}
                / {target.toLocaleString("fr-FR")}
              </span>
            </span>
            <span
              className={cn(
                "font-semibold tabular",
                state === "ready"
                  ? "text-accent-red"
                  : pct >= 75
                  ? "text-accent-gold"
                  : "text-text-dim",
              )}
            >
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// helper non utilisé extérieurement — gardé pour la cohérence du fichier
export { ACHIEVEMENT_TO_CHAIN };
