import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { ListingForm } from '@/components/marketplace/ListingForm';
import type { Locale } from '@/i18n/routing';
import { requireUser, userDisplayName } from '@/lib/auth';
import { getListingForEdit } from '@/lib/marketplace';
import { pageMetadata } from '@/lib/seo';
import { isSupabaseConfigured } from '@/lib/supabase/config';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'Marketplace.form.edit' });
  return pageMetadata({
    locale,
    path: `/marketplace/${id}/edit`,
    title: t('title'),
    description: t('subtitle'),
    noindex: true,
  });
}

export default async function EditListingPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);

  // Editing needs an account and a database.
  if (!isSupabaseConfigured) notFound();
  const user = await requireUser(locale, `/marketplace/${id}/edit`);

  // Only the seller's own listing is returned; anyone else gets a 404.
  const listing = await getListingForEdit(id, user.id);
  if (!listing) notFound();

  const t = await getTranslations('Marketplace.form.edit');

  return (
    <div className="container max-w-3xl py-10 sm:py-14">
      <header>
        <h1 className="text-3xl sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{t('subtitle')}</p>
      </header>

      <div className="mt-8">
        <ListingForm listing={listing} defaultName={userDisplayName(user) ?? undefined} />
      </div>

      <DisclaimerPanel className="mt-12" points={['independent', 'marketplace', 'landLaws', 'liability']} />
    </div>
  );
}
