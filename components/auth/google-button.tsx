"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";

interface Props {
  next?: string;
  className?: string;
  label?: string;
}

export function GoogleSignInButton({
  next = "/quiz",
  className,
  label = "Continuer avec Google",
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!isSupabaseConfigured()) {
      setError(
        "L'authentification Google nécessite la configuration Supabase (env vars).",
      );
      return;
    }
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg px-5 py-3 text-sm font-semibold hover:bg-bg-card-hover transition-colors disabled:opacity-50 w-full"
        }
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path
              fill="#EA4335"
              d="M5.27 9.76A7.08 7.08 0 0 1 16.39 6.6l3.07-3.06A11.18 11.18 0 0 0 1.95 6.66z"
            />
            <path
              fill="#34A853"
              d="M16.04 18.01a7.05 7.05 0 0 1-10.77-2.35L1.92 18.71A11.16 11.16 0 0 0 12 23a10.7 10.7 0 0 0 7.4-2.78z"
            />
            <path
              fill="#4A90E2"
              d="M19.4 20.22A11.07 11.07 0 0 0 23 12c0-.72-.08-1.41-.18-2.12H12v4.51h6.18A5.32 5.32 0 0 1 16.04 18z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.27a6.81 6.81 0 0 1 0-4.5L1.95 6.66a11.13 11.13 0 0 0 0 10.05z"
            />
          </svg>
        )}
        {label}
      </button>
      {error && <p className="mt-2 text-xs text-error">{error}</p>}
    </div>
  );
}
