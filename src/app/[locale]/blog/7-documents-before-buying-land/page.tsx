import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight, CalendarDays, CheckCircle2, ExternalLink, ListOrdered } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/i18n/routing';
import { BLOG_GUIDES } from '@/lib/blog-guides';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

const PUBLISHED_AT = '2026-11-15T09:00:00+05:30';

const DOCUMENTS = [
  { key: 'jamabandi', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
  { key: 'tatima', url: 'https://bhunakshahp.nic.in/' },
  { key: 'intkal', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
  { key: 'titleDeed', url: 'https://ngdrshp.gov.in/NGDRS_HP_LIVE' },
  { key: 'mortgage', url: 'https://ngdrshp.gov.in/NGDRS_HP_LIVE' },
  { key: 'landUse', url: 'https://himachal.nic.in/revenue' },
  { key: 'section118', url: 'https://himachal.nic.in/revenue' },
] as const;

const SOURCES = [
  { label: 'HimBhoomi public land records', url: 'https://himbhoomilmk.nic.in/viewlandrecords.aspx' },
  { label: 'BhuNaksha Himachal Pradesh', url: 'https://bhunakshahp.nic.in/' },
  { label: 'NGDRS Himachal Pradesh (registration)', url: 'https://ngdrshp.gov.in/NGDRS_HP_LIVE' },
  { label: 'Himachal Pradesh Revenue Department', url: 'https://himachal.nic.in/revenue' },
];

const SLUG = '7-documents-before-buying-land';

type Props = { params: Promise<{ locale: string }> };
type Lang = 'en' | 'hi';

function formatDate(iso: string, language: Lang) {
  return new Intl.DateTimeFormat(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(iso));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Blog.sevenDocuments' });
  return pageMetadata({
    locale,
    path: `/blog/${SLUG}`,
    title: t('title'),
    description: t('intro'),
    type: 'article',
    publishedTime: PUBLISHED_AT,
    modifiedTime: PUBLISHED_AT,
  });
}

export default async function SevenDocumentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const language: Lang = locale === 'hi' ? 'hi' : 'en';
  const t = await getTranslations('Blog.sevenDocuments');
  const articleUrl = absoluteUrl(`/${locale}/blog/${SLUG}`);

  const labels =
    language === 'hi'
      ? {
          home: 'होम',
          blog: 'ब्लॉग',
          published: 'प्रकाशित',
          readTime: '7 दस्तावेज़ों की जाँच-सूची',
          toc: 'इस लेख में',
          checklist: 'त्वरित जाँच-सूची',
          checklistHint: 'सौदे में पैसा देने से पहले इन सातों की प्रमाणित प्रतियाँ और सत्यापन पूरा करें।',
          sources: 'आधिकारिक स्रोत',
          related: 'और मार्गदर्शिकाएँ पढ़ें',
          allGuides: 'सभी मार्गदर्शिकाएँ',
          readMore: 'पढ़ें',
        }
      : {
          home: 'Home',
          blog: 'Blog',
          published: 'Published',
          readTime: '7-document checklist',
          toc: 'In this guide',
          checklist: 'Quick checklist',
          checklistHint: 'Get certified copies and independent verification of all seven before any money changes hands.',
          sources: 'Official sources',
          related: 'More guides',
          allGuides: 'All guides',
          readMore: 'Read guide',
        };

  const relatedGuides = BLOG_GUIDES.filter((g) => g.slug !== SLUG).slice(0, 4);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: t('title'),
      description: t('intro'),
      image: [absoluteUrl('/images/seven-land-documents.webp')],
      datePublished: PUBLISHED_AT,
      dateModified: PUBLISHED_AT,
      inLanguage: language === 'hi' ? 'hi-IN' : 'en-IN',
      mainEntityOfPage: articleUrl,
      author: { '@type': 'Organization', name: 'HimachalLand Check', url: absoluteUrl('/') },
      publisher: { '@id': `${absoluteUrl('/')}#organization` },
      about: DOCUMENTS.map(({ key }) => t(`items.${key}.title`)),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: labels.home, item: absoluteUrl(`/${locale}`) },
        { '@type': 'ListItem', position: 2, name: labels.blog, item: absoluteUrl(`/${locale}/blog`) },
        { '@type': 'ListItem', position: 3, name: t('title'), item: articleUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${articleUrl}#documents`,
      name: t('title'),
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: DOCUMENTS.length,
      itemListElement: DOCUMENTS.map(({ key }, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: t(`items.${key}.title`),
        url: `${articleUrl}#${key}`,
      })),
    },
  ];

  return (
    <article className="container max-w-4xl py-10 sm:py-14">
      <JsonLd data={jsonLd} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li><a href={`/${locale}`} className="hover:underline">{labels.home}</a></li>
          <li aria-hidden="true">/</li>
          <li><a href={`/${locale}/blog`} className="hover:underline">{labels.blog}</a></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="line-clamp-1 text-foreground">{t('title')}</li>
        </ol>
      </nav>

      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{labels.readTime}</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-4" aria-hidden="true" />
            {labels.published}: <time dateTime={PUBLISHED_AT}>{formatDate(PUBLISHED_AT, language)}</time>
          </span>
        </p>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>
      </header>

      <figure className="concept-card relative mt-9 aspect-[16/9] overflow-hidden rounded-3xl border bg-muted shadow-[8px_9px_0_rgba(42,16,45,0.08)]">
        <Image src="/images/seven-land-documents.webp" alt="" fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
      </figure>

      <aside className="mt-8 rounded-xl border border-notice-border bg-notice p-5 text-sm leading-relaxed text-notice-foreground">{t('warning')}</aside>

      {/* Table of contents */}
      <nav aria-label={labels.toc} className="mt-8 rounded-xl border bg-muted/40 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-serif text-foreground">
          <ListOrdered className="size-5" aria-hidden="true" />
          {labels.toc}
        </h2>
        <ol className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {DOCUMENTS.map(({ key }, index) => (
            <li key={key} className="flex gap-2">
              <span className="font-semibold text-primary">{index + 1}.</span>
              <a href={`#${key}`} className="text-muted-foreground hover:text-foreground hover:underline">
                {t(`items.${key}.title`)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Document sections */}
      <div className="mt-10 space-y-7">
        {DOCUMENTS.map(({ key, url }, index) => (
          <section key={key} className="scroll-mt-24 rounded-xl border bg-card p-6 sm:p-8" id={key}>
            <div className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">{index + 1}</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('documentLabel')}</p>
                <h2 className="mt-1 text-2xl sm:text-3xl">{t(`items.${key}.title`)}</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div><h3 className="text-base">{t('whatItShows')}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{t(`items.${key}.shows`)}</p></div>
              <div><h3 className="text-base">{t('redFlags')}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{t(`items.${key}.flags`)}</p></div>
            </div>
            <div className="mt-6 rounded-lg bg-muted p-4">
              <h3 className="text-base">{t('onlineCheck')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`items.${key}.online`)}</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                {t(`items.${key}.link`)} <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </div>
          </section>
        ))}
      </div>

      {/* Final takeaway */}
      <section className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-2xl text-primary-foreground">{t('final.title')}</h2>
        <p className="mt-3 leading-relaxed text-primary-foreground/85">{t('final.body')}</p>
      </section>

      {/* Quick checklist */}
      <section className="mt-8 rounded-xl border bg-card p-6 sm:p-8" aria-labelledby="quick-checklist">
        <h2 id="quick-checklist" className="text-xl font-serif text-foreground">{labels.checklist}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{labels.checklistHint}</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {DOCUMENTS.map(({ key }) => (
            <li key={key} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
              <a href={`#${key}`} className="text-foreground hover:underline">{t(`items.${key}.title`)}</a>
            </li>
          ))}
        </ul>
      </section>

      {/* Sources */}
      <section className="mt-8 rounded-xl border bg-muted/50 p-6">
        <h2 className="text-xl">{labels.sources}</h2>
        <ul className="mt-4 space-y-3">
          {SOURCES.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
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
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{related.readTime[language]}</p>
                  <h3 className="mt-2 text-base font-serif leading-snug text-foreground group-hover:underline">{related.title[language]}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{related.summary[language]}</p>
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