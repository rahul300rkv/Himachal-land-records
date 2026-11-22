import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, Check, ChevronDown, Info, Landmark, TreePine, Users } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

type Lang = 'en' | 'hi';

const GUIDES = [
  { key: 'buyLand', icon: Landmark },
  { key: 'legalHeir', icon: Users },
  { key: 'forestLand', icon: TreePine },
] as const;

/** Where each guide hands the reader next (tool or related article). */
const NEXT_STEP: Record<(typeof GUIDES)[number]['key'], { href: string; label: Record<Lang, string> }> = {
  buyLand: { href: '/check', label: { en: 'Jamabandi checker', hi: 'जमाबंदी जाँच' } },
  legalHeir: {
    href: '/blog/himachal-land-mutation-intkal-guide',
    label: { en: 'Land mutation (Intkal) guide', hi: 'भूमि इंतकाल (म्यूटेशन) मार्गदर्शिका' },
  },
  forestLand: { href: '/map', label: { en: 'Plot map lookup', hi: 'प्लॉट नक्शा खोज' } },
};

const COPY: Record<
  Lang,
  { jump: string; keyPoint: string; inGuide: string; note: string; questions: (n: number) => string; faq: string; next: string }
> = {
  en: {
    jump: 'Jump to guide',
    keyPoint: 'Key point',
    inGuide: 'In this guide',
    note: 'Good to know',
    questions: (n) => `${n} ${n === 1 ? 'question' : 'questions'}`,
    faq: 'Frequently asked questions',
    next: 'Next step',
  },
  hi: {
    jump: 'गाइड पर जाएँ',
    keyPoint: 'मुख्य बिंदु',
    inGuide: 'इस गाइड में',
    note: 'ध्यान दें',
    questions: (n) => `${n} प्रश्न`,
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    next: 'अगला कदम',
  },
};

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
          <span
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Note: amber, icon + label, so it never reads as body text or CTA ── */
function Note({ text, label }: { text: string; label: string }) {
  return (
    <aside
      role="note"
      className="mt-6 flex gap-3 rounded-r-xl border-l-4 border-amber-500 bg-amber-50 p-4 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100"
    >
      <Info className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        <p className="font-semibold">{label}</p>
        <p className="mt-1">{text}</p>
      </div>
    </aside>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────────────── */
function Faq({
  guideKey,
  title,
  items,
  copy,
}: {
  guideKey: string;
  title?: string;
  items: FAQItem[];
  copy: (typeof COPY)[Lang];
}) {
  if (items.length === 0) return null;
  const headingId = `${guideKey}-faq`;

  return (
    <section className="mt-12 scroll-mt-24" id={headingId} aria-labelledby={`${headingId}-title`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`${headingId}-title`} className="text-xl font-semibold tracking-tight">
          {title ?? copy.faq}
        </h3>
        <span className="text-sm text-muted-foreground">{copy.questions(items.length)}</span>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-border/70 bg-card transition-colors open:border-primary/40 open:bg-primary/[0.03]"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded-xl px-5 py-4 font-medium leading-snug outline-none hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-primary/50 [&::-webkit-details-marker]:hidden">
              <span>{faq.q}</span>
              <span
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-200 group-open:rotate-180 group-open:border-primary/40 group-open:text-primary"
                aria-hidden="true"
              >
                <ChevronDown className="size-4" />
              </span>
            </summary>
            <div className="mx-5 mb-5 border-l-2 border-primary/30 pl-4 text-sm leading-[1.8] text-muted-foreground">
              {faq.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ─── Full guide detail block ─────────────────────────────────────────── */
function GuideDetails({
  guideKey,
  page,
  lang,
}: {
  guideKey: (typeof GUIDES)[number]['key'];
  page?: GuidePageContent;
  lang: Lang;
}) {
  if (!page) return null;

  const copy = COPY[lang];
  const sections = Object.entries(page.sections ?? {});
  const faqItems = getValues(page.faq?.items);
  const next = NEXT_STEP[guideKey];
  const titled = sections.filter(([, s]) => s.title);

  return (
    <div className="mt-8 border-t border-border/60 pt-8">
      {page.intro && <p className="mb-8 text-base leading-[1.8] text-muted-foreground">{page.intro}</p>}

      {/* In-guide navigation */}
      {titled.length >= 3 && (
        <nav aria-label={copy.inGuide} className="mb-10 rounded-xl border border-border/60 bg-muted/30 p-4">
          <p className="text-sm font-semibold">{copy.inGuide}</p>
          <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {titled.map(([sectionKey, section]) => (
              <li key={sectionKey}>
                <a href={`#${guideKey}-${sectionKey}`} className="text-muted-foreground hover:text-foreground hover:underline">
                  {section.title}
                </a>
              </li>
            ))}
            {faqItems.length > 0 && (
              <li>
                <a href={`#${guideKey}-faq`} className="text-muted-foreground hover:text-foreground hover:underline">
                  {page.faq?.title ?? copy.faq}
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}

      {/* Sections */}
      <div className="space-y-10">
        {sections.map(([sectionKey, section], idx) => (
          <section key={sectionKey} id={`${guideKey}-${sectionKey}`} className="scroll-mt-24">
            {section.title && (
              <div className="flex items-baseline gap-3">
                <span
                  className="shrink-0 font-mono text-xs font-semibold tabular-nums text-primary/50"
                  aria-hidden="true"
                >
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">{section.title}</h3>
              </div>
            )}

            <div className={section.title ? 'pl-8' : ''}>
              {section.intro && <p className="mt-3 leading-relaxed text-muted-foreground">{section.intro}</p>}

              {section.body && (
                <div className="mt-3 space-y-3 leading-[1.8] text-muted-foreground">
                  {(Array.isArray(section.body) ? section.body : [section.body]).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}

              <ContentList items={section.items} />
              {section.note && <Note text={section.note} label={copy.note} />}
            </div>
          </section>
        ))}
      </div>

      <Faq guideKey={guideKey} title={page.faq?.title} items={faqItems} copy={copy} />

      {/* Next step: solid block, clearly an action */}
      {(page.cta || next) && (
        <div className="mt-12 flex flex-col gap-4 rounded-xl bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="min-w-0">
            {page.cta?.title && <p className="text-lg font-semibold text-primary-foreground">{page.cta.title}</p>}
            {page.cta?.body && (
              <p className="mt-1 text-sm leading-relaxed text-primary-foreground/85">{page.cta.body}</p>
            )}
          </div>
          <Link
            href={next.href}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-semibold text-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
          >
            <span className="sr-only">{copy.next}: </span>
            {next.label[lang]}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
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
  const lang: Lang = locale === 'hi' ? 'hi' : 'en';
  const copy = COPY[lang];
  const t = await getTranslations('Guides');
  const tSeo = await getTranslations('Seo');
  const breadcrumbTrail = [
    { name: tSeo('breadcrumb.home'), href: '/' },
    { name: tSeo('breadcrumb.guides'), href: '/guides' },
  ];

  const guides = GUIDES.map(({ key, icon }) => ({
    key,
    icon,
    content: (t.raw as (k: string) => unknown)(`items.${key}`) as GuideContent,
  }));

  const pageUrl = absoluteUrl(`/${locale}/guides`);
  const inLanguage = lang === 'hi' ? 'hi-IN' : 'en-IN';
  const allFaqs = guides.flatMap(({ content }) => getValues(content.page?.faq?.items));

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#page`,
      url: pageUrl,
      name: t('title'),
      description: t('intro'),
      inLanguage,
      publisher: { '@id': `${absoluteUrl('/')}#organization` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: guides.length,
        itemListElement: guides.map(({ key, content }, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: content.title,
          url: `${pageUrl}#${key}`,
        })),
      },
    },
  ];
  // One FAQPage per URL: merge every guide's questions into it.
  if (allFaqs.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      inLanguage,
      mainEntity: allFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return (
    <article className="container max-w-5xl py-10 sm:py-16">
      <JsonLd data={jsonLd} />
      <Breadcrumbs trail={breadcrumbTrail} className="mb-6" />

      {/* Header */}
      <header className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>

          <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{t('title')}</h1>

          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>

          {/* Quick-jump nav */}
          <nav className="mt-7 flex flex-wrap gap-2" aria-label={copy.jump}>
            {guides.map(({ key, content }, i) => (
              <a
                key={key}
                href={`#${key}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
              >
                <span className="font-mono text-primary/60">{i + 1}</span>
                {content.title}
              </a>
            ))}
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

      {/* Guides */}
      <div className="mt-14 space-y-10">
        {guides.map(({ key, icon: Icon, content: guide }, index) => (
          <section
            key={key}
            id={key}
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
          >
            <div className="h-1 w-full bg-primary/20" />

            <div className="p-7 sm:p-10">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                  <Icon className="size-5" aria-hidden="true" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t('guideLabel', { number: index + 1 })}
                  </p>
                  <h2 className="mt-0.5 text-2xl font-semibold leading-snug sm:text-3xl">{guide.title}</h2>
                </div>
              </div>

              <p className="mt-6 text-base leading-[1.8] text-muted-foreground">{guide.body}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[guide.point1, guide.point2, guide.point3].map((pt, pi) => (
                  <li
                    key={pi}
                    className="rounded-xl border border-border/70 bg-muted/50 px-4 py-3 text-sm leading-relaxed"
                  >
                    <span className="mb-1 block text-xs font-semibold text-primary/70">
                      {copy.keyPoint} {pi + 1}
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <GuideDetails guideKey={key} page={guide.page} lang={lang} />
            </div>
          </section>
        ))}
      </div>

      {t.has('reviewNote') && (
        <p className="mt-10 text-sm leading-relaxed text-muted-foreground">{t('reviewNote')}</p>
      )}
    </article>
  );
}