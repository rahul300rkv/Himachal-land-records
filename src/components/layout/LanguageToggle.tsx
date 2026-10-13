'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LABELS: Record<Locale, { visible: string; name: 'english' | 'hindi' }> = {
  en: { visible: 'EN', name: 'english' },
  hi: { visible: 'हिन्दी', name: 'hindi' },
};

/**
 * Two-option language switch. Keeps the visitor on the same page and swaps the locale.
 * next-intl also remembers the choice in the NEXT_LOCALE cookie.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={t('language')}
      aria-busy={isPending}
      className={cn('inline-flex items-center rounded-full border bg-secondary p-0.5 text-sm', className)}
    >
      {routing.locales.map((code) => {
        const active = code === locale;
        const { visible, name } = LABELS[code];
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={active}
            aria-label={active ? t(name) : t('switchTo', { language: t(name) })}
            disabled={isPending}
            onClick={() => switchTo(code)}
            className={cn(
              'min-h-8 rounded-full px-2.5 font-medium transition-colors sm:px-3',
              active
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {visible}
          </button>
        );
      })}
    </div>
  );
}
