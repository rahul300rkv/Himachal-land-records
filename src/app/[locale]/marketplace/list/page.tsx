import { DatabaseZap } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { StateMessage } from '@/components/layout/StateMessage';
import { ListingForm } from '@/components/marketplace/ListingForm';
import type { Locale } from '@/i18n/routing';
import { requireUser, userDisplayName } from '@/lib/auth';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Marketplace.form' });
  return pageMetadata({
    locale,
    path: '/marketplace/list',
    title: t('title'),
    description: t('metaDescription'),
    noindex: true,
  });
}

export default async function ListLandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('Marketplace.form');

  // Listing needs an account and a database. Without Supabase there is nothing to submit to.
  const user = isSupabaseConfigured ? await requireUser(locale, '/marketplace/list') : null;

  return (
    <div className="container max-w-3xl py-10 sm:py-14">
      <header>
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
      </header>

      <div className="mt-8">
        {user ? (
          <ListingForm defaultName={userDisplayName(user) ?? undefined} />
        ) : (
          <StateMessage icon={DatabaseZap} title={t('title')} body={t('notConfigured')} />
        )}
      </div>

      <DisclaimerPanel
        className="mt-12"
        points={['independent', 'marketplace', 'landLaws', 'liability']}
      />
    </div>
  );
}
