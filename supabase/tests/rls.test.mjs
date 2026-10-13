// =============================================================================
// Database tests: applies both migrations to an in-memory Postgres (PGlite) and checks that
// the security rules hold: RLS, role protection, listing moderation, hidden seller contact
// columns, report/saved-search limits and storage policies.
//
//   npm run test:db
//
// Supabase's own `auth` and `storage` schemas are stubbed below, so no running Supabase
// instance is needed. These tests cannot replace testing against your real project.
// =============================================================================
import { PGlite } from '@electric-sql/pglite';
import { pg_trgm } from '@electric-sql/pglite/contrib/pg_trgm';
import fs from 'node:fs';

const db = await new PGlite({ extensions: { pg_trgm } });

// ---- Stubs for the parts of Supabase that exist before our migrations run ----
await db.exec(`
  create role anon nologin; create role authenticated nologin;
  create schema extensions;
  create schema auth;
  create table auth.users (id uuid primary key default gen_random_uuid(), raw_user_meta_data jsonb, phone text);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create schema storage;
  create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
  create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text, name text);
  alter table storage.objects enable row level security;
  create function storage.foldername(name text) returns text[] language sql as $$ select (string_to_array(name, '/'))[1:array_length(string_to_array(name,'/'),1)-1] $$;
  grant usage on schema public, auth, storage to anon, authenticated;
  alter default privileges in schema public grant all on tables to anon, authenticated;
  alter default privileges in schema public grant all on functions to anon, authenticated;
  grant select on all tables in schema storage to anon; grant all on all tables in schema storage to authenticated;
`);

let failures = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${extra ? '  -> ' + extra : ''}`); if (!cond) failures++; };
const fails = async (sql) => { try { await db.exec(sql); return null; } catch (e) { return e.message; } };
const as = async (role, uid) => {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid ?? ''}', false);`);
  if (role !== 'postgres') await db.exec(`set role ${role}`);
};

for (const f of ['001_initial_schema.sql', '002_marketplace_dashboard.sql']) {
  const err = await fails(fs.readFileSync(new URL(`../migrations/${f}`, import.meta.url), 'utf8'));
  ok(`migration ${f} applies`, err === null, err ?? '');
  if (err) process.exit(1);
}

const U1 = '11111111-1111-1111-1111-111111111111', U2 = '22222222-2222-2222-2222-222222222222', ADMIN = '99999999-9999-9999-9999-999999999999';
await db.exec(`insert into auth.users (id, raw_user_meta_data, phone) values
  ('${U1}', '{"full_name":"Seller One","locale":"hi"}', '+919876543210'),
  ('${U2}', '{"full_name":"Buyer Two","locale":"xx"}', null),
  ('${ADMIN}', '{}', null);`);
let r = await db.query(`select id, full_name, preferred_locale, role from public.profiles order by id`);
ok('signup trigger creates 3 profiles', r.rows.length === 3);
ok('locale metadata respected, invalid locale falls back to hi', r.rows[0].preferred_locale === 'hi' && r.rows[1].preferred_locale === 'hi');
await db.exec(`update public.profiles set role = 'admin' where id = '${ADMIN}'`);

// --- profiles: privilege escalation ---
await as('authenticated', U1);
ok('user cannot promote self to admin', (await fails(`update public.profiles set role = 'admin' where id = '${U1}'`))?.includes('administrator'));
ok('user cannot read other profiles', (await db.query(`select id from public.profiles`)).rows.length === 1);

// --- land_records: public read, admin-only write ---
await as('postgres');
await db.exec(`insert into public.land_records (district,tehsil,village,khasra_number,khewat_number,owner_name,area,area_unit,land_type,jamabandi_year)
  values ('Shimla','Theog','Sample Village A','123/4','56','Demo Owner One',2.4,'bigha','orchard',2022),
         ('Kullu','Manali','Sample Village C','88','30','Demo Owner Four',3,'kanal','orchard',2021)`);
await as('anon');
ok('anon can read land_records', (await db.query(`select id from public.land_records`)).rows.length === 2);
ok('anon cannot insert land_records', !!(await fails(`insert into public.land_records (district,tehsil,village,khasra_number,owner_name,area,jamabandi_year) values ('a','b','c','d','e',1,2020)`)));
await as('authenticated', U1);
ok('non-admin cannot insert land_records (RLS)', !!(await fails(`insert into public.land_records (district,tehsil,village,khasra_number,owner_name,area,jamabandi_year) values ('a','b','c','d','e',1,2020)`)));
await as('authenticated', ADMIN);
ok('admin can insert land_records', (await fails(`insert into public.land_records (district,tehsil,village,khasra_number,owner_name,area,jamabandi_year) values ('Una','Una','V','9','O',1,2020)`)) === null);
ok('unique entry index blocks duplicates', !!(await fails(`insert into public.land_records (district,tehsil,village,khasra_number,owner_name,area,jamabandi_year) values ('Una','Una','V','9','O2',1,2020)`)));
await as('anon');
r = await db.query(`select * from public.search_land_records(p_district => 'Shimla', p_owner => 'owner one')`);
ok('search_land_records filters + ilike', r.rows.length === 1 && r.rows[0].khasra_number === '123/4');

