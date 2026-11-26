# HimLand Check (`himachal-land-records`)

A private, independent platform to **search, read and check land records in Himachal Pradesh**: jamabandi, khasra, khatauni, khewat, mutations (intkal), maps, shajra nasb (family tree), pre-purchase check reports (PDF) and a land marketplace. Fully bilingual: **Hindi and English**.

**Link** https://himachal-land-records.vercel.app/

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
| **Source verification workspace**: one plot brief with official HimBhoomi, HP High Court and district eCourts handoffs | `/verify`, `/api/integrations/capabilities` |
| **Tools, maps and guides**: land converter, stamp-duty calculator, official MEGH circle-rate lookup, official BhuNaksha plot viewer and practical bilingual explainers | `/tools`, `/map`, `/guides`, `/circle-rate`, `/stamp-duty-calculator`, `/converter` |
| **Blog**: bilingual due-diligence articles, including the seven-document pre-purchase checklist with official online-check links | `/blog`, `/blog/7-documents-before-buying-land` |
| **Auth**: passwordless sign-in by **mobile OTP or email** (Supabase Auth) | `/login`, `/api/auth/callback` |
| **Dashboard**: saved searches, generated reports, my land listings | `/dashboard` |
| **Legal + info**: About, Disclaimer, Privacy policy, Terms of use | `/about`, `/disclaimer`, `/privacy`, `/terms` |
| **Finishing**: loading skeletons for all major pages, error boundary, localized 404, SEO metadata + hreflang + sitemap + robots, favicon | `loading.tsx`, `error.tsx`, `not-found.tsx`, `sitemap.ts`, `robots.ts` |

All routes live under `/hi/...` and `/en/...`.

## Tech stack

- **Next.js 15** (App Router, React 19) + **TypeScript** (strict)
- **Tailwind CSS 3** + shadcn/ui conventions and `lucide-react`
- **next-intl 4**: Hindi + English
- **Supabase**: Auth, Postgres with Row Level Security, Storage (`@supabase/ssr`)
- `zod` + `react-hook-form`, `date-fns`, `leaflet` (maps), `@react-pdf/renderer` (PDF reports), `pdfjs-dist` and `@napi-rs/canvas` (Nakal PDF rendering)

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
| `GOOGLE_SITE_VERIFICATION` | Search Console -> URL-prefix property -> HTML tag | Paste only the verification token; optional locally |
| `GEMINI_API_KEY` | Google AI Studio | Primary Nakal PDF extraction provider; server-only |
| `GEMINI_MODELS` | Your Google AI Studio model list | Optional comma-separated fallback order |
| `NVIDIA_API_KEY` | NVIDIA NIM | Optional fallback when Gemini is unavailable; server-only |
| `NVIDIA_MODEL` | NVIDIA NIM model ID | Optional; defaults to `microsoft/phi-4-multimodal-instruct` |

### 3. Create the database

Run **all three** migrations, in order. Either paste each file into **SQL Editor -> New query**, or use the CLI:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

| Migration | Creates |
| --- | --- |
| `supabase/migrations/001_initial_schema.sql` | enums, `profiles`, `land_records`, `mutations`, `listings`, `reports`, indexes, triggers, RLS policies, the `search_land_records` function, storage buckets `listing-images` (public) and `report-files` (private) |
| `supabase/migrations/002_marketplace_dashboard.sql` | `saved_searches` (max 25 per user), hides seller contact columns from logged-out visitors, marketplace indexes |
| `supabase/migrations/003_listing_location.sql` | BhuNaksha village codes, Khasra/Khewat/Khatauni fields, exact logged-in coordinates, public offset coordinates and location-source protections |

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
3. Under **Environment Variables** add the variables from the table above (set `NEXT_PUBLIC_SITE_URL` to your production URL). Add them for *Production* and, if you use previews, *Preview* too.
4. **Deploy.**
5. Project Settings -> **Functions** -> choose a region near your users and your Supabase project (for India: Mumbai `bom1`).
6. Add your custom domain (Settings -> Domains), then update **Site URL** and **Redirect URLs** in Supabase (step 4 above) to that domain.
7. Open `https://your-domain/api/health`. It should return `{"status":"ok"}`.

### Google Search Console

1. Add a **URL-prefix property** for the exact production URL (including `https://`).
2. Choose the **HTML tag** verification method and copy only its `content` token into `GOOGLE_SITE_VERIFICATION` in Vercel.
3. Redeploy, then click **Verify** in Search Console.
4. Submit `https://your-domain/sitemap.xml` in the Sitemaps report. The app also advertises it in `robots.txt`.

The app generates `/robots.txt`, `/sitemap.xml` and `/manifest.webmanifest` at runtime. `public/llms.txt` is an optional, non-standard summary for AI crawlers; it does not replace normal SEO or Search Console verification.

Notes:

