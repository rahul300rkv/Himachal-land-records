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
      className={cn('flex min-h-12 items-center gap-2.5 rounded-md', className)}
    >
      <Image src="/images/himland-mark.webp" alt="" width={44} height={44} className="size-9 shrink-0 object-contain sm:size-10 lg:size-11" priority />
      <span className="font-signature max-w-[9rem] text-xl leading-none text-[#2a102d] max-[359px]:hidden sm:max-w-[12rem] sm:text-2xl lg:max-w-none lg:text-3xl">
        {t('Metadata.siteName')}
      </span>
    </Link>
  );
}