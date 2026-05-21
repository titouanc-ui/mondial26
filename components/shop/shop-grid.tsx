"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Coins,
  Loader2,
  Lock,
  BadgeCheck,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  RARITY_STYLE,
  type BannerItem,
  type FrameItem,
  type BadgeItem,
  type IconItem,
  type ShopItem,
  type ItemType,
} from "@/lib/shop/catalog";

interface Props {
  coins: number;
  isVerified: boolean;
  ownedIds: string[];
  equipped: {
    banner: string | null;
    frame: string | null;
    badge: string | null;
    icon: string | null;
  };
  catalog: {
    banners: BannerItem[];
    frames: FrameItem[];
    badges: BadgeItem[];
    icons: IconItem[];
  };
}

const TABS: { id: ItemType; label: string }[] = [
  { id: "banner", label: "Bannières" },
  { id: "frame", label: "Cadres" },
  { id: "badge", label: "Badges" },
  { id: "icon", label: "Icônes" },
];

export function ShopGrid({
  coins: initialCoins,
  isVerified,
  ownedIds: initialOwned,
  equipped: initialEquipped,
  catalog,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ItemType>("banner");
  const [coins, setCoins] = useState(initialCoins);
  const [owned, setOwned] = useState(new Set(initialOwned));
  const [equipped, setEquipped] = useState(initialEquipped);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const items: ShopItem[] =
    activeTab === "banner"
      ? catalog.banners
      : activeTab === "frame"
      ? catalog.frames
      : activeTab === "badge"
      ? catalog.badges
      : catalog.icons;

  const handleBuy = async (item: ShopItem) => {
    setBusyId(item.id);
    setError(null);
    try {
      const res = await fetch("/api/shop/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec de l'achat");
      setOwned((prev) => new Set(prev).add(item.id));
      setCoins(data.coins as number);
      setFlash(`Acheté : ${item.name}`);
      setTimeout(() => setFlash(null), 2500);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  const handleEquip = async (item: ShopItem) => {
    setBusyId(item.id);
    setError(null);
    try {
      const isEquipped = equipped[item.type] === item.id;
      const res = await fetch("/api/shop/equip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: item.type,
          itemId: isEquipped ? null : item.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Échec");
      setEquipped((prev) => ({
        ...prev,
        [item.type]: isEquipped ? null : item.id,
      }));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
        {TABS.map((t) => {
          const active = activeTab === t.id;
          const count =
            t.id === "banner"
              ? catalog.banners.length
              : t.id === "frame"
              ? catalog.frames.length
              : t.id === "badge"
              ? catalog.badges.length
              : catalog.icons.length;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                active ? "text-text" : "text-text-muted hover:text-text",
              )}
            >
              {t.label}
              <span className="rounded-full bg-bg-card px-1.5 py-0.5 text-[10px] tabular text-text-muted">
                {count}
              </span>
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 bg-gradient-to-r from-accent-red to-accent-blue" />
              )}
            </button>
          );
        })}
      </div>

      {/* Flash + error */}
      {(error || flash) && (
        <div className="mt-4">
          {error && (
            <p className="flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}
          {flash && !error && (
            <p className="flex items-center gap-1.5 text-sm text-success">
              <Sparkles className="h-4 w-4" /> {flash}
            </p>
          )}
        </div>
      )}

      {/* Grille */}
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border bg-bg-card/40 p-10 text-center text-text-muted">
          <Sparkles className="h-8 w-8 mx-auto text-text-dim" />
          <p className="mt-3 text-sm">
            Cette catégorie sera bientôt disponible.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ShopCard
              key={item.id}
              item={item}
              coins={coins}
              owned={owned.has(item.id) || item.price === 0}
              equipped={equipped[item.type] === item.id}
              isVerified={isVerified}
              busy={busyId === item.id}
              onBuy={() => handleBuy(item)}
              onEquip={() => handleEquip(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CardProps {
  item: ShopItem;
  coins: number;
  owned: boolean;
  equipped: boolean;
  isVerified: boolean;
  busy: boolean;
  onBuy: () => void;
  onEquip: () => void;
}

function ShopCard({
  item,
  coins,
  owned,
  equipped,
  isVerified,
  busy,
  onBuy,
  onEquip,
}: CardProps) {
  const rarity = RARITY_STYLE[item.rarity];
  const canAfford = coins >= item.price;
  const badgeLocked = item.type === "badge" && !isVerified;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl border bg-bg-card/60 overflow-hidden transition-all",
        equipped
          ? "border-accent-red ring-1 ring-accent-red/50"
          : "border-border hover:border-border-strong",
      )}
    >
      {/* Aperçu visuel */}
      <ItemPreview item={item} />

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
          <span className={cn("text-[10px] uppercase tracking-wider font-bold shrink-0", rarity.className)}>
            {rarity.label}
          </span>
        </div>
        <p className="mt-1 text-xs text-text-muted flex-1">{item.description}</p>

        <div className="mt-3 flex items-center justify-between">
          {item.price > 0 ? (
            <div className="inline-flex items-center gap-1 text-sm font-bold">
              <Coins className="h-3.5 w-3.5 text-accent-red" />
              <span className="font-mono tabular">{item.price}</span>
            </div>
          ) : (
            <span className="text-xs text-text-muted italic">Gratuit</span>
          )}

          {/* Action button */}
          {equipped ? (
            <button
              type="button"
              onClick={onEquip}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-md bg-accent-red px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-accent-red-hover transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
              Équipé
            </button>
          ) : owned ? (
            <button
              type="button"
              onClick={onEquip}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-md border border-accent-blue/40 bg-accent-blue/10 px-2.5 py-1.5 text-xs font-semibold text-accent-blue hover:bg-accent-blue/20 transition-colors disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              Équiper
            </button>
          ) : badgeLocked ? (
            <span className="inline-flex items-center gap-1 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs font-medium text-text-muted">
              <Lock className="h-3 w-3" /> Compte vérifié
            </span>
          ) : (
            <button
              type="button"
              onClick={onBuy}
              disabled={busy || !canAfford}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50",
                canAfford
                  ? "bg-accent-red text-white hover:bg-accent-red-hover"
                  : "border border-border bg-bg text-text-muted",
              )}
            >
              {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
              {canAfford ? "Acheter" : `Manque ${item.price - coins}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ItemPreview({ item }: { item: ShopItem }) {
  if (item.type === "banner") {
    return (
      <div
        className="relative h-28 w-full flex items-center justify-center"
        style={{ background: item.gradient }}
      >
        {item.flag && (
          <span className="text-5xl drop-shadow-lg">{item.flag}</span>
        )}
      </div>
    );
  }
  if (item.type === "frame") {
    return (
      <div className="h-28 w-full flex items-center justify-center bg-bg-elevated/40">
        <div
          className={cn(
            "h-16 w-16 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-red/30",
            item.className,
          )}
        />
      </div>
    );
  }
  if (item.type === "badge") {
    return (
      <div className="h-28 w-full flex items-center justify-center bg-bg-elevated/40">
        <BadgeCheck
          className={cn("h-16 w-16", item.glowClass)}
          style={{ color: item.color }}
          strokeWidth={2}
        />
      </div>
    );
  }
  // icon
  return (
    <div className="h-28 w-full flex items-center justify-center bg-bg-elevated/40 text-text-muted">
      <Sparkles className="h-8 w-8 text-text-dim" />
    </div>
  );
}
