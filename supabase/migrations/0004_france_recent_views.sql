-- Mondial 26 — Thème "Équipe de France" + vues enrichies (avatar, frame, badge, recent)
-- À exécuter dans Supabase Studio > SQL Editor

-- ============================================================
-- 1. Étend la liste des thèmes autorisés sur quiz_questions
-- ============================================================
alter table public.quiz_questions
  drop constraint if exists quiz_questions_theme_check;

alter table public.quiz_questions
  add constraint quiz_questions_theme_check check (
    theme in ('equipes', 'joueurs', 'historique', 'matchs', 'culture', 'mix', 'france')
  );

-- ============================================================
-- 2. Recrée leaderboard_global avec avatar / frame / badge
-- ============================================================
drop view if exists public.leaderboard_global;
create view public.leaderboard_global as
select
  p.id              as profile_id,
  p.pseudo,
  p.is_verified,
  p.avatar_url,
  p.equipped_frame,
  p.equipped_badge,
  max(s.score)      as best_score,
  count(s.id)::int  as games_played,
  max(s.played_at)  as last_played
from public.profiles p
join public.quiz_sessions s on s.profile_id = p.id
group by p.id, p.pseudo, p.is_verified, p.avatar_url, p.equipped_frame, p.equipped_badge
order by best_score desc, last_played desc;

-- ============================================================
-- 3. Vue recent_sessions : 10 dernières parties tous joueurs
--    Inclut les cosmétiques équipés pour affichage instantané
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
  p.equipped_frame,
  p.equipped_badge
from public.quiz_sessions s
join public.profiles p on p.id = s.profile_id;
