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
    <article className="container max-w-xl py-8 sm:py-12">
      <header className="mb-6">
        <h1 className="text-3xl leading-tight sm:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('intro')}</p>
      </header>
      <LandConverter />
      <p className="mt-6 text-sm text-muted-foreground">{t('note')}</p>
      <section className="mt-10 space-y-6 text-sm leading-7" aria-labelledby="converter-standards">
        <h2 id="converter-standards" className="text-2xl">{t('standardsTitle')}</h2>
        <p className="text-muted-foreground">{t('standardsIntro')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4"><h3 className="font-medium">{t('kanalTitle')}</h3><p className="mt-2 text-muted-foreground">{t('kanalStandards')}</p></div>
          <div className="rounded-lg border border-border p-4"><h3 className="font-medium">{t('bighaTitle')}</h3><p className="mt-2 text-muted-foreground">{t('bighaStandards')}</p></div>
        </div>
        <div><h2 className="text-2xl">{t('exampleTitle')}</h2><p className="mt-2 text-muted-foreground">{t('exampleBody')}</p></div>
        <div><h2 className="text-2xl">{t('faqTitle')}</h2><dl className="mt-3 space-y-4">{(['districts', 'which', 'records', 'rounding'] as const).map((key) => <div key={key}><dt className="font-medium">{t(`faq.${key}.q`)}</dt><dd className="mt-1 text-muted-foreground">{t(`faq.${key}.a`)}</dd></div>)}</dl></div>
      </section>
    </article>
  );
}
