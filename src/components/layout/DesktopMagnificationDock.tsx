'use client';

import { FileCheck2, Map, Newspaper, Search, Wrench } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const DOCK_ITEMS = [
  { href: '/search', key: 'search', icon: Search },
  { href: '/check', key: 'nakalChecker', icon: FileCheck2 },
  { href: '/map', key: 'map', icon: Map },
  { href: '/blog', key: 'blog', icon: Newspaper },
  { href: '/tools', key: 'tools', icon: Wrench },
] as const;

export function DesktopMagnificationDock() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mainNavigation')}
      className="pointer-events-none fixed inset-x-0 bottom-5 z-40 hidden justify-center px-4 lg:flex"
    >
      <div className="pointer-events-auto flex items-end gap-2 rounded-2xl border border-border/80 bg-card/95 px-3 py-2 shadow-[0_12px_30px_hsl(var(--shadow-color)/0.14)] backdrop-blur-md">
        {DOCK_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              aria-label={t(item.key)}
              className={cn(
                'group relative flex size-14 items-center justify-center rounded-xl text-muted-foreground transition-[transform,background-color,color] duration-200 ease-out hover:z-10 hover:-translate-y-2 hover:scale-125 hover:bg-primary-soft hover:text-primary focus-visible:z-10 focus-visible:bg-primary-soft focus-visible:text-primary',
                active && 'bg-primary-soft text-primary',
              )}
            >
              <Icon className="size-6" strokeWidth={1.8} aria-hidden="true" />
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100">
                {t(item.key)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
