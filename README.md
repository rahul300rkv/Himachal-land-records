# HimLand Check (`himachal-land-records`)

A private, independent platform to **search, read and check land records in Himachal Pradesh**: jamabandi, khasra, khatauni, khewat, mutations (intkal), maps, shajra nasb (family tree), pre-purchase check reports (PDF) and a land marketplace. Fully bilingual: **Hindi and English**.

> **Legal notice.** This is a private platform. It is **not** a government website and is not affiliated with the Government of Himachal Pradesh or any revenue department. Information shown is for general reference only, is not an official or certified record, and must be verified with the Patwari / Tehsil office before any transaction. A disclaimer is shown on every page (banner above the header, notice in the footer) and a full one on record, listing, report and marketplace pages and at `/disclaimer`.

---

## Contents

1. [What is built](#what-is-built)
2. [Tech stack](#tech-stack)
3. [Quick start (demo mode, 2 minutes)](#quick-start-demo-mode)
4. [Full setup with Supabase](#full-setup-with-supabase)
5. [Deploying to Vercel](#deploying-to-vercel)
6. [Running the business: data, moderation, admins](#running-the-business)
7. [Project structure](#project-structure)
8. [How the main features work](#how-the-main-features-work)
9. [Internationalisation](#internationalisation)
10. [Security and privacy notes](#security-and-privacy-notes)
11. [Scripts and testing](#scripts-and-testing)
12. [Before you launch (checklist)](#before-you-launch)
13. [Troubleshooting](#troubleshooting)

---

## What is built

| Area | Routes / files |
| --- | --- |
| **Homepage**: hero with District -> Tehsil -> Village search, what we do, features, how it works, disclaimer, CTA | `/` |
| **Search**: cascading form, filters (khewat, khatauni, land type, year), result cards, pagination, "save this search" | `/search` |
| **Record detail**: jamabandi table, mutation timeline, Leaflet map, shajra nasb tree, "Generate pre-purchase report" | `/record/[id]` |
| **Marketplace**: browse + filter (district, price, area, land type, verified), listing page with linked record and verification badge, contact seller, create a listing with photos | `/marketplace`, `/marketplace/[id]`, `/marketplace/list` |
| **Pre-purchase reports**: PDF generated with `@react-pdf/renderer` (Hindi + English), unique report ID, mutation history, circle-rate placeholder, disclaimer | `/reports`, `POST/GET /api/report/generate` |
| **Auth**: passwordless sign-in by **mobile OTP or email** (Supabase Auth) | `/login`, `/api/auth/callback` |
| **Dashboard**: saved searches, generated reports, my land listings | `/dashboard` |
| **Legal + info**: About, Disclaimer, Privacy policy, Terms of use | `/about`, `/disclaimer`, `/privacy`, `/terms` |
| **Finishing**: loading skeletons for all major pages, error boundary, localized 404, SEO metadata + hreflang + sitemap + robots, favicon | `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts` |

All routes live under `/hi/...` and `/en/...`.

## Tech stack

- **Next.js 15** (App Router, React 19) + **TypeScript** (strict)
- **Tailwind CSS 3** + shadcn/ui conventions, `lucide-react`, `framer-motion`
- **next-intl 4**: Hindi + English
- **Supabase**: Auth, Postgres with Row Level Security, Storage (`@supabase/ssr`)
- `zod` + `react-hook-form`, `date-fns`, `leaflet` (maps), `@react-pdf/renderer` (PDF reports)

## Quick start (demo mode)

You need Node.js **18.18+** (20 or 22 recommended).

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. With no Supabase variables set the app runs in **demo mode** on a few clearly fictional records and listings:

- Try searching **Shimla -> Theog**, open the record (map, mutation timeline and family tree are filled in for the first sample record), and click **Generate pre-purchase report** to download a real PDF.
- Browse `/marketplace` and open a listing.
- Sign-in, the dashboard and creating listings need Supabase (next section).

## Full setup with Supabase

### 1. Create a project

Create a free project at [supabase.com](https://supabase.com). Choose a region close to your users (for India: **Mumbai, ap-south-1**).

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings -> API | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings -> API | Anon / publishable key. Safe in the browser; protected by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings -> API | **Server only.** Bypasses RLS. Used to save generated reports. Never prefix with `NEXT_PUBLIC_` |
| `NEXT_PUBLIC_SITE_URL` | your domain | `http://localhost:3000` locally |

### 3. Create the database

Run **both** migrations, in order. Either paste each file into **SQL Editor -> New query**, or use the CLI:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

| Migration | Creates |
| --- | --- |
| `supabase/migrations/001_initial_schema.sql` | enums, `profiles`, `land_records`, `mutations`, `listings`, `reports`, indexes, triggers, RLS policies, the `search_land_records` function, storage buckets `listing-images` (public) and `report-files` (private) |
| `supabase/migrations/002_marketplace_dashboard.sql` | `saved_searches` (max 25 per user), hides seller contact columns from logged-out visitors, marketplace indexes |

### 4. Configure sign-in (Authentication)

The app uses **one-time codes**, with no passwords.

**Mobile OTP (recommended for India)**

1. Authentication -> Providers -> **Phone**: enable it.
2. Pick an SMS provider (Twilio, MessageBird, Vonage or TextLocal) and enter its credentials.
3. In India, commercial SMS must go through a **DLT-registered sender ID and template**. Register these with your SMS provider before launch, otherwise OTPs may not be delivered.
4. Keep the OTP length at **6** (the form expects 6 digits).

**Email**

1. Authentication -> Providers -> **Email**: enable it. Turn **off** "Confirm email" if you want first-time users to sign in with the code alone.
2. Authentication -> **Email Templates**: edit both **Magic Link** (existing users) and **Confirm signup** (new users) so the email contains the code. For example, add the line: `Your code is {{ .Token }}`. The link in the default template keeps working too.
3. Supabase's built-in email sender is for testing only and is heavily rate-limited. In production configure **Custom SMTP** (Project Settings -> Authentication -> SMTP).

**URL configuration**

Authentication -> URL Configuration:

- **Site URL**: your production URL, for example `https://himlandcheck.in`
- **Redirect URLs**: add `https://himlandcheck.in/api/auth/callback` and `http://localhost:3000/api/auth/callback`

### 5. Make yourself an admin

Sign in once, then in the SQL Editor:

```sql
update public.profiles set role = 'admin' where id = '<your-user-uuid>';
```

(Find your id under Authentication -> Users.) Only admins can edit land records and mutations, and publish marketplace listings.

### 6. Run

```bash
npm run dev
```

## Deploying to Vercel

1. Push the project to GitHub, GitLab or Bitbucket.
2. In Vercel: **Add New -> Project**, import the repository. The framework is detected as Next.js; keep the defaults.
3. Under **Environment Variables** add all four variables from the table above (set `NEXT_PUBLIC_SITE_URL` to your production URL). Add them for *Production* and, if you use previews, *Preview* too.
4. **Deploy.**
5. Project Settings -> **Functions** -> choose a region near your users and your Supabase project (for India: Mumbai `bom1`).
6. Add your custom domain (Settings -> Domains), then update **Site URL** and **Redirect URLs** in Supabase (step 4 above) to that domain.
7. Open `https://your-domain/api/health`. It should return `{"status":"ok"}`.

Notes:

- PDF reports run in a Node.js serverless function. The Hind font files in `src/assets/fonts/` are shipped with it automatically (`outputFileTracingIncludes` in `next.config.ts`).
- The build needs internet access to Google Fonts (`next/font/google`).
- OpenStreetMap's public tile server (used by the map) is for light use. For real traffic switch the tile URL in `src/components/record/MapViewer.tsx` to a commercial provider (MapTiler, Mapbox, Stadia).

## Running the business

### Loading land records

`land_records` is read-only for the public and writable only by admins (or the service role). Add data from the Supabase **Table Editor** (import CSV) or SQL:

```sql
insert into public.land_records
  (district, tehsil, village, khasra_number, khewat_number, khatauni_number,
   owner_name, father_name, area, area_unit, land_type, jamabandi_year, raw_data, map_geojson)
values
  ('Shimla', 'Theog', 'Your Village', '123/4', '56', '78',
   'Owner Name', 'Father Name', 2.4, 'bigha', 'orchard', 2022,
   '{"share": "1/2", "area_text": "2-4-0 (bigha-biswa-biswansi)",
     "shajra_nasb": [{"name": "Grandfather", "deceased": true,
        "children": [{"name": "Father", "children": [{"name": "Owner"}]}]}]}',
   null);
```

- Use the canonical English **district** and **tehsil** names from `src/lib/data/districts.ts` (the search form sends those values).
- `raw_data` may hold `share`, `cultivator`, `area_text`, `remarks` and `shajra_nasb` (a nested family tree). They appear on the record page and in the PDF.
- `map_geojson` takes a GeoJSON Feature / Polygon (longitude, latitude order). The Leaflet map appears automatically when it is set.
- Only load data you have the right to use and publish. Records contain personal data; see Privacy policy.
- Add a unique-looking `source` (for example the register and year) so you can trace every entry.

### Moderating the marketplace

New listings are saved as `pending_review` and are visible only to their seller. To publish one (SQL Editor, or the Table Editor):

```sql
-- publish
update public.listings set status = 'active' where id = '<listing-id>';
-- publish and mark as verified (basic checks done, linked record confirmed)
update public.listings set status = 'active', is_verified = true where id = '<listing-id>';
-- reject
update public.listings set status = 'rejected' where id = '<listing-id>';
```

Sellers can never set `active`, `is_verified` or `is_featured` themselves (enforced by RLS and database triggers). The **Verified** badge is shown only when `is_verified` is true **and** the listing is linked to a land record.

### Circle rates

Reports show a "to be added" placeholder. When you have a data source, implement `getCircleRate()` in `src/lib/data/circle-rates.ts`; the PDF already renders its result.

## Project structure

```
src/
├── app/
│   ├── [locale]/                 # every page lives under /hi or /en
│   │   ├── layout.tsx            # fonts, intl provider, disclaimer banner, header, footer
│   │   ├── page.tsx              # Homepage
│   │   ├── search/               # Search
│   │   ├── record/[id]/          # Record detail
│   │   ├── marketplace/          # browse, [id], list
│   │   ├── reports/              # Reports info + your reports
│   │   ├── login/  dashboard/
│   │   ├── about/ disclaimer/ privacy/ terms/
│   │   ├── error.tsx  not-found.tsx  [...rest]/
│   │   └── (each page has a loading.tsx skeleton where it matters)
│   ├── api/
│   │   ├── report/generate/      # POST: create report + PDF, GET: re-download
│   │   ├── auth/callback/        # email-link sign-in
│   │   ├── villages/             # village suggestions
│   │   └── health/
│   ├── sitemap.ts  robots.ts  icon.svg  globals.css
├── components/
│   ├── layout/        Header, Footer, LanguageToggle, MobileNav, DisclaimerBanner, DisclaimerPanel, StateMessage
│   ├── home/          Hero, HeroSearch, WhatWeDo, Features, HowItWorks, DisclaimerSection, CTA
│   ├── search/        SearchForm, DistrictSelect, LocationFields, Filters, ResultCard, Pagination, SaveSearchButton
│   ├── record/        JamabandiTable, MutationTimeline, MapViewer, ShajraViewer, ReportButton
│   ├── marketplace/   ListingCard, ListingForm, MarketplaceFilters, ContactSeller, VerificationBadge
│   ├── reports/       ReportTemplate (PDF), ReportsTable
│   ├── auth/          LoginForm, AuthActions
│   ├── dashboard/     SavedSearchList, MyListings
│   ├── legal/         LegalDocument
│   └── ui/            button, input, select, label, badge, skeleton, reveal
├── lib/
│   ├── supabase/      client, server, middleware, admin, config, use-user
│   ├── data/          districts (12 districts + tehsils), sample-records (demo), circle-rates
│   ├── search.ts  marketplace.ts  listing-utils.ts  record.ts  record-extras.ts
│   ├── report.ts  report-i18n.ts  pdf-fonts.ts
│   ├── auth.ts  phone.ts  seo.ts  site.ts  utils.ts
├── i18n/              routing, request, navigation (next-intl)
├── messages/          en.json, hi.json
├── types/             database.ts, land-record.ts
├── assets/fonts/      Hind (SIL OFL) for PDFs
└── middleware.ts      locale detection + Supabase session refresh
supabase/
├── migrations/        001_initial_schema.sql, 002_marketplace_dashboard.sql
└── tests/rls.test.mjs database tests (npm run test:db)
```

## How the main features work

- **Search**: `/search?district=&tehsil=&village=&khasra=&owner=` (+ `khewat`, `khatauni`, `type`, `year`, `page`). Everything is in the URL, so searches can be shared and saved. Khasra/khewat/khatauni match exactly; owner and village match partially. 20 results per page.
- **Village suggestions** come from the villages already stored for the chosen tehsil (`/api/villages`). No village names are hard-coded.
- **Record page** reads one `land_records` row plus its `mutations`. It is `noindex` because it contains owners' personal data.
- **Reports**: `POST /api/report/generate {recordId, locale}` verifies the user, builds a snapshot (record, mutations, rule-based "points to verify", circle-rate placeholder), stores it in `reports.findings` (needs `SUPABASE_SERVICE_ROLE_KEY`) and streams the PDF. `GET /api/report/generate?id=<uuid>&locale=` re-renders an earlier report from its snapshot, in either language. Limit: 10 reports per user per hour. The "points to verify" are a checklist, deliberately **not a risk score**.
- **Marketplace contact privacy**: logged-out visitors cannot read `contact_name` / `contact_phone`. This is enforced in the database with column privileges (migration 002), so it cannot be bypassed through the API. The app therefore always selects explicit columns for listings. If you add a public column to `listings`, also run `grant select (new_column) on public.listings to anon;`.
- **Demo mode** (no Supabase variables): sample data from `src/lib/data/sample-records.ts`. It switches to the database automatically once the variables are set.

## Internationalisation

- Locales: `hi` (default) and `en`, set in `src/i18n/routing.ts` (change `defaultLocale` for English).
- On first visit `/` redirects by the browser's language; the choice is remembered in the `NEXT_LOCALE` cookie.
- All text lives in `src/messages/en.json` and `hi.json`. **Keep both files in the same shape.** `global.d.ts` types the keys from `en.json`, so a missing English key fails type-checking; a key missing from `hi.json` is not caught, so check parity when adding text.
- Only the namespaces listed in `CLIENT_NAMESPACES` (`src/app/[locale]/layout.tsx`) are sent to the browser. If a new Client Component uses a new namespace, add it there.
- Use `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`, not the `next/*` versions.
- Fonts: **Hind** (body), **Noto Serif / Noto Serif Devanagari** (headings); PDFs embed Hind.
- Have a native Hindi speaker with revenue-record vocabulary (jamabandi, khewat, intkal, nakal) review the Hindi text before launch.

## Security and privacy notes

- **RLS is enabled on every table.** Land records and mutations are public to read, admin-only to write. Listings: anyone reads active ones; sellers manage their own; only admins publish, verify or feature. Reports and saved searches are private to their owner. Roles cannot be self-escalated.
- Seller contact details are hidden from logged-out visitors (see above) and revealed in the UI only on click.
- `SUPABASE_SERVICE_ROLE_KEY` is used only in `src/lib/supabase/admin.ts`, which imports `server-only`, so the build fails if a Client Component ever imports it.
- Open redirects are blocked: `?next=` is accepted only for same-site paths.
- Uploads are limited to JPG/PNG/WebP, 5 MB each, 4 per listing, and stored under the uploader's own folder.
- Security headers are set in `next.config.ts`.
- On the server, authorise with `supabase.auth.getUser()`, never `getSession()`.

## Scripts and testing

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:db` | Applies both migrations to an in-memory Postgres (PGlite) and checks 41 security rules: RLS, role protection, listing moderation, hidden contact columns, limits, storage policies |
| `npm run db:types` | Regenerates `src/types/database.ts` from your local Supabase DB (overwrites the hand-written file) |

`test:db` stubs Supabase's `auth` and `storage` schemas, so it needs no running Supabase. It does not replace testing against your real project.

## Before you launch

- [ ] Replace the placeholders in `src/lib/site.ts`: `companyName`, `contactEmail`, `jurisdiction`. Bump `legalLastUpdated` whenever legal pages change.
- [ ] Have an advocate review the **Disclaimer, Privacy policy, Terms of use** and the About page. They are careful drafts, **not legal advice**.
- [ ] Have the Hindi text reviewed by a native speaker.
- [ ] Verify the tehsil list in `src/lib/data/districts.ts` against official data.
- [ ] Configure an SMS provider (with DLT registration for India) and custom SMTP.
- [ ] Set Site URL and Redirect URLs in Supabase; set `NEXT_PUBLIC_SITE_URL`.
- [ ] Load real land records, with the right to publish them.
- [ ] Switch the map tiles to a commercial provider if you expect traffic.
- [ ] Implement circle rates (or keep the clearly labelled placeholder).
- [ ] Decide on a fee / refund policy if reports become paid (the `reports` table already has payment columns).
- [ ] Consider rate limiting (for example Vercel Firewall) for `/api/*` and a monitoring tool for errors.

## Troubleshooting

- **`Supabase is not configured`**: `.env.local` is missing, or the dev server was not restarted after editing it. Without any Supabase variables the app runs in demo mode instead.
- **No OTP arrives**: check the SMS provider credentials, the DLT template (India) and Supabase's Auth logs. For email, check SMTP settings and that the template contains `{{ .Token }}`.
- **`permission denied for table listings`**: something selected `*` (or a contact column) while logged out. Select explicit columns, as `src/lib/marketplace.ts` does.
- **Generated reports do not appear on the dashboard**: `SUPABASE_SERVICE_ROLE_KEY` is not set on the server. The PDF still downloads (the response header `X-Report-Persisted` is `false`).
- **Hindi text in a fallback font / build fails on fonts**: Google Fonts could not be downloaded (offline or blocked network).
- **Odd production errors after running `next dev`**: `next dev` and `next build` share the `.next` folder. Delete it (`rm -rf .next`) before building.
- **Locale not switching**: clear the `NEXT_LOCALE` cookie.
