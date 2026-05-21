-- Mondial 26 — Vues enrichies avec favorite_team
-- À exécuter dans Supabase Studio > SQL Editor
--
-- Ajoute favorite_team aux vues leaderboard_global et recent_sessions
-- pour afficher le drapeau de l'équipe favorite à côté du pseudo dans
-- le classement et les dernières parties.

-- ============================================================
-- 1. Recrée leaderboard_global avec favorite_team
-- ============================================================
drop view if exists public.leaderboard_global;
create view public.leaderboard_global as
select
  p.id              as profile_id,
  p.pseudo,
  p.is_verified,
  p.avatar_url,
  p.favorite_team,
  p.equipped_frame,
  p.equipped_badge,
  max(s.score)      as best_score,
  count(s.id)::int  as games_played,
  max(s.played_at)  as last_played
from public.profiles p
join public.quiz_sessions s on s.profile_id = p.id
group by p.id, p.pseudo, p.is_verified, p.avatar_url, p.favorite_team,
         p.equipped_frame, p.equipped_badge
order by best_score desc, last_played desc;

-- ============================================================
-- 2. Recrée recent_sessions avec favorite_team
-- ============================================================
drop view if exists public.recent_sessions;
create view public.recent_sessions as
select
  s.id                as session_id,
  s.score,
  s.correct_count,
  s.theme,
  s.played_at,
  p.id                as profile_id,
  p.pseudo,
  p.is_verified,
  p.avatar_url,
  p.favorite_team,
  p.equipped_frame,
  p.equipped_badge
from public.quiz_sessions s
join public.profiles p on p.id = s.profile_id;
