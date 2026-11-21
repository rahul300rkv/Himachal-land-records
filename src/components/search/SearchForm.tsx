'use client';

import { Download, LoaderCircle, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { loadOfficialLocations, type LocationCodes, type Option } from '@/lib/data/himbhoomi-location-options';

type OfficialControl = { name: string; label: string; kind: 'select' | 'radio' | 'text'; options: Option[]; selected?: string };
type NakalLabel = { id: string; value: string };
type ParcelTable = { headers: string[]; rows: string[][] };
type ApiResult = { options?: Option[]; image?: string; token?: string; receiptNumber?: string; labels?: NakalLabel[]; parcelTable?: ParcelTable; controls?: OfficialControl[]; captchaFailed?: boolean; submissionFailed?: boolean; recordReady?: boolean; error?: string };
type SearchFormProps = { initialLocation?: LocationCodes };

/** What the form is currently waiting on. Drives the status panel and per-field spinners. */
type Step = 'districts' | 'tehsils' | 'villages' | 'years' | 'record' | 'captcha' | 'search';

const UNAVAILABLE = 'HimBhoomi is unavailable';
const SLOW_AFTER_MS = 8_000;

class HimBhoomiTimeout extends Error {}

/* ─── Per-tab cache for location lists ────────────────────────────────────
   Everything still comes from HimBhoomi. This only stops the same list being
   fetched twice in one tab session (going back, changing a district and
   returning, etc). Captcha, search and record steps are never cached. */
const memory = new Map<string, unknown>();

function readCache<T>(key: string): T | undefined {
  if (memory.has(key)) return memory.get(key) as T;
  try {
    const raw = sessionStorage.getItem(`himland:${key}`);
    if (raw) {
      const value = JSON.parse(raw) as T;
      memory.set(key, value);
      return value;
    }
  } catch {}
  return undefined;
}

function writeCache(key: string, value: unknown) {
  memory.set(key, value);
  try { sessionStorage.setItem(`himland:${key}`, JSON.stringify(value)); } catch {}
}

const loadLocations: typeof loadOfficialLocations = async (...args) => {
  const key = `loc:${args.join('|')}`;
  const hit = readCache<Awaited<ReturnType<typeof loadOfficialLocations>>>(key);
  if (hit) return hit;
  const value = await loadOfficialLocations(...args);
  if (value.length > 0) writeCache(key, value); // never cache empty or failed results
  return value;
};

const LIST_ACTIONS = new Set(['tehsils', 'villages', 'years']);

function selectedFields(controls: OfficialControl[]) {
  return Object.fromEntries(controls.map(({ name, selected }) => [name, selected ?? '']));
}

async function callHimBhoomi(payload: Record<string, unknown>): Promise<ApiResult> {
  const action = String(payload.action);
  const cacheKey = LIST_ACTIONS.has(action) ? `api:${JSON.stringify(payload)}` : null;
  if (cacheKey) {
    const hit = readCache<ApiResult>(cacheKey);
    if (hit) return hit;
  }

  // Never wait forever: captcha/search get longer, everything else 30 s.
  const controller = new AbortController();
  const limit = action === 'search' || action === 'captcha' ? 45_000 : 30_000;
  const timer = setTimeout(() => controller.abort(), limit);
  try {
    const response = await fetch('/api/himbhoomi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const data = (await response.json().catch(() => ({}))) as ApiResult;
    if (!response.ok) throw new Error(data.error || UNAVAILABLE);
    if (cacheKey && data.options && data.options.length > 0) writeCache(cacheKey, data);
    return data;
  } catch (reason) {
    if (reason instanceof DOMException && reason.name === 'AbortError') throw new HimBhoomiTimeout();
    throw reason;
  } finally {
    clearTimeout(timer);
  }
}

/** Label with an inline spinner while its own list is loading. */
function Field({ id, label, loading, children }: { id: string; label: string; loading: boolean; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-1.5">
        {label}
        {loading && <LoaderCircle className="size-3.5 animate-spin text-primary" aria-hidden="true" />}
      </Label>
      {children}
    </div>
  );
}

export function SearchForm({ initialLocation }: SearchFormProps) {
  const t = useTranslations('Search.official');
  const [districts, setDistricts] = useState<Option[]>([]);
  const [tehsils, setTehsils] = useState<Option[]>([]);
  const [villages, setVillages] = useState<Option[]>([]);
  const [years, setYears] = useState<Option[]>([]);
  const [district, setDistrict] = useState('');
  const [tehsil, setTehsil] = useState('');
  const [village, setVillage] = useState('');
  const [year, setYear] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [token, setToken] = useState('');
  const [controls, setControls] = useState<OfficialControl[]>([]);
  const [officialFields, setOfficialFields] = useState<Record<string, string>>({});
  const [receiptNumber, setReceiptNumber] = useState('');
  const [labels, setLabels] = useState<NakalLabel[]>([]);
  const [parcelTable, setParcelTable] = useState<ParcelTable>();
  const [recordReady, setRecordReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState<Step | null>(null);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState<(() => void) | null>(null);
  const [initAttempt, setInitAttempt] = useState(0);
  const operationInFlight = useRef(false);

  const begin = useCallback((next: Step) => { setBusy(true); setStep(next); }, []);
  const end = useCallback(() => { setBusy(false); setStep(null); }, []);

  /** One place that turns a failure into a message the user can act on. */
  function fail(reason: unknown, again?: () => void) {
    const message =
      reason instanceof HimBhoomiTimeout
        ? t('timeout')
        : reason instanceof Error && reason.message && reason.message !== UNAVAILABLE
          ? reason.message
          : t('unavailable');
    setError(message);
    setRetry(again ? () => again : null);
  }

  function clearError() {
    setError('');
    setRetry(null);
  }

  // After a few seconds, say plainly that the delay is on HimBhoomi's side.
  useEffect(() => {
    setSlow(false);
    if (!busy) return;
    const id = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(id);
  }, [busy, step]);

  useEffect(() => {
    let active = true;
    clearError();
    begin('districts');
    async function initialize() {
      const items = await loadLocations('districts');
      if (!active) return;
      setDistricts(items);
      if (items.length === 0) throw new Error(t('emptyList'));
      if (!initialLocation) return;
      const { district, tehsil, village } = initialLocation;
      if (!items.some((item) => item.value === district)) return;
      setDistrict(district);
      setStep('tehsils');
      const nextTehsils = await loadLocations('tehsils', district);
      if (!active) return;
      setTehsils(nextTehsils);
      if (!nextTehsils.some((item) => item.value === tehsil)) return;
      setTehsil(tehsil);
      setStep('villages');
      const nextVillages = await loadLocations('villages', district, tehsil);
      if (!active) return;
      setVillages(nextVillages);
      if (!nextVillages.some((item) => item.value === village)) return;
      setVillage(village);
      setStep('years');
      const data = await callHimBhoomi({ action: 'years', district, tehsil, village });
      if (active) setYears(data.options ?? []);
    }
    void initialize()
      .catch((reason) => active && fail(reason, () => setInitAttempt((n) => n + 1)))
      .finally(() => active && end());
    return () => { active = false; };
    // fail/clearError/begin/end are stable enough for this effect; re-run on retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLocation, t, initAttempt]);

  async function load(action: 'tehsils' | 'villages' | 'years', payload: Record<string, string>) {
    begin(action);
    clearError();
    try {
      const options = (await callHimBhoomi({ action, ...payload })).options ?? [];
      if (action === 'tehsils') setTehsils(options);
      if (action === 'villages') setVillages(options);
      if (action === 'years') setYears(options);
      if (options.length === 0) fail(new Error(t('emptyList')), () => void load(action, payload));
    } catch (reason) {
      fail(reason, () => void load(action, payload));
    } finally {
      end();
    }
  }

  function resetAfterLocation() {
    setCaptcha(''); setCaptchaImage(''); setToken(''); setControls([]); setOfficialFields({}); setRecordReady(false);
    setReceiptNumber('');
    setLabels([]);
    setParcelTable(undefined);
  }

  async function requestCaptcha() {
    if (!token || operationInFlight.current) return;
    operationInFlight.current = true;
    begin('captcha'); clearError(); setCaptcha(''); setCaptchaImage('');
    try {
      const data = await callHimBhoomi({ action: 'captcha', token });
      setCaptchaImage(data.image ?? ''); setToken(data.token ?? '');
    } catch (reason) {
      fail(reason, () => void requestCaptcha());
    } finally {
      operationInFlight.current = false;
      end();
    }
  }

  async function submitCaptcha(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !captcha.trim() || operationInFlight.current) return;
    operationInFlight.current = true;
    begin('search'); clearError();
    try {
      const data = await callHimBhoomi({ action: 'search', token, captcha });
      if (data.captchaFailed) {
        setError(t('captchaInvalid'));
        setCaptcha(''); setCaptchaImage(data.image ?? '');
        setToken(data.token ?? token);
        return;
      }
      if (data.submissionFailed) {
        setError(t('submissionInvalid'));
        setCaptcha(''); setCaptchaImage('');
        setToken(data.token ?? token);
        if (data.controls) {
          setControls(data.controls);
          setOfficialFields(selectedFields(data.controls));
        }
        return;
      }
      setToken(data.token ?? token); setControls(data.controls ?? []); setRecordReady(Boolean(data.recordReady));
      setReceiptNumber(data.receiptNumber ?? '');
      setLabels(data.labels ?? []);
      setParcelTable(data.parcelTable);
      setCaptchaImage('');
    } catch (reason) {
      // The captcha is single-use, so a retry means getting a fresh one.
      fail(reason, () => void requestCaptcha());
    } finally {
      operationInFlight.current = false;
      end();
    }
  }

  async function prepareRecordOptions(nextYear: string) {
    if (operationInFlight.current) return;
    operationInFlight.current = true;
    setYear(nextYear); resetAfterLocation();
    if (!nextYear) { operationInFlight.current = false; return; }
    begin('record'); clearError();
    try {
      const data = await callHimBhoomi({ action: 'recordOptions', district, tehsil, village, year: nextYear });
      const nextControls = data.controls ?? [];
      setToken(data.token ?? ''); setControls(nextControls); setOfficialFields(selectedFields(nextControls));
    } catch (reason) {
      fail(reason, () => void prepareRecordOptions(nextYear));
    } finally {
      operationInFlight.current = false;
      end();
    }
  }

  async function changeOfficialControl(control: OfficialControl, value: string) {
    if (operationInFlight.current) return;
    const nextFields = { ...officialFields, [control.name]: value };
    setOfficialFields(nextFields); setCaptchaImage(''); setCaptcha('');
    if (control.kind === 'text' || !value || !token) return;
    operationInFlight.current = true;
    begin('record'); clearError();
    try {
      const data = await callHimBhoomi({ action: 'continue', token, fields: nextFields, eventTarget: control.name });
      const nextControls = data.controls ?? [];
      setOfficialFields(selectedFields(nextControls));
      setToken(data.token ?? token); setControls(nextControls); setRecordReady(Boolean(data.recordReady));
      setReceiptNumber(data.receiptNumber ?? '');
      setLabels(data.labels ?? []);
      setParcelTable(data.parcelTable);
    } catch (reason) {
      fail(reason, () => void changeOfficialControl(control, value));
    } finally {
      operationInFlight.current = false;
      end();
    }
  }

  const canRequestCaptcha = Boolean(token && controls.length > 0 && controls.every((control) => officialFields[control.name]?.trim()));

  function clearAll() {
    setDistrict(''); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); clearError(); resetAfterLocation();
  }

  async function downloadCopy() {
    if (!parcelTable || !receiptNumber || downloading) return;
    setDownloading(true);
    setDownloadError(false);
    try {
      const response = await fetch('/api/himbhoomi/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptNumber, labels, parcelTable }),
      });
      if (!response.ok) throw new Error('PDF failed');
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement('a');
      link.href = url;
      link.download = `HimLand-Check-information-${receiptNumber}.pdf`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setDownloadError(true);
    } finally {
      setDownloading(false);
    }
  }

  const locationStep = !district ? 1 : !tehsil ? 2 : !village ? 3 : 4;
  /** Placeholder text that says "Loading villages…" while that list is in flight. */
  const ph = (field: Step, idle: string) => (step === field ? t(`loading.${field}`) : idle);

  return <div className="space-y-6">
    {/* Status: always says what is happening and whose side the wait is on */}
    {busy && step && (
      <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4 text-sm">
        <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin text-primary" aria-hidden="true" />
        <div>
          <p className="font-medium">{t(`loading.${step}`)}</p>
          <p className="mt-0.5 text-muted-foreground">{slow ? t('slow') : t('loadingOfficial')}</p>
        </div>
      </div>
    )}

    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <p>{t('privacy')}</p>
    </div>

    {!recordReady && (
      <p className="text-xs font-medium text-muted-foreground">{t('step', { current: locationStep, total: 4 })}</p>
    )}

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Field id="official-district" label={t('district')} loading={step === 'districts'}>
        <Select
          id="official-district"
          value={district}
          aria-busy={step === 'districts'}
          disabled={busy || districts.length === 0}
          onChange={(event) => {
            const value = event.target.value;
            setDistrict(value); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); resetAfterLocation();
            if (value) void load('tehsils', { district: value });
          }}
        >
          <option value="">{ph('districts', t('districtPlaceholder'))}</option>
          {districts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </Field>

      <Field id="official-tehsil" label={t('tehsil')} loading={step === 'tehsils'}>
        <Select
          id="official-tehsil"
          value={tehsil}
          aria-busy={step === 'tehsils'}
          disabled={busy || !district}
          onChange={(event) => {
            const value = event.target.value;
            setTehsil(value); setVillage(''); setYear(''); setVillages([]); setYears([]); resetAfterLocation();
            if (value) void load('villages', { district, tehsil: value });
          }}
        >
          <option value="">{ph('tehsils', t('tehsilPlaceholder'))}</option>
          {tehsils.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </Field>

      <Field id="official-village" label={t('village')} loading={step === 'villages'}>
        <Select
          id="official-village"
          value={village}
          aria-busy={step === 'villages'}
          disabled={busy || !tehsil}
          onChange={(event) => {
            const value = event.target.value;
            setVillage(value); setYear(''); setYears([]); resetAfterLocation();
            if (value) void load('years', { district, tehsil, village: value });
          }}
        >
          <option value="">{ph('villages', t('villagePlaceholder'))}</option>
          {villages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </Field>

      <Field id="official-year" label={t('year')} loading={step === 'years'}>
        <Select
          id="official-year"
          value={year}
          aria-busy={step === 'years' || step === 'record'}
          disabled={busy || !village}
          onChange={(event) => void prepareRecordOptions(event.target.value)}
        >
          <option value="">{ph('years', t('yearPlaceholder'))}</option>
          {years.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </Select>
      </Field>
    </div>

    {controls.length > 0 && !captchaImage && (
      <section className="rounded-xl border bg-background p-5">
        <h2 className="font-sans text-lg font-semibold tracking-normal">{t('recordChooser')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('recordChooserBody')}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {controls.map((control) => (
            <div key={control.name}>
              <Label htmlFor={`official-${control.name}`}>{control.label}</Label>
              {control.kind === 'text' ? (
                <Input
                  id={`official-${control.name}`}
                  value={officialFields[control.name] ?? ''}
                  disabled={busy}
                  autoComplete="off"
                  onChange={(event) => void changeOfficialControl(control, event.target.value)}
                />
              ) : (
                <Select
                  id={`official-${control.name}`}
                  value={officialFields[control.name] ?? ''}
                  disabled={busy}
                  aria-busy={step === 'record'}
                  onChange={(event) => void changeOfficialControl(control, event.target.value)}
                >
                  <option value="">{t('choose')}</option>
                  {control.options.map((option) => (
                    <option key={`${control.name}-${option.value}`} value={option.value}>{option.label}</option>
                  ))}
                </Select>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button type="button" disabled={busy || !canRequestCaptcha} onClick={() => void requestCaptcha()}>
            {step === 'captcha' ? <LoaderCircle className="animate-spin" /> : <Search />}
            {step === 'captcha' ? t('loading.captcha') : t('continue')}
          </Button>
          <Button type="button" variant="ghost" disabled={busy} onClick={clearAll}><X />{t('reset')}</Button>
        </div>
      </section>
    )}

    {!captchaImage && !recordReady && controls.length === 0 && (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" size="lg" variant="ghost" disabled={busy} onClick={clearAll}><X />{t('reset')}</Button>
      </div>
    )}

    {captchaImage && !recordReady && (
      <form className="rounded-xl border bg-background p-5" onSubmit={submitCaptcha}>
        <h2 className="font-sans text-lg font-semibold tracking-normal">{t('captchaTitle')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('captchaBody')}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          <div>
            <span className="text-sm font-medium">{t('captcha')}</span>
            <div className="mt-1 flex min-h-12 items-center rounded-md border bg-white px-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={captchaImage} alt={t('captchaAlt')} className="max-h-10 max-w-[190px]" />
            </div>
          </div>
          <div className="min-w-48 flex-1">
            <Label htmlFor="official-captcha">{t('captchaEntry')}</Label>
            <Input id="official-captcha" value={captcha} maxLength={12} autoComplete="off" onChange={(event) => setCaptcha(event.target.value.toUpperCase())} />
          </div>
          <Button type="submit" size="lg" disabled={busy || !captcha.trim()}>
            {step === 'search' ? <LoaderCircle className="animate-spin" /> : <Search />}
            {step === 'search' ? t('loading.search') : t('fetch')}
          </Button>
          <Button type="button" variant="ghost" size="lg" disabled={busy} onClick={() => void requestCaptcha()}><RefreshCw />{t('newCaptcha')}</Button>
        </div>
      </form>
    )}

    {error && (
      <div className="space-y-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
        <p role="alert" className="text-sm text-destructive">{error}</p>
        <p className="text-xs text-muted-foreground">{t('errorHint')}</p>
        <div className="flex flex-wrap gap-3">
          {retry && (
            <Button type="button" variant="default" disabled={busy} onClick={retry}>
              <RefreshCw aria-hidden="true" />
              {t('retry')}
            </Button>
          )}
          <Button asChild variant="outline">
            <a href="https://himbhoomilmk.nic.in/viewlandrecords.aspx" target="_blank" rel="noopener noreferrer">
              {t('openOfficial')}
            </a>
          </Button>
        </div>
      </div>
    )}

    {recordReady && parcelTable && (
      <section className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/10 p-6 shadow-sm">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{t('parcelDetails')}</h2>
          </div>
          <Button type="button" size="lg" className="h-14 rounded-full bg-primary px-7 shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 hover:bg-primary/90" onClick={() => void downloadCopy()} disabled={downloading || !receiptNumber}>
            {downloading ? <LoaderCircle className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
            {t('downloadCopy')}
          </Button>
        </div>
        {downloadError && <p role="alert" className="mt-4 text-sm text-destructive">{t('downloadFailed')}</p>}
      </section>
    )}
  </div>;
}