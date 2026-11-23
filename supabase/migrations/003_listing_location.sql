-- =============================================================================
-- HimLand Check: listing location, plot details and privacy
-- Migration: 003_listing_location.sql
--
--   1. Village code (BhuNaksha), khasra / khewat / khatauni, pin source
--   2. Exact pin (latitude, longitude) visible to logged-in users only
--   3. Public pin (public_latitude, public_longitude) about 100 m away, set by a trigger
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. New columns
-- -----------------------------------------------------------------------------
alter table public.listings
  add column gis_code        text
    check (gis_code is null or gis_code ~ '^[0-9]{10}$'),
  add column khasra          text
    check (khasra is null or char_length(khasra) <= 100),
  add column khewat          text
    check (khewat is null or char_length(khewat) <= 100),
  add column khatauni        text
    check (khatauni is null or char_length(khatauni) <= 100),
  -- How the pin was set: 'pin' (placed by the seller), 'plot' (centre of the plot found
  -- in BhuNaksha) or 'village' (fallback: centre of the village).
  add column location_source text
    check (location_source is null or location_source in ('pin', 'plot', 'village')),
  add column public_latitude  numeric(9, 6)
    check (public_latitude is null or public_latitude between -90 and 90),
  add column public_longitude numeric(9, 6)
    check (public_longitude is null or public_longitude between -180 and 180);

comment on column public.listings.gis_code is 'BhuNaksha code: district (2) + tehsil (2) + village (6).';
comment on column public.listings.latitude is 'Exact pin. Readable by logged-in users only.';
comment on column public.listings.public_latitude is 'Pin moved about 70-100 m in a random direction. Shown to logged-out visitors.';

create index listings_gis_code_idx on public.listings (gis_code) where status = 'active';

-- -----------------------------------------------------------------------------
-- 2. public_latitude / public_longitude are maintained by the database only
-- -----------------------------------------------------------------------------
-- The offset is chosen once, when the exact pin is set or moved, and then stored. It
-- never changes between requests, so repeated page loads cannot be averaged to find the
-- real point. Whatever a client sends for the public_* columns is ignored.
create or replace function public.set_listing_public_location()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  distance_m double precision;
  bearing    double precision;
begin
  if new.latitude is null or new.longitude is null then
    new.public_latitude := null;
    new.public_longitude := null;
    return new;
  end if;

  if tg_op = 'UPDATE'
     and new.latitude is not distinct from old.latitude
     and new.longitude is not distinct from old.longitude
     and old.public_latitude is not null then
    new.public_latitude := old.public_latitude;
    new.public_longitude := old.public_longitude;
    return new;
  end if;

  distance_m := 70 + random() * 30;           -- between 70 m and 100 m away
  bearing := random() * 2 * pi();
  new.public_latitude := round(
    (new.latitude::double precision + distance_m * cos(bearing) / 111320.0)::numeric, 6);
  new.public_longitude := round(
    (new.longitude::double precision
      + distance_m * sin(bearing) / (111320.0 * cos(radians(new.latitude::double precision))))::numeric, 6);
  return new;
end;
$$;

create trigger set_listing_public_location
  before insert or update on public.listings
  for each row execute function public.set_listing_public_location();

-- Give any listing that already has a pin its public position.
update public.listings set latitude = latitude where latitude is not null;

-- -----------------------------------------------------------------------------
-- 3. Column privileges for logged-out visitors
-- -----------------------------------------------------------------------------
-- Logged-out visitors get the village code and the offset pin only. The exact pin and
-- the plot numbers (khasra / khewat / khatauni, which would reveal the exact plot) stay
-- with logged-in users, like the seller contact details.
revoke select (latitude, longitude) on public.listings from anon;

grant select (
  gis_code,
  location_source,
  public_latitude,
  public_longitude
) on public.listings to anon;
