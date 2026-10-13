import { CircleAlert, DatabaseZap, FileText, Plus, Search, Store } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { StateMessage } from '@/components/layout/StateMessage';
import { MyListings, type MyListingItem } from '@/components/dashboard/MyListings';
import { SavedSearchList, type SavedSearchItem } from '@/components/dashboard/SavedSearchList';
import { ReportsTable, type ReportListItem } from '@/components/reports/ReportsTable';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { requireUser, userDisplayName } from '@/lib/auth';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';
import type { Json } from '@/types/database';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Dashboard' });
  return pageMetadata({
    locale,
    path: '/dashboard',
    title: t('title'),
    description: t('metaDescription'),
    noindex: true,
  });
}

/** Keeps only string values from the stored search params. */
function toQuery(params: Json): Record<string, string> {
  if (!params || typeof params !== 'object' || Array.isArray(params)) return {};
  return Object.fromEntries(Object.entries(params).filter(([, v]) => typeof v === 'string')) as Record<string, string>;
}

async function loadDashboard(userId: string) {
  const supabase = await createClient();

  // Each list loads independently, so one failing query does not blank the whole page.
  const [saved, reports, listings] = await Promise.all([
    supabase
      .from('saved_searches')
      .select('id, name, params, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('reports')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .eq('report_type', 'pre_purchase')
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('listings')
      .select('id, title, status, district, tehsil, village, price, created_at')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false })
      .limit(50),
  ]);

  return {
    saved: saved.error
      ? null
      : (saved.data ?? []).map((s): SavedSearchItem => ({ ...s, params: toQuery(s.params) })),
    reports: reports.error ? null : ((reports.data ?? []) as ReportListItem[]),
    listings: listings.error ? null : ((listings.data ?? []) as MyListingItem[]),
  };
}

export default async function DashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Dashboard');
  const nav = await getTranslations('Navigation');

  if (!isSupabaseConfigured) {
    return (
      <div className="container py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <div className="mt-8 max-w-2xl">
          <StateMessage icon={DatabaseZap} title={t('title')} body={t('demoNotice')} />
        </div>
      </div>
    );
  }

  const user = await requireUser(locale, '/dashboard');
  const data = await loadDashboard(user.id);
  const name = userDisplayName(user) ?? user.email ?? user.phone ?? null;

  const errorState = (
    <StateMessage tone="error" icon={CircleAlert} title={t('error.title')} body={t('error.body')} />
  );

  return (
    <div className="container py-10 sm:py-14">
      <header>
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {name ? t('welcome', { name }) : t('welcomeAnon')}
        </p>
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-10">
        <section aria-labelledby="saved-title">
          <h2 id="saved-title" className="mb-4 text-2xl">
            {t('saved.title')}
          </h2>
          {data.saved === null ? (
            errorState
          ) : data.saved.length === 0 ? (
            <StateMessage icon={Search} title={t('saved.empty.title')} body={t('saved.empty.body')}>
              <Button asChild variant="outline">
                <Link href="/search">{nav('search')}</Link>
              </Button>
            </StateMessage>
          ) : (
            <SavedSearchList items={data.saved} />
          )}
        </section>

        <section aria-labelledby="reports-title">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <h2 id="reports-title" className="text-2xl">
              {t('reports.title')}
            </h2>
            <Link href="/reports" className="text-sm font-medium text-primary hover:underline">
              {t('reports.about')}
            </Link>
          </div>
          {data.reports === null ? (
            errorState
          ) : data.reports.length === 0 ? (
            <StateMessage icon={FileText} title={t('reports.empty.title')} body={t('reports.empty.body')} />
          ) : (
            <ReportsTable reports={data.reports} />
          )}
        </section>
      </div>

      <section className="mt-12" aria-labelledby="listings-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 id="listings-title" className="text-2xl">
            {t('listings.title')}
          </h2>
          <Button asChild variant="leaf" size="sm">
            <Link href="/marketplace/list">
              <Plus />
              {t('listings.create')}
            </Link>
          </Button>
        </div>
        {data.listings === null ? (
          errorState
        ) : data.listings.length === 0 ? (
          <StateMessage icon={Store} title={t('listings.empty.title')} body={t('listings.empty.body')}>
            <Button asChild>
              <Link href="/marketplace/list">{t('listings.create')}</Link>
            </Button>
          </StateMessage>
        ) : (
          <MyListings items={data.listings} />
        )}
      </section>

      <DisclaimerPanel className="mt-14" points={['independent', 'notLegalRecord', 'verify', 'marketplace']} />
    </div>
  );
}
