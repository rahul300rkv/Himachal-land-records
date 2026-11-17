import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, FileCheck2 } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { BLOG_GUIDES } from '@/lib/blog-guides';
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
      <Link href="/blog/7-documents-before-buying-land" className="concept-card group mt-10 grid overflow-hidden rounded-3xl border bg-card shadow-[8px_9px_0_rgba(42,16,45,0.08)] transition hover:-translate-y-1 hover:border-primary/40 lg:grid-cols-[1.15fr_1fr]">
        <div className="relative min-h-64 overflow-hidden lg:min-h-[28rem]">
          <Image src="/images/blog-land-research.webp" alt="" fill sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
        <div className="flex flex-col justify-center p-6 sm:p-9">
          <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary"><FileCheck2 className="size-6" aria-hidden="true" /></span>
          <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('article.readTime')}</p>
          <h2 className="mt-2 text-3xl sm:text-4xl">{t('article.title')}</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{t('article.summary')}</p>
          <span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">{t('read')} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
        </div>
      </Link>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {BLOG_GUIDES.map((guide) => {
          const language = locale === 'hi' ? 'hi' : 'en';
          return <Link key={guide.slug} href={`/blog/${guide.slug}`} className="concept-card group overflow-hidden rounded-3xl border bg-card shadow-[6px_7px_0_rgba(42,16,45,0.07)] transition hover:-translate-y-1 hover:border-primary/40">
            <div className="relative aspect-[16/9] overflow-hidden"><Image src={guide.image} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /></div>
            <div className="p-6"><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{guide.readTime[language]}</p><h2 className="mt-2 text-2xl">{guide.title[language]}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{guide.summary[language]}</p><span className="mt-5 inline-flex items-center gap-2 font-semibold text-primary">{t('read')} <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" /></span></div>
          </Link>;
        })}
      </div>
    </article>
  );
}
