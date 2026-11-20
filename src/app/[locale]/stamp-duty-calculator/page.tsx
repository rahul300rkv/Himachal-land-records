import { setRequestLocale } from 'next-intl/server';
import { StampDutyCalculator } from '@/components/tools/StampDutyCalculator';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedTools } from '@/components/seo/RelatedTools';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getStampDutyCopy } from '@/lib/stamp-duty-copy';

type Props = { params: Promise<{ locale: string }> };
const path = '/stamp-duty-calculator';

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const copy = getStampDutyCopy(locale);
  return pageMetadata({ locale, path, title: copy.title, description: copy.intro });
}

export default async function StampDutyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const copy = getStampDutyCopy(locale);
  return (
    <article className="container max-w-6xl py-10 sm:py-14">
      <Breadcrumbs current="stampDuty" className="mb-6" />
      <header className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{copy.intro}</p>
      </header>
      <StampDutyCalculator copy={copy} locale={locale} />
      <section aria-labelledby="stamp-overview" className="mt-10 max-w-3xl">
        <h2 id="stamp-overview" className="text-2xl">{copy.overview}</h2>
        <p className="mt-3 text-muted-foreground">{copy.overviewText}</p>
        <a href="https://rajpatra.hp.gov.in/OPENFILE1.aspx?ID=52317+&amp;etype=NSPECIAL" className="mt-3 inline-block font-medium text-primary underline">
          {copy.source}
        </a>
      </section>
      <section aria-labelledby="stamp-faq" className="mt-10 max-w-3xl">
        <h2 id="stamp-faq" className="text-2xl">{copy.faqTitle}</h2>
        <div className="mt-4 space-y-3">
          {copy.faq.map(([question, answer]) => (
            <details key={question} className="rounded-xl border bg-card">
              <summary className="min-h-12 cursor-pointer px-4 py-3 font-medium">{question}</summary>
              <p className="px-4 pb-4 text-muted-foreground">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <RelatedTools current="stampDuty" />
    </article>
  );
}
