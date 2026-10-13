import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalDocument, type LegalSection } from '@/components/legal/LegalDocument';
import { fillLegalVars, formatLegalDate } from '@/lib/site';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

const SECTION_KEYS = [
  'who',
  'collect',
  'publicRecords',
  'use',
  'consent',
  'sharing',
  'location',
  'cookies',
  'retention',
  'security',
  'rights',
  'children',
  'grievance',
  'changes',
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Privacy' });
  return pageMetadata({ locale, path: '/privacy', title: t('title'), description: t('intro') });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Privacy');
  const legal = await getTranslations('Legal');

  const sections: LegalSection[] = SECTION_KEYS.map((key) => ({
    id: key,
    title: t(`sections.${key}.title`),
    body: (t.raw(`sections.${key}.body`) as string[]).map(fillLegalVars),
  }));

  return (
    <LegalDocument
      title={t('title')}
      lastUpdated={legal('lastUpdated', { date: formatLegalDate(locale) })}
      intro={t('intro')}
      sections={sections}
    />
  );
}
