'use client';

import { LoaderCircle, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { loadMapLocations, type LocationCodes, type Option } from '@/lib/data/map-location-options';

type OfficialControl = { name: string; label: string; kind: 'select' | 'radio' | 'text'; options: Option[] };
type ApiResult = { options?: Option[]; image?: string; token?: string; html?: string; controls?: OfficialControl[]; captchaFailed?: boolean; submissionFailed?: boolean; recordReady?: boolean; error?: string };
type SearchFormProps = { initialLocation?: LocationCodes };

async function callHimBhoomi(payload: Record<string, unknown>): Promise<ApiResult> {
  const response = await fetch('/api/himbhoomi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = (await response.json()) as ApiResult;
  if (!response.ok) throw new Error(data.error || 'HimBhoomi is unavailable');
  return data;
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
  const [resultHtml, setResultHtml] = useState('');
  const [recordReady, setRecordReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [liveLocations, setLiveLocations] = useState(false);
  const [error, setError] = useState('');
  const operationInFlight = useRef(false);

  useEffect(() => {
    let active = true;
    setBusy(true);
    const options = liveLocations
      ? callHimBhoomi({ action: 'districts' }).then((data) => data.options ?? [])
      : loadMapLocations('districts');
    async function initialize() {
      const items = await options;
      if (!active) return;
      setDistricts(items);
      if (liveLocations || !initialLocation) return;
      const { district, tehsil, village } = initialLocation;
      if (!items.some((item) => item.value === district)) return;
      setDistrict(district);
      const nextTehsils = await loadMapLocations('tehsils', district);
      if (!active) return;
      setTehsils(nextTehsils);
      if (!nextTehsils.some((item) => item.value === tehsil)) return;
      setTehsil(tehsil);
      const nextVillages = await loadMapLocations('villages', district, tehsil);
      if (!active) return;
      setVillages(nextVillages);
      if (!nextVillages.some((item) => item.value === village)) return;
      setVillage(village);
      const data = await callHimBhoomi({ action: 'years', district, tehsil, village });
      if (active) setYears(data.options ?? []);
    }
    void initialize().catch(() => active && setError(t('unavailable'))).finally(() => active && setBusy(false));
    return () => { active = false; };
  }, [initialLocation, liveLocations, t]);

  async function load(action: 'tehsils' | 'villages' | 'years', payload: Record<string, string>) {
    setBusy(true); setError('');
    try {
      const options = action !== 'years' && !liveLocations
        ? await loadMapLocations(action, payload.district, payload.tehsil)
        : (await callHimBhoomi({ action, ...payload })).options ?? [];
      if (action === 'tehsils') setTehsils(options);
      if (action === 'villages') setVillages(options);
      if (action === 'years') setYears(options);
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { setBusy(false); }
  }

  function resetAfterLocation() {
    setCaptcha(''); setCaptchaImage(''); setToken(''); setControls([]); setOfficialFields({}); setResultHtml(''); setRecordReady(false);
  }

  async function requestCaptcha() {
    if (!token || operationInFlight.current) return;
    operationInFlight.current = true;
    setBusy(true); setError(''); setCaptcha(''); setCaptchaImage('');
    try {
      const data = await callHimBhoomi({ action: 'captcha', token });
      setCaptchaImage(data.image ?? ''); setToken(data.token ?? '');
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { operationInFlight.current = false; setBusy(false); }
  }

  async function submitCaptcha(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !captcha.trim() || operationInFlight.current) return;
    operationInFlight.current = true;
    setBusy(true); setError('');
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
        setControls(data.controls ?? controls);
        return;
      }
      setToken(data.token ?? token); setControls(data.controls ?? []); setResultHtml(data.html ?? ''); setRecordReady(Boolean(data.recordReady));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { operationInFlight.current = false; setBusy(false); }
  }

  async function prepareRecordOptions(nextYear: string) {
    if (operationInFlight.current) return;
    operationInFlight.current = true;
    setYear(nextYear); resetAfterLocation();
    if (!nextYear) { operationInFlight.current = false; return; }
    setBusy(true); setError('');
    try {
      const data = await callHimBhoomi({ action: 'recordOptions', district, tehsil, village, year: nextYear });
      setToken(data.token ?? ''); setControls(data.controls ?? []); setOfficialFields({});
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { operationInFlight.current = false; setBusy(false); }
  }

  async function changeOfficialControl(control: OfficialControl, value: string) {
    if (operationInFlight.current) return;
    const nextFields = { ...officialFields, [control.name]: value };
    setOfficialFields(nextFields); setCaptchaImage(''); setCaptcha('');
    if (control.kind === 'text' || !value || !token) return;
    operationInFlight.current = true;
    setBusy(true); setError('');
    try {
      const data = await callHimBhoomi({ action: 'continue', token, fields: nextFields, eventTarget: control.name });
      const nextControls = data.controls ?? [];
      const names = new Set(nextControls.map((item) => item.name));
      setOfficialFields(Object.fromEntries(Object.entries(nextFields).filter(([name]) => names.has(name))));
      setToken(data.token ?? token); setControls(nextControls); setRecordReady(Boolean(data.recordReady));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { operationInFlight.current = false; setBusy(false); }
  }

  const canRequestCaptcha = Boolean(token && controls.length > 0 && controls.every((control) => officialFields[control.name]?.trim()));

  function clearAll() {
    setDistrict(''); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); setError(''); resetAfterLocation();
  }

  return <div className="space-y-6">
    {!liveLocations && (
      <Button type="button" variant="outline" disabled={busy} onClick={() => {
        clearAll();
        setDistricts([]);
        setBusy(true);
        setLiveLocations(true);
      }}>
        <RefreshCw aria-hidden="true" />
        {t('loadLiveLocations')}
      </Button>
    )}
    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p>{t('privacy')}</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div><Label htmlFor="official-district">{t('district')}</Label><Select id="official-district" value={district} disabled={busy || districts.length === 0} onChange={(event) => { const value = event.target.value; setDistrict(value); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); resetAfterLocation(); if (value) void load('tehsils', { district: value }); }}><option value="">{t('districtPlaceholder')}</option>{districts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-tehsil">{t('tehsil')}</Label><Select id="official-tehsil" value={tehsil} disabled={busy || !district} onChange={(event) => { const value = event.target.value; setTehsil(value); setVillage(''); setYear(''); setVillages([]); setYears([]); resetAfterLocation(); if (value) void load('villages', { district, tehsil: value }); }}><option value="">{t('tehsilPlaceholder')}</option>{tehsils.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-village">{t('village')}</Label><Select id="official-village" value={village} disabled={busy || !tehsil} onChange={(event) => { const value = event.target.value; setVillage(value); setYear(''); setYears([]); resetAfterLocation(); if (value) void load('years', { district, tehsil, village: value }); }}><option value="">{t('villagePlaceholder')}</option>{villages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-year">{t('year')}</Label><Select id="official-year" value={year} disabled={busy || !village} onChange={(event) => void prepareRecordOptions(event.target.value)}><option value="">{t('yearPlaceholder')}</option>{years.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
    </div>
    {!captchaImage && !resultHtml && controls.length === 0 && <div className="flex flex-col gap-3 sm:flex-row"><Button type="button" size="lg" variant="ghost" disabled={busy} onClick={clearAll}><X />{t('reset')}</Button></div>}
    {captchaImage && !resultHtml && <form className="rounded-xl border bg-background p-5" onSubmit={submitCaptcha}><h2 className="font-sans text-lg font-semibold tracking-normal">{t('captchaTitle')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('captchaBody')}</p><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"><div><span className="text-sm font-medium">{t('captcha')}</span><div className="mt-1 flex min-h-12 items-center rounded-md border bg-white px-3"><img src={captchaImage} alt={t('captchaAlt')} className="max-h-10 max-w-[190px]" /></div></div><div className="min-w-48 flex-1"><Label htmlFor="official-captcha">{t('captchaEntry')}</Label><Input id="official-captcha" value={captcha} maxLength={12} autoComplete="off" onChange={(event) => setCaptcha(event.target.value.toUpperCase())} /></div><Button type="submit" size="lg" disabled={busy || !captcha.trim()}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{t('fetch')}</Button><Button type="button" variant="ghost" size="lg" disabled={busy} onClick={() => void requestCaptcha()}><RefreshCw />{t('newCaptcha')}</Button></div></form>}
    {controls.length > 0 && !captchaImage && <section className="rounded-xl border bg-background p-5"><h2 className="font-sans text-lg font-semibold tracking-normal">{t('recordChooser')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('recordChooserBody')}</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{controls.map((control) => <div key={control.name}><Label htmlFor={`official-${control.name}`}>{control.label}</Label>{control.kind === 'text' ? <Input id={`official-${control.name}`} value={officialFields[control.name] ?? ''} disabled={busy} autoComplete="off" onChange={(event) => void changeOfficialControl(control, event.target.value)} /> : <Select id={`official-${control.name}`} value={officialFields[control.name] ?? ''} disabled={busy} onChange={(event) => void changeOfficialControl(control, event.target.value)}><option value="">{t('choose')}</option>{control.options.map((option) => <option key={`${control.name}-${option.value}`} value={option.value}>{option.label}</option>)}</Select>}</div>)}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row"><Button type="button" disabled={busy || !canRequestCaptcha} onClick={() => void requestCaptcha()}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{t('continue')}</Button><Button type="button" variant="ghost" disabled={busy} onClick={clearAll}><X />{t('reset')}</Button></div></section>}
    {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
    {resultHtml && <section className="space-y-3"><h2 className="font-sans text-lg font-semibold tracking-normal">{recordReady ? t('nakalReady') : t('officialResponse')}</h2><div className="official-record overflow-x-auto rounded-xl border bg-white p-4 text-sm text-foreground [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:bg-muted [&_th]:p-2" aria-label={t('officialResult')} dangerouslySetInnerHTML={{ __html: resultHtml }} /></section>}
  </div>;
}
