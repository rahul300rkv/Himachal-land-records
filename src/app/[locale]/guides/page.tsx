import type { Metadata } from 'next';
import Image from 'next/image';
import { Landmark, TreePine, Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

const GUIDES = [
  { key: 'buyLand',    icon: Landmark  },
  { key: 'legalHeir', icon: Users      },
  { key: 'forestLand',icon: TreePine   },
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

function getValues<T>(value?: Record<string, T> | T[]): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : Object.values(value);
}

/* ─── Checklist grid ──────────────────────────────────────────────────── */
function ContentList({ items }: { items?: ContentItems }) {
  const values = getValues(items);
  if (values.length === 0) return null;

  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {values.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-xl border border-border/60 bg-muted/40 p-4 text-sm leading-relaxed"
        >
          {/* small filled bullet */}
          <span
            className="mt-[3px] size-2 shrink-0 rounded-full bg-primary/60"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Callout / note ──────────────────────────────────────────────────── */
function Note({ text }: { text: string }) {
  return (
    <div className="mt-5 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed">
      <span className="mt-px shrink-0 text-primary" aria-hidden="true">
        ↳
      </span>
      <p>{text}</p>
    </div>
  );
}

/* ─── Full guide detail block ─────────────────────────────────────────── */
function GuideDetails({ page }: { page?: GuidePageContent }) {
  if (!page) return null;

  const sections  = Object.entries(page.sections ?? {});
  const faqItems  = getValues(page.faq?.items);

  return (
    <div className="mt-8 border-t border-border/60 pt-8">

      {/* Intro paragraph */}
      {page.intro && (
        <p className="mb-10 text-base leading-[1.8] text-muted-foreground">
          {page.intro}
        </p>
      )}

      {/* Sections */}
      <div className="space-y-10">
        {sections.map(([sectionKey, section], idx) => (
          <section key={sectionKey}>

            {section.title && (
              <div className="flex items-baseline gap-3">
                {/* step counter */}
                <span
                  className="shrink-0 font-mono text-xs font-semibold tabular-nums text-primary/50"
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">
                  {section.title}
                </h3>
              </div>
            )}

            {section.intro && (
              <p className="mt-3 pl-8 leading-relaxed text-muted-foreground">
                {section.intro}
              </p>
            )}

            {section.body && (
              <div className="mt-3 space-y-3 pl-8 leading-[1.8] text-muted-foreground">
                {(Array.isArray(section.body)
                  ? section.body
                  : [section.body]
                ).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            <div className={section.title ? 'pl-8' : ''}>
              <ContentList items={section.items} />
              {section.note && <Note text={section.note} />}
            </div>

          </section>
        ))}
      </div>

      {/* FAQ accordion */}
      {faqItems.length > 0 && (
        <section className="mt-12">
          {page.faq?.title && (
            <h3 className="mb-5 text-lg font-semibold tracking-tight">
              {page.faq.title}
            </h3>
          )}

          <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden">
            {faqItems.map((faq, i) => (
              <details key={i} className="group bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium hover:bg-muted/40 transition-colors">
                  <span>{faq.q}</span>
                  <span
                    className="shrink-0 size-5 flex items-center justify-center rounded-full border border-border text-xs text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  >
                    ↓
                  </span>
                </summary>
                <p className="border-t border-border/60 bg-muted/20 px-5 py-4 text-sm leading-[1.8] text-muted-foreground">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA strip */}
      {page.cta && (
        <div className="mt-10 grid gap-1 rounded-xl border border-primary/25 bg-primary/5 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            {page.cta.title && (
              <p className="font-semibold">{page.cta.title}</p>
            )}
            {page.cta.body && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {page.cta.body}
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

/* ─── Metadata ────────────────────────────────────────────────────────── */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Guides' });
  return pageMetadata({ locale, path: '/guides', title: t('title'), description: t('intro') });
}

/* ─── Page ────────────────────────────────────────────────────────────── */
export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Guides');
  const tSeo = await getTranslations('Seo');
  const breadcrumbTrail = [
    { name: tSeo('breadcrumb.home'), href: '/' },
    { name: tSeo('breadcrumb.guides'), href: '/guides' },
  ];

  return (
    <article className="container max-w-5xl py-10 sm:py-16">
      <Breadcrumbs trail={breadcrumbTrail} className="mb-6" />

      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">
            {t('eyebrow')}
          </p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
            {t('title')}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {t('intro')}
          </p>

          {/* Quick-jump nav */}
          <nav
            className="mt-7 flex flex-wrap gap-2"
            aria-label="Jump to guide"
          >
            {GUIDES.map(({ key }, i) => {
              const guide = (t.raw as (k: string) => unknown)(
                `items.${key}`,
              ) as GuideContent;
              return (
                <a
                  key={key}
                  href={`#${key}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
                >
                  <span className="font-mono text-primary/60">{i + 1}</span>
                  {guide.title}
                </a>
              );
            })}
          </nav>
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

      {/* ══════════════════════════════════════════
          GUIDES
      ══════════════════════════════════════════ */}
      <div className="mt-14 space-y-10">
        {GUIDES.map(({ key, icon: Icon }, index) => {
          const guide = (t.raw as (k: string) => unknown)(
            `items.${key}`,
          ) as GuideContent;

          return (
            <section
              key={key}
              id={key}
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              {/* ── Coloured top bar ── */}
              <div className="h-1 w-full bg-primary/20" />

              <div className="p-7 sm:p-10">

                {/* Guide heading row */}
                <div className="flex items-start gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {t('guideLabel', { number: index + 1 })}
                    </p>
                    <h2 className="mt-0.5 text-2xl font-semibold leading-snug sm:text-3xl">
                      {guide.title}
                    </h2>
                  </div>
                </div>

                {/* Lead paragraph */}
                <p className="mt-6 text-base leading-[1.8] text-muted-foreground">
                  {guide.body}
                </p>

                {/* Three key points */}
                <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[guide.point1, guide.point2, guide.point3].map((pt, pi) => (
                    <li
                      key={pi}
                      className="rounded-xl border border-border/70 bg-muted/50 px-4 py-3 text-sm leading-relaxed"
                    >
                      <span className="mb-1 block font-mono text-[10px] font-semibold uppercase tracking-widest text-primary/50">
                        Point {pi + 1}
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Full expanded content */}
                <GuideDetails page={guide.page} />

              </div>
            </section>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════
          REVIEW NOTE
      ══════════════════════════════════════════ */}
      {t.has('reviewNote') && (
        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">
          {t('reviewNote')}
        </p>
      )}

    </article>
  );
}