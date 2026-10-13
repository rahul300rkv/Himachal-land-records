'use client';

import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { StateMessage } from '@/components/layout/StateMessage';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

/** Error boundary for every page. Next.js passes `reset` to retry rendering the segment. */
export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Errors');
  const common = useTranslations('Common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container max-w-2xl py-16">
      <StateMessage tone="error" icon={CircleAlert} title={t('title')} body={t('body')}>
        <Button onClick={reset}>{t('retry')}</Button>
        <Button asChild variant="outline">
          <Link href="/">{common('home')}</Link>
        </Button>
      </StateMessage>
      {error.digest && (
        <p className="mt-4 text-center text-xs text-muted-foreground">{t('reference', { digest: error.digest })}</p>
      )}
    </div>
  );
}
