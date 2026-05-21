"use client";

import { Fragment, useEffect, useRef } from "react";
import { BadgeCheck, Check, Coins, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RARITY_STYLE,
  type BadgeItem,
  type FrameItem,
} from "@/lib/shop/catalog";

type TierItem = FrameItem | BadgeItem;
type TierStatus = "equipped" | "owned" | "available" | "locked";

interface Props {
  items: TierItem[];
  ownedIds: Set<string>;
  equippedId: string | null;
  coins: number;
  busyId: string | null;
  onBuy: (item: TierItem) => void;
  onEquip: (item: TierItem) => void;
}

export function TrophyRoad({
  items,
  ownedIds,
  equippedId,
  coins,
  busyId,
  onBuy,
  onEquip,
}: Props) {
  // Auto-scroll vers le 1er palier non débloqué
  const containerRef = useRef<HTMLDivElement | null>(null);
  const focusRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!focusRef.current || !containerRef.current) return;
    const cont = containerRef.current;
    const target = focusRef.current;
    const left =
      target.offsetLeft - cont.offsetWidth / 2 + target.offsetWidth / 2;
    cont.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [items, ownedIds]);

  // Helper : un item gratuit (price=0) est toujours "possédé" par défaut.
  const isOwned = (item: TierItem) =>
    item.price === 0 || ownedIds.has(item.id);

  // Statut de chaque palier
  const statuses: TierStatus[] = items.map((item, idx) => {
    if (equippedId === item.id) return "equipped";
    if (isOwned(item)) return "owned";
    const prev = idx === 0 ? null : items[idx - 1];
    if (prev && !isOwned(prev)) return "locked";
    return "available";
  });

  // 1er palier "available" : celui qu'on focus visuellement
  const focusIdx = statuses.findIndex((s) => s === "available");

  // Progression globale (pour la barre du fond)
  const ownedCount = statuses.filter(
    (s) => s === "owned" || s === "equipped",
  ).length;
  const progressPct = (ownedCount / items.length) * 100;

  return (
    <div className="rounded-2xl border border-border bg-bg-card/40 p-4 sm:p-6">
      {/* Barre de progression globale */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="text-text-muted">
          Palier {ownedCount} / {items.length}
        </span>
        <span className="text-text-dim font-medium">
          {Math.round(progressPct)}% débloqué
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-border overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-accent-red to-accent-blue transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Route horizontale.
          py-10 = espace pour laisser respirer les glow (frame/badge platine
          peuvent étendre leur halo ~40px au-delà de la tuile). */}
      <div ref={containerRef} className="overflow-x-auto -mx-2 px-2 py-10">
        <div className="flex items-stretch min-w-max">
          {items.map((item, idx) => {
            const status = statuses[idx];
            const isFocus = idx === focusIdx;
            return (
              <Fragment key={item.id}>
                {idx > 0 && (
                  <Connector
                    filled={
                      statuses[idx - 1] === "owned" ||
                      statuses[idx - 1] === "equipped"
                    }
                  />
                )}
                <div ref={isFocus ? focusRef : undefined}>
                  <TierTile
                    item={item}
                    status={status}
                    missing={Math.max(0, item.price - coins)}
                    busy={busyId === item.id}
                    onBuy={() => onBuy(item)}
                    onEquip={() => onEquip(item)}
                  />
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div className="flex items-center w-10 sm:w-14 shrink-0 pt-[56px] sm:pt-[64px]">
      <div className="h-1 w-full rounded-full overflow-hidden bg-border">
        <div
          className={cn(
            "h-full transition-all",
            filled
              ? "w-full bg-gradient-to-r from-accent-red to-accent-blue"
              : "w-0",
          )}
        />
      </div>
    </div>
  );
}

interface TileProps {
  item: TierItem;
  status: TierStatus;
  /** Quantité de Buts qui manque pour acheter (0 si solde suffisant). */
  missing: number;
  busy: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

function TierTile({
  item,
  status,
  missing,
  busy,
  onBuy,
  onEquip,
}: TileProps) {
  const rarity = RARITY_STYLE[item.rarity];
  const locked = status === "locked";
  const canAfford = missing === 0;

  return (
    <div className="flex flex-col items-center gap-2.5 w-32 sm:w-36 shrink-0">
      {/* Vignette aperçu */}
      <div
        className={cn(
          "relative h-28 sm:h-32 w-full rounded-2xl border-2 flex items-center justify-center transition-all",
          status === "equipped" &&
            "border-accent-red bg-accent-red/10 shadow-lg shadow-accent-red/20",
          status === "owned" && "border-accent-blue/50 bg-accent-blue/5",
          status === "available" &&
            "border-border bg-bg-card hover:border-border-strong",
          status === "locked" && "border-border/50 bg-bg-card/30",
        )}
      >
        <ItemThumbnail item={item} locked={locked} />

        {/* Coin d'état */}
        {status === "equipped" && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-accent-red text-white shadow-md">
            <Check className="h-4 w-4" />
          </span>
        )}
        {status === "owned" && (
          <span className="absolute -top-2 -right-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-accent-blue text-white shadow-md">
            <Check className="h-4 w-4" />
          </span>
        )}
        {status === "locked" && (
          <span className="absolute inset-0 rounded-2xl bg-bg/60 backdrop-blur-[2px] flex items-center justify-center">
            <Lock className="h-7 w-7 text-text-muted" />
          </span>
        )}
      </div>

      {/* Nom + rareté */}
      <div className="text-center w-full">
        <div className="text-xs font-semibold leading-tight truncate">
          {item.name}
        </div>
        <div
          className={cn(
            "text-[10px] uppercase tracking-wider font-bold mt-0.5",
            locked ? "text-text-dim" : rarity.className,
          )}
        >
          {rarity.label}
        </div>
      </div>

      {/* Action */}
      <div className="w-full">
        {status === "equipped" ? (
          <button
            type="button"
            onClick={onEquip}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-1 rounded-lg bg-accent-red px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
          >
            {busy ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Check className="h-3 w-3" />
            )}
            Équipé
          </button>
        ) : status === "owned" ? (
          <button
            type="button"
            onClick={onEquip}
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-accent-blue/40 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-semibold text-accent-blue hover:bg-accent-blue/20 transition-colors disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            Équiper
          </button>
        ) : status === "locked" ? (
          <div className="w-full inline-flex items-center justify-center gap-1 rounded-lg border border-border bg-bg/40 px-2.5 py-1.5 text-xs font-medium text-text-dim">
            <Coins className="h-3 w-3" />
            <span className="font-mono tabular">{item.price}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onBuy}
            disabled={busy || !canAfford}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
              canAfford
                ? "bg-accent-red text-white hover:bg-accent-red-hover"
                : "border border-border bg-bg text-text-muted",
            )}
          >
            {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
            {canAfford ? (
              <>
                <Coins className="h-3 w-3" />
                <span className="font-mono tabular">{item.price}</span>
              </>
            ) : (
              `Manque ${missing}`
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function ItemThumbnail({
  item,
  locked,
}: {
  item: TierItem;
  locked: boolean;
}) {
  if (item.type === "frame") {
    return (
      <div
        className={cn(
          "h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-red/30",
          item.className,
          locked && "opacity-50 saturate-0",
        )}
      />
    );
  }
  // badge
  return (
    <BadgeCheck
      className={cn(
        "h-14 w-14 sm:h-16 sm:w-16",
        item.glowClass,
        locked && "opacity-50 saturate-0",
      )}
      style={{ color: item.color }}
      strokeWidth={2}
    />
  );
}
