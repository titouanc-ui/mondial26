export type QuizTheme =
  | "equipes"
  | "joueurs"
  | "historique"
  | "matchs"
  | "culture"
  | "france"
  | "mix";

export interface QuizAnswer {
  text: string;
  is_correct: boolean;
}

export interface QuizQuestion {
  id: string;
  theme: QuizTheme;
  difficulty: 1 | 2 | 3;
  question: string;
  answers: QuizAnswer[];
  explanation: string | null;
  source: "manual" | "auto";
  active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  pseudo: string;
  user_id: string | null;
  is_verified: boolean;
  points_total: number;
  coins: number;
  avatar_url: string | null;
  favorite_team: string | null;
  bio: string | null;
  equipped_banner: string | null;
  equipped_frame: string | null;
  equipped_badge: string | null;
  equipped_icon: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  profile_id: string;
  item_id: string;
  item_type: "banner" | "frame" | "badge" | "icon";
  acquired_at: string;
}

export interface QuizSession {
  id: string;
  profile_id: string;
  theme: string;
  score: number;
  correct_count: number;
  duration_ms: number;
  played_at: string;
  questions_snapshot: unknown;
}

export interface LeaderboardEntry {
  profile_id: string;
  pseudo: string;
  is_verified: boolean;
  avatar_url: string | null;
  equipped_frame: string | null;
  equipped_badge: string | null;
  best_score: number;
  games_played: number;
  last_played: string;
}

export interface RecentSessionEntry {
  session_id: string;
  score: number;
  correct_count: number;
  theme: string;
  played_at: string;
  profile_id: string;
  pseudo: string;
  is_verified: boolean;
  avatar_url: string | null;
  equipped_frame: string | null;
  equipped_badge: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id?: string;
          pseudo: string;
          user_id?: string | null;
          points_total?: number;
          coins?: number;
          avatar_url?: string | null;
          favorite_team?: string | null;
          bio?: string | null;
        };
        Update: Partial<{
          pseudo: string;
          user_id: string | null;
          points_total: number;
          coins: number;
          avatar_url: string | null;
          favorite_team: string | null;
          bio: string | null;
        }>;
        Relationships: [];
      };
      quiz_questions: {
        Row: QuizQuestion;
        Insert: {
          id?: string;
          theme: QuizTheme;
          difficulty?: 1 | 2 | 3;
          question: string;
          answers: QuizAnswer[];
          explanation?: string | null;
          source?: "manual" | "auto";
          active?: boolean;
        };
        Update: Partial<QuizQuestion>;
        Relationships: [];
      };
      quiz_sessions: {
        Row: QuizSession;
        Insert: {
          id?: string;
          profile_id: string;
          theme: string;
          score: number;
          correct_count: number;
          duration_ms: number;
          questions_snapshot: unknown;
        };
        Update: Partial<QuizSession>;
        Relationships: [];
      };
    };
    Views: {
      leaderboard_global: {
        Row: LeaderboardEntry;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
}
