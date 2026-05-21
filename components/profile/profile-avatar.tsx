import Image from "next/image";
import { cn } from "@/lib/utils";
import { getFrame } from "@/lib/shop/catalog";

interface Props {
  avatarUrl: string | null | undefined;
  pseudo: string;
  frameId?: string | null;
  /** Taille en px (carré). Par défaut 112 (page profil). */
  size?: number;
  className?: string;
}

/**
 * Avatar circulaire avec cadre cosmétique optionnel.
 * Utilisé : header (32px), page profil (112px), peut-être leaderboard plus tard.
 */
export function ProfileAvatar({
  avatarUrl,
  pseudo,
  frameId,
  size = 112,
  className,
}: Props) {
  const frame = getFrame(frameId);
  const frameClass = frame?.className ?? "border-2 border-border";

  const initials = pseudo
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Taille d'icône réduite si petit avatar
  const fontSize = size < 48 ? "text-xs" : size < 80 ? "text-base" : "text-2xl";

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0",
        frameClass,
        className,
      )}
      style={{ width: size, height: size }}
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
  );
}
