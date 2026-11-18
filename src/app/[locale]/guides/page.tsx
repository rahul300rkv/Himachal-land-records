
import type { Metadata } from 'next';
import Image from 'next/image';
import { BookOpen, FileCheck2, Scale } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

const GUIDES = [
  { key: 'jamabandi', icon: BookOpen },
  { key: 'beforeBuy', icon: FileCheck2 },
  { key: 'section118', icon: Scale },
] as const;

type Props = {
  params: Promise<{ locale: string }>;
};

type ContentItems = Record<string, string> | string[];

type GuideSection = {
  title?: string;
  intro?: string;
  body?: string | string[];
  items?: ContentItems;
  note?: string;
};

type FAQItem = {
  q: string;
  a: string;
};

type GuidePageContent = {
  intro?: string;
  sections?: Record<string, GuideSection>;
  faq?: {
    title?: string;
    items?: Record<string, FAQItem> | FAQItem[];
  };
  cta?: {
    title?: string;
    body?: string;
  };
};

type GuideContent = {
  title: string;
  body: string;
  point1: string;
  point2: string;
  point3: string;
  page?: GuidePageContent;
};

function getValues<T>(
  value?: Record<string, T> | T[],
): T[] {
  if (!value) return [];

  return Array.isArray(value)
    ? value
    : Object.values(value);
}

function ContentList({
  items,
}: {
  items?: ContentItems;
}) {
  const values = getValues(items);

  if (values.length === 0) return null;

  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
      {values.map((item, index) => (
        <li
          key={index}
          className="rounded-lg border bg-muted/50 p-4 text-sm leading-relaxed"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function GuideDetails({
  page,
}: {
  page?: GuidePageContent;
}) {
  if (!page) return null;

  const sections = Object.entries(page.sections ?? {});
  const faqItems = getValues(page.faq?.items);

  return (
    <div className="mt-8 border-t pt-7">
      {/* Detailed guide introduction */}
      {page.intro && (
        <p className="mb-8 text-base leading-relaxed text-muted-foreground">
          {page.intro}
        </p>
      )}

      {/* All guide sections */}
      <div className="space-y-8">
        {sections.map(([sectionKey, section]) => (
          <section key={sectionKey}>
            {section.title && (
              <h3 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h3>
            )}

            {section.intro && (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {section.intro}
              </p>
            )}

            {section.body && (
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground">
                {(
                  Array.isArray(section.body)
                    ? section.body
                    : [section.body]
                ).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Section lists, column explanations and checklists */}
            <ContentList items={section.items} />

            {/* Important notes and examples */}
            {section.note && (
              <div className="mt-4 rounded-lg border-l-4 border-primary bg-primary/5 p-4 text-sm leading-relaxed">
                {section.note}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Frequently asked questions */}
      {faqItems.length > 0 && (
        <section className="mt-10">
          {page.faq?.title && (
            <h3 className="text-xl font-semibold tracking-tight">
              {page.faq.title}
            </h3>
          )}

          <div className="mt-4 space-y-3">
            {faqItems.map((faq, index) => (
              <details
                key={index}
                className="group rounded-lg border bg-card p-4"
              >
                <summary className="cursor-pointer list-none font-medium">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}

                    <span className="shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                      ↓
                    </span>
                  </span>
                </summary>

                <p className="mt-3 border-t pt-3 text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Guide call to action */}
      {page.cta && (
        <div className="mt-10 rounded-xl bg-primary/5 p-6">
          {page.cta.title && (
            <h3 className="text-xl font-semibold">
              {page.cta.title}
            </h3>
          )}

          {page.cta.body && (
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {page.cta.body}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'Guides',
  });

  return pageMetadata({
    locale,
    path: '/guides',
    title: t('title'),
    description: t('intro'),
  });
}

export default async function GuidesPage({
  params,
}: Props) {
  const { locale } = await params;

  setRequestLocale(locale as Locale);

  const t = await getTranslations('Guides');

  return (
    <article className="container max-w-5xl py-10 sm:py-14">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <header className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr]">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">
            {t('eyebrow')}
          </p>

          <h1 className="mt-3 text-4xl sm:text-5xl">
            {t('title')}
          </h1>

          <p className="mt-4 text-lg text-muted-foreground">
            {t('intro')}
          </p>
        </div>

        <div className="concept-card relative aspect-[16/10] overflow-hidden rounded-3xl border bg-muted shadow-[8px_9px_0_rgba(42,16,45,0.08)]">
          <Image
            src="/images/land-record-guides.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 52vw, 100vw"
            className="object-cover"
          />
        </div>

      </header>

      {/* =========================================
          THREE COMPLETE GUIDES
          All content stays on this same URL.
      ========================================= */}

      <div className="mt-10 space-y-8">

        {GUIDES.map(({ key, icon: Icon }, index) => {

          const guide = t.raw(
            `items.${key}`,
          ) as GuideContent;

          return (
            <section
              key={key}
              className="rounded-xl border bg-card p-6 sm:p-8"
            >

              {/* Guide heading */}
              <div className="flex items-start gap-4">

                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon
                    className="size-5"
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t('guideLabel', {
                      number: index + 1,
                    })}
                  </p>

                  <h2 className="mt-1 text-2xl">
                    {guide.title}
                  </h2>
                </div>

              </div>

              {/* Existing guide overview */}
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {guide.body}
              </p>

              {/* Existing three overview points */}
              <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
                {[
                  guide.point1,
                  guide.point2,
                  guide.point3,
                ].map((point, pointIndex) => (
                  <li
                    key={pointIndex}
                    className="rounded-md bg-muted p-3"
                  >
                    {point}
                  </li>
                ))}
              </ul>

              {/* Full content from items.<guide>.page */}
              <GuideDetails page={guide.page} />

            </section>
          );
        })}

      </div>

      {/* =========================================
          REVIEW NOTE
      ========================================= */}

      {t.has('reviewNote') && (
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          {t('reviewNote')}
        </p>
      )}

    </article>
  );
}
