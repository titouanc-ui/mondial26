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
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RARITY_BORDER,
  RARITY_BG,
  RARITY_LABEL,
  RARITY_TEXT,
  type Achievement,
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

    // Update optimiste : on marque les succès comme réclamés tout de suite.
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

  // Trie : à réclamer d'abord, puis débloqués, puis verrouillés (avec progression),
  // puis verrouillés (sans progression), puis réclamés en dernier.
  const sorted = [...items].sort((a, b) => {
    const rank = (x: ProgressAchievement): number => {
      if (x.unlocked && !x.claimed) return 0; // à collecter
      if (x.claimed) return 3; // déjà fait, on push tout en bas
      // pas encore débloqué : threshold avec progression > 0 d'abord
      if (x.type === "threshold" && (x.current ?? 0) > 0) return 1;
      return 2;
    };
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    // Au sein d'un même rang : trier par % de progression décroissant pour
    // les threshold, sinon par récompense décroissante
    const aPct =
      a.type === "threshold" ? (a.current ?? 0) / a.target : 0;
    const bPct =
      b.type === "threshold" ? (b.current ?? 0) / b.target : 0;
    if (aPct !== bPct) return bPct - aPct;
    return b.reward - a.reward;
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

      {/* Liste */}
      <div className="space-y-2.5">
        {sorted.map((ach) => (
          <AchievementRow key={ach.id} achievement={ach} />
        ))}
      </div>
    </div>
  );
}

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
      {/* Ligne du haut : emoji + nom + récompense */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Emoji */}
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

        {/* Nom + rareté + description */}
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

        {/* Récompense / statut */}
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

      {/* Barre de progression — pleine largeur, plus prominente.
          Pour les threshold (évolutifs) : on l'affiche dans tous les états
          sauf "claimed" (où elle ne sert plus à rien). */}
      {isThreshold && state !== "claimed" && (
        <div className="mt-4">
          {/* Track */}
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
            {/* Pulse subtil quand ready */}
            {state === "ready" && (
              <div className="absolute inset-0 rounded-full ring-1 ring-accent-red/40 animate-pulse pointer-events-none" />
            )}
          </div>
          {/* Légende sous la barre */}
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
              <span className="text-text-dim"> / {target.toLocaleString("fr-FR")}</span>
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
