import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { SITE, formatLegalDate } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'About' });
  return pageMetadata({ locale, path: '/about', title: t('title'), description: t('intro') });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('About');
  const nav = await getTranslations('Navigation');

  return (
    <article className="container max-w-3xl py-12 sm:py-16">
      <header>
        <h1 className="text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {t('lastUpdated', { date: formatLegalDate(locale) })}
        </p>
        <p className="mt-6 text-xl leading-relaxed">{t('intro')}</p>
      </header>

      <section className="mt-12 border-t pt-8">
        <h2 className="text-2xl">{t('whatWeDo.title')}</h2>
        <p className="mt-3 text-lg leading-relaxed">{t('whatWeDo.body')}</p>
      </section>

      <section className="mt-10 border-t pt-8">
        <h2 className="text-2xl">{t('whatWeAreNot.title')}</h2>
        <p className="mt-3 text-lg leading-relaxed">{t('whatWeAreNot.body')}</p>
      </section>

      <section className="mt-10 border-t pt-8">
        <h2 className="text-2xl">{t('whoRuns.title')}</h2>
        <p className="mt-3 text-lg leading-relaxed">{t('whoRuns.body', { company: SITE.companyName })}</p>
      </section>

      <nav aria-label={t('related')} className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t pt-6 text-sm">
        <span className="font-semibold">{t('related')}:</span>
        <Link href="/disclaimer" className="text-primary hover:underline">
          {nav('disclaimer')}
        </Link>
        <Link href="/privacy" className="text-primary hover:underline">
          {nav('privacy')}
        </Link>
        <Link href="/terms" className="text-primary hover:underline">
          {nav('terms')}
        </Link>
      </nav>
    </article>
  );
}
