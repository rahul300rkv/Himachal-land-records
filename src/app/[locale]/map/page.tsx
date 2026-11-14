import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapViewer } from '@/components/record/MapViewer';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { SAMPLE_RECORDS } from '@/lib/data/sample-records';
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
  const sample = SAMPLE_RECORDS[0];
  return (
    <article className="container max-w-6xl py-10 sm:py-14">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p>
      </header>
      <div className="mt-8"><MapViewer geojson={sample.map_geojson} /></div>
      <div className="mt-5 flex flex-col justify-between gap-4 rounded-lg border bg-muted/40 p-5 sm:flex-row sm:items-center">
        <div><h2 className="text-xl">{t('demoTitle')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('demoBody', { khasra: sample.khasra_number })}</p></div>
        <Link href="/search" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">{t('search')} <ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t('notice')}</p>
    </article>
  );
}
