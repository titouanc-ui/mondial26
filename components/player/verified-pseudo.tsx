import { BadgeCheck } from "lucide-react";
import { getBadge } from "@/lib/shop/catalog";
import { getTeam } from "@/lib/teams";
import { cn } from "@/lib/utils";

/**
 * Affiche : `<pseudo>` + drapeau équipe favorite + checkmark si compte vérifié.
 *
 * Factorise le pattern dupliqué dans :
 *   - components/leaderboard/leaderboard-table.tsx
 *   - components/quiz/recent-sessions.tsx
 *   - components/profile/player-profile-modal.tsx
 *
 * Le pseudo lui-même n'est pas stylé (laissé au parent qui sait quelle
 * taille / poids appliquer). Le composant ne fait que poser le pseudo,
 * le drapeau et le badge dans le bon ordre.
 */
interface Props {
  pseudo: string;
  isVerified?: boolean;
  /** ID du badge équipé (depuis `lib/shop/catalog`). */
  equippedBadge?: string | null;
  /** Code équipe favorite (FRA, BRA…) — affiche le drapeau emoji à côté. */
  favoriteTeam?: string | null;
  /** Taille du badge vérifié + drapeau. "sm" par défaut. */
  size?: "xs" | "sm" | "md";
  /** Classe additionnelle pour le wrapper. */
  className?: string;
  /** Classe additionnelle pour le texte du pseudo. */
  pseudoClassName?: string;
}

const SIZE_CFG = {
  xs: { badge: "h-3 w-3", flag: "text-sm", gap: "gap-1" },
  sm: { badge: "h-3.5 w-3.5", flag: "text-base", gap: "gap-1.5" },
  md: { badge: "h-4 w-4", flag: "text-base", gap: "gap-1.5" },
} as const;

export function VerifiedPseudo({
  pseudo,
  isVerified = false,
  equippedBadge = null,
  favoriteTeam = null,
  size = "sm",
  className,
  pseudoClassName,
}: Props) {
  const cfg = SIZE_CFG[size];
  const badge = getBadge(equippedBadge);
  const badgeColor = badge?.color ?? "#4a8fff";
  const badgeGlow = badge?.glowClass ?? "";
  const team = getTeam(favoriteTeam);

  return (
    <span className={cn("inline-flex items-center min-w-0", cfg.gap, className)}>
      <span className={cn("truncate", pseudoClassName)}>{pseudo}</span>
      {team && (
        <span
          className={cn("leading-none shrink-0", cfg.flag)}
          title={team.name}
          aria-label={`Équipe favorite : ${team.name}`}
        >
          {team.flag}
        </span>
      )}
      {isVerified && (
        <BadgeCheck
          className={cn("shrink-0", cfg.badge, badgeGlow)}
          style={{ color: badgeColor }}
          strokeWidth={2.2}
          aria-label="Compte vérifié"
        />
      )}
    </span>
  );
}
