export interface NewsSource {
  id: string;
  name: string;
  url: string;
  faviconColor?: string;
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: "lequipe",
    name: "L'Équipe",
    url: "https://www.lequipe.fr/rss/actu_rss_Football.xml",
    faviconColor: "#000000",
  },
  {
    id: "rmcsport",
    name: "RMC Sport",
    url: "https://rmcsport.bfmtv.com/rss/football/",
    faviconColor: "#e10600",
  },
  {
    id: "sofoot",
    name: "So Foot",
    url: "https://www.sofoot.com/rss.xml",
    faviconColor: "#f57c00",
  },
  {
    id: "footmercato",
    name: "Foot Mercato",
    url: "https://www.footmercato.net/rss/",
    faviconColor: "#1c2434",
  },
  {
    id: "francebleu",
    name: "France Bleu Sport",
    url: "https://www.francebleu.fr/rss/sport/foot.xml",
    faviconColor: "#0066b3",
  },
];

// Filtres pour ne garder que les news pertinentes au Mondial 2026
export const WORLD_CUP_KEYWORDS = [
  "coupe du monde",
  "mondial",
  "cdm",
  "world cup",
  "fifa 2026",
  "mondial 2026",
  "qualifications mondial",
  "équipe de france",
  "bleus",
  "didier deschamps",
];

export function isWorldCupRelated(title: string, content: string): boolean {
  const text = `${title} ${content}`.toLowerCase();
  return WORLD_CUP_KEYWORDS.some((kw) => text.includes(kw));
}
