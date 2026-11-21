import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowRight, CalendarDays, ChevronDown, ExternalLink, ListOrdered, ShieldAlert } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import type { Locale } from '@/i18n/routing';
import { BLOG_GUIDES, getBlogGuide, type BlogGuide } from '@/lib/blog-guides';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

type Props = { params: Promise<{ locale: string; slug: string }> };
type Lang = 'en' | 'hi';
type Section = BlogGuide['sections'][number];

/* ---------- helpers ---------- */

function isFaqSection(section: Section) {
  return /^frequently asked questions/i.test(section.title.en);
}

/** Splits "Question? Answer." strings at the first "? ". */
function parseFaq(items: string[]) {
  return items
    .map((item) => {
      const idx = item.indexOf('? ');
      if (idx === -1) return null;
      return { question: item.slice(0, idx + 1).trim(), answer: item.slice(idx + 2).trim() };
    })
    .filter((x): x is { question: string; answer: string } => Boolean(x && x.answer));
}

function formatDate(iso: string, language: Lang) {
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));
}

/** Data links are written as /en/...; point them at the active locale. */
function localizeHref(href: string, locale: string) {
  if (!href.startsWith('/')) return href;
  return href.replace(/^\/(en|hi)(?=\/|$)/, `/${locale}`);
}

const TABLE_HEADERS: Record<Lang, string[]> = {
  en: ['Term', 'What it records', 'When', 'Handled by', 'Legal effect'],
  hi: ['शब्द', 'क्या दर्ज करता है', 'कब', 'कौन संभालता है', 'कानूनी प्रभाव'],
};

/* ---------- section renderer ---------- */

