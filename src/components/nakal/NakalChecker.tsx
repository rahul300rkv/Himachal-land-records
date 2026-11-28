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
const BAND_STYLE: Record<Band, { ring: string; bar: string; label: string }> = {
  low: { ring: 'border-emerald-500/40 bg-emerald-500/10', bar: 'bg-emerald-500', label: 'text-emerald-700 dark:text-emerald-300' },
  moderate: { ring: 'border-amber-500/40 bg-amber-500/10', bar: 'bg-amber-500', label: 'text-amber-700 dark:text-amber-300' },
  high: { ring: 'border-red-500/40 bg-red-500/10', bar: 'bg-red-500', label: 'text-red-700 dark:text-red-300' },
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
          <div className={`rounded-xl border p-5 sm:p-7 ${BAND_STYLE[result.band].ring}`}>
            <div className="flex flex-wrap items-center gap-5">
              <div className="relative grid size-28 shrink-0 place-items-center rounded-full border-[10px] border-current/20" style={{ color: result.band === 'low' ? '#10b981' : result.band === 'moderate' ? '#f59e0b' : '#ef4444' }}>
                <div className="text-center"><p className="text-4xl font-semibold leading-none tabular-nums">{result.score}</p><span className="text-xs text-muted-foreground">/100</span></div>
              </div>
              <div className="min-w-[180px] flex-1 space-y-2"><Badge tone={BAND_TONE[result.band]}>{tx(`bands.${result.band}`)}</Badge><p className={`text-lg font-medium ${BAND_STYLE[result.band].label}`}>{t('scoreHelp')}</p><div className="h-2 overflow-hidden rounded-full bg-black/10"><div className={`h-full rounded-full ${BAND_STYLE[result.band].bar}`} style={{ width: `${result.score}%` }} /></div></div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[['ownership', s.shareHolders > 0 ? 100 : 0, t('threeChecks.ownership.title'), t('threeChecks.ownership.body', { count: s.shareHolders })], ['history', Math.min(100, s.mutationCount * 20), t('threeChecks.encumbrances.title'), t('threeChecks.encumbrances.body', { count: s.mutationCount })], ['litigation', s.pendingCases > 0 ? 20 : 100, t('threeChecks.litigation.title'), t('threeChecks.litigation.body', { count: s.pendingCases })]].map(([key, value, title, body]) => <div key={key} className="rounded-lg bg-background/70 p-3"><div className="flex items-center justify-between gap-2 text-sm font-medium"><span>{title}</span><span className="tabular-nums text-muted-foreground">{value}%</span></div><div className="mt-2 h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${key === 'litigation' && s.pendingCases > 0 ? 'bg-red-500' : 'bg-primary'}`} style={{ width: `${value}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{body}</p></div>)}
            </div>
          </div>
          {(!s.extractionComplete || s.lowConfidenceCount > 0) && (
            <div className="rounded-lg border border-notice-border bg-notice p-4 text-sm text-notice-foreground">
              <p className="font-semibold">{t('quality.title')}</p>
              {!s.extractionComplete && <p className="mt-1">{t('quality.incomplete')}</p>}
              {s.lowConfidenceCount > 0 && <p className="mt-1">{t('quality.uncertain', { count: s.lowConfidenceCount })}</p>}
            </div>
          )}
          <div className="hidden">
          <div className="flex flex-wrap items-center gap-4 border-y border-border py-5">
            <p className="text-5xl font-semibold tabular-nums text-primary">{result.score}<span className="text-2xl text-muted-foreground">/100</span></p>
            <div className="space-y-1">
              <Badge tone={BAND_TONE[result.band]}>{tx(`bands.${result.band}`)}</Badge>
              <p className="text-sm text-muted-foreground">{t('scoreHelp')}</p>
            </div>
          </div></div>

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
          {result.khasras.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl">{t('khasrasTitle')}</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[560px] text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('tables.khasra')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.area')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.landClass')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.possession')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.khasras.map((k, i) => (
                      <tr key={`${k.number ?? 'khasra'}-${i}`}>
                        <td className="px-3 py-2 font-medium">{k.number ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{k.area ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{k.landClass ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{k.possession ?? t('tables.notRecorded')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {result.mutations.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl">{t('mutationsTitle')}</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[620px] text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('tables.mutation')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.type')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.date')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.transferredArea')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.party')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.note')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.mutations.map((m, i) => (
                      <tr key={`${m.number ?? 'mutation'}-${i}`}>
                        <td className="px-3 py-2 font-medium">{m.number ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{m.kind}</td>
                        <td className="px-3 py-2">{m.date ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{m.area ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{m.buyer ?? t('tables.notRecorded')}</td>
                        <td className="max-w-[28rem] whitespace-normal px-3 py-2">{m.note ?? t('tables.notRecorded')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {result.litigation.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl">{t('litigationTitle')}</h2>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full min-w-[680px] text-sm">
                  <thead className="bg-muted/50 text-left">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('tables.caseNo')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.caseType')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.court')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.filedOn')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.litigation.map((l, i) => (
                      <tr key={`${l.caseNo ?? 'case'}-${i}`}>
                        <td className="px-3 py-2 font-medium">{l.caseNo ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{l.caseType ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{l.court ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{l.filedOn ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{l.status ?? t('tables.notRecorded')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {result.ownerUpdates.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl">{t('ownerUpdatesTitle')}</h2>
              <p className="mb-3 text-sm text-muted-foreground">{t('ownerUpdatesIntro')}</p>
              <div className="overflow-x-auto rounded-lg border border-amber-300/70 bg-amber-50/60 dark:border-amber-400/30 dark:bg-amber-950/20">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-amber-100/80 text-left dark:bg-amber-900/30">
                    <tr>
                      <th className="px-3 py-2 font-medium">{t('tables.mutation')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.date')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.newOwners')}</th>
                      <th className="px-3 py-2 font-medium">{t('tables.share')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.ownerUpdates.map((owner, i) => (
                      <tr key={`${owner.mutationNumber ?? 'update'}-${i}`}>
                        <td className="px-3 py-2 font-medium">{owner.mutationNumber ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2">{owner.date ?? t('tables.notRecorded')}</td>
                        <td className="max-w-[34rem] whitespace-normal px-3 py-2">{owner.names ?? t('tables.notRecorded')}</td>
                        <td className="px-3 py-2 font-medium">{owner.share ?? t('tables.notRecorded')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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



          <p className="text-sm text-muted-foreground">{t('verify')}</p>
        </div>
      )}
    </section>
  );
}
