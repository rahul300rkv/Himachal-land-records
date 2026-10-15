'use client';

import { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/** User-specified Himachal rates; a square foot is exactly 0.09290304 sq m. */
const SQ_M_PER_UNIT = { marla: 19.2, kanal: 384, sq_m: 1, sq_ft: 0.09290304 } as const;
type Unit = keyof typeof SQ_M_PER_UNIT;
const UNITS: Unit[] = ['marla', 'kanal', 'sq_m', 'sq_ft'];

export function LandConverter() {
  const t = useTranslations('Converter');
  const u = useTranslations('Units');
  const locale = useLocale();
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState<Unit>('kanal');
  const [to, setTo] = useState<Unit>('marla');
  const fmt = (n: number) => new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    maximumFractionDigits: 4,
  }).format(n);

  const result = useMemo(() => {
    const amount = Number(value);
    if (!value.trim() || !Number.isFinite(amount) || amount < 0) return null;
    const converted = amount * SQ_M_PER_UNIT[from] / SQ_M_PER_UNIT[to];
    return Number.isFinite(converted) ? converted : null;
  }, [value, from, to]);

  const selectClass = 'h-12 w-full min-w-0 rounded-md border border-input bg-background px-3 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <section aria-label={t('title')} className="space-y-5">
      <div>
        <Label htmlFor="conv-value">{t('value')}</Label>
        <Input id="conv-value" type="number" inputMode="decimal" min={0} step="any"
          className="h-14 text-2xl shadow-none" value={value}
          onChange={(e) => setValue(e.target.value)} />
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)] items-end gap-3">
        <div className="min-w-0">
          <Label htmlFor="conv-from">{t('from')}</Label>
          <select id="conv-from" className={selectClass} value={from} onChange={(e) => setFrom(e.target.value as Unit)}>
            {UNITS.map((unit) => <option key={unit} value={unit}>{u(unit)}</option>)}
          </select>
        </div>
        <ArrowRight aria-hidden="true" className="mb-3 h-6 w-6 text-muted-foreground" />
        <div className="min-w-0">
          <Label htmlFor="conv-to">{t('to')}</Label>
          <select id="conv-to" className={selectClass} value={to} onChange={(e) => setTo(e.target.value as Unit)}>
            {UNITS.map((unit) => <option key={unit} value={unit}>{u(unit)}</option>)}
          </select>
        </div>
      </div>

      <div role="status" aria-live="polite" aria-atomic="true" className="border-y border-border py-6">
        {result === null ? (
          <p className="text-sm text-muted-foreground">{t('enterValue')}</p>
        ) : (
          <>
            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-primary">
              <span className="min-w-0 break-all text-4xl font-semibold leading-tight tabular-nums sm:text-5xl">{fmt(result)}</span>
              <span className="text-lg font-medium">{u(to)}</span>
            </p>
            <p className="mt-2 break-words text-sm text-muted-foreground">
              {t('result', { value: fmt(Number(value)), from: u(from), result: fmt(result), to: u(to) })}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
