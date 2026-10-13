'use client';

import { CheckCircle2, FileDown, Loader2, LogIn } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type ReportButtonProps = {
  recordId: string;
  /** True when a logged-in user is required (always, except in demo mode). */
  requiresLogin: boolean;
  isAuthenticated: boolean;
  /** 'onDark' renders a white button for use on the blue report banner. */
  tone?: 'default' | 'onDark';
  className?: string;
};

type Status = 'idle' | 'loading' | 'done' | 'error';

/** Generates the pre-purchase PDF through POST /api/report/generate and downloads it. */
export function ReportButton({
  recordId,
  requiresLogin,
  isAuthenticated,
  tone = 'default',
  className,
}: ReportButtonProps) {
  const t = useTranslations('Record.report');
  const locale = useLocale();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const buttonClass = cn(
    'h-14 w-full px-6 text-base font-semibold sm:w-auto',
    tone === 'onDark' && 'bg-white text-primary hover:bg-white/90',
    className,
  );

  if (requiresLogin && !isAuthenticated) {
    return (
      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className={buttonClass}>
          <Link href={{ pathname: '/login', query: { next: `/record/${recordId}` } }}>
            <LogIn />
            {t('loginButton')}
          </Link>
        </Button>
        <p className={cn('text-sm', tone === 'onDark' ? 'text-white/80' : 'text-muted-foreground')}>
          {t('loginHint')}
        </p>
      </div>
    );
  }

  async function generate() {
    setStatus('loading');
    setMessage(null);
    try {
      const response = await fetch('/api/report/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordId, locale }),
      });

      if (!response.ok) {
        const key =
          response.status === 401 ? 'auth' : response.status === 404 ? 'notFound' : response.status === 429 ? 'rateLimit' : 'generic';
        setMessage(t(`errors.${key}`));
        setStatus('error');
        return;
      }

      const blob = await response.blob();
      const filename =
        /filename="?([^";]+)"?/.exec(response.headers.get('Content-Disposition') ?? '')?.[1] ?? 'report.pdf';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      setMessage(t('success'));
      setStatus('done');
    } catch {
      setMessage(t('errors.generic'));
      setStatus('error');
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        size="lg"
        className={buttonClass}
        onClick={generate}
        disabled={status === 'loading'}
        aria-busy={status === 'loading'}
      >
        {status === 'loading' ? <Loader2 className="animate-spin" /> : <FileDown />}
        {status === 'loading' ? t('generating') : t('button')}
      </Button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          'flex min-h-5 items-center gap-1.5 text-sm',
          status === 'error'
            ? tone === 'onDark'
              ? 'font-medium text-white'
              : 'text-destructive'
            : tone === 'onDark'
              ? 'text-white/90'
              : 'text-muted-foreground',
        )}
      >
        {status === 'done' && <CheckCircle2 className="size-4" aria-hidden="true" />}
        {message}
      </p>
    </div>
  );
}
