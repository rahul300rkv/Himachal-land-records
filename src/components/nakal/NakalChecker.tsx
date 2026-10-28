'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { FileUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AssessResult, Band, Severity } from '@/lib/nakal/assess';

const MAX_BYTES = 4 * 1024 * 1024;
const BAND_TONE: Record<Band, 'success' | 'warning' | 'danger'> = {
  low: 'success',
  moderate: 'warning',
  high: 'danger',
};
const SEVERITY_TONE: Record<Severity, 'danger' | 'warning' | 'neutral'> = {
  critical: 'danger',
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

export function NakalChecker() {
  const t = useTranslations('NakalCheck');
  // Flag / error keys are dynamic, so use an untyped view of the translator for them.
  const tx = t as unknown as (key: string, values?: Record<string, string | number>) => string;
  const locale = useLocale();
  const num = new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', { maximumFractionDigits: 2 });

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessResult | null>(null);

  async function run() {
    if (!file) return;
    setError(null);
    setResult(null);
    if (file.size > MAX_BYTES) return setError('too_large');
    setLoading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/nakal/analyze', { method: 'POST', body });
      const data = (await res.json().catch(() => null)) as { result?: AssessResult; error?: string } | null;
      if (!res.ok || !data?.result) setError(data?.error ?? 'model_error');
      else setResult(data.result);
    } catch {
      setError('network');
    } finally {
      setLoading(false);
    }
  }

  const s = result?.summary;
  const rows: [string, string | null][] = s
    ? [
        [t('summary.refNo'), s.refNo],
        [t('summary.khata'), s.khata],
        [t('summary.village'), s.village],
        [t('summary.tehsil'), s.tehsil],
        [
          t('summary.area'),
          s.areaSqm > 0
            ? t('areaValue', { sqm: num.format(s.areaSqm), kanal: s.area.kanal, marla: s.area.marla })
            : null,
        ],
        [t('summary.shareHolders'), String(s.shareHolders)],
        [t('summary.mutations'), String(s.mutationCount)],
        [t('summary.pendingCases'), String(s.pendingCases)],
      ]
    : [];

  return (
    <section aria-label={t('title')} className="space-y-6">
      <div className="space-y-3">
        <label htmlFor="nakal-file" className="block text-sm font-medium">{t('choose')}</label>
        <input
          id="nakal-file"
          type="file"
          accept="application/pdf"
          onChange={(e) => { setFile(e.target.files?.[0] ?? null); setResult(null); setError(null); }}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium"
        />
        <Button type="button" size="lg" onClick={run} disabled={!file || loading}>
          {loading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <FileUp aria-hidden="true" />}
          {loading ? t('analyzing') : t('analyze')}
        </Button>
        <p className="text-xs text-muted-foreground">{t('privacy')}</p>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {tx(`errors.${error}`)}
        </p>
      )}

      {result && s && (
        <div className="space-y-6" aria-live="polite">
          <div className="flex flex-wrap items-center gap-4 border-y border-border py-5">
            <p className="text-5xl font-semibold tabular-nums text-primary">{result.score}<span className="text-2xl text-muted-foreground">/100</span></p>
            <div className="space-y-1">
              <Badge tone={BAND_TONE[result.band]}>{tx(`bands.${result.band}`)}</Badge>
              <p className="text-sm text-muted-foreground">{t('scoreHelp')}</p>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xl">{t('flagsTitle')}</h2>
            {result.flags.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('noFlags')}</p>
            ) : (
              <ul className="space-y-3">
                {result.flags.map((f, i) => (
                  <li key={`${f.code}-${i}`} className="flex items-start gap-3 rounded-md border border-border p-3">
                    <Badge tone={SEVERITY_TONE[f.severity]}>{tx(`severity.${f.severity}`)}</Badge>
                    <p className="text-sm">{tx(`flags.${f.code}`, f.params)}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-xl">{t('summary.title')}</h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="break-words">{v ?? '—'}</dd>
                </div>
              ))}
            </dl>
          </div>

          {result.owners.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl">{t('ownersTitle')}</h2>
              <ul className="divide-y divide-border rounded-md border border-border text-sm">
                {result.owners.map((o, i) => (
                  <li key={i} className="flex items-start justify-between gap-4 p-3">
                    <span className="min-w-0 break-words">{o.names || '—'}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      {o.shareNum ?? '—'}{o.sharePct !== null ? ` (${num.format(o.sharePct)}%)` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-sm text-muted-foreground">{t('verify')}</p>
        </div>
      )}
    </section>
  );
}
