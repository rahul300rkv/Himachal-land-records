import { FileQuestion } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { StateMessage } from '@/components/layout/StateMessage';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';

export default function LocaleNotFound() {
  const t = useTranslations('NotFound');
  const common = useTranslations('Common');

  return (
    <div className="container max-w-2xl py-16">
      <StateMessage icon={FileQuestion} title={t('title')} body={t('body')}>
        <Button asChild>
          <Link href="/">{common('home')}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">{t('search')}</Link>
        </Button>
      </StateMessage>
    </div>
  );
}
