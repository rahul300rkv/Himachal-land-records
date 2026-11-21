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

const FAQ_KEYS = ['districts', 'which', 'records', 'rounding', 'ownership', 'biswa', 'kanal', 'section118'] as const;

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

      {/* Why units matter — context section */}
      <section className="mt-10 border-t pt-8">
        <h2 className="text-2xl sm:text-3xl">{t('contextTitle')}</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t('contextBody')}</p>
      </section>

      {/* FAQ */}
      <section className="mt-10 border-t pt-8" aria-labelledby="converter-faq">
        <h2 id="converter-faq" className="text-2xl sm:text-3xl">{t('faqTitle')}</h2>
        <dl className="mt-6 space-y-0 divide-y divide-border rounded-xl border border-border">
          {FAQ_KEYS.map((key) => (
            <div key={key} className="p-5 sm:p-6">
              <dt className="font-semibold leading-snug">{t(`faq.${key}.q`)}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`faq.${key}.a`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <RelatedTools current="converter" />
    </article>
  );
}