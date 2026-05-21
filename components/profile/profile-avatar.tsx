import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFrame, getIcon } from "@/lib/shop/catalog";
import { getTeam } from "@/lib/teams";

interface Props {
  avatarUrl: string | null | undefined;
  pseudo: string;
  frameId?: string | null;
  /** Code ISO 3 lettres de l'équipe favorite (FRA, BRA, ...). Affiché en bas-droite. */
  favoriteTeam?: string | null;
  /** Id d'icône cosmétique équipée. Affichée en bas-gauche (large only). */
  iconId?: string | null;
  /** Taille en px (carré). Par défaut 112 (page profil). */
  size?: number;
  className?: string;
}

/**
 * Avatar circulaire avec cadre cosmétique optionnel + flair (drapeau équipe favorite, icône).
 * Utilisé : header (28px), recent sessions (36px), leaderboard (32px), page profil (112px).
 *
 * Les flairs (drapeau, icône) ne sont affichés qu'à partir de size >= 64 pour éviter
 * de surcharger les petits avatars.
 */
export function ProfileAvatar({
  avatarUrl,
  pseudo,
  frameId,
  favoriteTeam,
  iconId,
  size = 112,
  className,
}: Props) {
  const frame = getFrame(frameId);
  const frameClass = frame?.className ?? "border-2 border-border";

  const team = getTeam(favoriteTeam ?? null);
  const icon = getIcon(iconId);

  const initials = pseudo
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fontSize = size < 48 ? "text-xs" : size < 80 ? "text-base" : "text-2xl";

  // Taille des badges de flair, ~35% de l'avatar (min 22px pour rester lisible)
  const flairSize = Math.max(22, Math.round(size * 0.34));
  const flairFont = Math.max(11, Math.round(flairSize * 0.62));
  const showFlairs = size >= 64;

  return (
    <div
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {/* Cercle principal avec cadre */}
      <div
        className={cn(
          "relative rounded-full overflow-hidden h-full w-full",
          frameClass,
        )}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={pseudo}
            fill
            sizes={`${size}px`}
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className={cn(
              "h-full w-full flex items-center justify-center font-bold text-text-muted bg-gradient-to-br from-accent-red/20 to-accent-blue/20",
              fontSize,
            )}
          >
            {initials || "?"}
          </div>
        )}
      </div>

      {/* Flair drapeau équipe favorite (bas-droite) */}
      {showFlairs && team && (
        <div
          className="absolute rounded-full bg-bg-card border-2 border-bg flex items-center justify-center shadow-md overflow-hidden"
          style={{
            width: flairSize,
            height: flairSize,
            bottom: -2,
            right: -2,
            fontSize: flairFont,
            lineHeight: 1,
          }}
          title={team.name}
          aria-label={`Équipe favorite : ${team.name}`}
        >
          {/* L'emoji drapeau est rendu à l'échelle pour remplir le cercle */}
          <span
            className="block select-none"
            style={{
              fontSize: flairSize * 0.95,
              lineHeight: 1,
              transform: "translateY(1px)",
            }}
          >
            {team.flag}
          </span>
        </div>
      )}

      {/* Flair icône équipée (bas-gauche) */}
      {showFlairs && icon && (
        <div
          className="absolute rounded-full border-2 border-bg flex items-center justify-center shadow-md"
          style={{
            width: flairSize,
            height: flairSize,
            bottom: -2,
            left: -2,
            background: icon.bgGradient,
          }}
          title={icon.name}
          aria-label={`Icône : ${icon.name}`}
        >
          <span
            className="block select-none"
            style={{ fontSize: flairFont, lineHeight: 1 }}
          >
            {icon.emoji}
          </span>
        </div>
      )}
    </div>
  );
}
