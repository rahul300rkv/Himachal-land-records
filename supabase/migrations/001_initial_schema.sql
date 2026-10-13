-- =============================================================================
-- Himachal Land Records: initial schema
-- Migration: 001_initial_schema.sql
--
-- Contents
--   1. Extensions
--   2. Enum types
--   3. Helper functions (updated_at trigger, is_admin)
--   4. Tables: profiles, land_records, mutations, listings, reports
--   5. Indexes
--   6. Triggers (updated_at, new-user profile, privilege protection)
--   7. Row Level Security policies
--   8. Search RPC
--   9. Storage buckets + policies
--
-- NOTE: Data stored here is for general reference only. It is NOT an official
-- or certified land record. See the legal disclaimer in the application.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Extensions
-- -----------------------------------------------------------------------------
-- Trigram index for fuzzy owner-name / khasra search.
create extension if not exists pg_trgm with schema extensions;


-- -----------------------------------------------------------------------------
-- 2. Enum types
-- -----------------------------------------------------------------------------
create type public.user_role as enum ('user', 'agent', 'admin');

-- Units seen in Himachal records: bigha-biswa-biswansi (traditional),
-- kanal-marla, and metric (hectare / sq m).
create type public.area_unit as enum ('sq_m', 'hectare', 'bigha', 'biswa', 'kanal', 'marla', 'acre');

create type public.land_type as enum (
  'irrigated',
  'unirrigated',
  'orchard',
  'residential',
  'commercial',
  'forest',
  'pasture',
  'barren',
  'other'
);

create type public.mutation_type as enum (
  'sale',
  'inheritance',
  'gift',
  'partition',
  'lease',
  'mortgage',
  'court_order',
  'other'
);

create type public.mutation_status as enum ('pending', 'attested', 'rejected');

create type public.listing_status as enum (
  'draft',
  'pending_review',
  'active',
  'sold',
  'withdrawn',
  'rejected',
  'expired'
);

create type public.report_type as enum (
  'pre_purchase',
  'ownership_history',
  'encumbrance',
  'mutation_summary'
);

create type public.report_status as enum ('pending', 'processing', 'completed', 'failed');
create type public.risk_level as enum ('low', 'medium', 'high', 'unknown');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded');


-- -----------------------------------------------------------------------------
-- 3. Helper functions
-- -----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- -----------------------------------------------------------------------------
-- 4a. profiles (1:1 with auth.users)
-- -----------------------------------------------------------------------------
create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  full_name        text,
  phone            text,
  role             public.user_role not null default 'user',
  preferred_locale text not null default 'hi' check (preferred_locale in ('en', 'hi')),
  avatar_url       text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.profiles is 'Application profile for each authenticated user.';

-- is_admin() is SECURITY DEFINER so policies can call it without recursing into
-- the RLS policies of public.profiles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;


