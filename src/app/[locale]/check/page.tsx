import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { NakalChecker } from '@/components/nakal/NakalChecker';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'NakalCheck' });
  return pageMetadata({ locale, path: '/check', title: t('title'), description: t('intro') });
}

export default async function CheckPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('NakalCheck');

  return (
    <article className="container max-w-2xl space-y-6 py-8 sm:py-12">
      <header>
        <h1 className="text-3xl leading-tight sm:text-4xl">{t('title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t('intro')}</p>
      </header>
      <NakalChecker />
      <DisclaimerPanel />
    </article>
  );
}
