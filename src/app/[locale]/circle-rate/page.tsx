import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CircleRateLookup } from '@/components/tools/CircleRateLookup';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { meghDistricts } from '@/lib/megh-circle-rates';
import { districtLabel } from '@/lib/data/districts';

const topics = ['meaning', 'variation', 'date'] as const;
const lookupKeys = ['district', 'office', 'choose', 'submit', 'loading', 'failed', 'empty', 'file', 'uploaded', 'download'] as const;
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CircleRateTool' });
  return pageMetadata({ locale, path: '/circle-rate', title: t('title'), description: t('intro') });
}

export default async function CircleRatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('CircleRateTool');

  return (
    <article className="container max-w-6xl py-10 sm:py-14">
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p>
      </header>
      <section className="mt-8 rounded-xl border bg-card p-5 sm:p-6">
        <h2 className="text-2xl">{t('lookup')}</h2>
        <p className="mt-2 text-muted-foreground">{t('lookupHelp')}</p>
        <CircleRateLookup
          districts={meghDistricts.map(([id, name]) => [id, districtLabel(name === 'Lahaul-Spiti' ? 'Lahaul and Spiti' : name, locale)])}
          copy={Object.fromEntries(lookupKeys.map((key) => [key, t(`form.${key}`)])) as Record<(typeof lookupKeys)[number], string>}
        />
      </section>
      <section aria-labelledby="circle-rate-overview" className="mt-10 max-w-3xl">
        <h2 id="circle-rate-overview" className="text-2xl">{t('overview')}</h2>
        <p className="mt-3 text-muted-foreground">{t('overviewBody')}</p>
        <Link href="/stamp-duty-calculator" className="mt-2 inline-flex min-h-12 items-center font-medium text-primary underline">
          {t('stampDuty')}
        </Link>
      </section>
      <section aria-labelledby="circle-rate-faq" className="mt-8 max-w-3xl">
        <h2 id="circle-rate-faq" className="text-2xl">{t('faq')}</h2>
        <div className="mt-4 space-y-3">
          {topics.map((topic) => (
            <details key={topic} className="rounded-xl border bg-card">
              <summary className="min-h-12 cursor-pointer px-4 py-3 font-medium">{t(`questions.${topic}.q`)}</summary>
              <p className="px-4 pb-4 text-muted-foreground">{t(`questions.${topic}.a`)}</p>
            </details>
          ))}
        </div>
      </section>
    </article>
  );
}
