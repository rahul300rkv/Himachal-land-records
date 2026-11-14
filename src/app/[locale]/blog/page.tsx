import type { Metadata } from 'next';
import { ArrowRight, FileCheck2 } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Blog' });
  return pageMetadata({ locale, path: '/blog', title: t('title'), description: t('intro') });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Blog');
  return (
    <article className="container max-w-5xl py-10 sm:py-14">
      <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p><h1 className="mt-3 text-4xl sm:text-5xl">{t('title')}</h1><p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p></header>
      <Link href="/blog/7-documents-before-buying-land" className="group mt-10 block rounded-xl border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary"><FileCheck2 className="size-6" aria-hidden="true" /></span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('article.readTime')}</p>
        <h2 className="mt-2 text-2xl sm:text-3xl">{t('article.title')}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">{t('article.summary')}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">{t('read')} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
      </Link>
    </article>
  );
}
