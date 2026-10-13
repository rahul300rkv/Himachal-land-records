import { ArrowLeft, EyeOff, ImageOff, TestTube2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { DisclaimerPanel } from '@/components/layout/DisclaimerPanel';
import { ContactSeller } from '@/components/marketplace/ContactSeller';
import { VerificationBadge } from '@/components/marketplace/VerificationBadge';
import { ReportButton } from '@/components/record/ReportButton';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getCurrentUser } from '@/lib/auth';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { listingImageUrl, verificationStatus } from '@/lib/listing-utils';
import { getListing, getSellerContact } from '@/lib/marketplace';
import { getLandRecord } from '@/lib/record';
import { pageMetadata } from '@/lib/seo';
import { cn, formatPrice } from '@/lib/utils';

type Props = { params: Promise<{ locale: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const found = await getListing(id);
  if (!found) return { title: '404', robots: { index: false } };

  const { listing } = found;
  const description = (listing.description ?? '').slice(0, 155) || listing.title;
  return pageMetadata({
    locale,
    path: `/marketplace/${id}`,
    title: listing.title,
    description,
    // Only live listings should be indexed.
    noindex: listing.status !== 'active' || found.mode === 'demo',
  });
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b py-3 last:border-b-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}

export default async function ListingPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);

  const found = await getListing(id);
  if (!found) notFound();
  const { listing, mode } = found;

  const t = await getTranslations('Marketplace.detail');
  const card = await getTranslations('Marketplace.card');
  const land = await getTranslations('LandTypes');
  const units = await getTranslations('Units');
  const statuses = await getTranslations('ListingStatus');

  const user = await getCurrentUser();
  const contact = user ? await getSellerContact(id) : null;
  const linked = listing.land_record_id ? await getLandRecord(listing.land_record_id) : null;

  const intl = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const number = new Intl.NumberFormat(intl, { maximumFractionDigits: 4 });
  const date = new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'long', year: 'numeric' });
  const place = [
    listing.village,
    tehsilLabel(listing.district, listing.tehsil, locale),
    districtLabel(listing.district, locale),
  ].join(', ');
  const photos = listing.images.map(listingImageUrl);
  const status = verificationStatus(listing);

  return (
    <div className="container py-8 sm:py-12">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 rounded-sm text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('back')}
      </Link>

      {mode === 'demo' && (
        <p className="mt-4 flex items-start gap-2 rounded-md border border-notice-border bg-notice px-4 py-3 text-sm text-notice-foreground">
          <TestTube2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('demoNotice')}
        </p>
      )}
      {listing.status !== 'active' && (
        <p className="mt-4 flex items-start gap-2 rounded-md border border-primary/20 bg-primary-soft px-4 py-3 text-sm text-primary">
          <EyeOff className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('pendingNotice')}
        </p>
      )}

      <header className="mt-5 max-w-3xl">
        <VerificationBadge status={status} />
        <h1 className="mt-3 text-3xl sm:text-4xl">{listing.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{place}</p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="min-w-0 space-y-10">
          {/* Photos */}
          {photos.length > 0 ? (
            <div className="space-y-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border bg-secondary">
                <Image
                  src={photos[0]}
                  alt={t('photo', { number: 1, total: photos.length })}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </div>
              {photos.length > 1 && (
                <ul className="grid grid-cols-3 gap-3">
                  {photos.slice(1).map((src, index) => (
                    <li key={src} className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-secondary">
                      <Image
                        src={src}
                        alt={t('photo', { number: index + 2, total: photos.length })}
                        fill
                        sizes="(min-width: 1024px) 20vw, 33vw"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="flex aspect-[16/6] flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-muted-foreground">
              <ImageOff className="size-8" aria-hidden="true" />
              <p>{t('noPhotos')}</p>
            </div>
          )}

          {listing.description && (
            <section aria-labelledby="about-title">
              <h2 id="about-title" className="text-2xl">
                {t('about')}
              </h2>
              <p className="mt-3 whitespace-pre-line text-lg leading-relaxed [overflow-wrap:anywhere]">
                {listing.description}
              </p>
            </section>
          )}

          <section aria-labelledby="details-title">
            <h2 id="details-title" className="text-2xl">
              {t('details')}
            </h2>
            <dl className="mt-3 rounded-lg border bg-card px-4">
              <Row label={t('price')}>
                {formatPrice(listing.price, locale)}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({card(listing.price_negotiable ? 'negotiable' : 'fixed')})
                </span>
              </Row>
              <Row label={t('area')}>
                {number.format(listing.area)} {units(listing.area_unit)}
              </Row>
              <Row label={t('landType')}>{land(listing.land_type)}</Row>
              <Row label={t('location')}>{place}</Row>
              <Row label={t('posted')}>{date.format(new Date(listing.created_at))}</Row>
              {listing.status !== 'active' && <Row label={t('status')}>{statuses(listing.status)}</Row>}
            </dl>
          </section>

          {/* Verification and the land record behind the listing */}
          <section aria-labelledby="record-title">
            <h2 id="record-title" className="text-2xl">
              {t('record.title')}
            </h2>
            <div className="mt-3">
              <VerificationBadge status={status} showHelp />
            </div>

            {linked ? (
              <div className="mt-5 rounded-lg border bg-card p-5">
                <p className="text-muted-foreground">{t('record.intro')}</p>
                <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                  <div className="col-span-2 sm:col-span-3">
                    <dt className="text-sm text-muted-foreground">{t('record.owner')}</dt>
                    <dd className="font-semibold [overflow-wrap:anywhere]">{linked.record.owner_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t('record.khasra')}</dt>
                    <dd className="font-semibold tabular-nums">{linked.record.khasra_number}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t('record.khewat')}</dt>
                    <dd className="font-semibold tabular-nums">{linked.record.khewat_number ?? '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t('record.khatauni')}</dt>
                    <dd className="font-semibold tabular-nums">{linked.record.khatauni_number ?? '-'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">{t('record.year')}</dt>
                    <dd className="font-semibold tabular-nums">{linked.record.jamabandi_year}</dd>
                  </div>
                </dl>
                <Link
                  href={`/record/${linked.record.id}`}
                  className={cn(buttonVariants({ variant: 'outline' }), 'mt-5')}
                >
                  {t('record.view')}
                </Link>
              </div>
            ) : (
              <p className="mt-5 text-muted-foreground">{t('record.none')}</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="font-serif text-3xl font-semibold tabular-nums">{formatPrice(listing.price, locale)}</p>
            <Badge className="mt-2">{card(listing.price_negotiable ? 'negotiable' : 'fixed')}</Badge>

            <h2 className="mt-6 font-sans text-lg font-semibold tracking-normal">{t('contact.title')}</h2>
            <div className="mt-3">
              <ContactSeller
                listingId={listing.id}
                title={listing.title}
                isAuthenticated={Boolean(user)}
                contact={contact}
                isDemo={mode === 'demo'}
              />
            </div>
          </div>

          {linked && (
            <div className="rounded-xl border bg-primary-soft p-5">
              <h2 className="font-sans text-lg font-semibold tracking-normal">{t('report.title')}</h2>
              <p className="mb-4 mt-1 text-sm text-muted-foreground">{t('report.body')}</p>
              <ReportButton
                recordId={linked.record.id}
                requiresLogin={linked.mode === 'live'}
                isAuthenticated={Boolean(user)}
                className="h-12 text-sm"
              />
            </div>
          )}

          <div className="rounded-xl border border-notice-border bg-notice p-5 text-notice-foreground">
            <h2 className="font-sans text-base font-semibold tracking-normal text-notice-foreground">
              {t('contact.safetyTitle')}
            </h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {(['a', 'b', 'c'] as const).map((key) => (
                <li key={key} className="flex gap-2.5">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-notice-foreground" aria-hidden="true" />
                  <span>{t(`contact.safety.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <DisclaimerPanel
        className="mt-14"
        points={['independent', 'marketplace', 'notLegalRecord', 'verify', 'noAdvice', 'landLaws']}
      />
    </div>
  );
}
