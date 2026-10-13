import { ArrowLeft, FileCheck2, TestTube2 } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { JamabandiTable } from '@/components/record/JamabandiTable';
import { MapViewer } from '@/components/record/MapViewer';
import { MutationTimeline } from '@/components/record/MutationTimeline';
import { ReportButton } from '@/components/record/ReportButton';
import { ShajraViewer } from '@/components/record/ShajraViewer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCurrentUser } from '@/lib/auth';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { extractExtras, extractShajra, getLandRecord, getRecordWithMutations } from '@/lib/record';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const found = await getLandRecord(id);
  if (!found) return { title: '404', robots: { index: false } };

  const { record } = found;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Record' });
  const values = {
    khasra: record.khasra_number,
    village: record.village,
    tehsil: tehsilLabel(record.district, record.tehsil, locale),
    district: districtLabel(record.district, locale),
  };

  // Records contain owners' personal data, so keep them out of search engines.
  return pageMetadata({
    locale,
    path: `/record/${id}`,
    title: t('metaTitle', values),
    description: t('metaDescription', values),
    noindex: true,
  });
}

export default async function RecordPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);

  const result = await getRecordWithMutations(id);
  if (!result) notFound();

  const { record, mutations, mode } = result;
  const t = await getTranslations('Record');
  const user = await getCurrentUser();

  const location = [
    record.village,
    tehsilLabel(record.district, record.tehsil, locale),
    districtLabel(record.district, locale),
  ].join(', ');

  const reportProps = { recordId: record.id, requiresLogin: mode === 'live', isAuthenticated: Boolean(user) };

  const sections = [
    { id: 'details', label: t('jamabandi.title') },
    { id: 'mutations', label: t('mutations.title') },
    { id: 'map', label: t('map.title') },
    { id: 'shajra', label: t('shajra.title') },
  ];

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('back')}
      </Link>

      <header className="mt-4">
        <h1 className="text-3xl sm:text-4xl">{t('khasraTitle', { number: record.khasra_number })}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{location}</p>
      </header>

      {mode === 'demo' && (
        <p className="mt-5 flex items-start gap-2 rounded-md border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">
          <TestTube2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('demoNotice')}
        </p>
      )}

      {/* Prominent report call to action */}
      <section
        aria-labelledby="report-title"
        className="mt-6 flex flex-col gap-5 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="max-w-2xl">
          <h2 id="report-title" className="flex items-center gap-2.5 text-2xl text-primary-foreground">
            <FileCheck2 className="size-6 shrink-0" aria-hidden="true" />
            {t('report.title')}
          </h2>
          <p className="mt-2 text-primary-foreground/90">{t('report.body')}</p>
        </div>
        <ReportButton {...reportProps} tone="onDark" />
      </section>

      <nav aria-label={t('onPage')} className="mt-6 flex flex-wrap gap-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="rounded-full border bg-card px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary"
          >
            {section.label}
          </a>
        ))}
      </nav>

      <div className="mt-10 space-y-14">
        <section id="details" aria-labelledby="details-title">
          <h2 id="details-title" className="mb-4 text-2xl">
            {t('jamabandi.title')}
          </h2>
          <JamabandiTable record={record} extras={extractExtras(record.raw_data)} />
        </section>

        <section id="mutations" aria-labelledby="mutations-title">
          <h2 id="mutations-title" className="text-2xl">
            {t('mutations.title')}
          </h2>
          <p className="mb-5 mt-1 text-muted-foreground">{t('mutations.intro')}</p>
          <MutationTimeline mutations={mutations} />
        </section>

        <section id="map" aria-labelledby="map-title">
          <h2 id="map-title" className="text-2xl">
            {t('map.title')}
          </h2>
          <p className="mb-4 mt-1 text-muted-foreground">{t('map.intro')}</p>
          <MapViewer geojson={record.map_geojson} />
        </section>

        <section id="shajra" aria-labelledby="shajra-title">
          <h2 id="shajra-title" className="text-2xl">
            {t('shajra.title')}
          </h2>
          <p className="mb-5 mt-1 text-muted-foreground">{t('shajra.intro')}</p>
          <ShajraViewer tree={extractShajra(record.raw_data)} />
        </section>

        <section
          aria-labelledby="bottom-cta-title"
          className="flex flex-col gap-4 rounded-xl bg-leaf-soft p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <h2 id="bottom-cta-title" className="text-xl sm:text-2xl">
              {t('bottomCta.title')}
            </h2>
            <p className="mt-1 text-muted-foreground">{t('bottomCta.body')}</p>
          </div>
          <ReportButton {...reportProps} />
        </section>

        <DisclaimerPanel />
      </div>
    </div>
  );
}
