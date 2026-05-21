-- Mondial 26 — Vue agrégée des stats par profil
-- À exécuter dans Supabase Studio > SQL Editor
--
-- Évite de SELECT * des sessions juste pour compter / max-er côté serveur.
-- Utilisée par :
--   - app/profil/page.tsx (loadStats)
--   - components/profile/player-profile-modal.tsx (best/games)

create or replace view public.profile_stats as
select
  p.id                              as profile_id,
  coalesce(max(s.score), 0)::int    as best_score,
  coalesce(count(s.id), 0)::int     as games_played,
  coalesce(sum(s.correct_count), 0)::int as total_correct
from public.profiles p
left join public.quiz_sessions s on s.profile_id = p.id
group by p.id;

-- Lecture publique : pas de RLS (vue calculée, pas de donnée sensible).
-- La vue hérite des permissions des tables sous-jacentes.
grant select on public.profile_stats to anon, authenticated;
