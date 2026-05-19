import type {
  FootballProvider,
  GroupStanding,
  Match,
  MatchDetails,
  MatchStatus,
  TopScorer,
  Team,
} from "./types";

const TEAMS: Record<string, Team> = {
  FRA: { id: "FRA", name: "France", shortName: "France", tla: "FRA" },
  ESP: { id: "ESP", name: "Espagne", shortName: "Espagne", tla: "ESP" },
  ARG: { id: "ARG", name: "Argentine", shortName: "Argentine", tla: "ARG" },
  BRA: { id: "BRA", name: "Brésil", shortName: "Brésil", tla: "BRA" },
  GER: { id: "GER", name: "Allemagne", shortName: "Allemagne", tla: "GER" },
  ENG: { id: "ENG", name: "Angleterre", shortName: "Angleterre", tla: "ENG" },
  POR: { id: "POR", name: "Portugal", shortName: "Portugal", tla: "POR" },
  NED: { id: "NED", name: "Pays-Bas", shortName: "Pays-Bas", tla: "NED" },
  ITA: { id: "ITA", name: "Italie", shortName: "Italie", tla: "ITA" },
  BEL: { id: "BEL", name: "Belgique", shortName: "Belgique", tla: "BEL" },
  CRO: { id: "CRO", name: "Croatie", shortName: "Croatie", tla: "CRO" },
  USA: { id: "USA", name: "États-Unis", shortName: "USA", tla: "USA" },
  MEX: { id: "MEX", name: "Mexique", shortName: "Mexique", tla: "MEX" },
  CAN: { id: "CAN", name: "Canada", shortName: "Canada", tla: "CAN" },
  JPN: { id: "JPN", name: "Japon", shortName: "Japon", tla: "JPN" },
  KOR: { id: "KOR", name: "Corée du Sud", shortName: "Corée Sud", tla: "KOR" },
  SEN: { id: "SEN", name: "Sénégal", shortName: "Sénégal", tla: "SEN" },
  MAR: { id: "MAR", name: "Maroc", shortName: "Maroc", tla: "MAR" },
  AUS: { id: "AUS", name: "Australie", shortName: "Australie", tla: "AUS" },
  URU: { id: "URU", name: "Uruguay", shortName: "Uruguay", tla: "URU" },
  COL: { id: "COL", name: "Colombie", shortName: "Colombie", tla: "COL" },
  ECU: { id: "ECU", name: "Équateur", shortName: "Équateur", tla: "ECU" },
  PAR: { id: "PAR", name: "Paraguay", shortName: "Paraguay", tla: "PAR" },
  CIV: { id: "CIV", name: "Côte d'Ivoire", shortName: "Côte d'Ivoire", tla: "CIV" },
  EGY: { id: "EGY", name: "Égypte", shortName: "Égypte", tla: "EGY" },
  NGA: { id: "NGA", name: "Nigéria", shortName: "Nigéria", tla: "NGA" },
  TUN: { id: "TUN", name: "Tunisie", shortName: "Tunisie", tla: "TUN" },
  ALG: { id: "ALG", name: "Algérie", shortName: "Algérie", tla: "ALG" },
  IRN: { id: "IRN", name: "Iran", shortName: "Iran", tla: "IRN" },
  KSA: { id: "KSA", name: "Arabie Saoudite", shortName: "Arabie S.", tla: "KSA" },
  SUI: { id: "SUI", name: "Suisse", shortName: "Suisse", tla: "SUI" },
  AUT: { id: "AUT", name: "Autriche", shortName: "Autriche", tla: "AUT" },
  TUR: { id: "TUR", name: "Turquie", shortName: "Turquie", tla: "TUR" },
  POL: { id: "POL", name: "Pologne", shortName: "Pologne", tla: "POL" },
  DEN: { id: "DEN", name: "Danemark", shortName: "Danemark", tla: "DEN" },
  SRB: { id: "SRB", name: "Serbie", shortName: "Serbie", tla: "SRB" },
  SCO: { id: "SCO", name: "Écosse", shortName: "Écosse", tla: "SCO" },
  NOR: { id: "NOR", name: "Norvège", shortName: "Norvège", tla: "NOR" },
  WAL: { id: "WAL", name: "Pays de Galles", shortName: "Galles", tla: "WAL" },
  CHI: { id: "CHI", name: "Chili", shortName: "Chili", tla: "CHI" },
  CRC: { id: "CRC", name: "Costa Rica", shortName: "Costa Rica", tla: "CRC" },
  PAN: { id: "PAN", name: "Panama", shortName: "Panama", tla: "PAN" },
  GHA: { id: "GHA", name: "Ghana", shortName: "Ghana", tla: "GHA" },
  CMR: { id: "CMR", name: "Cameroun", shortName: "Cameroun", tla: "CMR" },
  RSA: { id: "RSA", name: "Afrique du Sud", shortName: "Afrique du Sud", tla: "RSA" },
  NZL: { id: "NZL", name: "Nouvelle-Zélande", shortName: "N.-Zélande", tla: "NZL" },
  QAT: { id: "QAT", name: "Qatar", shortName: "Qatar", tla: "QAT" },
  UZB: { id: "UZB", name: "Ouzbékistan", shortName: "Ouzbékistan", tla: "UZB" },
};

