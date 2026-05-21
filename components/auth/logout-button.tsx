"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

interface Props {
  className?: string;
}

export function LogoutButton({ className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowser();
      await supabase.auth.signOut();
      router.refresh();
    } catch (err) {
      console.error("[logout]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-bg px-4 py-2 text-sm font-medium text-text-muted hover:text-text hover:bg-bg-card-hover transition-colors disabled:opacity-50 w-full"
      }
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      Se déconnecter
    </button>
  );
}
