import Parser from "rss-parser";
import { NEWS_SOURCES, isWorldCupRelated } from "./sources";
import type { Article } from "./types";

interface CustomItem {
  enclosure?: { url: string };
  "media:content"?: { $: { url: string } };
  "media:thumbnail"?: { $: { url: string } };
}

const parser = new Parser<Record<string, unknown>, CustomItem>({
  timeout: 10_000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; Mondial26Bot/1.0; +https://mondial26.app)",
  },
  customFields: {
    item: [
      "enclosure",
      ["media:content", "media:content", { keepArray: false }],
      ["media:thumbnail", "media:thumbnail", { keepArray: false }],
    ],
  },
});

function extractImage(item: Record<string, unknown> & CustomItem): string | undefined {
  if (item.enclosure?.url) return item.enclosure.url;
  const mediaContent = item["media:content"];
  if (mediaContent?.$.url) return mediaContent.$.url;
  const mediaThumb = item["media:thumbnail"];
  if (mediaThumb?.$.url) return mediaThumb.$.url;

  const content = (item.content as string) ?? (item["content:encoded"] as string) ?? "";
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export async function fetchSource(sourceId: string): Promise<Article[]> {
  const source = NEWS_SOURCES.find((s) => s.id === sourceId);
  if (!source) return [];

  try {
    const feed = await parser.parseURL(source.url);
    const items = feed.items ?? [];

    return items
      .map((item): Article | null => {
        const title = (item.title as string) ?? "";
        const link = (item.link as string) ?? "";
        if (!title || !link) return null;

        const rawDescription =
          (item.contentSnippet as string) ??
          (item.content as string) ??
          ((item as Record<string, unknown>).description as string) ??
          "";
        const description = stripHtml(rawDescription).slice(0, 400);

        if (!isWorldCupRelated(title, description)) return null;

        return {
          id: `${source.id}:${item.guid ?? link}`,
          title: title.trim(),
          description,
          link,
          source: source.name,
          sourceId: source.id,
          publishedAt:
            (item.isoDate as string) ??
            (item.pubDate as string) ??
            new Date().toISOString(),
          imageUrl: extractImage(item as Record<string, unknown> & CustomItem),
        };
      })
      .filter((a): a is Article => a !== null);
  } catch (err) {
    console.error(`[news] failed to fetch ${source.id}:`, err);
    return [];
  }
}

export async function fetchAllNews(): Promise<Article[]> {
  const results = await Promise.allSettled(
    NEWS_SOURCES.map((s) => fetchSource(s.id)),
  );

  const articles = results
    .flatMap((r) => (r.status === "fulfilled" ? r.value : []))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const seen = new Set<string>();
  return articles.filter((a) => {
    if (seen.has(a.link)) return false;
    seen.add(a.link);
    return true;
  });
}
