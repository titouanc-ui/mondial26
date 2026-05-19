import type {
  FootballProvider,
  GroupStanding,
  Match,
  MatchDetails,
  MatchStatus,
  TopScorer,
} from "./types";

const BASE_URL = "https://api.football-data.org/v4";
const COMPETITION_CODE = "WC";

interface RawTeam {
  id: number;
  name: string;
  shortName?: string;
  tla?: string;
  crest?: string;
}

interface RawScore {
  fullTime: { home: number | null; away: number | null };
  halfTime?: { home: number | null; away: number | null };
  duration?: string;
  penalties?: { home: number; away: number };
}

interface RawMatch {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  group?: string | null;
  matchday?: number | null;
  minute?: number | null;
  homeTeam: RawTeam;
  awayTeam: RawTeam;
  score: RawScore;
  venue?: string;
}

interface RawStanding {
  position: number;
  team: RawTeam;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  form?: string;
}

interface RawGroup {
  stage: string;
  group?: string | null;
  type: string;
  table: RawStanding[];
}

interface RawScorer {
  player: { id: number; name: string };
  team: { id: number; name: string };
  goals?: number;
  assists?: number;
  penalties?: number;
  playedMatches?: number;
}

function mapTeam(raw: RawTeam) {
  return {
    id: String(raw.id),
    name: raw.name,
    shortName: raw.shortName ?? raw.name,
    tla: raw.tla ?? raw.name.slice(0, 3).toUpperCase(),
    flagUrl: raw.crest,
  };
}

function mapStatus(s: string): MatchStatus {
  switch (s) {
    case "SCHEDULED":
    case "TIMED":
      return "SCHEDULED";
    case "LIVE":
    case "IN_PLAY":
      return "IN_PLAY";
    case "PAUSED":
      return "PAUSED";
    case "FINISHED":
      return "FINISHED";
    case "POSTPONED":
    case "SUSPENDED":
      return "POSTPONED";
    case "CANCELLED":
    case "AWARDED":
      return "CANCELLED";
    default:
      return "SCHEDULED";
  }
}

function mapStage(s: string): Match["stage"] {
  switch (s) {
    case "GROUP_STAGE":
      return "GROUP_STAGE";
    case "LAST_16":
      return "LAST_16";
    case "QUARTER_FINALS":
      return "QUARTER_FINALS";
    case "SEMI_FINALS":
      return "SEMI_FINALS";
    case "THIRD_PLACE":
      return "THIRD_PLACE";
    case "FINAL":
      return "FINAL";
    default:
      return "GROUP_STAGE";
  }
}

function mapMatch(raw: RawMatch): Match {
  return {
    id: String(raw.id),
    utcDate: raw.utcDate,
    status: mapStatus(raw.status),
    stage: mapStage(raw.stage),
    group: raw.group ?? undefined,
    matchday: raw.matchday ?? undefined,
    minute: raw.minute ?? null,
    homeTeam: mapTeam(raw.homeTeam),
    awayTeam: mapTeam(raw.awayTeam),
    score: {
      home: raw.score.fullTime.home,
      away: raw.score.fullTime.away,
      duration:
        raw.score.duration === "EXTRA_TIME"
          ? "EXTRA_TIME"
          : raw.score.duration === "PENALTY_SHOOTOUT"
            ? "PENALTY_SHOOTOUT"
            : "REGULAR",
      penalties: raw.score.penalties,
    },
    venue: raw.venue,
  };
}

interface FetchOpts {
  path: string;
  query?: Record<string, string | undefined>;
  revalidate?: number;
}

async function call<T>(opts: FetchOpts): Promise<T> {
  const url = new URL(`${BASE_URL}${opts.path}`);
  for (const [k, v] of Object.entries(opts.query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, v);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (process.env.FOOTBALL_DATA_API_KEY) {
    headers["X-Auth-Token"] = process.env.FOOTBALL_DATA_API_KEY;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: opts.revalidate ?? 600 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `football-data.org ${opts.path} → ${res.status} ${res.statusText} ${body}`,
    );
  }

  return res.json() as Promise<T>;
}

export class FootballDataOrgProvider implements FootballProvider {
  readonly name = "football-data-org";

  async getMatches(opts: {
    dateFrom?: string;
    dateTo?: string;
    status?: MatchStatus;
  } = {}): Promise<Match[]> {
    const data = await call<{ matches: RawMatch[] }>({
      path: `/competitions/${COMPETITION_CODE}/matches`,
      query: {
        dateFrom: opts.dateFrom,
        dateTo: opts.dateTo,
        status: opts.status,
      },
      revalidate: 300,
    });
    return data.matches.map(mapMatch);
  }

  async getMatchById(id: string): Promise<MatchDetails | null> {
    try {
      const raw = await call<RawMatch>({
        path: `/matches/${id}`,
        revalidate: 60,
      });
      const base = mapMatch(raw);
      return { ...base, events: [], stats: {} };
    } catch (err) {
      if (err instanceof Error && err.message.includes("404")) return null;
      throw err;
    }
  }

  async getStandings(): Promise<GroupStanding[]> {
    const data = await call<{ standings: RawGroup[] }>({
      path: `/competitions/${COMPETITION_CODE}/standings`,
      revalidate: 600,
    });
    return data.standings
      .filter((s) => s.type === "TOTAL")
      .map((g) => ({
        groupId: g.group ?? g.stage,
        groupName: g.group?.replace(/_/g, " ") ?? g.stage.replace(/_/g, " "),
        standings: g.table.map((row) => ({
          team: mapTeam(row.team),
          position: row.position,
          playedGames: row.playedGames,
          won: row.won,
          draw: row.draw,
          lost: row.lost,
          points: row.points,
          goalsFor: row.goalsFor,
          goalsAgainst: row.goalsAgainst,
          goalDifference: row.goalDifference,
          form: row.form,
        })),
      }));
  }

  async getTopScorers(limit = 20): Promise<TopScorer[]> {
    const data = await call<{ scorers: RawScorer[] }>({
      path: `/competitions/${COMPETITION_CODE}/scorers`,
      query: { limit: String(limit) },
      revalidate: 1800,
    });
    return data.scorers.map((s) => ({
      player: {
        id: String(s.player.id),
        name: s.player.name,
        teamId: String(s.team.id),
        teamName: s.team.name,
      },
      goals: s.goals ?? 0,
      assists: s.assists,
      penalties: s.penalties,
      playedMatches: s.playedMatches,
    }));
  }
}
