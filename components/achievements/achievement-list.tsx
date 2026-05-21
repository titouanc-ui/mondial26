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

    // Update optimiste : on marque tout de suite les succès débloqués comme
    // réclamés côté UI, et on affiche le flash sans attendre la réponse.
    // Si le serveur rejette, on annule.
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
      // Synchro finale avec le serveur (cas où des succès auraient été
      // débloqués entre-temps par un autre onglet).
      setTimeout(() => setFlash(null), 3000);
      await load();
      router.refresh();
    } catch (err) {
      // Rollback : on restaure l'état précédent
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

  // Trie : à réclamer d'abord, puis débloqués, puis verrouillés
  const sorted = [...items].sort((a, b) => {
    const rank = (x: ProgressAchievement) =>
      x.unlocked && !x.claimed ? 0 : x.claimed ? 2 : 1;
    return rank(a) - rank(b);
  });

  const unlockedCount = items.filter((a) => a.unlocked).length;
  const totalCount = items.length;

  return (
    <div className="space-y-4">
      {/* Header avec stats globales */}
      <div className="rounded-2xl border border-border bg-bg-card/40 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent-gold" />
              Mes succès
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {unlockedCount} sur {totalCount} débloqués
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
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
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

  const state = achievement.claimed
    ? "claimed"
    : achievement.unlocked
    ? "ready"
    : "locked";

  return (
    <div
      className={cn(
        "rounded-2xl border p-4 transition-all",
        RARITY_BORDER[achievement.rarity],
        RARITY_BG[achievement.rarity],
        state === "ready" &&
          "ring-2 ring-accent-red/40 shadow-lg shadow-accent-red/10",
        state === "locked" && "opacity-70",
      )}
    >
      <div className="flex items-center gap-4">
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

        {/* Texte + progression */}
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

          {/* Barre de progression (uniquement pour les threshold) */}
          {isThreshold && state !== "claimed" && (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs text-text-dim mb-1">
                <span className="font-mono tabular">
                  {current.toLocaleString("fr-FR")} /{" "}
                  {target.toLocaleString("fr-FR")}
                </span>
                <span className="font-semibold">
                  {Math.round(pct)}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    state === "ready"
                      ? "bg-gradient-to-r from-accent-red to-accent-blue"
                      : "bg-text-dim/60",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Status / récompense */}
        <div className="shrink-0 text-right">
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
    </div>
  );
}
