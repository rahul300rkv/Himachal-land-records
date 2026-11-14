import type { Metadata } from 'next';
import { BookOpen, FileCheck2, Scale } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

const GUIDES = [
  { key: 'jamabandi', icon: BookOpen },
  { key: 'beforeBuy', icon: FileCheck2 },
  { key: 'section118', icon: Scale },
] as const;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Guides' });
  return pageMetadata({ locale, path: '/guides', title: t('title'), description: t('intro') });
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Guides');
  return (
    <article className="container max-w-5xl py-10 sm:py-14">
      <header className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p><h1 className="mt-3 text-4xl sm:text-5xl">{t('title')}</h1><p className="mt-4 text-lg text-muted-foreground">{t('intro')}</p></header>
      <div className="mt-10 space-y-6">
        {GUIDES.map(({ key, icon: Icon }, index) => (
          <section key={key} className="rounded-xl border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4"><span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('guideLabel', { number: index + 1 })}</p><h2 className="mt-1 text-2xl">{t(`items.${key}.title`)}</h2></div></div>
            <p className="mt-5 leading-relaxed text-muted-foreground">{t(`items.${key}.body`)}</p>
            <ul className="mt-5 grid gap-3 text-sm sm:grid-cols-3">{([1, 2, 3] as const).map((n) => <li key={n} className="rounded-md bg-muted p-3">{t(`items.${key}.point${n}`)}</li>)}</ul>
          </section>
        ))}
      </div>
    </article>
  );
}
