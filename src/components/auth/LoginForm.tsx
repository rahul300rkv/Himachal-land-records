'use client';

import { Loader2, Mail, Smartphone } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useRouter } from '@/i18n/navigation';
import { formatIndianMobile, normalizeIndianMobile } from '@/lib/phone';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

type Method = 'phone' | 'email';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_SECONDS = 30;

/**
 * Passwordless sign-in: a one-time code by SMS (mobile number) or email.
 * The same flow signs in existing users and creates accounts for new ones.
 */
export function LoginForm({ next }: { next: string }) {
  const t = useTranslations('Auth');
  const locale = useLocale();
  const router = useRouter();

  const [method, setMethod] = useState<Method>('phone');
  const [step, setStep] = useState<'request' | 'code'>('request');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const rateLimited = (e: { status?: number; message?: string }) =>
    e.status === 429 || /rate limit|too many/i.test(e.message ?? '');

  async function sendCode() {
    setError(null);

    const e164 = method === 'phone' ? normalizeIndianMobile(phone) : null;
    if (method === 'phone' && !e164) return setError(t('phone.invalid'));
    if (method === 'email' && !EMAIL.test(email.trim())) return setError(t('email.invalid'));
    if (!consent) return setError(t('consentRequired'));

    setBusy(true);
    try {
      const supabase = createClient();
      const data = { locale, ...(name.trim() ? { full_name: name.trim() } : {}) };
      const { error: sendError } =
        method === 'phone'
          ? await supabase.auth.signInWithOtp({ phone: e164!, options: { data } })
          : await supabase.auth.signInWithOtp({
              email: email.trim(),
              options: {
                data,
                // Used if the visitor clicks the link in the email instead of typing the code.
                emailRedirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}`,
              },
            });

      if (sendError) {
        setError(rateLimited(sendError) ? t('errors.rateLimited') : t('errors.sendFailed'));
        return;
      }

      setDestination(method === 'phone' ? formatIndianMobile(e164!) : email.trim());
      setStep('code');
      setCode('');
      setCooldown(RESEND_SECONDS);
    } catch {
      setError(t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    if (!/^\d{6}$/.test(code)) return setError(t('code.invalid'));

    setBusy(true);
    try {
      const supabase = createClient();
      const { error: verifyError } =
        method === 'phone'
          ? await supabase.auth.verifyOtp({ phone: normalizeIndianMobile(phone)!, token: code, type: 'sms' })
          : await supabase.auth.verifyOtp({ email: email.trim(), token: code, type: 'email' });

      if (verifyError) {
        setError(rateLimited(verifyError) ? t('errors.rateLimited') : t('errors.verifyFailed'));
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError(t('errors.generic'));
    } finally {
      setBusy(false);
    }
  }

  const errorBox = error && (
    <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
      {error}
    </p>
  );

  // ---- Step 2: enter the code ----
  if (step === 'code') {
    return (
      <form onSubmit={verifyCode} noValidate className="space-y-5">
        <div>
          <h2 className="text-xl">{t('code.title')}</h2>
          <p className="mt-1 text-muted-foreground">{t('code.sentTo', { destination })}</p>
          {method === 'email' && <p className="mt-1 text-sm text-muted-foreground">{t('code.emailLink')}</p>}
        </div>

        <div>
          <Label htmlFor="code">{t('code.label')}</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            className="h-14 text-center text-2xl tracking-[0.5em] tabular-nums"
            aria-invalid={Boolean(error)}
          />
        </div>

        {errorBox}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />}
          {busy ? t('code.verifying') : t('code.verify')}
        </Button>

        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={sendCode}
            disabled={cooldown > 0 || busy}
            className="text-left font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:text-muted-foreground disabled:no-underline"
          >
            {cooldown > 0 ? t('code.resendIn', { seconds: cooldown }) : t('code.resend')}
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('request');
              setError(null);
            }}
            className="text-left text-muted-foreground hover:text-foreground hover:underline"
          >
            {t('code.change')}
          </button>
        </div>
      </form>
    );
  }

  // ---- Step 1: phone or email ----
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void sendCode();
      }}
      noValidate
      className="space-y-5"
    >
      <div role="tablist" aria-label={t('title')} className="grid grid-cols-2 rounded-lg border bg-secondary p-1">
        {(['phone', 'email'] as const).map((value) => {
          const Icon = value === 'phone' ? Smartphone : Mail;
          const active = method === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMethod(value);
                setError(null);
              }}
              className={cn(
                'flex min-h-11 items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors',
                active ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {t(`tabs.${value}`)}
            </button>
          );
        })}
      </div>

      {method === 'phone' ? (
        <div role="tabpanel">
          <Label htmlFor="phone">{t('phone.label')}</Label>
          <div className="flex gap-2">
            <span className="flex h-11 items-center rounded-md border bg-secondary px-3 text-base font-medium">+91</span>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('phone.placeholder')}
              maxLength={16}
            />
          </div>
        </div>
      ) : (
        <div role="tabpanel">
          <Label htmlFor="email">{t('email.label')}</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('email.placeholder')}
            maxLength={254}
          />
        </div>
      )}

      <div>
        <Label htmlFor="name">
          {t('name.label')} <span className="font-normal text-muted-foreground">({t('name.hint')})</span>
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

      {errorBox}

      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />}
        {busy ? t('sending') : t(`${method}.send`)}
      </Button>
    </form>
  );
}
