import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import type { Locale } from '@/i18n/routing';
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

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Blog.sevenDocuments' });
  return pageMetadata({
    locale,
    path: '/blog/7-documents-before-buying-land',
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
  const t = await getTranslations('Blog.sevenDocuments');
  const articleUrl = absoluteUrl(`/${locale}/blog/7-documents-before-buying-land`);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: t('title'),
      description: t('intro'),
      image: [absoluteUrl('/images/himachal-valley.jpg')],
      datePublished: PUBLISHED_AT,
      dateModified: PUBLISHED_AT,
      inLanguage: locale === 'hi' ? 'hi-IN' : 'en-IN',
      mainEntityOfPage: articleUrl,
      author: { '@type': 'Organization', name: 'HimachalLand Check', url: absoluteUrl('/') },
      publisher: { '@id': `${absoluteUrl('/')}#organization` },
      about: DOCUMENTS.map(({ key }) => t(`items.${key}.title`)),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: locale === 'hi' ? 'होम' : 'Home', item: absoluteUrl(`/${locale}`) },
        { '@type': 'ListItem', position: 2, name: locale === 'hi' ? 'ब्लॉग' : 'Blog', item: absoluteUrl(`/${locale}/blog`) },
        { '@type': 'ListItem', position: 3, name: t('title'), item: articleUrl },
      ],
    },
  ];
  return (
    <article className="container max-w-4xl py-10 sm:py-14">
      <JsonLd data={jsonLd} />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>
      </header>

      <aside className="mt-8 rounded-xl border border-notice-border bg-notice p-5 text-sm leading-relaxed text-notice-foreground">{t('warning')}</aside>

      <div className="mt-10 space-y-7">
        {DOCUMENTS.map(({ key, url }, index) => (
          <section key={key} className="rounded-xl border bg-card p-6 sm:p-8" id={key}>
            <div className="flex gap-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-serif font-semibold text-primary-foreground">{index + 1}</span><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('documentLabel')}</p><h2 className="mt-1 text-2xl sm:text-3xl">{t(`items.${key}.title`)}</h2></div></div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div><h3 className="text-base">{t('whatItShows')}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{t(`items.${key}.shows`)}</p></div>
              <div><h3 className="text-base">{t('redFlags')}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{t(`items.${key}.flags`)}</p></div>
            </div>
            <div className="mt-6 rounded-lg bg-muted p-4"><h3 className="text-base">{t('onlineCheck')}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`items.${key}.online`)}</p><a href={url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">{t(`items.${key}.link`)} <ExternalLink className="size-4" aria-hidden="true" /></a></div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-xl bg-primary p-6 text-primary-foreground sm:p-8"><h2 className="text-2xl text-primary-foreground">{t('final.title')}</h2><p className="mt-3 leading-relaxed text-primary-foreground/85">{t('final.body')}</p></section>
    </article>
  );
}