-- -----------------------------------------------------------------------------
-- 4b. land_records
-- -----------------------------------------------------------------------------
create table public.land_records (
  id              uuid primary key default gen_random_uuid(),

  -- Location hierarchy (canonical English names; Hindi names live in the app).
  district        text not null,
  tehsil          text not null,
  village         text not null,

  -- Record identifiers
  khasra_number   text not null,
  khewat_number   text,
  khatauni_number text,

  -- Ownership
  owner_name      text not null,
  father_name     text,

  -- Area: a single numeric value + unit. Compound jamabandi areas
  -- (e.g. "2-4-5" bigha-biswa-biswansi) are kept verbatim in raw_data.
  area            numeric(14, 4) not null check (area >= 0),
  area_unit       public.area_unit not null default 'sq_m',
  land_type       public.land_type not null default 'other',
  jamabandi_year  integer not null check (jamabandi_year between 1800 and 2200),

  -- Everything else from the source (shares, remarks, cultivation, etc.)
  raw_data        jsonb not null default '{}'::jsonb,
  -- GeoJSON Feature / FeatureCollection for the plot or village map
  map_geojson     jsonb,

  source          text,
  is_verified     boolean not null default false,
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.land_records is 'Searchable land record entries. For general reference only; not an official record.';
comment on column public.land_records.raw_data is 'Original/unstructured fields from the source record.';
comment on column public.land_records.map_geojson is 'GeoJSON geometry for the plot or village map.';


-- -----------------------------------------------------------------------------
-- 4c. mutations (intkal)
-- -----------------------------------------------------------------------------
create table public.mutations (
  id               uuid primary key default gen_random_uuid(),
  land_record_id   uuid not null references public.land_records (id) on delete cascade,
  mutation_number  text not null,
  mutation_type    public.mutation_type not null default 'other',
  mutation_date    date,
  status           public.mutation_status not null default 'pending',
  previous_owner   text,
  new_owner        text,
  area_affected    numeric(14, 4) check (area_affected is null or area_affected >= 0),
  area_unit        public.area_unit not null default 'sq_m',
  remarks          text,
  raw_data         jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.mutations is 'Mutation (intkal) history for a land record.';


-- -----------------------------------------------------------------------------
-- 4d. listings (marketplace)
-- -----------------------------------------------------------------------------
create table public.listings (
  id               uuid primary key default gen_random_uuid(),
  seller_id        uuid not null references public.profiles (id) on delete cascade,
  land_record_id   uuid references public.land_records (id) on delete set null,

  title            text not null check (char_length(title) between 5 and 200),
  description      text,

  district         text not null,
  tehsil           text not null,
  village          text not null,

  price            numeric(14, 2) not null check (price > 0),
  price_negotiable boolean not null default true,
  area             numeric(14, 4) not null check (area > 0),
  area_unit        public.area_unit not null default 'bigha',
  land_type        public.land_type not null default 'other',

  contact_name     text,
  contact_phone    text,
  -- Storage object paths inside the public `listing-images` bucket
  images           text[] not null default '{}',
  latitude         numeric(9, 6) check (latitude is null or latitude between -90 and 90),
  longitude        numeric(9, 6) check (longitude is null or longitude between -180 and 180),

  status           public.listing_status not null default 'draft',
  is_verified      boolean not null default false,
  is_featured      boolean not null default false,
  expires_at       timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on table public.listings is 'Land marketplace listings posted by third parties. Not verified title.';


-- -----------------------------------------------------------------------------
-- 4e. reports (pre-purchase and other reports)
-- -----------------------------------------------------------------------------
create table public.reports (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  land_record_id    uuid references public.land_records (id) on delete set null,
  listing_id        uuid references public.listings (id) on delete set null,

  report_type       public.report_type not null default 'pre_purchase',
  status            public.report_status not null default 'pending',
  risk_level        public.risk_level,

  title             text not null,
  summary           text,
  -- Structured checks, flags and recommendations produced for the report
  findings          jsonb not null default '{}'::jsonb,
  -- Search inputs used when no land_record_id is attached
  input_params      jsonb not null default '{}'::jsonb,
  -- Path to the generated PDF inside the private `report-files` bucket
  file_path         text,

  payment_status    public.payment_status not null default 'unpaid',
  amount_paid       numeric(10, 2) check (amount_paid is null or amount_paid >= 0),
  payment_reference text,

  completed_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.reports is 'Informational reports. Not a title opinion or legal advice.';


-- -----------------------------------------------------------------------------
-- 5. Indexes
-- -----------------------------------------------------------------------------
-- land_records: location drill-down and identifier lookups
create index land_records_location_idx
  on public.land_records (district, tehsil, village);

create index land_records_khasra_idx
  on public.land_records (district, tehsil, village, khasra_number);

create index land_records_khewat_idx
  on public.land_records (district, tehsil, village, khewat_number)
  where khewat_number is not null;

create index land_records_khatauni_idx
  on public.land_records (district, tehsil, village, khatauni_number)
  where khatauni_number is not null;

create index land_records_year_idx
  on public.land_records (jamabandi_year desc);

-- Fuzzy / partial owner-name search (ILIKE '%ram%')
create index land_records_owner_trgm_idx
  on public.land_records using gin (owner_name extensions.gin_trgm_ops);

create index land_records_raw_data_idx
  on public.land_records using gin (raw_data jsonb_path_ops);

-- One row per (plot, khewat, year). coalesce() makes NULL khewat comparable.
create unique index land_records_unique_entry_idx
  on public.land_records (
    district, tehsil, village, khasra_number, coalesce(khewat_number, ''), jamabandi_year
  );

-- mutations
create index mutations_land_record_idx on public.mutations (land_record_id, mutation_date desc);
create index mutations_number_idx      on public.mutations (mutation_number);

-- listings
create index listings_seller_idx   on public.listings (seller_id);
create index listings_status_idx   on public.listings (status, created_at desc);
create index listings_location_idx on public.listings (district, tehsil, village);
create index listings_record_idx   on public.listings (land_record_id) where land_record_id is not null;

-- reports
create index reports_user_idx   on public.reports (user_id, created_at desc);
create index reports_record_idx on public.reports (land_record_id) where land_record_id is not null;


-- -----------------------------------------------------------------------------
-- 6. Triggers
-- -----------------------------------------------------------------------------
create trigger set_profiles_updated_at     before update on public.profiles     for each row execute function public.set_updated_at();
create trigger set_land_records_updated_at before update on public.land_records for each row execute function public.set_updated_at();
create trigger set_mutations_updated_at    before update on public.mutations    for each row execute function public.set_updated_at();
create trigger set_listings_updated_at     before update on public.listings     for each row execute function public.set_updated_at();
create trigger set_reports_updated_at      before update on public.reports      for each row execute function public.set_updated_at();

-- Create a profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone, preferred_locale)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.phone, ''),
    case
      when new.raw_user_meta_data ->> 'locale' in ('en', 'hi') then new.raw_user_meta_data ->> 'locale'
      else 'hi'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Users must not be able to promote themselves to admin.
-- auth.uid() is NULL for the service role / SQL editor, which are allowed.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only an administrator can change a role.' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_profile_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Sellers must not be able to mark their own listing as verified / featured.
create or replace function public.protect_listing_flags()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (new.is_verified is distinct from old.is_verified
      or new.is_featured is distinct from old.is_featured)
     and (select auth.uid()) is not null
     and not public.is_admin() then
    raise exception 'Only an administrator can change verification or featured flags.' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger protect_listing_flags
  before update on public.listings
  for each row execute function public.protect_listing_flags();


-- -----------------------------------------------------------------------------
-- 7. Row Level Security
-- -----------------------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.land_records enable row level security;
alter table public.mutations    enable row level security;
alter table public.listings     enable row level security;
alter table public.reports      enable row level security;

-- profiles ---------------------------------------------------------------------
create policy "profiles: read own or admin"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy "profiles: update own"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles: admin update any"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- land_records: public read, admin-only write ------------------------------------
-- Tighten the SELECT policy to `authenticated` if you want search behind login.
create policy "land_records: public read"
  on public.land_records for select
  to anon, authenticated
  using (true);

create policy "land_records: admin insert"
  on public.land_records for insert
  to authenticated
  with check (public.is_admin());

create policy "land_records: admin update"
  on public.land_records for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "land_records: admin delete"
  on public.land_records for delete
  to authenticated
  using (public.is_admin());

-- mutations: public read, admin-only write ---------------------------------------
create policy "mutations: public read"
  on public.mutations for select
  to anon, authenticated
  using (true);

create policy "mutations: admin insert"
  on public.mutations for insert
  to authenticated
  with check (public.is_admin());

create policy "mutations: admin update"
  on public.mutations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "mutations: admin delete"
  on public.mutations for delete
  to authenticated
  using (public.is_admin());

-- listings -----------------------------------------------------------------------
create policy "listings: read active, own or admin"
  on public.listings for select
  to anon, authenticated
  using (
    status = 'active'
    or seller_id = (select auth.uid())
    or public.is_admin()
  );

create policy "listings: sellers insert own"
  on public.listings for insert
  to authenticated
  with check (
    seller_id = (select auth.uid())
    and status in ('draft', 'pending_review')
    and is_verified = false
    and is_featured = false
  );

-- Sellers may edit their listing and move it between draft / pending_review /
-- sold / withdrawn. Only admins can set `active`, `rejected` or `expired`.
create policy "listings: sellers update own"
  on public.listings for update
  to authenticated
  using (seller_id = (select auth.uid()))
  with check (
    seller_id = (select auth.uid())
    and status in ('draft', 'pending_review', 'sold', 'withdrawn')
  );

create policy "listings: admin update any"
  on public.listings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "listings: sellers delete own"
  on public.listings for delete
  to authenticated
  using (seller_id = (select auth.uid()) or public.is_admin());

-- reports ------------------------------------------------------------------------
create policy "reports: read own or admin"
  on public.reports for select
  to authenticated
  using (user_id = (select auth.uid()) or public.is_admin());

create policy "reports: users request own"
  on public.reports for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and payment_status = 'unpaid'
    and file_path is null
  );

-- Reports are generated/updated by admins or the server (service role).
create policy "reports: admin update"
  on public.reports for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "reports: admin delete"
  on public.reports for delete
  to authenticated
  using (public.is_admin());


-- -----------------------------------------------------------------------------
-- 8. Search RPC
-- -----------------------------------------------------------------------------
-- SECURITY INVOKER (default): RLS of the caller applies.
create or replace function public.search_land_records(
  p_district  text    default null,
  p_tehsil    text    default null,
  p_village   text    default null,
  p_khasra    text    default null,
  p_khewat    text    default null,
  p_khatauni  text    default null,
  p_owner     text    default null,
  p_year      integer default null,
  p_limit     integer default 20,
  p_offset    integer default 0
)
returns setof public.land_records
language sql
stable
set search_path = ''
as $$
  select lr.*
  from public.land_records lr
  where (p_district is null or lr.district = p_district)
    and (p_tehsil   is null or lr.tehsil   = p_tehsil)
    and (p_village  is null or lr.village  = p_village)
    and (p_khasra   is null or lr.khasra_number   = p_khasra)
    and (p_khewat   is null or lr.khewat_number   = p_khewat)
    and (p_khatauni is null or lr.khatauni_number = p_khatauni)
    and (p_owner    is null or lr.owner_name ilike '%' || p_owner || '%')
    and (p_year     is null or lr.jamabandi_year = p_year)
  order by lr.jamabandi_year desc, lr.village, lr.khasra_number
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;


-- -----------------------------------------------------------------------------
-- 9. Storage
-- -----------------------------------------------------------------------------
-- listing-images: public bucket. Files are stored under "<user_id>/<file>".
-- report-files:   private bucket. Files are stored under "<user_id>/<file>".
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('listing-images', 'listing-images', true,  5 * 1024 * 1024,  array['image/jpeg', 'image/png', 'image/webp']),
  ('report-files',   'report-files',   false, 20 * 1024 * 1024, array['application/pdf'])
on conflict (id) do nothing;

create policy "listing-images: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'listing-images');

create policy "listing-images: upload to own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "listing-images: update own files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "listing-images: delete own files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-images'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin())
  );

create policy "report-files: read own or admin"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'report-files'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin())
  );

-- Report PDFs are written by admins / the server (service role bypasses RLS).
create policy "report-files: admin write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'report-files' and public.is_admin())
  with check (bucket_id = 'report-files' and public.is_admin());
