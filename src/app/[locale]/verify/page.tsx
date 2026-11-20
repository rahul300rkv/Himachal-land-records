import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { VerificationWorkspace } from '@/components/verification/VerificationWorkspace';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { RelatedTools } from '@/components/seo/RelatedTools';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Verification' });
  return pageMetadata({ locale, path: '/verify', title: t('title'), description: t('intro'), noindex: true });
}

export default async function VerifyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('Verification');
  return (
    <article className="container max-w-6xl py-8 sm:py-12">
      <Breadcrumbs current="verify" className="mb-6" />
      <header className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf">{t('eyebrow')}</p>
        <h1 className="mt-3 text-3xl leading-tight sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>
      </header>
      <div className="mt-10"><VerificationWorkspace /></div>
      <RelatedTools current="verify" />
    </article>
  );
}
