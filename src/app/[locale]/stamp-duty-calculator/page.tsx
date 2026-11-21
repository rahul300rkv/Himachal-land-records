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
    <article className="container max-w-3xl py-10 sm:py-14">
      <Breadcrumbs current="stampDuty" className="mb-6" />

      <header>
        <h1 className="text-4xl sm:text-5xl">{copy.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{copy.intro}</p>
      </header>

      <StampDutyCalculator copy={copy} locale={locale} />

      <section aria-labelledby="stamp-overview" className="mt-10 border-t pt-8">
        <h2 id="stamp-overview" className="text-2xl">{copy.overview}</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{copy.overviewText}</p>
        <a
          href="https://rajpatra.hp.gov.in/OPENFILE1.aspx?ID=52317+&amp;etype=NSPECIAL"
          className="mt-3 inline-block font-medium text-primary underline underline-offset-4"
        >
          {copy.source}
        </a>
      </section>

      <section aria-labelledby="stamp-faq" className="mt-10 border-t pt-8">
        <h2 id="stamp-faq" className="text-2xl">{copy.faqTitle}</h2>
        <dl className="mt-5 space-y-2">
          {copy.faq.map(([question, answer]) => (
            <details key={question} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium">
                <span>{question}</span>
                <svg
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
            </details>
          ))}
        </dl>
      </section>

      <RelatedTools current="stampDuty" />
    </article>
  );
}