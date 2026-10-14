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
    <article className="container max-w-3xl py-12 sm:py-16">
      <header className="mb-8">
        <h1 className="text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>
      </header>
      <LandConverter />
      <p className="mt-6 text-sm text-muted-foreground">{t('note')}</p>
    </article>
  );
}
