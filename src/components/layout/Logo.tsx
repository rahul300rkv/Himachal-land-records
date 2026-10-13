import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

/** Logo mark: a mountain ridge over a surveyed plot line. */
function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-9 w-9 shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M5 22 12.5 10l4.5 7 3-4.5L27 22H5Z" className="fill-[hsl(var(--primary-foreground))]" />
      <path d="M5 26h22" className="stroke-[hsl(var(--leaf-soft))]" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 3" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  const t = useTranslations();

  return (
    <Link
      href="/"
      aria-label={t('Navigation.homeLabel')}
      className={cn('flex items-center gap-2.5 rounded-md', className)}
    >
      <LogoMark />
      <span className="max-w-[11rem] font-sans text-base font-semibold leading-tight text-foreground sm:max-w-none sm:text-xl">
        {t('Metadata.siteName')}
      </span>
    </Link>
  );
}