function renderSectionContent(language: Lang, locale: string, section: Section) {
  const items = section.list?.[language] ?? [];
  const faq = isFaqSection(section);
  const hasTable = !faq && items.length > 0 && items.every((item) => item.includes('|'));
  const faqItems = faq ? parseFaq(items) : [];
  const showFaq = faq && faqItems.length > 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-serif text-foreground">{section.title[language]}</h2>
      {section.citation && (
        <p className="mt-1 text-xs italic text-muted-foreground/80 border-l-2 border-muted pl-3">
          {section.citation[language]}
        </p>
      )}
      <p className="leading-relaxed text-muted-foreground">{section.body[language]}</p>

      {hasTable && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-muted">
            <thead>
              <tr>
                {TABLE_HEADERS[language].map((header) => (
                  <th key={header} className="text-left bg-muted/50 font-semibold text-muted-foreground border-b border-muted p-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, ri) => (
                <tr key={ri} className="border-b border-muted/50">
                  {item.split('|').map((cell, ci) => {
                    const text = cell.trim();
                    if (ci === 0) {
                      const [name, ...rest] = text.split(': ');
                      return (
                        <td key={ci} className="p-3 align-top">
                          <span className="font-semibold text-foreground">{name}</span>
                          {rest.length > 0 && (
                            <span className="mt-1 block text-xs text-muted-foreground">{rest.join(': ')}</span>
                          )}
                        </td>
                      );
                    }
                    return (
                      <td key={ci} className="p-3 align-top text-muted-foreground">
                        {text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showFaq && (
        <div className="mt-4 space-y-3">
          {faqItems.map((faqItem, i) => (
            <details key={i} className="group rounded-lg border bg-background px-4 py-3 open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <span>{faqItem.question}</span>
                <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="mt-3 leading-relaxed text-muted-foreground">{faqItem.answer}</p>
            </details>
          ))}
        </div>
      )}

      {!hasTable && !showFaq && items.length > 0 && (
        <ul className="mt-4 space-y-2 list-disc list-inside text-muted-foreground leading-relaxed sm:text-sm">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{item}</li>
          ))}
        </ul>
      )}

      {section.note && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
          <p className="text-sm leading-relaxed text-amber-900/90">{section.note[language]}</p>
        </div>
      )}

      {section.link && (() => {
        const href = localizeHref(section.link.href, locale);
        const external = !href.startsWith('/');
        return (
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            {section.link.label[language]} →
          </a>
        );
      })()}
    </div>
  );
}

/* ---------- Next.js hooks ---------- */

export function generateStaticParams() {
  return BLOG_GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBlogGuide(slug);
  if (!guide) return {};
  const language: Lang = locale === 'hi' ? 'hi' : 'en';
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: guide.title[language],
    description: guide.summary[language],
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.updatedAt ?? guide.publishedAt,
  });
}

/* ---------- page ---------- */

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const guide = getBlogGuide(slug);
  if (!guide) notFound();
  setRequestLocale(locale as Locale);
  const language: Lang = locale === 'hi' ? 'hi' : 'en';
  const articleUrl = absoluteUrl(`/${locale}/blog/${slug}`);

  const labels =
    language === 'hi'
      ? {
          eyebrow: 'भूमि जाँच मार्गदर्शिका',
          takeaway: 'मुख्य निष्कर्ष',
          sources: 'आधिकारिक स्रोत',
          home: 'होम',
          blog: 'ब्लॉग',
          published: 'प्रकाशित',
          updated: 'अद्यतन',
          toc: 'इस लेख में',
          related: 'और मार्गदर्शिकाएँ पढ़ें',
          readMore: 'पढ़ें',
          disclaimerTitle: 'सूचना',
          disclaimer:
            'यह मार्गदर्शिका केवल सामान्य जानकारी के लिए है और कानूनी सलाह नहीं है। कानून और प्रक्रियाएँ बदल सकती हैं। किसी भी लेन-देन से पहले वर्तमान आधिकारिक पाठ की पुष्टि करें और योग्य हिमाचली संपत्ति वकील से सलाह लें।',
          faqJump: 'अक्सर पूछे जाने वाले प्रश्न',
          allGuides: 'सभी मार्गदर्शिकाएँ',
        }
      : {
          eyebrow: 'Land due-diligence guide',
          takeaway: 'Key takeaway',
          sources: 'Official sources',
          home: 'Home',
          blog: 'Blog',
          published: 'Published',
          updated: 'Last updated',
          toc: 'In this guide',
          related: 'More guides',
          readMore: 'Read guide',
          disclaimerTitle: 'Please note',
          disclaimer:
            'This guide is for general information only and is not legal advice. Laws and procedures change. Confirm the current official text and consult a qualified Himachal property lawyer before any transaction.',
          faqJump: 'Frequently asked questions',
          allGuides: 'All guides',
        };

  const faqSection = guide.sections.find(isFaqSection);
  const faqItems = faqSection ? parseFaq(faqSection.list?.[language] ?? []) : [];
  const modifiedAt = guide.updatedAt ?? guide.publishedAt;
  const hasUpdate = Boolean(guide.updatedAt);

  const relatedGuides = BLOG_GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: guide.title[language],
      description: guide.summary[language],
      image: [absoluteUrl(guide.image)],
      datePublished: guide.publishedAt,
      dateModified: modifiedAt,
      inLanguage: language === 'hi' ? 'hi-IN' : 'en-IN',
      mainEntityOfPage: articleUrl,
      author: { '@type': 'Organization', name: 'HimachalLand Check', url: absoluteUrl('/') },
      publisher: { '@id': `${absoluteUrl('/')}#organization` },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: absoluteUrl(`/${locale}`) },
        { '@type': 'ListItem', position: 2, name: labels.blog, item: absoluteUrl(`/${locale}/blog`) },
        { '@type': 'ListItem', position: 3, name: guide.title[language], item: articleUrl },
      ],
    },
  ];

  if (faqItems.length > 0) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${articleUrl}#faq`,
      inLanguage: language === 'hi' ? 'hi-IN' : 'en-IN',
      mainEntity: faqItems.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  const takeawayHtml = guide.takeaway[language]
    .replace(/\/(en|hi)\//g, `/${locale}/`)
    .replace(
      /class="takeaway-link"/g,
      'style="color: inherit; text-decoration: underline; text-underline-offset: 2px; font-weight: 600;"',
    );

  return (
    <article className="container max-w-4xl py-10 sm:py-14">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <Breadcrumbs
        trail={[
          { name: labels.home, href: '/' },
          { name: labels.blog, href: '/blog' },
          { name: guide.title[language], href: `/blog/${slug}` },
        ]}
        className="mb-6"
      />

      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{labels.eyebrow}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{guide.readTime[language]}</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{guide.title[language]}</h1>

        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {labels.published}: <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt, language)}</time>
          </span>
          {hasUpdate && (
            <span>
              {labels.updated}: <time dateTime={modifiedAt}>{formatDate(modifiedAt, language)}</time>
            </span>
          )}
        </p>

        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.intro[language]}</p>
      </header>

      <figure className="concept-card relative mt-9 aspect-[16/9] overflow-hidden rounded-3xl border bg-muted shadow-[8px_9px_0_rgba(42,16,45,0.08)]">
        <Image src={guide.image} alt="" fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
      </figure>

      {/* Table of contents */}
      <nav aria-label={labels.toc} className="mt-10 rounded-xl border bg-muted/40 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-serif text-foreground">
          <ListOrdered className="size-5" aria-hidden="true" />
          {labels.toc}
        </h2>
        <ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {guide.sections.map((section, index) => (
            <li key={section.title.en} className="flex gap-2">
              <span className="font-semibold text-primary">{index + 1}.</span>
              <a href={`#section-${index + 1}`} className="text-muted-foreground hover:text-foreground hover:underline">
                {section.title[language]}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="mt-10 space-y-8">
        {guide.sections.map((section, index) => (
          <section
            key={section.title.en}
            id={`section-${index + 1}`}
            className="scroll-mt-24 rounded-xl border bg-card p-6 sm:p-8"
          >
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">{renderSectionContent(language, locale, section)}</div>
            </div>
          </section>
        ))}
      </div>

      {/* Takeaway */}
      <section className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-2xl text-primary-foreground">{labels.takeaway}</h2>
        <p className="mt-3 leading-7 text-primary-foreground/85" dangerouslySetInnerHTML={{ __html: takeawayHtml }} />
      </section>

      {/* Disclaimer */}
      <aside className="mt-8 flex gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-5" role="note">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-amber-900">{labels.disclaimerTitle}</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-900/90">{labels.disclaimer}</p>
        </div>
      </aside>

      {/* Sources */}
      <section className="mt-8 rounded-xl border bg-muted/50 p-6">
        <h2 className="text-xl">{labels.sources}</h2>
        <ul className="mt-4 space-y-3">
          {guide.sources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
              >
                {source.label}
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* Related guides */}
      {relatedGuides.length > 0 && (
        <section className="mt-12" aria-labelledby="related-guides">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-guides" className="text-2xl font-serif text-foreground">{labels.related}</h2>
            <a href={`/${locale}/blog`} className="text-sm font-semibold text-primary hover:underline">
              {labels.allGuides} →
            </a>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {relatedGuides.map((related) => (
              <a
                key={related.slug}
                href={`/${locale}/blog/${related.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] bg-muted">
                  <Image
                    src={related.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {related.readTime[language]}
                  </p>
                  <h3 className="mt-2 text-base font-serif leading-snug text-foreground group-hover:underline">
                    {related.title[language]}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {related.summary[language]}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {labels.readMore}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}