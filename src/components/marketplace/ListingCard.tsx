import { ImageOff, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { districtLabel, tehsilLabel } from '@/lib/data/districts';
import { listingImageUrl, verificationStatus } from '@/lib/listing-utils';
import { formatPrice } from '@/lib/utils';
import type { ListingPublic } from '@/types/land-record';
import { VerificationBadge } from './VerificationBadge';

/** Card for the marketplace grid. The whole card is clickable through the title link. */
export function ListingCard({ listing }: { listing: ListingPublic }) {
  const t = useTranslations('Marketplace.card');
  const land = useTranslations('LandTypes');
  const units = useTranslations('Units');
  const locale = useLocale();

  const intl = locale === 'hi' ? 'hi-IN' : 'en-IN';
  const area = `${new Intl.NumberFormat(intl, { maximumFractionDigits: 4 }).format(listing.area)} ${units(listing.area_unit)}`;
  const place = [
    listing.village,
    tehsilLabel(listing.district, listing.tehsil, locale),
    districtLabel(listing.district, locale),
  ].join(', ');
  const photo = listing.images[0];

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-ring hover:shadow-md">
      <div className="relative aspect-[16/10] bg-secondary">
        {photo ? (
          <Image
            src={listingImageUrl(photo)}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 text-muted-foreground">
            <ImageOff className="size-7" aria-hidden="true" />
            <span className="text-sm">{t('noPhoto')}</span>
          </div>
        )}
        {listing.is_featured && (
          <Badge tone="warning" className="absolute left-3 top-3 shadow-sm">
            {t('featured')}
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <VerificationBadge status={verificationStatus(listing)} />

        <h3 className="mt-3 font-sans text-lg font-semibold leading-snug tracking-normal">
          <Link
            href={`/marketplace/${listing.id}`}
            aria-label={t('viewFor', { title: listing.title })}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {listing.title}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" aria-hidden="true" />
          <span>{place}</span>
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          {area} <span aria-hidden="true">·</span> {land(listing.land_type)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="font-serif text-xl font-semibold tabular-nums">{formatPrice(listing.price, locale)}</p>
            <p className="text-xs text-muted-foreground">
              {listing.price_negotiable ? t('negotiable') : t('fixed')}
            </p>
          </div>
          <span className="text-sm font-medium text-primary group-hover:underline">{t('view')}</span>
        </div>
      </div>
    </article>
  );
}
