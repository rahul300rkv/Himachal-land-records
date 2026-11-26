'use client';

import { FileCheck2, Map, Newspaper, Search, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const QUICK_ITEMS = [
  { href: '/search', key: 'search', icon: Search },
  { href: '/check', key: 'nakalChecker', icon: FileCheck2 },
  { href: '/map', key: 'map', icon: Map },
  { href: '/blog', key: 'blog', icon: Newspaper },
  { href: '/tools', key: 'tools', icon: Wrench },
] as const;

export function MobileQuickDock() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mainNavigation')}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_hsl(var(--shadow-color)/0.08)] backdrop-blur-md lg:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {QUICK_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={t(item.key)}
              className={cn(
                'flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2 text-center text-[10px] font-medium leading-tight text-muted-foreground transition-colors',
                active ? 'bg-primary-soft text-primary' : 'hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="line-clamp-2">{t(item.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
