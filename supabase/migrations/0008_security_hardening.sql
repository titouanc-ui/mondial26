-- Mondial 26 — Renforcement sécurité & race conditions
-- À exécuter dans Supabase Studio > SQL Editor
--
-- Cette migration corrige plusieurs problèmes :
--   1. quiz_questions était lisible par tout client (clé anon) → les réponses
--      correctes étaient publiques. On bloque la lecture côté client : tout
--      passe par /api/quiz/start (service_role).
--   2. profiles autorisait l'insert anonyme (auth.uid() is null), ce qui
--      permettait à un bot de spammer la table. On bloque : tous les profils
--      sont créés par /api/quiz/submit ou /api/profile/pseudo en service_role.
--   3. Les updates de coins étaient des read-modify-write non atomiques.
--      Deux requêtes concurrentes (deux achats simultanés, ou achat + quiz)
--      pouvaient écraser le solde et permettre un double-spend.
--      On expose des fonctions RPC atomiques utilisables côté serveur.

-- ============================================================
-- 1. Bloquer la lecture publique de quiz_questions
-- ============================================================
drop policy if exists "questions read active" on public.quiz_questions;
-- Plus aucune policy → tout bloqué côté client. Les serveurs lisent en service_role.

-- ============================================================
-- 2. Bloquer l'insert anonyme dans profiles
-- ============================================================
drop policy if exists "profiles insert own" on public.profiles;
-- On garde uniquement l'insert via service_role (pas de policy = bloqué côté client).
-- Les pseudos anonymes passent par /api/profile/pseudo et /api/quiz/submit.

-- ============================================================
-- 3. RPC atomique : créditer des Buts (quiz submit, claim achievements…)
-- ============================================================
create or replace function public.credit_coins(
  p_profile_id uuid,
  p_coins_delta int,
  p_points_delta int default 0,
  p_earned_delta int default 0
) returns table (
  coins int,
  points_total int,
  coins_earned_total int
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_coins_delta < 0 then
    raise exception 'credit_coins ne peut pas créditer un montant négatif (utiliser spend_coins)';
  end if;

  update public.profiles
  set
    coins = coins + p_coins_delta,
    points_total = points_total + p_points_delta,
    coins_earned_total = coins_earned_total + greatest(p_earned_delta, 0)
  where id = p_profile_id
  returning
    public.profiles.coins,
    public.profiles.points_total,
    public.profiles.coins_earned_total
  into coins, points_total, coins_earned_total;

  if not found then
    raise exception 'profil introuvable: %', p_profile_id;
  end if;
  return next;
end;
$$;

revoke all on function public.credit_coins(uuid, int, int, int) from public;
grant execute on function public.credit_coins(uuid, int, int, int) to service_role;

-- ============================================================
-- 4. RPC atomique : débiter des Buts (boutique)
--    Renvoie le nouveau solde si OK, lève une exception 'insufficient_funds' sinon.
-- ============================================================
create or replace function public.spend_coins(
  p_profile_id uuid,
  p_amount int
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_coins int;
begin
  if p_amount < 0 then
    raise exception 'spend_coins ne peut pas débiter un montant négatif';
  end if;

  update public.profiles
  set coins = coins - p_amount
  where id = p_profile_id and coins >= p_amount
  returning coins into v_new_coins;

  if not found then
    raise exception 'insufficient_funds';
  end if;

  return v_new_coins;
end;
$$;

revoke all on function public.spend_coins(uuid, int) from public;
grant execute on function public.spend_coins(uuid, int) to service_role;

-- ============================================================
-- 5. RPC atomique : incrémenter un compteur générique (article_clicks…)
--    Évite le pattern read-modify-write côté serveur pour les compteurs simples.
-- ============================================================
create or replace function public.increment_profile_counter(
  p_profile_id uuid,
  p_column text,
  p_delta int default 1
) returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_new_value int;
  v_sql text;
begin
  if p_column not in ('article_clicks') then
    raise exception 'colonne non incrémentable: %', p_column;
  end if;
  if p_delta < 0 then
    raise exception 'delta négatif non autorisé';
  end if;

  v_sql := format(
    'update public.profiles set %I = %I + $1 where id = $2 returning %I',
    p_column, p_column, p_column
  );
  execute v_sql into v_new_value using p_delta, p_profile_id;

  if v_new_value is null then
    raise exception 'profil introuvable: %', p_profile_id;
  end if;
  return v_new_value;
end;
$$;

revoke all on function public.increment_profile_counter(uuid, text, int) from public;
grant execute on function public.increment_profile_counter(uuid, text, int) to service_role;

-- ============================================================
-- 6. RPC : récupérer en 1 seul aller-retour tous les compteurs nécessaires
--    au check des succès. Évite 3 SELECT côté serveur (profile + sessions + inventory).
-- ============================================================
create or replace function public.get_achievement_counters(
  p_profile_id uuid
) returns table (
  best_score int,
  games_played int,
  points_total int,
  coins int,
  coins_earned_total int,
  article_clicks int,
  frames_owned int,
  badges_owned int,
  banners_owned int,
  icons_owned int,
  favorite_team text,
  avatar_url text,
  bio text
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce((
      select max(score) from public.quiz_sessions where profile_id = p_profile_id
    ), 0)::int as best_score,
    coalesce((
      select count(*) from public.quiz_sessions where profile_id = p_profile_id
    ), 0)::int as games_played,
    coalesce(p.points_total, 0) as points_total,
    coalesce(p.coins, 0) as coins,
    coalesce(p.coins_earned_total, 0) as coins_earned_total,
    coalesce(p.article_clicks, 0) as article_clicks,
    coalesce((
      select count(*)::int from public.user_inventory
      where profile_id = p_profile_id and item_type = 'frame'
    ), 0) as frames_owned,
    coalesce((
      select count(*)::int from public.user_inventory
      where profile_id = p_profile_id and item_type = 'badge'
    ), 0) as badges_owned,
    coalesce((
      select count(*)::int from public.user_inventory
      where profile_id = p_profile_id and item_type = 'banner'
    ), 0) as banners_owned,
    coalesce((
      select count(*)::int from public.user_inventory
      where profile_id = p_profile_id and item_type = 'icon'
    ), 0) as icons_owned,
    p.favorite_team,
    p.avatar_url,
    p.bio
  from public.profiles p
  where p.id = p_profile_id;
$$;

revoke all on function public.get_achievement_counters(uuid) from public;
grant execute on function public.get_achievement_counters(uuid) to service_role;
