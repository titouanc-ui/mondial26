import { fetchAllNews } from "@/lib/news/fetcher";
import { ArticleCard } from "@/components/news/article-card";
import { NEWS_SOURCES } from "@/lib/news/sources";
import { Rss } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description:
    "L'actu de la Coupe du Monde 2026 agrégée depuis L'Équipe, RMC Sport, So Foot et Foot Mercato.",
};

export const revalidate = 900; // 15 min

export default async function NewsPage() {
  const articles = await fetchAllNews();
  const [featured, ...rest] = articles;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">News</h1>
        <p className="mt-2 text-text-muted">
          L'actu du Mondial agrégée depuis les grands médias français.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-text-muted">
          <Rss className="h-3.5 w-3.5" />
          <span className="text-text-dim">Sources :</span>
          {NEWS_SOURCES.map((s, i) => (
            <span key={s.id}>
              <span className="text-text">{s.name}</span>
              {i < NEWS_SOURCES.length - 1 && (
                <span className="text-text-dim"> ·</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {articles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-bg-card/50 p-10 text-center">
          <p className="text-text-muted">
            Aucune actu trouvée pour le moment. Les flux sont rafraîchis
            automatiquement toutes les 15 minutes.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {featured && <ArticleCard article={featured} featured />}
          </div>
          <div className="space-y-3">
            {rest.slice(0, 5).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <div className="lg:col-span-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(5).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
