"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Toast minimaliste — pas de provider, l'état est géré par le composant parent.
 *
 * Pattern :
 *   const [toast, setToast] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
 *   ...
 *   {toast && <Toast {...toast} onClose={() => setToast(null)} />}
 *
 * Auto-disparition après `duration` ms (3 sec par défaut).
 */
interface Props {
  kind?: "ok" | "err";
  msg: string;
  duration?: number;
  onClose: () => void;
}

export function Toast({ kind = "ok", msg, duration = 3_000, onClose }: Props) {
  useEffect(() => {
    if (duration <= 0) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  const Icon = kind === "ok" ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] inline-flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-2xl backdrop-blur-sm",
        kind === "ok"
          ? "border-success/40 bg-success/15 text-success"
          : "border-error/40 bg-error/15 text-error",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{msg}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer la notification"
        className="ml-1 -mr-1 h-6 w-6 inline-flex items-center justify-center rounded-md hover:bg-current/10 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
