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

      <div className="mt-10 space-y-7">
        {guide.sections.map((section, index) => (
          <section key={section.title.en} className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">{index + 1}</span>
              <div><h2 className="text-2xl sm:text-3xl">{section.title[language]}</h2><p className="mt-3 leading-7 text-muted-foreground">{section.body[language]}</p></div>
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
