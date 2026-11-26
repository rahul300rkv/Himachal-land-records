import type { Metadata } from 'next';
import { ArrowRight, Calculator, FileSearch, Map, Search, ShieldCheck } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd, absoluteUrl } from '@/components/seo/JsonLd';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getStampDutyCopy } from '@/lib/stamp-duty-copy';

const TOOLS = [
  { key: 'search', href: '/search', icon: Search },
  { key: 'nakal', href: '/check', icon: FileSearch },
  { key: 'map', href: '/map', icon: Map },
  { key: 'circleRate', href: '/circle-rate', icon: Calculator },
  { key: 'stampDuty', href: '/stamp-duty-calculator', icon: Calculator },
  { key: 'converter', href: '/converter', icon: Calculator },
  { key: 'verify', href: '/verify', icon: ShieldCheck },
] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Tools' });
  return pageMetadata({ locale, path: '/tools', title: t('title'), description: t('intro') });
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Tools');
  const stampDuty = getStampDutyCopy(locale);
  const circleRate = await getTranslations('CircleRateTool');
  const toolTitle = (key: (typeof TOOLS)[number]['key']) =>
    key === 'circleRate' ? circleRate('title') : key === 'stampDuty' ? stampDuty.title : t(`items.${key}.title`);
  const toolBody = (key: (typeof TOOLS)[number]['key']) =>
    key === 'circleRate' ? circleRate('intro') : key === 'stampDuty' ? stampDuty.intro : t(`items.${key}.body`);
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    itemListElement: TOOLS.map(({ key, href }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: toolTitle(key),
      url: absoluteUrl(locale, href),
    })),
  };
  return (
    <article className="container py-10 sm:py-14">
      <Breadcrumbs className="mb-6" />
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p>
      </header>
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ key, href, icon: Icon }) => (
          <li key={key}>
            <Link href={href} className="group flex h-full flex-col rounded-lg border bg-card p-6 transition-colors hover:border-primary/50">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span>
              <h2 className="mt-5 text-xl">{toolTitle(key)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{toolBody(key)}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{t('open')} <ArrowRight className="size-4" aria-hidden="true" /></span>
            </Link>
          </li>
        ))}
      </ul>
      <JsonLd data={itemList} />
    </article>
  );
}
