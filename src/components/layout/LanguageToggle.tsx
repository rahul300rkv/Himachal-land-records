'use client';

import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const LABELS: Record<Locale, { visible: string; name: 'english' | 'hindi' }> = {
  en: { visible: 'EN', name: 'english' },
  hi: { visible: 'हिन्दी', name: 'hindi' },
};

/**
 * Compact two-option language switch. Keeps the visitor on the same page and swaps the locale.
 * next-intl also remembers the choice in the NEXT_LOCALE cookie.
 */
export function LanguageToggle({ className }: { className?: string }) {
  const t = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      const query = searchParams.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { locale: next });
    });
  }

  return (
    <div
      role="group"
      aria-label={t('language')}
      aria-busy={isPending}
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-xl border border-black/10 bg-white/75 px-1 shadow-sm ring-1 ring-black/[0.03] backdrop-blur-sm',
        className,
      )}
    >
      <span className="flex size-8 items-center justify-center text-[#69566b]" aria-hidden="true">
        <Languages className="size-4" strokeWidth={1.8} />
      </span>

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
              'h-8 rounded-lg px-2 text-xs font-semibold tracking-[0.02em] transition-[background-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              code === 'hi' && 'min-w-12',
              code === 'en' && 'min-w-9',
              active
                ? 'bg-[#2a102d] text-white shadow-sm'
                : 'text-[#69566b] hover:bg-[#2a102d]/[0.06] hover:text-[#2a102d]',
            )}
          >
            {visible}
          </button>
        );
      })}
    </div>
  );
}
