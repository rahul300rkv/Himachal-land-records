-- =============================================================================
-- HimLand Check: marketplace privacy + dashboard
-- Migration: 002_marketplace_dashboard.sql
--
--   1. saved_searches (dashboard "Saved searches")
--   2. Hide seller contact details from anonymous (logged-out) visitors
--   3. Marketplace query indexes
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. saved_searches
-- -----------------------------------------------------------------------------
create table public.saved_searches (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  name       text not null check (char_length(name) between 1 and 200),
  -- The /search query string as key/value pairs, e.g. {"district":"Shimla","tehsil":"Theog"}
  params     jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

comment on table public.saved_searches is 'Searches a user saved from the search page.';

create index saved_searches_user_idx on public.saved_searches (user_id, created_at desc);

-- Keep each user to a sensible number of saved searches.
create or replace function public.limit_saved_searches()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.saved_searches s where s.user_id = new.user_id) >= 25 then
    raise exception 'You can keep up to 25 saved searches.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger limit_saved_searches
  before insert on public.saved_searches
  for each row execute function public.limit_saved_searches();

alter table public.saved_searches enable row level security;

create policy "saved_searches: read own"
  on public.saved_searches for select
  to authenticated
  using (user_id = (select auth.uid()));

create policy "saved_searches: insert own"
  on public.saved_searches for insert
  to authenticated
  with check (user_id = (select auth.uid()));

create policy "saved_searches: delete own"
  on public.saved_searches for delete
  to authenticated
  using (user_id = (select auth.uid()));


-- -----------------------------------------------------------------------------
-- 2. Seller contact details are for logged-in users only
-- -----------------------------------------------------------------------------
-- Anonymous visitors (the public API key without a session) may read active listings,
-- but NOT contact_name / contact_phone. Column-level privileges enforce this in the
-- database, so it cannot be bypassed by calling the API directly.
--
--   * The app always selects explicit columns for listings (never `select *`).
--   * If you add a column to public.listings that logged-out visitors should see,
--     grant it too:  grant select (new_column) on public.listings to anon;
revoke select on public.listings from anon;

grant select (
  id,
  seller_id,
  land_record_id,
  title,
  description,
  district,
  tehsil,
  village,
  price,
  price_negotiable,
  area,
  area_unit,
  land_type,
  images,
  latitude,
  longitude,
  status,
  is_verified,
  is_featured,
  expires_at,
  created_at,
  updated_at
) on public.listings to anon;


-- -----------------------------------------------------------------------------
-- 3. Marketplace indexes
-- -----------------------------------------------------------------------------
create index listings_price_idx on public.listings (price) where status = 'active';
create index listings_land_type_idx on public.listings (land_type) where status = 'active';
