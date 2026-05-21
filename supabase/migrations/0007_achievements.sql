-- Mondial 26 — Système de succès
-- À exécuter dans Supabase Studio > SQL Editor

-- ============================================================
-- 1. Compteurs additionnels sur profiles (pour calcul de succès)
-- ============================================================
alter table public.profiles
  add column if not exists article_clicks int not null default 0 check (article_clicks >= 0),
  add column if not exists coins_earned_total int not null default 0 check (coins_earned_total >= 0);

-- ============================================================
-- 2. Table user_achievements : succès débloqués + réclamés
-- ============================================================
create table if not exists public.user_achievements (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  claimed_at timestamptz,
  primary key (profile_id, achievement_id)
);

create index if not exists idx_user_achievements_profile
  on public.user_achievements(profile_id);

-- ============================================================
-- 3. RLS : lecture publique (pour profils joueurs), écriture via service_role
-- ============================================================
alter table public.user_achievements enable row level security;

drop policy if exists "user_achievements read public" on public.user_achievements;
create policy "user_achievements read public" on public.user_achievements
  for select using (true);

-- ============================================================
-- 4. Backfill coins_earned_total à partir des sessions existantes
--    Formule : 10 Buts/bonne réponse + 50 si parfait (correct_count = 10)
-- ============================================================
update public.profiles p
set coins_earned_total = coalesce((
  select sum(
    correct_count * 10 +
    case when correct_count = 10 then 50 else 0 end
  )::int
  from public.quiz_sessions
  where profile_id = p.id
), 0)
where coins_earned_total = 0;
