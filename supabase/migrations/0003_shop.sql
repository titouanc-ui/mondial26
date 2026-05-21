-- Mondial 26 — Boutique
-- Inventaire d'objets cosmétiques + slots "équipé" sur profiles
-- À exécuter dans Supabase Studio > SQL Editor

-- ============================================================
-- 1. Slots "équipé" sur profiles
-- ============================================================
alter table public.profiles
  add column if not exists equipped_banner text,
  add column if not exists equipped_frame text,
  add column if not exists equipped_badge text,
  add column if not exists equipped_icon text;

-- ============================================================
-- 2. Inventaire (objets possédés par un profil)
-- ============================================================
create table if not exists public.user_inventory (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  item_id text not null,
  item_type text not null check (item_type in ('banner', 'frame', 'badge', 'icon')),
  acquired_at timestamptz not null default now(),
  primary key (profile_id, item_id)
);

create index if not exists idx_inventory_profile on public.user_inventory(profile_id);

-- ============================================================
-- 3. RLS : un user voit/lit son propre inventaire
--    Toute écriture passe par l'API (service_role), donc pas de policy insert/update.
-- ============================================================
alter table public.user_inventory enable row level security;

drop policy if exists "inventory read own" on public.user_inventory;
create policy "inventory read own" on public.user_inventory
  for select using (
    profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  );

-- ============================================================
-- 4. Étend la protection anti-triche aux slots equipped
--    (un user ne peut pas s'auto-équiper un item qu'il ne possède pas
--     en modifiant son profil directement)
-- ============================================================
create or replace function public.protect_profile_columns() returns trigger as $$
begin
  if auth.role() = 'authenticated' then
    if new.coins is distinct from old.coins then
      raise exception 'coins est en lecture seule côté client';
    end if;
    if new.points_total is distinct from old.points_total then
      raise exception 'points_total est en lecture seule côté client';
    end if;
    if new.equipped_banner is distinct from old.equipped_banner then
      raise exception 'equipped_banner doit passer par /api/shop/equip';
    end if;
    if new.equipped_frame is distinct from old.equipped_frame then
      raise exception 'equipped_frame doit passer par /api/shop/equip';
    end if;
    if new.equipped_badge is distinct from old.equipped_badge then
      raise exception 'equipped_badge doit passer par /api/shop/equip';
    end if;
    if new.equipped_icon is distinct from old.equipped_icon then
      raise exception 'equipped_icon doit passer par /api/shop/equip';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;
-- (le trigger existant trg_profiles_protect_columns référence cette fonction)
