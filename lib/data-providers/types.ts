export interface Team {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  flagUrl?: string;
  groupId?: string;
}

export type MatchStatus =
  | "SCHEDULED"
  | "LIVE"
  | "IN_PLAY"
  | "PAUSED"
  | "FINISHED"
  | "POSTPONED"
  | "CANCELLED";

export type MatchStage =
  | "GROUP_STAGE"
  | "LAST_32"
  | "LAST_16"
  | "QUARTER_FINALS"
  | "SEMI_FINALS"
  | "THIRD_PLACE"
  | "FINAL";

export interface Score {
  home: number | null;
  away: number | null;
  duration?: "REGULAR" | "EXTRA_TIME" | "PENALTY_SHOOTOUT";
  penalties?: { home: number; away: number };
}

export interface Match {
  id: string;
  utcDate: string;
  status: MatchStatus;
  stage: MatchStage;
  group?: string;
  matchday?: number;
  minute?: number | null;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
  venue?: string;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: "GOAL" | "YELLOW_CARD" | "RED_CARD" | "SUBSTITUTION" | "PENALTY";
  teamId: string;
  playerName: string;
  detail?: string;
}

export interface MatchStats {
  possession?: { home: number; away: number };
  shots?: { home: number; away: number };
  shotsOnTarget?: { home: number; away: number };
  corners?: { home: number; away: number };
  fouls?: { home: number; away: number };
  yellowCards?: { home: number; away: number };
  redCards?: { home: number; away: number };
  expectedGoals?: { home: number; away: number };
}

export interface MatchDetails extends Match {
  events: MatchEvent[];
  stats: MatchStats;
}

export interface Standing {
  team: Team;
  position: number;
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

export interface GroupStanding {
  groupId: string;
  groupName: string;
  standings: Standing[];
}

export interface Player {
  id: string;
  name: string;
  teamId?: string;
  teamName?: string;
  position?: string;
  shirtNumber?: number;
}

export interface TopScorer {
  player: Player;
  goals: number;
  assists?: number;
  penalties?: number;
  playedMatches?: number;
}

export interface FootballProvider {
  readonly name: string;
  getMatches(opts?: {
    dateFrom?: string;
    dateTo?: string;
    status?: MatchStatus;
  }): Promise<Match[]>;
  getMatchById(id: string): Promise<MatchDetails | null>;
  getStandings(): Promise<GroupStanding[]>;
  getTopScorers(limit?: number): Promise<TopScorer[]>;
}
