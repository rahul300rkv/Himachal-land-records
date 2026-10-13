import { CircleAlert, Plus, SearchX, TestTube2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { StateMessage } from '@/components/layout/StateMessage';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { Pagination } from '@/components/search/Pagination';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { parseListingParams, searchListings } from '@/lib/marketplace';
import { pageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Marketplace' });
  return pageMetadata({ locale, path: '/marketplace', title: t('title'), description: t('metaDescription') });
}

export default async function MarketplacePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Marketplace');
  const raw = await searchParams;
  const result = await searchListings(parseListingParams(raw));

  // Query string kept by the pagination links (the page number is added there).
  const currentQuery = Object.fromEntries(
    Object.entries(raw)
      .map(([key, value]) => [key, Array.isArray(value) ? value[0] : value] as const)
      .filter(([key, value]) => key !== 'page' && value),
  ) as Record<string, string>;

  return (
    <div className="container py-10 sm:py-14">
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Button asChild size="lg" variant="leaf" className="shrink-0">
          <Link href="/marketplace/list">
            <Plus />
            {t('listLand')}
          </Link>
        </Button>
      </header>

      {result.mode === 'demo' && (
        <p className="mt-6 flex items-start gap-2 rounded-md border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">
          <TestTube2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('demoNotice')}
        </p>
      )}

      <p className="mt-6 text-sm text-muted-foreground">{t('notice')}</p>

      <div className="mt-6">
        <MarketplaceFilters />
      </div>

      <section className="mt-8" aria-live="polite">
        {result.error ? (
          <StateMessage tone="error" icon={CircleAlert} title={t('results.error.title')} body={t('results.error.body')} />
        ) : result.listings.length === 0 ? (
          <StateMessage icon={SearchX} title={t('results.empty.title')} body={t('results.empty.body')}>
            <Button asChild variant="outline">
              <Link href="/marketplace/list">{t('listLand')}</Link>
            </Button>
          </StateMessage>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              {t('results.summary', { count: result.listings.length, page: result.page })}
            </p>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.listings.map((listing) => (
                <li key={listing.id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
            <Pagination pathname="/marketplace" page={result.page} hasMore={result.hasMore} query={currentQuery} />
          </>
        )}
      </section>

      <DisclaimerPanel
        className="mt-14"
        points={['independent', 'marketplace', 'notLegalRecord', 'verify', 'landLaws']}
      />
    </div>
  );
}
