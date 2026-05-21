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
  {
    id: "lemonde",
    name: "Le Monde Sport",
    url: "https://www.lemonde.fr/sport/rss_full.xml",
    faviconColor: "#0a3c8e",
  },
];

// ============================================================
// Filtre football strict : on ne garde que les news vraiment foot
// ============================================================
// Stratégie : (au moins 1 mot-clé foot) ET (aucun mot-clé d'un autre sport)
// On reste large sur les mots foot pour ne pas rater de transferts /
// résultats / qualifs CDM, et on exclut explicitement les autres sports.

const FOOTBALL_KEYWORDS = [
  // Termes génériques
  "football",
  " foot ",
  " foot.",
  " foot,",
  "ballon rond",
  // Compétitions
  "coupe du monde",
  "mondial",
  "fifa",
  "uefa",
  "ligue 1",
  "ligue 2",
  "ligue des champions",
  "champions league",
  "europa league",
  "premier league",
  "liga ",
  "bundesliga",
  "serie a",
  "ligue europa",
  "ligue conférence",
  "coupe d'afrique",
  "can ",
  "euro 2024",
  "euro 2025",
  "qualifications mondial",
  // Équipes nationales
  "équipe de france",
  "les bleus",
  "deschamps",
  "selecao",
  "albiceleste",
  "three lions",
  "nationalmannschaft",
  "roja ",
  "azzurri",
  // Clubs majeurs
  "psg",
  "paris saint-germain",
  "olympique de marseille",
  "om ",
  "ol ",
  "olympique lyonnais",
  "monaco",
  "asse",
  "stade rennais",
  "lille",
  "lens",
  "real madrid",
  "barcelone",
  "barça",
  "atlético madrid",
  "manchester united",
  "manchester city",
  "liverpool",
  "chelsea",
  "arsenal",
  "tottenham",
  "bayern",
  "borussia",
  "juventus",
  "milan ac",
  "inter milan",
  "naples",
  // Joueurs phares (échantillon)
  "mbappé",
  "griezmann",
  "giroud",
  "pogba",
  "kanté",
  "varane",
  "dembélé",
  "tchouaméni",
  "rabiot",
  "haaland",
  "messi",
  "ronaldo",
  "neymar",
  "vinicius",
  "bellingham",
  "kane",
];

const NON_FOOTBALL_KEYWORDS = [
  // Tennis
  "tennis",
  "roland-garros",
  "wimbledon",
  "us open",
  "atp ",
  "wta ",
  " atp",
  " wta",
  "alcaraz",
  "sinner",
  "djokovic",
  "nadal",
  "federer",
  "swiatek",
  "masters 1000",
  "rolex paris masters",
  // Rugby
  "rugby",
  "xv de france",
  "top 14",
  "six nations",
  "tournoi des six",
  "all blacks",
  "springboks",
  // Basket
  "basket",
  "nba ",
  " nba",
  "lebron",
  "wembanyama",
  "euroligue",
  // F1 / moto / cyclisme
  "formule 1",
  " f1 ",
  "verstappen",
  "hamilton",
  "ferrari",
  "moto gp",
  "motogp",
  "cyclisme",
  "tour de france",
  "paris-nice",
  // Autres
  "handball",
  "natation",
  "athlétisme",
  "marathon",
  "ski ",
  "ski alpin",
  "biathlon",
  "boxe ",
  "mma ",
  "ufc ",
];

/**
 * Garde compatibilité avec l'import existant : on alias l'ancien nom
 * sur la nouvelle fonction stricte.
 */
export const WORLD_CUP_KEYWORDS = FOOTBALL_KEYWORDS;

export function isWorldCupRelated(title: string, content: string): boolean {
  return isFootballArticle(title, content);
}

export function isFootballArticle(title: string, content: string): boolean {
  const text = ` ${title} ${content} `.toLowerCase();
  const hasFootball = FOOTBALL_KEYWORDS.some((kw) => text.includes(kw));
  if (!hasFootball) return false;
  const hasOtherSport = NON_FOOTBALL_KEYWORDS.some((kw) => text.includes(kw));
  return !hasOtherSport;
}
