-- Mondial 26 — Fix RPC credit_coins
--
-- La version dans 0008 utilisait des OUT parameters portant le même nom que
-- les colonnes (`coins`, `points_total`, `coins_earned_total`). Quand la
-- clause `RETURNING ... INTO` est utilisée, PostgreSQL ne sait plus si
-- `coins` désigne la colonne de profiles ou l'OUT param → erreur :
--   « column reference "coins" is ambiguous ».
--
-- Fix : on alias la table (`p.coins`) et on utilise `RETURN QUERY` pour
-- garder les mêmes noms de colonnes en sortie (l'API JS ne change pas).

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
declare
  v_count int;
begin
  if p_coins_delta < 0 then
    raise exception 'credit_coins ne peut pas créditer un montant négatif (utiliser spend_coins)';
  end if;

  return query
  update public.profiles as p
  set
    coins = p.coins + p_coins_delta,
    points_total = p.points_total + p_points_delta,
    coins_earned_total = p.coins_earned_total + greatest(p_earned_delta, 0)
  where p.id = p_profile_id
  returning p.coins, p.points_total, p.coins_earned_total;

  get diagnostics v_count = row_count;
  if v_count = 0 then
    raise exception 'profil introuvable: %', p_profile_id;
  end if;
end;
$$;

revoke all on function public.credit_coins(uuid, int, int, int) from public;
grant execute on function public.credit_coins(uuid, int, int, int) to service_role;
