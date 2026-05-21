"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabaseBrowser, isSupabaseConfigured } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Hook qui :
 *   1. fetch une liste à l'initialisation
 *   2. écoute en realtime les INSERT sur `watchTable`
 *   3. déclenche un refetch *debouncé* à chaque événement
 *      (évite de spammer Supabase quand 10 personnes terminent un quiz d'affilée)
 *
 * Le fetcher est référencé via ref, pas via deps : on peut le définir
 * inline dans le composant sans relancer la souscription à chaque render.
 *
 * Utilisé par :
 *   - components/leaderboard/leaderboard-table.tsx
 *   - components/quiz/recent-sessions.tsx
 */
interface Config<T> {
  /** Nom unique du channel Supabase realtime. */
  channelName: string;
  /** Table à surveiller (typiquement la table sous-jacente à la vue lue). */
  watchTable: string;
  /** Délai de debounce sur les refetch realtime (ms). Par défaut 2 sec. */
  debounceMs?: number;
  /** Fonction de fetch — peut être inline (capturée via ref). */
  fetcher: (
    supabase: SupabaseClient,
  ) => PromiseLike<{ data: T[] | null }>;
}

export function useRealtimeList<T>({
  channelName,
  watchTable,
  debounceMs = 2_000,
  fetcher,
}: Config<T>): T[] | null {
  const [items, setItems] = useState<T[] | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setItems([]);
      return;
    }
    const supabase = getSupabaseBrowser();
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const doFetch = async () => {
      const { data } = await fetcherRef.current(supabase);
      if (!cancelled) setItems(data ?? []);
    };

    void doFetch();

    const debouncedRefetch = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!cancelled) void doFetch();
      }, debounceMs);
    };

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: watchTable },
        debouncedRefetch,
      )
      .subscribe();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [channelName, watchTable, debounceMs]);

  return items;
}
