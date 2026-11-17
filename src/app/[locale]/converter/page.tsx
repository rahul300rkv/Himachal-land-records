import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { LandConverter } from '@/components/tools/LandConverter';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Converter' });
  return pageMetadata({ locale, path: '/converter', title: t('title'), description: t('intro') });
}

export default async function ConverterPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Converter');

  return (
    <article className="container max-w-5xl py-10 sm:py-16">
      <header className="mx-auto mb-10 max-w-3xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">HimLand Check · Field guide</p>
        <h1 className="text-4xl leading-tight sm:text-6xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{t('intro')}</p>
      </header>
      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_20px_70px_-35px_hsl(var(--primary)/0.45)] sm:p-10">
        <LandConverter />
        <p className="mt-7 border-t border-border pt-5 text-sm leading-6 text-muted-foreground">{t('note')}</p>
      </div>
      <section className="mx-auto mt-14 max-w-4xl space-y-7 text-base leading-7" aria-labelledby="converter-standards">
        <h2 id="converter-standards" className="text-3xl sm:text-4xl">{t('standardsTitle')}</h2>
        <p className="text-muted-foreground">{t('standardsIntro')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/30 p-6"><h3 className="text-xl font-medium">{t('kanalTitle')}</h3><p className="mt-3 text-muted-foreground">{t('kanalStandards')}</p></div>
          <div className="rounded-xl border border-border bg-muted/30 p-6"><h3 className="text-xl font-medium">{t('bighaTitle')}</h3><p className="mt-3 text-muted-foreground">{t('bighaStandards')}</p></div>
        </div>
        <div className="rounded-xl bg-primary p-6 text-primary-foreground sm:p-8"><h2 className="text-2xl">{t('exampleTitle')}</h2><p className="mt-3 leading-7 opacity-90">{t('exampleBody')}</p></div>
        <div><h2 className="text-3xl sm:text-4xl">{t('faqTitle')}</h2><dl className="mt-5 divide-y divide-border rounded-xl border border-border">{(['districts', 'which', 'records', 'rounding'] as const).map((key) => <div className="p-5 sm:p-6" key={key}><dt className="text-lg font-medium">{t(`faq.${key}.q`)}</dt><dd className="mt-2 text-muted-foreground">{t(`faq.${key}.a`)}</dd></div>)}</dl></div>
      </section>
    </article>
  );
}
