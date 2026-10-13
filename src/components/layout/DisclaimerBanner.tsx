import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/**
 * Slim, always-visible legal notice at the very top of every page.
 * Deliberately NOT dismissible. The full text lives on /disclaimer.
 */
export function DisclaimerBanner() {
  const t = useTranslations('Disclaimer');

  return (
    <div role="note" className="border-b border-notice-border bg-notice text-notice-foreground">
      <div className="container flex items-start gap-2.5 py-2 text-sm">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <p>
          {t('banner')}{' '}
          <Link href="/disclaimer" className="whitespace-nowrap font-semibold underline underline-offset-2">
            {t('bannerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