- PDF reports run in a Node.js serverless function. The Hind font files in `src/assets/fonts/` are shipped with it automatically (`outputFileTracingIncludes` in `next.config.ts`).
- The build needs internet access to Google Fonts (`next/font/google`).
- The official BhuNaksha viewer uses Himachal government map services. The record and marketplace Leaflet maps use OpenStreetMap tiles, which are suitable only for light use; switch those tile URLs to a commercial provider for real traffic.

## Running the business

### Loading land records

The district, tehsil/sub-tehsil and village selectors are populated from the supplied
Himachal Pradesh village directory dated 15 November 2026. The generated data files are
`src/lib/data/hp-subdistricts.json` and `src/lib/data/hp-villages.json`: 12 districts,
193 sub-districts and all 21,595 coded village records (21,590 unique location names). Village names
retain both the canonical English value and the local-language label. Regenerate these
files whenever the source administrative directory changes.

Tehsil and sub-tehsil classifications come from the supplied district administrative-unit
CSV. The selector displays the classification beside each name. Units present in the village
directory but absent from that CSV remain available and are labelled `Administrative unit`
instead of being assigned a type without source evidence.

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

The `/circle-rate` page fetches official district- and Sub-Registrar-specific schedules from the MEGH document portal through `/api/circle-rate`. The pre-purchase PDF still shows a clearly labelled placeholder rather than silently inventing a rate; connect a verified rate to the report only after defining the matching land category and office.

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
├── migrations/        001_initial_schema.sql, 002_marketplace_dashboard.sql, 003_listing_location.sql
└── tests/rls.test.mjs database tests (npm run test:db)
```

## How the main features work

- **External verification**: `/verify` creates a consistent plot brief and opens each official source in a separate tab. Search values stay in the browser and are not sent by HimLand Check. HimBhoomi and eCourts require the user to complete their CAPTCHAs. The app does not store third-party credentials. The separate `/api/himbhoomi` flow handles the official public HimBhoomi form session, CAPTCHA image and result/PDF handoff; it does not bypass CAPTCHA. `/api/integrations/capabilities` exposes source modes and constraints.

- **Search**: `/search?district=&tehsil=&village=&khasra=&owner=` (+ `khewat`, `khatauni`, `type`, `year`, `page`). Everything is in the URL, so searches can be shared and saved. Khasra/khewat/khatauni match exactly; owner and village match partially. 20 results per page.
- **Village suggestions** come from the villages already stored for the chosen tehsil (`/api/villages`). No village names are hard-coded.
- **Record page** reads one `land_records` row plus its `mutations`. It is `noindex` because it contains owners' personal data.
- **Reports**: `POST /api/report/generate {recordId, locale}` verifies the user, builds a snapshot (record, mutations, rule-based "points to verify", circle-rate placeholder), stores it in `reports.findings` (needs `SUPABASE_SERVICE_ROLE_KEY`) and streams the PDF. `GET /api/report/generate?id=<uuid>&locale=` re-renders an earlier report from its snapshot, in either language. Limit: 10 reports per user per hour. The "points to verify" are a checklist, deliberately **not a risk score**.
- **Marketplace privacy**: logged-out visitors cannot read `contact_name` / `contact_phone`, exact coordinates, `khasra`, `khewat` or `khatauni`. These restrictions are enforced with database column privileges and RLS, not only UI hiding. Public map pins are generated 70–100 metres away from the exact seller pin by a database trigger. The app always selects explicit listing columns. If you add a public column to `listings`, also update the grants in migrations 002 and 003.
- **Demo mode** (no Supabase variables): sample data from `src/lib/data/sample-records.ts`. It switches to the database automatically once the variables are set.

## Nakal checker (upload a nakal PDF -> risk score)

`/hi/check` and `/en/check`: upload a jamabandi nakal PDF, get a 0-100 score with the reasons.

Pipeline: `src/lib/nakal/extract.ts` sends the PDF to Gemini first and can fall back to `src/lib/nakal/nvidia.ts`, which renders pages locally with `pdfjs-dist` and `@napi-rs/canvas` before sending images to NVIDIA NIM. The returned JSON is validated by Zod, then `src/lib/nakal/assess.ts` applies deterministic rules; the AI never sets the score. `NakalChecker.tsx` shows the score, flags and extracted summary in Hindi/English (`NakalCheck` messages).

Setup: create a Gemini key at <https://aistudio.google.com/app/api-keys> and set `GEMINI_API_KEY` (optionally `GEMINI_MODELS`). To enable the fallback, also set `NVIDIA_API_KEY` and optionally `NVIDIA_MODEL`. All provider keys are server-only environment variables and must never use the `NEXT_PUBLIC_` prefix.

Notes:
- Gemini has quota and model-availability limits. Google may use free-tier inputs to improve its models; NVIDIA processing sends rendered page images to NVIDIA. Land records name real people: use an appropriate paid/provider agreement before real users and keep the consent notice current.
- Uploads are limited to 4 MB and are not persisted as files. A successful result may remain in a best-effort in-memory server cache for up to six hours, keyed by a SHA-256 digest, so repeat analysis can avoid another provider request.
- Rule penalties in `assess.ts` are starting values: calibrate them with a local lawyer or patwari.
- Area units reuse the marla = 19.2 sq m / kanal = 384 sq m rates from the converter (`src/lib/nakal/units.ts`).

## Internationalisation

- Locales: `en` (default) and `hi`, set in `src/i18n/routing.ts`. Locale-prefixed URLs are always used (`/en/...` and `/hi/...`); the root path redirects according to the locale cookie/browser language.
- On first visit `/` redirects by the browser's language; the choice is remembered in the `NEXT_LOCALE` cookie.
- All text lives in `src/messages/en.json` and `hi.json`. **Keep both files in the same shape.** `global.d.ts` types the keys from `en.json`, so a missing English key fails type-checking; a key missing from `hi.json` is not caught, so check parity when adding text.
- Only the namespaces listed in `CLIENT_NAMESPACES` (`src/app/[locale]/layout.tsx`) are sent to the browser. If a new Client Component uses a new namespace, add it there.
- Use `Link`, `usePathname`, `useRouter` from `@/i18n/navigation`, not the `next/*` versions.
- Fonts: **Hind** (body), **Noto Serif / Noto Serif Devanagari** (headings); PDFs embed Hind.
- Have a native Hindi speaker with revenue-record vocabulary (jamabandi, khewat, intkal, nakal) review the Hindi text before launch.

## Security and privacy notes

- **RLS is enabled on every table.** Migration 003 must be applied after migrations 001 and 002 before marketplace location fields are used. Land records and mutations are public to read, admin-only to write. Listings: anyone reads active ones; sellers manage their own; only admins publish, verify or feature. Reports and saved searches are private to their owner. Roles cannot be self-escalated.
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
| `npm run test:db` | Applies all three migrations to an in-memory Postgres (PGlite) and checks security rules: RLS, role protection, listing moderation, hidden contact columns, limits, storage policies |
| `npm run db:types` | Regenerates `src/types/database.ts` from your local Supabase DB (overwrites the hand-written file) |

`test:db` stubs Supabase's `auth` and `storage` schemas, so it needs no running Supabase. It does not replace testing against your real project.

## Before you launch

- [ ] Confirm the configured `companyName`, `contactEmail`, and `jurisdiction` in `src/lib/site.ts`; bump `legalLastUpdated` whenever legal pages change.
- [ ] Have an advocate review the **Disclaimer, Privacy policy, Terms of use** and the About page. They are careful drafts, **not legal advice**.
- [ ] Have the Hindi text reviewed by a native speaker.
- [ ] Verify the tehsil list in `src/lib/data/districts.ts` against official data.
- [ ] Configure an SMS provider (with DLT registration for India) and custom SMTP.
- [ ] Set Site URL and Redirect URLs in Supabase; set `NEXT_PUBLIC_SITE_URL`.
- [ ] Set `GOOGLE_SITE_VERIFICATION`, verify the production property, and submit `/sitemap.xml` in Search Console.
- [ ] Load real land records, with the right to publish them.
- [ ] Switch the map tiles to a commercial provider if you expect traffic.
- [ ] Confirm the official MEGH circle-rate lookup works for the target districts and offices; keep the report placeholder clearly labelled until report integration is verified.
- [ ] Decide on a fee / refund policy if reports become paid (the `reports` table already has payment columns).
- [ ] Consider rate limiting (for example Vercel Firewall) for `/api/*` and a monitoring tool for errors.

## Troubleshooting

- **`Supabase is not configured`**: `.env.local` is missing, or the dev server was not restarted after editing it. Without any Supabase variables the app runs in demo mode instead.
- **No OTP arrives**: check the SMS provider credentials, the DLT template (India) and Supabase's Auth logs. For email, check SMTP settings and that the template contains `{{ .Token }}`.
- **`permission denied for table listings`**: something selected `*` (or a contact column) while logged out. Select explicit columns, as `src/lib/marketplace.ts` does.
- **Generated reports do not appear on the dashboard**: `SUPABASE_SERVICE_ROLE_KEY` is not set on the server. The PDF still downloads (the response header `X-Report-Persisted` is `false`).
- **Nakal analysis fails**: check `GEMINI_API_KEY`; if using the fallback, check `NVIDIA_API_KEY`, `NVIDIA_MODEL`, provider quotas and the Vercel 60-second function limit.
- **Hindi text in a fallback font / build fails on fonts**: Google Fonts could not be downloaded (offline or blocked network).
- **Odd production errors after running `next dev`**: `next dev` and `next build` share the `.next` folder. Delete it (`rm -rf .next`) before building.
- **Locale not switching**: clear the `NEXT_LOCALE` cookie.
