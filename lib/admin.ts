/**
 * Identification des comptes admin.
 *
 * Liste d'emails autorisés via la variable d'env `ADMIN_EMAILS` (CSV).
 * Exemple : `ADMIN_EMAILS=titouan@example.com,autre@example.com`
 *
 * Volontairement côté serveur uniquement (pas de `NEXT_PUBLIC_`) — la liste
 * ne fuite pas dans le bundle client. Le front demande au serveur si l'user
 * courant est admin via le rendu conditionnel (RSC) ou un endpoint dédié.
 */

let cached: Set<string> | null = null;

function getAdminEmails(): Set<string> {
  if (cached) return cached;
  const raw = process.env.ADMIN_EMAILS ?? "";
  cached = new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
  return cached;
}

/** Vrai si l'email est dans la liste d'admins. Case-insensitive. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().has(email.toLowerCase());
}
