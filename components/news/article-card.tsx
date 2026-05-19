import type { Article } from "@/lib/news/types";
import { formatRelativeTime } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured }: ArticleCardProps) {
  if (featured) {
    return (
      <a
        href={article.link}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-2xl border border-border bg-bg-card hover:border-border-strong transition-all"
      >
        {article.imageUrl ? (
          <div
            className="aspect-[16/9] bg-bg-elevated bg-cover bg-center"
            style={{ backgroundImage: `url(${article.imageUrl})` }}
          >
            <div className="h-full w-full bg-gradient-to-t from-bg-card via-bg-card/30 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[16/9] bg-gradient-to-br from-accent-blue/30 to-accent-red/20" />
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="font-semibold text-text">{article.source}</span>
            <span className="text-text-dim">·</span>
            <span>{formatRelativeTime(article.publishedAt)}</span>
          </div>
          <h3 className="mt-2 text-xl font-bold tracking-tight text-balance group-hover:text-accent-red transition-colors">
            {article.title}
          </h3>
          {article.description && (
            <p className="mt-2 text-sm text-text-muted line-clamp-3">
              {article.description}
            </p>
          )}
        </div>
      </a>
    );
  }

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-xl border border-border bg-bg-card/60 p-4 hover:border-border-strong hover:bg-bg-card transition-all"
    >
      {article.imageUrl && (
        <div
          className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-lg bg-bg-elevated bg-cover bg-center"
          style={{ backgroundImage: `url(${article.imageUrl})` }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="font-semibold text-text">{article.source}</span>
          <span className="text-text-dim">·</span>
          <span>{formatRelativeTime(article.publishedAt)}</span>
        </div>
        <h3 className="mt-1 font-semibold text-text-balance line-clamp-2 group-hover:text-accent-red transition-colors">
          {article.title}
        </h3>
        {article.description && (
          <p className="mt-1 text-sm text-text-muted line-clamp-2 hidden sm:block">
            {article.description}
          </p>
        )}
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-text-dim">
          <ExternalLink className="h-3 w-3" /> Lire sur {article.source}
        </div>
      </div>
    </a>
  );
}
