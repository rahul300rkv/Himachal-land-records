import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type PointKey =
  | 'independent'
  | 'notLegalRecord'
  | 'accuracy'
  | 'verify'
  | 'noAdvice'
  | 'landLaws'
  | 'marketplace'
  | 'liability';

const DEFAULT_POINTS: readonly PointKey[] = ['independent', 'notLegalRecord', 'verify', 'noAdvice', 'landLaws'];

/**
 * Prominent legal disclaimer for pages where people may act on what they read
 * (records, listings, reports). The complete text lives on /disclaimer.
 */
export function DisclaimerPanel({
  points = DEFAULT_POINTS,
  className,
}: {
  points?: readonly PointKey[];
  className?: string;
}) {
  const t = useTranslations('Disclaimer');

  return (
    <aside
      aria-labelledby="page-disclaimer-title"
      className={cn(
        'rounded-xl border border-notice-border bg-notice p-5 text-notice-foreground sm:p-6',
        className,
      )}
    >
      <h2
        id="page-disclaimer-title"
        className="flex items-center gap-2.5 text-xl text-notice-foreground sm:text-2xl"
      >
        <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
        {t('title')}
      </h2>
      <ul className="mt-4 grid gap-x-8 gap-y-3 text-sm leading-relaxed lg:grid-cols-2">
        {points.map((key) => (
          <li key={key} className="flex gap-2.5">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-notice-foreground" aria-hidden="true" />
            <span>{t(`points.${key}`)}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/disclaimer"
        className="mt-4 inline-block text-sm font-semibold underline underline-offset-2"
      >
        {t('bannerLink')}
      </Link>
    </aside>
  );
}
