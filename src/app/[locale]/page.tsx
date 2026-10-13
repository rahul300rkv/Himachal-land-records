import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { CTA } from '@/components/home/CTA';
import { DisclaimerSection } from '@/components/home/DisclaimerSection';
import { Features } from '@/components/home/Features';
import { Hero } from '@/components/home/Hero';
import { HowItWorks } from '@/components/home/HowItWorks';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Metadata' });
  // `absolute` keeps the full site title instead of "<title> | HimLand Check".
  return { ...pageMetadata({ locale, path: '', title: t('title'), description: t('description') }), title: { absolute: t('title') } };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <>
      <Hero />
      <WhatWeDo />
      <Features />
      <HowItWorks />
      <DisclaimerSection />
      <CTA />
    </>
  );
}
