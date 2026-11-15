import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <Link
      href="/"
      aria-label={t('Navigation.homeLabel')}
      className={cn('flex items-center gap-2.5 rounded-md', className)}
    >
      <Image src="/images/himland-mark.png" alt="" width={48} height={48} className="size-10 shrink-0 object-contain sm:size-12" priority />
      <span className="font-signature max-w-[11rem] text-2xl leading-none text-[#2a102d] sm:max-w-none sm:text-4xl">
        {t('Metadata.siteName')}
      </span>
    </Link>
  );
}
