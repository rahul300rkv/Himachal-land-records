import { CircleAlert, FileText, TestTube2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { StateMessage } from '@/components/layout/StateMessage';
import { ReportsTable, type ReportListItem } from '@/components/reports/ReportsTable';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCurrentUser } from '@/lib/auth';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createClient } from '@/lib/supabase/server';

type Props = { params: Promise<{ locale: string }> };

const INCLUDES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const;
const STEPS = ['search', 'open', 'generate'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Report.page' });
  return pageMetadata({ locale, path: '/reports', title: t('title'), description: t('metaDescription') });
}

async function loadReports(userId: string): Promise<ReportListItem[] | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('reports')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .eq('report_type', 'pre_purchase')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error('Could not load reports', error);
    return null;
  }
}

export default async function ReportsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Report.page');
  const user = await getCurrentUser();
  const reports = user ? await loadReports(user.id) : null;

  return (
    <div className="container py-10 sm:py-14">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/search">{t('ctaSearch')}</Link>
        </Button>
      </header>

      {!isSupabaseConfigured && (
        <p className="mt-6 flex items-start gap-2 rounded-md border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">
          <TestTube2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('demoNotice')}
        </p>
      )}

      <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <section aria-labelledby="includes-title">
          <h2 id="includes-title" className="text-2xl">
            {t('includesTitle')}
          </h2>
          <ul className="mt-4 space-y-3">
            {INCLUDES.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-2.5 size-2 shrink-0 rounded-full bg-leaf" aria-hidden="true" />
                <span className="text-lg">{t(`includes.${key}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="how-title">
          <h2 id="how-title" className="text-2xl">
            {t('howTitle')}
          </h2>
          <ol className="mt-4 space-y-5">
            {STEPS.map((key, index) => (
              <li key={key} className="flex gap-4">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg">{t(`steps.${key}.title`)}</h3>
                  <p className="mt-1 text-muted-foreground">{t(`steps.${key}.body`)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-14" aria-labelledby="yours-title">
        <h2 id="yours-title" className="mb-4 text-2xl">
          {t('yourReports')}
        </h2>

        {!user ? (
          <StateMessage icon={FileText} title={t('yourReports')} body={t('loginPrompt')}>
            <Button asChild>
              <Link href={{ pathname: '/login', query: { next: '/reports' } }}>{t('login')}</Link>
            </Button>
          </StateMessage>
        ) : reports === null ? (
          <StateMessage tone="error" icon={CircleAlert} title={t('error.title')} body={t('error.body')} />
        ) : reports.length === 0 ? (
          <StateMessage icon={FileText} title={t('empty.title')} body={t('empty.body')}>
            <Button asChild variant="outline">
              <Link href="/search">{t('ctaSearch')}</Link>
            </Button>
          </StateMessage>
        ) : (
          <ReportsTable reports={reports} />
        )}
      </section>

      <DisclaimerPanel className="mt-14" />
    </div>
  );
}
