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
          <p className="mt-1 text-sm text-muted-foreground">{t('sample.caption')}</p>
        </figcaption>
        <div className="grid sm:grid-cols-2">
          <svg
            viewBox="0 0 400 240"
            role="img"
            aria-label={t('sample.mapAlt')}
            className="block h-auto w-full bg-[#eff1f4]"
          >
            <g fill="#ddd6e0" stroke="#614a65" strokeWidth="2" strokeLinejoin="round">
              <path d="M35 44 147 29 165 102 47 121Z" />
              <path d="M147 29 259 45 251 97 165 102Z" />
              <path d="M259 45 359 66 345 128 251 97Z" />
              <path d="M47 121 165 102 178 178 62 199Z" />
              <path d="M165 102 251 97 271 166 178 178Z" fill="#f6c660" stroke="#311831" strokeWidth="3" />
              <path d="M251 97 345 128 329 178 271 166Z" />
            </g>
            <path d="M48 218 182 193 271 182 345 197" fill="none" stroke="#614a65" strokeWidth="2" strokeDasharray="5 5" />
            <g fill="#311831" fontSize="17" fontWeight="600" textAnchor="middle">
              <text x="97" y="80">1</text><text x="204" y="72">2</text><text x="302" y="88">3</text>
              <text x="108" y="155">4</text><text x="217" y="144">5</text><text x="299" y="143">6</text>
            </g>
          </svg>
          <dl className="grid content-center grid-cols-[1fr_auto] gap-x-4 gap-y-3 p-5 text-sm sm:p-7">
            <dt className="text-muted-foreground">{t('districtLabel')}</dt><dd>{t('sample.district')}</dd>
            <dt className="text-muted-foreground">{t('tehsilLabel')}</dt><dd>{t('sample.tehsil')}</dd>
            <dt className="text-muted-foreground">{t('villageLabel')}</dt><dd>{t('sample.village')}</dd>
            <dt className="text-muted-foreground">{t('plotLabel')}</dt><dd className="font-semibold">5</dd>
            <dt className="text-muted-foreground">{t('sample.area')}</dt><dd>{t('sample.areaValue')}</dd>
          </dl>
        </div>
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
