import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/i18n/routing';
import { BLOG_GUIDES, getBlogGuide } from '@/lib/blog-guides';
import { pageMetadata } from '@/lib/seo';
import { absoluteUrl } from '@/lib/utils';

type Props = { params: Promise<{ locale: string; slug: string }> };

function renderSectionContent(language: 'en' | 'hi', section: {
  title: { en: string; hi: string };
  body: { en: string; hi: string };
  citation?: { en: string; hi: string };
  list?: { en: string[]; hi: string[] };
  note?: { en: string; hi: string };
  link?: { href: string; label: { en: string; hi: string } };
}) {
  const items = section.list?.[language] ?? [];
  const hasTable = items.length > 0 && items.every((item) => item.includes('|'));

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
                {items[0].split('|').map((_, ci) => (
                  <th key={ci} className="text-left bg-muted/50 font-semibold text-muted-foreground border-b border-muted p-3">
                    {items[0].split('|')[ci].trim().split(': ')[1] ?? items[0].split('|')[ci].trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, ri) => (
                <tr key={ri} className="border-b border-muted/50">
                  {item.split('|').map((cell, ci) => (
                    <td key={ci} className="p-3 align-top">
                      {ci === 0 ? <span className="font-semibold text-foreground">{cell.trim()}</span> : cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!hasTable && items.length > 0 && (
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
      {section.link && (
  <a
    href={section.link.href}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
  >
    {section.link.label[language]} →
  </a>
)}
    </div>
  );
}

export function generateStaticParams() {
  return BLOG_GUIDES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getBlogGuide(slug);
  if (!guide) return {};
  const language = locale === 'hi' ? 'hi' : 'en';
  return pageMetadata({
    locale,
    path: `/blog/${slug}`,
    title: guide.title[language],
    description: guide.summary[language],
    type: 'article',
    publishedTime: guide.publishedAt,
    modifiedTime: guide.publishedAt,
  });
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const guide = getBlogGuide(slug);
  if (!guide) notFound();
  setRequestLocale(locale as Locale);
  const language = locale === 'hi' ? 'hi' : 'en';
  const articleUrl = absoluteUrl(`/${locale}/blog/${slug}`);
  const labels = language === 'hi'
    ? { eyebrow: 'भूमि जाँच मार्गदर्शिका', takeaway: 'मुख्य निष्कर्ष', sources: 'आधिकारिक स्रोत', home: 'होम', blog: 'ब्लॉग' }
    : { eyebrow: 'Land due-diligence guide', takeaway: 'Key takeaway', sources: 'Official sources', home: 'Home', blog: 'Blog' };
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: guide.title[language],
      description: guide.summary[language],
      image: [absoluteUrl(guide.image)],
      datePublished: guide.publishedAt,
      dateModified: guide.publishedAt,
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
  return (
    <article className="container max-w-4xl py-10 sm:py-14">
      <JsonLd data={jsonLd} />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{labels.eyebrow}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{guide.readTime[language]}</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{guide.title[language]}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{guide.intro[language]}</p>
      </header>

      <figure className="concept-card relative mt-9 aspect-[16/9] overflow-hidden rounded-3xl border bg-muted shadow-[8px_9px_0_rgba(42,16,45,0.08)]">
        <Image src={guide.image} alt="" fill priority sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" />
      </figure>

      <div className="mt-10 space-y-8">
        {guide.sections.map((section, index) => (
          <section key={section.title.en} className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">{index + 1}</span>
<div>{renderSectionContent(language, section)}</div>
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-2xl text-primary-foreground">{labels.takeaway}</h2>
        <p className="mt-3 leading-7 text-primary-foreground/85" dangerouslySetInnerHTML={{ __html: guide.takeaway[language].replace(/class="takeaway-link"/g, 'style="color: inherit; text-decoration: underline; text-underline-offset: 2px; font-weight: 600; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1"') }} />
      </section>

      <section className="mt-8 rounded-xl border bg-muted/50 p-6">
        <h2 className="text-xl">{labels.sources}</h2>
        <ul className="mt-4 space-y-3">
          {guide.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">{source.label}<ExternalLink className="size-4" aria-hidden="true" /></a></li>)}
        </ul>
      </section>
    </article>
  );
}
