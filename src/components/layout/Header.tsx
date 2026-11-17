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
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#e9eef1]/90 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-2 sm:h-[4.5rem] sm:gap-3 lg:h-20">
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
                  'inline-flex min-h-12 items-center rounded-full px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#2a102d]/[0.07] text-[#2a102d]'
                    : 'text-[#69566b] hover:bg-[#2a102d]/[0.06] hover:text-[#2a102d]',
                )}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <div className="hidden md:block">
            <AuthActions variant="desktop" />
          </div>
          <MobileNav className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
