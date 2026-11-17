import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlotMapLookup } from '@/components/map/PlotMapLookup';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const faqTopics = ['plotNumber', 'openReport', 'missingReport', 'ownership', 'boundary'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'MapExplorer' });
  return pageMetadata({ locale, path: '/map', title: t('title'), description: t('intro') });
}

export default async function MapPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('MapExplorer');
  return (
    <article className="container max-w-6xl py-10 sm:py-14">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p>
      </header>
      <PlotMapLookup />
      <figure className="mt-8 overflow-hidden rounded-2xl border bg-card">
        <figcaption className="border-b px-5 py-4 sm:px-7">
          <h2 className="text-2xl">{t('sample.title')}</h2>
        </figcaption>
        {/* Use the supplied image directly so its report is available at full resolution. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://mp-sample-docs.s3.ap-south-1.amazonaws.com/hp/hp-bhunaksha-sample-document.jpg"
          alt={t('sample.mapAlt')}
          loading="lazy"
          decoding="async"
          className="mx-auto block h-auto w-full max-w-3xl"
        />
      </figure>
      <section aria-labelledby="map-overview" className="mt-10 max-w-3xl">
        <h2 id="map-overview" className="text-2xl sm:text-3xl">{t('overview.title')}</h2>
        <p className="mt-3 text-muted-foreground">{t('overview.body')}</p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
          <li>{t('overview.identify')}</li>
          <li>{t('overview.compare')}</li>
        </ul>
      </section>
      <section aria-labelledby="map-faq" className="mt-10 max-w-3xl">
        <h2 id="map-faq" className="text-2xl sm:text-3xl">{t('faq.title')}</h2>
        <div className="mt-4 space-y-3">
          {faqTopics.map((topic) => (
            <details key={topic} className="rounded-xl border bg-card">
              <summary className="min-h-12 cursor-pointer px-4 py-3 font-medium">
                {t(`faq.${topic}.question`)}
              </summary>
              <p className="px-4 pb-4 text-muted-foreground">{t(`faq.${topic}.answer`)}</p>
            </details>
          ))}
        </div>
      </section>
      <p className="mt-5 rounded-xl border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">{t('notice')}</p>
    </article>
  );
}
