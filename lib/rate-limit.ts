/**
 * Rate limiter in-memory (fenêtre glissante).
 *
 * ⚠️ Limitation : sur Vercel chaque instance Lambda a sa propre Map → la limite
 * est par-instance, pas globale. Pour un projet perso c'est suffisant : ça stoppe
 * la majorité des bots simples. Pour un usage à grande échelle, brancher
 * sur Upstash Redis (`@upstash/ratelimit`) ou une table Postgres dédiée.
 *
 * Le but est de poser le garde-fou ; on pourra remplacer l'implémentation
 * sans toucher aux call-sites.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Nettoyage périodique des buckets expirés pour éviter une fuite mémoire.
// On nettoie à la volée lors des appels (pas de setInterval — pas idéal sur Vercel).
function cleanup(now: number) {
  if (buckets.size < 1000) return;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

export interface RateLimitConfig {
  /** Nombre max d'appels autorisés dans la fenêtre. */
  max: number;
  /** Fenêtre en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  /** true = autorisé, false = bloqué. */
  ok: boolean;
  /** Combien de requêtes restantes dans la fenêtre courante. */
  remaining: number;
  /** Quand la fenêtre se réinitialise (timestamp ms). */
  resetAt: number;
  /** Combien de secondes avant retry. */
  retryAfterSec: number;
}

/**
 * Vérifie + incrémente le compteur pour `key`.
 *
 * @param key  Identifiant logique (ex: `quiz-submit:<ip>`, `article-click:<profileId>`)
 * @param cfg  Limite (max appels / fenêtre)
 */
export function rateLimit(key: string, cfg: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  cleanup(now);

  let b = buckets.get(key);
  if (!b || b.resetAt < now) {
    b = { count: 0, resetAt: now + cfg.windowMs };
    buckets.set(key, b);
  }

  b.count += 1;
  const ok = b.count <= cfg.max;
  const remaining = Math.max(0, cfg.max - b.count);
  const retryAfterSec = Math.max(1, Math.ceil((b.resetAt - now) / 1000));

  return { ok, remaining, resetAt: b.resetAt, retryAfterSec };
}

/**
 * Extrait l'IP du client à partir des en-têtes Vercel/Next.js.
 * Fallback : "unknown" — préférable à un crash.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  return headers.get("x-real-ip") ?? "unknown";
}

/**
 * Construit la NextResponse "trop de requêtes" attendue.
 */
export function tooManyRequests(res: RateLimitResult, message?: string) {
  return new Response(
    JSON.stringify({
      error: message ?? "Trop de requêtes, réessaie dans un instant.",
      retryAfter: res.retryAfterSec,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(res.retryAfterSec),
      },
    },
  );
}
