import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PlotMapLookup } from '@/components/map/PlotMapLookup';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

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
      <p className="mt-5 rounded-xl border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">{t('notice')}</p>
    </article>
  );
}
