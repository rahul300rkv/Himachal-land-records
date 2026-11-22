'use client';

import { Loader2, Mail, MailCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Magic-link sign-in: enter an email address, receive a link, click it.
 * No OTP code entry. The link is handled by /api/auth/callback.
 */
export function LoginForm({ next }: { next: string }) {
  const t = useTranslations('Auth');

  const [email, setEmail]     = useState('');
  const [name, setName]       = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [busy, setBusy]       = useState(false);

  const rateLimited = (e: { status?: number; message?: string }) =>
    e.status === 429 || /rate limit|too many/i.test(e.message ?? '');

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!EMAIL.test(email.trim())) return setError(t('email.invalid'));
    if (!consent) return setError(t('consentRequired'));

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: sendError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          shouldCreateUser: true,
          data: name.trim() ? { full_name: name.trim() } : undefined,
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (sendError) {
        setError(rateLimited(sendError) ? t('errors.rateLimited') : t('errors.sendFailed'));
        return;
      }

      setSent(true);
    } catch {
      setError(t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  // ── Sent state ──────────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-7" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t('magic.sentTitle')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t('magic.sentBody', { email: email.trim() })}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{t('magic.sentHint')}</p>
        <button
          type="button"
          onClick={() => { setSent(false); setError(null); }}
          className="text-sm font-medium text-primary hover:underline"
        >
          {t('magic.tryDifferent')}
        </button>
      </div>
    );
  }

  // ── Request form ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
        {t('magic.hint')}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t('email.label')}</Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('email.placeholder')}
          maxLength={254}
          aria-invalid={Boolean(error)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">
          {t('name.label')}{' '}
          <span className="font-normal text-muted-foreground">({t('name.hint')})</span>
        </Label>
        <Input
          id="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('name.placeholder')}
          maxLength={100}
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 rounded border-input accent-[hsl(var(--primary))]"
        />
        <span>
          {t.rich('consent', {
            terms: (chunks) => (
              <Link href="/terms" target="_blank" className="font-medium text-primary underline underline-offset-2">
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link href="/privacy" target="_blank" className="font-medium text-primary underline underline-offset-2">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" aria-hidden="true" />}
        {busy ? t('magic.sending') : t('magic.send')}
      </Button>
    </form>
  );
}