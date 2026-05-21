"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Loader2, ShieldCheck } from "lucide-react";
import { Toast } from "@/components/ui/toast";

/**
 * Bouton admin "+N Buts" — rendu uniquement côté serveur quand l'user
 * est dans `ADMIN_EMAILS`. Le composant lui-même ne re-vérifie pas le
 * statut admin (le serveur le fait sur le endpoint).
 */
interface Props {
  amount?: number;
}

export function AdminGrantButton({ amount = 10_000 }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(
    null,
  );

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/grant-coins", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      setToast({
        kind: "ok",
        msg: `+${amount.toLocaleString("fr-FR")} Buts ajoutés (solde : ${data.coins?.toLocaleString("fr-FR") ?? "?"})`,
      });
      router.refresh();
    } catch (err) {
      setToast({
        kind: "err",
        msg: err instanceof Error ? err.message : "Erreur",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <div className="rounded-2xl border border-accent-gold/40 bg-gradient-to-br from-accent-gold/10 via-bg-card/60 to-bg-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="h-4 w-4 text-accent-gold" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-accent-gold">
            Mode admin
          </h3>
        </div>
        <p className="text-xs text-text-muted mb-3">
          Ajoute des Buts à ton compte pour tester la boutique sans grinder.
        </p>
        <button
          type="button"
          onClick={handleClick}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-accent-gold/50 bg-accent-gold/15 hover:bg-accent-gold/25 px-3 py-2 text-sm font-semibold text-accent-gold transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Coins className="h-4 w-4" />
          )}
          +{amount.toLocaleString("fr-FR")} Buts
        </button>
      </div>
    </>
  );
}