const GROUP_LAYOUT: Record<string, [string, string, string, string]> = {
  A: ["MEX", "MAR", "POL", "CIV"],
  B: ["CAN", "BEL", "ECU", "EGY"],
  C: ["USA", "POR", "URU", "TUN"],
  D: ["FRA", "JPN", "COL", "GHA"],
  E: ["ESP", "AUS", "PAR", "CMR"],
  F: ["GER", "KOR", "PAN", "ALG"],
  G: ["BRA", "DEN", "CRC", "QAT"],
  H: ["ENG", "SCO", "IRN", "RSA"],
  I: ["ITA", "SUI", "WAL", "UZB"],
  J: ["NED", "CRO", "CRC", "SEN"],
  K: ["ARG", "NOR", "NZL", "NGA"],
  L: ["POR", "TUR", "CHI", "KSA"],
};

const venues = [
  "MetLife Stadium · New York",
  "SoFi Stadium · Los Angeles",
  "Estadio Azteca · Mexico",
  "BMO Field · Toronto",
  "Lumen Field · Seattle",
  "Mercedes-Benz Stadium · Atlanta",
];

let cachedMatches: Match[] | null = null;

function buildMatches(): Match[] {
  if (cachedMatches) return cachedMatches;
  const matches: Match[] = [];
  const kickoff = new Date("2026-06-11T20:00:00-04:00").getTime();
  let matchId = 1;

  for (const [group, teamIds] of Object.entries(GROUP_LAYOUT)) {
    const pairs: [number, number][] = [
      [0, 1],
      [2, 3],
      [0, 2],
      [1, 3],
      [0, 3],
      [1, 2],
    ];
    pairs.forEach(([a, b], i) => {
      const ts = kickoff + matchId * 1000 * 60 * 60 * 6;
      matches.push({
        id: String(matchId++),
        utcDate: new Date(ts).toISOString(),
        status: "SCHEDULED",
        stage: "GROUP_STAGE",
        group: `Groupe ${group}`,
        matchday: Math.floor(i / 2) + 1,
        minute: null,
        homeTeam: TEAMS[teamIds[a]],
        awayTeam: TEAMS[teamIds[b]],
        score: { home: null, away: null, duration: "REGULAR" },
        venue: venues[matchId % venues.length],
      });
    });
  }

  cachedMatches = matches;
  return matches;
}

function buildStandings(): GroupStanding[] {
  return Object.entries(GROUP_LAYOUT).map(([group, teamIds]) => ({
    groupId: group,
    groupName: `Groupe ${group}`,
    standings: teamIds.map((id, idx) => ({
      team: TEAMS[id],
      position: idx + 1,
      playedGames: 0,
      won: 0,
      draw: 0,
      lost: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    })),
  }));
}

export class MockProvider implements FootballProvider {
  readonly name = "mock";

  async getMatches(opts: {
    dateFrom?: string;
    dateTo?: string;
    status?: MatchStatus;
  } = {}): Promise<Match[]> {
    let m = buildMatches();
    if (opts.status) m = m.filter((x) => x.status === opts.status);
    if (opts.dateFrom) m = m.filter((x) => x.utcDate >= opts.dateFrom!);
    if (opts.dateTo) m = m.filter((x) => x.utcDate <= opts.dateTo!);
    return m;
  }

  async getMatchById(id: string): Promise<MatchDetails | null> {
    const m = buildMatches().find((x) => x.id === id);
    if (!m) return null;
    return { ...m, events: [], stats: {} };
  }

  async getStandings(): Promise<GroupStanding[]> {
    return buildStandings();
  }

  async getTopScorers(limit = 10): Promise<TopScorer[]> {
    return Array.from({ length: Math.min(limit, 5) }).map((_, i) => ({
      player: {
        id: `mock-${i}`,
        name: ["K. Mbappé", "Vinicius Jr", "L. Messi", "E. Haaland", "J. Bellingham"][i],
        teamName: ["France", "Brésil", "Argentine", "Norvège", "Angleterre"][i],
      },
      goals: 0,
    }));
  }
}