// --- listings ---
await as('authenticated', U1);
const listing = (extra = '') => `insert into public.listings (seller_id,title,district,tehsil,village,price,area,area_unit,land_type,contact_name,contact_phone,status ${extra ? ',' + extra.split('=')[0] : ''})
  values ('${U1}','Apple orchard near Theog','Shimla','Theog','Sample Village A',4800000,2.4,'bigha','orchard','Seller One','+919876543210','pending_review' ${extra ? ',' + extra.split('=')[1] : ''})`;
ok('seller can create pending_review listing', (await fails(listing())) === null);
ok('seller cannot create an already-active listing', !!(await fails(listing().replace("'pending_review'", "'active'"))));
ok('seller cannot self-verify on insert', !!(await fails(listing('is_verified=true'))));
ok('seller cannot self-activate via update', !!(await fails(`update public.listings set status = 'active' where seller_id = '${U1}'`)) || (await db.query(`select status from public.listings`)).rows[0].status !== 'active');
ok('seller cannot self-verify via update', !!(await fails(`update public.listings set is_verified = true where seller_id = '${U1}'`)));
ok('seller CAN mark own listing withdrawn', (await fails(`update public.listings set status = 'withdrawn' where seller_id = '${U1}'`)) === null);
await db.exec(`update public.listings set status = 'pending_review' where seller_id = '${U1}'`);

await as('authenticated', ADMIN);
ok('admin can activate + verify a listing', (await fails(`update public.listings set status = 'active', is_verified = true`)) === null);

const PUBLIC_COLS = 'id, title, price, status, is_verified';
await as('anon');
ok('anon can read active listing (public columns)', (await db.query(`select ${PUBLIC_COLS} from public.listings`)).rows.length === 1);
ok('anon CANNOT select contact_phone', (await fails(`select contact_phone from public.listings`))?.includes('permission denied') === true);
ok('anon CANNOT select contact_name', (await fails(`select contact_name from public.listings`))?.includes('permission denied') === true);
ok('anon "select *" is refused (app always lists columns)', (await fails(`select * from public.listings`))?.includes('permission denied') === true);
await as('authenticated', U2);
r = await db.query(`select contact_name, contact_phone from public.listings`);
ok('logged-in user CAN read seller contact', r.rows.length === 1 && r.rows[0].contact_phone === '+919876543210');

await as('authenticated', ADMIN);
await db.exec(`update public.listings set status = 'withdrawn'`);
await as('anon');
ok('withdrawn listings are hidden from anon', (await db.query(`select id from public.listings`)).rows.length === 0);
await as('authenticated', U1);
ok('seller still sees own withdrawn listing', (await db.query(`select id from public.listings`)).rows.length === 1);
await as('authenticated', U2);
ok('other user does not see it', (await db.query(`select id from public.listings`)).rows.length === 0);

// --- reports ---
await as('authenticated', U1);
ok('user can request own report', (await fails(`insert into public.reports (user_id,title,status,payment_status) values ('${U1}','t','pending','unpaid')`)) === null);
ok('user cannot insert a "completed"/paid report', !!(await fails(`insert into public.reports (user_id,title,status,payment_status) values ('${U1}','t','completed','paid')`)));
ok('user cannot insert a report for someone else', !!(await fails(`insert into public.reports (user_id,title) values ('${U2}','t')`)));
await db.exec(`update public.reports set status='completed'`);
ok('user cannot update reports (no policy)', (await db.query(`select status from public.reports`)).rows[0].status === 'pending');
await as('authenticated', U2);
ok('other user cannot read it', (await db.query(`select id from public.reports`)).rows.length === 0);

// --- saved_searches ---
await as('authenticated', U1);
for (let i = 1; i <= 25; i++) await db.exec(`insert into public.saved_searches (user_id,name,params) values ('${U1}','s${i}','{"district":"Shimla"}')`);
ok('25 saved searches allowed', (await db.query(`select count(*)::int c from public.saved_searches`)).rows[0].c === 25);
const limitErr = await fails(`insert into public.saved_searches (user_id,name) values ('${U1}','s26')`);
ok('26th saved search rejected (P0001 trigger)', limitErr?.includes('25 saved searches') === true, limitErr ?? '');
ok('cannot save a search for someone else', !!(await fails(`insert into public.saved_searches (user_id,name) values ('${U2}','x')`)));
await as('authenticated', U2);
ok('other users cannot see saved searches', (await db.query(`select id from public.saved_searches`)).rows.length === 0);
await as('authenticated', U1);
await db.exec(`delete from public.saved_searches where name = 's1'`);
ok('owner can delete a saved search', (await db.query(`select count(*)::int c from public.saved_searches`)).rows[0].c === 24);

// --- storage buckets / policies exist ---
await as('postgres');
r = await db.query(`select id, public from storage.buckets order by id`);
ok('storage buckets created', r.rows.length === 2 && r.rows[0].id === 'listing-images' && r.rows[0].public === true && r.rows[1].public === false);
r = await db.query(`select count(*)::int c from pg_policies where schemaname='storage'`);
ok('storage policies created', r.rows[0].c === 6, `count=${r.rows[0].c}`);
await as('authenticated', U1);
ok('user can upload into own folder', (await fails(`insert into storage.objects (bucket_id,name) values ('listing-images','${U1}/a.jpg')`)) === null);
ok('user cannot upload into another user folder', !!(await fails(`insert into storage.objects (bucket_id,name) values ('listing-images','${U2}/a.jpg')`)));
ok('user cannot write report-files', !!(await fails(`insert into storage.objects (bucket_id,name) values ('report-files','${U1}/r.pdf')`)));

console.log(failures === 0 ? '\nALL SQL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
