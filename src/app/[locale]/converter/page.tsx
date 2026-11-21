import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { LandConverter } from '@/components/tools/LandConverter';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedTools } from '@/components/seo/RelatedTools';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Converter' });
  return pageMetadata({ locale, path: '/converter', title: t('title'), description: t('intro') });
}

const FAQ_KEYS = [
  'districts', 'which', 'records', 'rounding',
  'ownership', 'biswa', 'kanal', 'section118',
] as const;

export default async function ConverterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Converter');

  return (
    <article className="container max-w-3xl py-10 sm:py-16">
      <Breadcrumbs current="converter" className="mb-6" />

      <header className="mb-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          HimLand Check · Field guide
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg leading-7 text-muted-foreground">{t('intro')}</p>
      </header>

      {/* Calculator card */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_70px_-35px_hsl(var(--primary)/0.45)] sm:p-10">
        <LandConverter />
        <p className="mt-7 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">
          {t('note')}
        </p>
      </div>

      {/* Measurement standards */}
      <section className="mt-14 space-y-6" aria-labelledby="converter-standards">
        <h2 id="converter-standards" className="text-2xl sm:text-3xl">{t('standardsTitle')}</h2>
        <p className="text-muted-foreground">{t('standardsIntro')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-medium">{t('kanalTitle')}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('kanalStandards')}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-6">
            <h3 className="text-lg font-medium">{t('bighaTitle')}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t('bighaStandards')}</p>
          </div>
        </div>
      </section>

      {/* Worked example */}
      <section className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-xl font-semibold">{t('exampleTitle')}</h2>
        <p className="mt-3 text-sm leading-relaxed opacity-90">{t('exampleBody')}</p>
      </section>

      {/* Why units matter */}
      <section className="mt-10 border-t pt-8">
        <h2 className="text-2xl sm:text-3xl">{t('contextTitle')}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t('contextBody')}</p>
      </section>

      {/* FAQ — collapsible */}
      <section className="mt-10 border-t pt-8" aria-labelledby="converter-faq">
        <h2 id="converter-faq" className="text-2xl sm:text-3xl">{t('faqTitle')}</h2>
        <dl className="mt-5 space-y-2">
          {FAQ_KEYS.map((key) => (
            <details key={key} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium">
                <span>{t(`faq.${key}.q`)}</span>
                <svg
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <dd className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(`faq.${key}.a`)}
              </dd>
            </details>
          ))}
        </dl>
      </section>

      <RelatedTools current="converter" />
    </article>
  );
}