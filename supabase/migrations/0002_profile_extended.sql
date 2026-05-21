-- Mondial 26 — Extension du profil joueur
-- Ajoute avatar, équipe favorite, bio, monnaie virtuelle ("Buts")
-- À exécuter dans Supabase Studio > SQL Editor

-- ============================================================
-- 1. Colonnes additionnelles sur profiles
-- ============================================================
alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists favorite_team text check (favorite_team is null or length(favorite_team) between 2 and 3),
  add column if not exists bio text check (bio is null or length(bio) <= 200),
  add column if not exists coins int not null default 0 check (coins >= 0);

-- Note: `points_total` (existant) = score cumulé "lifetime"
--       `coins`        (nouveau)  = monnaie virtuelle dépensable dans la boutique

-- ============================================================
-- 2. Policy : update du propre profil (compte Google)
--    Permet à un user authentifié de modifier son avatar/équipe/bio/pseudo
--    (mais PAS coins ni points_total — ces colonnes sont gérées côté serveur)
-- ============================================================

-- La policy existante "profiles update own" autorise déjà l'update.
-- Pour bloquer la triche sur coins/points_total, on ajoute un trigger qui
-- empêche un user normal de modifier ces colonnes.

create or replace function public.protect_profile_columns() returns trigger as $$
begin
  -- Si la session est authentifiée mais PAS service_role,
  -- on empêche la modification de coins et points_total.
  if auth.role() = 'authenticated' then
    if new.coins is distinct from old.coins then
      raise exception 'coins est en lecture seule côté client';
    end if;
    if new.points_total is distinct from old.points_total then
      raise exception 'points_total est en lecture seule côté client';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_profiles_protect_columns on public.profiles;
create trigger trg_profiles_protect_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ============================================================
-- 3. Storage bucket pour avatars
-- ============================================================

-- Crée le bucket "avatars" public (lecture libre, écriture restreinte par policy)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  2 * 1024 * 1024,  -- 2 Mo max
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policies storage : chaque user ne peut écrire que dans son dossier {auth.uid()}/*
drop policy if exists "avatars public read" on storage.objects;
create policy "avatars public read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars own write" on storage.objects;
create policy "avatars own write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars own update" on storage.objects;
create policy "avatars own update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars own delete" on storage.objects;
create policy "avatars own delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 4. Backfill : crédite 50 "Buts" de bienvenue aux profils existants
--    (seulement ceux à 0 — geste de lancement)
-- ============================================================
update public.profiles
set coins = 50
where coins = 0;
