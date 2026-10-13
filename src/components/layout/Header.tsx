'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { AuthActions } from '@/components/auth/AuthActions';
import { LanguageToggle } from './LanguageToggle';
import { Logo } from './Logo';
import { MobileNav } from './MobileNav';
import { NAV_ITEMS } from './nav-items';

export function Header() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-20 items-center justify-between gap-2 sm:gap-3">
        <Logo />

        <nav aria-label={t('mainNavigation')} className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'land-nav-active'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <div className="hidden sm:block">
            <AuthActions variant="desktop" />
          </div>
          <MobileNav className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
