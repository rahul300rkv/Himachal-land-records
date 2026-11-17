import type { Metadata } from 'next';
import Image from 'next/image';
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
      <section className="space-y-4 border-t border-border pt-8" aria-labelledby="nakal-overview">
        <h2 id="nakal-overview" className="text-2xl sm:text-3xl">{t('guide.title')}</h2>
        <p className="leading-relaxed text-muted-foreground">{t('guide.body')}</p>
        <figure className="overflow-hidden rounded-xl border border-border bg-card">
          <Image
            src="/images/nakal-checker-sample.webp"
            alt={t('guide.sample')}
            width={1200}
            height={675}
            sizes="(max-width: 672px) 100vw, 672px"
            className="h-auto w-full"
          />
        </figure>
      </section>
      <section className="space-y-4 border-t border-border pt-8" aria-labelledby="nakal-faq">
        <h2 id="nakal-faq" className="text-2xl sm:text-3xl">{t('guide.faqTitle')}</h2>
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {(['file', 'score', 'mortgage', 'cases', 'privacy'] as const).map((key) => (
            <details key={key} className="px-4 py-1 sm:px-5">
              <summary className="cursor-pointer py-3 font-medium">{t(`guide.faq.${key}.q`)}</summary>
              <p className="pb-4 leading-relaxed text-muted-foreground">{t(`guide.faq.${key}.a`)}</p>
            </details>
          ))}
        </div>
      </section>
      <DisclaimerPanel />
    </article>
  );
}
