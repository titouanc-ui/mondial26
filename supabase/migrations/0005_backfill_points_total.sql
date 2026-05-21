-- Mondial 26 — Backfill du score cumulé (points_total) sur les profils existants
-- À exécuter dans Supabase Studio > SQL Editor
--
-- Avant cette correction, points_total n'était jamais mis à jour côté serveur
-- → affichait toujours 0 dans la page profil. Cette migration recalcule la
-- somme à partir des quiz_sessions existantes. Les nouvelles parties
-- l'incrémentent automatiquement (voir /api/quiz/submit/route.ts).

update public.profiles p
set points_total = coalesce(
  (select sum(score)::int from public.quiz_sessions where profile_id = p.id),
  0
);
