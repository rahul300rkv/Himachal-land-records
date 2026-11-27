import { CircleAlert, Info, SearchX, TestTube2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Filters } from '@/components/search/Filters';
import { Pagination } from '@/components/search/Pagination';
import { ResultCard } from '@/components/search/ResultCard';
import { SaveSearchButton } from '@/components/search/SaveSearchButton';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedTools } from '@/components/seo/RelatedTools';
import { SearchForm } from '@/components/search/SearchForm';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { getCurrentUser } from '@/lib/auth';
import { parseSearchParams, searchLandRecords } from '@/lib/search';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import type { Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const raw = await searchParams;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Search' });
  // Index the search page itself, not the endless result pages.
  return pageMetadata({
    locale,
    path: '/search',
    title: t('title'),
    description: t('subtitle'),
    noindex: Object.keys(raw).length > 0,
  });
}

function Message({
  icon: Icon,
  title,
  body,
  tone = 'neutral',
}: {
  icon: typeof Info;
  title: string;
  body: string;
  tone?: 'neutral' | 'error';
}) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className="rounded-lg border border-dashed px-6 py-10 text-center">
      <Icon
        className={`mx-auto size-8 ${tone === 'error' ? 'text-destructive' : 'text-muted-foreground'}`}
        aria-hidden="true"
      />
      <h2 className="mt-3 font-sans text-lg font-semibold tracking-normal">{title}</h2>
      <p className="mx-auto mt-1.5 max-w-md text-muted-foreground">{body}</p>
    </div>
  );
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Search');
  const raw = await searchParams;
  const initialLocation = typeof raw.districtCode === 'string' ? {
    district: raw.districtCode,
    tehsil: typeof raw.tehsilCode === 'string' ? raw.tehsilCode : '',
    village: typeof raw.villageCode === 'string' ? raw.villageCode : '',
  } : undefined;
  const parsed = parseSearchParams(initialLocation ? {} : raw);
  const result = parsed.status === 'ok' ? await searchLandRecords(parsed.query) : null;
  const user = result ? await getCurrentUser() : null;

  // Query string kept by the pagination links (page itself is added there).
  const currentQuery = Object.fromEntries(
    Object.entries(raw)
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value] as const)
      .filter(([key, value]) => key !== 'page' && value),
  ) as Record<string, string>;

  const place =
    parsed.status === 'ok'
      ? [
          parsed.query.village,
          parsed.query.tehsil && tehsilLabel(parsed.query.district, parsed.query.tehsil, locale),
          districtLabel(parsed.query.district, locale),
        ]
          .filter(Boolean)
          .join(', ')
      : '';

  return (
    <div className="container py-10 sm:py-14">
      <Breadcrumbs current="search" className="mb-6" />
      <header className="max-w-2xl">
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
      </header>

      <section className="mt-8 rounded-xl border bg-card p-5 shadow-sm sm:p-6" aria-label={t('title')}>
        <SearchForm key={JSON.stringify(initialLocation)} initialLocation={initialLocation} />
      </section>

      
      <section className="mt-4 grid gap-3 sm:grid-cols-3" aria-labelledby="search-trust-title">
        <h2 id="search-trust-title" className="sr-only">{t('trust.title')}</h2>
        <div className="rounded-lg border border-primary/15 bg-primary-soft p-4">
          <p className="text-sm font-semibold text-primary">{t('trust.sourceTitle')}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t('trust.sourceBody')}</p>
        </div>
        <div className="rounded-lg border border-notice-border bg-notice p-4">
          <p className="text-sm font-semibold text-notice-foreground">{t('trust.referenceTitle')}</p>
          <p className="mt-1 text-sm text-notice-foreground/80">{t('trust.referenceBody')}</p>
        </div>
      </section>

      <section className="mt-10" aria-live="polite">
        {parsed.status === 'idle' && (
          <div className="rounded-lg bg-primary-soft p-6">
            <h2 className="flex items-center gap-2 font-sans text-lg font-semibold tracking-normal">
              <Info className="size-5 text-primary" aria-hidden="true" />
              {t('results.idle.title')}
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-5 marker:font-semibold marker:text-primary">
              {(['a', 'b', 'c'] as const).map((key) => (
                <li key={key}>{t(`results.idle.tips.${key}`)}</li>
              ))}
            </ol>
          </div>
        )}

        {parsed.status === 'idle' && (
          <section className="mt-8 rounded-xl border bg-card p-6" aria-labelledby="search-faq-title">
            <h2 id="search-faq-title" className="text-2xl">{t('results.faq.title')}</h2>
            <div className="mt-4 divide-y">
              {(['a', 'b', 'c', 'd', 'e'] as const).map((key) => (
                <details key={key} className="group py-4 first:pt-0 last:pb-0">
                  <summary className="cursor-pointer list-none font-semibold marker:hidden">{t(`results.faq.${key}.q`)}</summary>
                  <p className="mt-2 text-muted-foreground">{t(`results.faq.${key}.a`)}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {parsed.status === 'invalid' && (
          <Message icon={Info} title={t('results.invalid.title')} body={t('results.invalid.body')} />
        )}

        {result && parsed.status === 'ok' && (
          <>
            {result.mode === 'demo' && (
              <p className="mb-4 flex items-start gap-2 rounded-md border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">
                <TestTube2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {t('results.demoNotice')}
              </p>
            )}

            <Filters
              defaults={{
                khewat: parsed.query.khewatNumber,
                khatauni: parsed.query.khatauniNumber,
                type: parsed.query.landType,
                year: parsed.query.jamabandiYear,
              }}
            />

            {result.error ? (
              <div className="mt-6">
                <Message
                  tone="error"
                  icon={CircleAlert}
                  title={t('results.error.title')}
                  body={t('results.error.body')}
                />
              </div>
            ) : result.records.length === 0 ? (
              <div className="mt-6">
                <Message icon={SearchX} title={t('results.empty.title')} body={t('results.empty.body')} />
              </div>
            ) : (
              <>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-sans text-lg font-semibold tracking-normal">
                      {t('results.searchedIn', { place })}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t('results.summary', { page: result.page, count: result.records.length })}
                    </p>
                  </div>
                  {isSupabaseConfigured && (
                    <SaveSearchButton
                      params={currentQuery}
                      name={[place, parsed.query.khasraNumber && `${parsed.query.khasraNumber}`, parsed.query.jamabandiYear]
                        .filter(Boolean)
                        .join(' · ')}
                      isAuthenticated={Boolean(user)}
                    />
                  )}
                </div>

                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
                  <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  {t('results.notice')}
                </p>

                <ul className="mt-5 grid gap-4 lg:grid-cols-2">
                  {result.records.map((record) => (
                    <li key={record.id} className="flex">
                      <div className="flex w-full flex-col [&>article]:flex-1">
                        <ResultCard record={record} />
                      </div>
                    </li>
                  ))}
                </ul>

                <Pagination page={result.page} hasMore={result.hasMore} query={currentQuery} />
              </>
            )}
          </>
        )}
      </section>
      
      <section className="mt-12 border-t border-border pt-8" aria-labelledby="search-how-title">
        <h2 id="search-how-title" className="text-2xl sm:text-3xl">{t('howTitle')}</h2>
        <p className="mt-3 max-w-4xl leading-relaxed text-muted-foreground">{t('howBody')}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(['one', 'two', 'three'] as const).map((key) => (
            <article key={key} className="rounded-xl border border-border bg-card p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">{t(`steps.${key}.label`)}</p>
              <h3 className="mt-2 text-lg">{t(`steps.${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`steps.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-6" aria-labelledby="search-what-title">
        <h2 id="search-what-title" className="text-2xl sm:text-3xl">{t('whatTitle')}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{t('whatBody')}</p>
      </section>

      <RelatedTools current="search" />
    </div>
  );
}
