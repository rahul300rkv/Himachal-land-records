'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AuthActions } from '@/components/auth/AuthActions';
import { Button } from '@/components/ui/button';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

/**
 * Hamburger menu for screens below `lg`.
 * The panel is absolutely positioned under the (sticky) header rather than using a
 * fixed overlay, because the header's backdrop blur would otherwise trap fixed children.
 */
export function MobileNav({ className }: { className?: string }) {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  // Close after navigating
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close with Escape
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <div className={className}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? t('closeMenu') : t('openMenu')}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="!size-5" /> : <Menu className="!size-5" />}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute inset-x-0 top-full border-b bg-background shadow-lg"
          >
            <nav aria-label={t('mainNavigation')} className="container flex flex-col py-3">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-12 items-center rounded-md px-3 text-base font-medium transition-colors',
                      active
                        ? 'bg-primary-soft text-primary'
                        : 'text-foreground hover:bg-accent',
                    )}
                  >
                    {t(item.key)}
                  </Link>
                );
              })}

              <AuthActions variant="mobile" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
