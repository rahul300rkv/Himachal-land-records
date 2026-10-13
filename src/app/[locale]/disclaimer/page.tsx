import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { formatLegalDate } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const POINT_KEYS = ['independent', 'notLegalRecord', 'accuracy', 'verify', 'noAdvice', 'landLaws', 'marketplace'] as const;
const STEP_KEYS = ['a', 'b', 'c', 'd'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Disclaimer.page' });
  return pageMetadata({ locale, path: '/disclaimer', title: t('title'), description: t('intro') });
}

export default async function DisclaimerPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Disclaimer');
  const legal = await getTranslations('Legal');

  const sections: LegalSection[] = [
    ...POINT_KEYS.map((key) => ({
      id: key,
      title: t(`page.titles.${key}`),
      body: [t(`points.${key}`)],
    })),
    { id: 'reports', title: t('page.titles.reports'), body: [t('page.reports')] },
    { id: 'liability', title: t('page.titles.liability'), body: [t('points.liability')] },
    {
      id: 'how-to-verify',
      title: t('page.howToVerify.title'),
      body: STEP_KEYS.map((key) => `- ${t(`page.howToVerify.steps.${key}`)}`),
    },
  ];

  return (
    <LegalDocument
      title={t('page.title')}
      lastUpdated={legal('lastUpdated', { date: formatLegalDate(locale) })}
      intro={t('page.intro')}
      sections={sections}
    />
  );
}
