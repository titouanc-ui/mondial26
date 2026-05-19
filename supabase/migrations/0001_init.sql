-- Mondial 26 — Schéma initial
-- À exécuter dans Supabase Studio > SQL Editor, ou via la CLI Supabase

-- ============================================================
-- profiles : profils joueurs (hybride pseudo / Google OAuth)
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  pseudo text not null check (length(pseudo) between 2 and 20),
  user_id uuid references auth.users(id) on delete set null unique,
  is_verified boolean generated always as (user_id is not null) stored,
  points_total int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_pseudo on public.profiles (lower(pseudo));
create index if not exists idx_profiles_user_id on public.profiles (user_id);

-- ============================================================
-- quiz_questions : banque de questions
-- ============================================================
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  theme text not null check (
    theme in ('equipes', 'joueurs', 'historique', 'matchs', 'culture', 'mix')
  ),
  difficulty int not null default 2 check (difficulty between 1 and 3),
  question text not null,
  answers jsonb not null,
  -- shape: [{ "text": "...", "is_correct": true|false }, ...] exactly 4 entries
  explanation text,
  source text not null default 'manual' check (source in ('manual', 'auto')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint answers_must_be_array check (jsonb_typeof(answers) = 'array'),
  constraint answers_must_have_four check (jsonb_array_length(answers) = 4)
);

create index if not exists idx_quiz_questions_theme on public.quiz_questions (theme) where active = true;

-- ============================================================
-- quiz_sessions : parties jouées (1 ligne = 1 partie complète)
-- ============================================================
create table if not exists public.quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  theme text not null,
  score int not null check (score >= 0 and score <= 1500),
  correct_count int not null default 0,
  duration_ms int not null,
  played_at timestamptz not null default now(),
  -- Snapshot des questions/réponses pour audit anti-triche
  questions_snapshot jsonb not null
);

create index if not exists idx_sessions_score_played on public.quiz_sessions (score desc, played_at desc);
create index if not exists idx_sessions_profile on public.quiz_sessions (profile_id, played_at desc);

-- ============================================================
-- Vues utilitaires : leaderboard
-- ============================================================
create or replace view public.leaderboard_global as
select
  p.id            as profile_id,
  p.pseudo,
  p.is_verified,
  max(s.score)    as best_score,
  count(s.id)::int as games_played,
  max(s.played_at) as last_played
from public.profiles p
left join public.quiz_sessions s on s.profile_id = p.id
where s.id is not null
group by p.id, p.pseudo, p.is_verified
order by best_score desc, last_played desc;

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_sessions enable row level security;

-- Lecture publique des profils (pseudo + is_verified affichés dans leaderboard)
create policy "profiles read public" on public.profiles
  for select using (true);

-- Insertion: anonyme autorisé (pour les pseudos) — restreint côté API via service role
create policy "profiles insert own" on public.profiles
  for insert with check (
    auth.uid() is null
    or auth.uid() = user_id
  );

-- Update : un profil lié à un user_id ne peut être modifié que par son propriétaire.
-- Les profils anonymes ne sont modifiés que via service role (anti-triche).
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = user_id);

-- Lecture publique des questions (mais les bonnes réponses doivent être masquées côté API)
create policy "questions read active" on public.quiz_questions
  for select using (active = true);

-- Lecture publique des sessions (pour le leaderboard)
create policy "sessions read public" on public.quiz_sessions
  for select using (true);

-- Aucune insertion directe par le client — uniquement via service role depuis l'API
-- (= aucune policy d'insert/update → tout bloqué par défaut côté client)

-- ============================================================
-- Trigger : maj de updated_at
-- ============================================================
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- Realtime : leaderboard live
-- ============================================================
-- À activer dans Supabase Studio > Database > Replication, table quiz_sessions
