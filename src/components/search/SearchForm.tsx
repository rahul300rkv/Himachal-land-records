'use client';

import { LoaderCircle, RefreshCw, Search, ShieldCheck, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

type Option = { value: string; label: string };
type OfficialControl = { name: string; label: string; kind: 'select' | 'radio'; options: Option[] };
type ApiResult = { options?: Option[]; image?: string; token?: string; html?: string; controls?: OfficialControl[]; captchaFailed?: boolean; recordReady?: boolean; error?: string };
type SearchFormProps = { defaultValues?: unknown };

async function callHimBhoomi(payload: Record<string, unknown>): Promise<ApiResult> {
  const response = await fetch('/api/himbhoomi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  const data = (await response.json()) as ApiResult;
  if (!response.ok) throw new Error(data.error || 'HimBhoomi is unavailable');
  return data;
}

export function SearchForm(_props: SearchFormProps) {
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
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setBusy(true);
    callHimBhoomi({ action: 'districts' }).then((data) => active && setDistricts(data.options ?? [])).catch((reason: Error) => active && setError(reason.message)).finally(() => active && setBusy(false));
    return () => { active = false; };
  }, []);

  async function load(action: 'tehsils' | 'villages' | 'years', payload: Record<string, string>) {
    setBusy(true); setError('');
    try {
      const data = await callHimBhoomi({ action, ...payload });
      if (action === 'tehsils') setTehsils(data.options ?? []);
      if (action === 'villages') setVillages(data.options ?? []);
      if (action === 'years') setYears(data.options ?? []);
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { setBusy(false); }
  }

  function resetAfterLocation() {
    setCaptcha(''); setCaptchaImage(''); setToken(''); setControls([]); setOfficialFields({}); setResultHtml(''); setRecordReady(false);
  }

  async function requestCaptcha() {
    if (!district || !tehsil || !village || !year) return;
    setBusy(true); setError(''); resetAfterLocation();
    try {
      const data = await callHimBhoomi({ action: 'captcha', district, tehsil, village, year });
      setCaptchaImage(data.image ?? ''); setToken(data.token ?? '');
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { setBusy(false); }
  }

  async function submitCaptcha(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !captcha.trim()) return;
    setBusy(true); setError('');
    try {
      const data = await callHimBhoomi({ action: 'search', token, captcha });
      if (data.captchaFailed) { setError(t('captchaInvalid')); setCaptcha(''); setCaptchaImage(''); setToken(''); return; }
      setToken(data.token ?? token); setControls(data.controls ?? []); setResultHtml(data.html ?? ''); setRecordReady(Boolean(data.recordReady));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { setBusy(false); }
  }

  async function loadOfficialChoice() {
    if (!token || Object.keys(officialFields).length === 0) return;
    setBusy(true); setError('');
    try {
      const eventTarget = controls.find((control) => officialFields[control.name])?.name ?? '';
      const data = await callHimBhoomi({ action: 'continue', token, fields: officialFields, eventTarget });
      setToken(data.token ?? token); setControls(data.controls ?? []); setResultHtml(data.html ?? ''); setRecordReady(Boolean(data.recordReady));
    } catch (reason) { setError(reason instanceof Error ? reason.message : t('unavailable')); }
    finally { setBusy(false); }
  }

  function clearAll() {
    setDistrict(''); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); setError(''); resetAfterLocation();
  }

  return <div className="space-y-6">
    <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /><p>{t('privacy')}</p></div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div><Label htmlFor="official-district">{t('district')}</Label><Select id="official-district" value={district} disabled={busy || districts.length === 0} onChange={(event) => { const value = event.target.value; setDistrict(value); setTehsil(''); setVillage(''); setYear(''); setTehsils([]); setVillages([]); setYears([]); resetAfterLocation(); if (value) void load('tehsils', { district: value }); }}><option value="">{t('districtPlaceholder')}</option>{districts.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-tehsil">{t('tehsil')}</Label><Select id="official-tehsil" value={tehsil} disabled={busy || !district} onChange={(event) => { const value = event.target.value; setTehsil(value); setVillage(''); setYear(''); setVillages([]); setYears([]); resetAfterLocation(); if (value) void load('villages', { district, tehsil: value }); }}><option value="">{t('tehsilPlaceholder')}</option>{tehsils.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-village">{t('village')}</Label><Select id="official-village" value={village} disabled={busy || !tehsil} onChange={(event) => { const value = event.target.value; setVillage(value); setYear(''); setYears([]); resetAfterLocation(); if (value) void load('years', { district, tehsil, village: value }); }}><option value="">{t('villagePlaceholder')}</option>{villages.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
      <div><Label htmlFor="official-year">{t('year')}</Label><Select id="official-year" value={year} disabled={busy || !village} onChange={(event) => { setYear(event.target.value); resetAfterLocation(); }}><option value="">{t('yearPlaceholder')}</option>{years.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></div>
    </div>
    {!captchaImage && !resultHtml && <div className="flex flex-col gap-3 sm:flex-row"><Button type="button" size="lg" disabled={busy || !district || !tehsil || !village || !year} onClick={() => void requestCaptcha()}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{t('continue')}</Button><Button type="button" size="lg" variant="ghost" disabled={busy} onClick={clearAll}><X />{t('reset')}</Button></div>}
    {captchaImage && !resultHtml && <form className="rounded-xl border bg-background p-5" onSubmit={submitCaptcha}><h2 className="font-sans text-lg font-semibold tracking-normal">{t('captchaTitle')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('captchaBody')}</p><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"><div><span className="text-sm font-medium">{t('captcha')}</span><div className="mt-1 flex min-h-12 items-center rounded-md border bg-white px-3"><img src={captchaImage} alt={t('captchaAlt')} className="max-h-10 max-w-[190px]" /></div></div><div className="min-w-48 flex-1"><Label htmlFor="official-captcha">{t('captchaEntry')}</Label><Input id="official-captcha" value={captcha} maxLength={12} autoComplete="off" onChange={(event) => setCaptcha(event.target.value.toUpperCase())} /></div><Button type="submit" size="lg" disabled={busy || !captcha.trim()}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{t('fetch')}</Button><Button type="button" variant="ghost" size="lg" disabled={busy} onClick={() => void requestCaptcha()}><RefreshCw />{t('newCaptcha')}</Button></div></form>}
    {controls.length > 0 && <section className="rounded-xl border bg-background p-5"><h2 className="font-sans text-lg font-semibold tracking-normal">{t('recordChooser')}</h2><p className="mt-1 text-sm text-muted-foreground">{t('recordChooserBody')}</p><div className="mt-4 grid gap-4 sm:grid-cols-2">{controls.map((control) => <div key={control.name}><Label htmlFor={`official-${control.name}`}>{control.label}</Label><Select id={`official-${control.name}`} value={officialFields[control.name] ?? ''} onChange={(event) => setOfficialFields((current) => ({ ...current, [control.name]: event.target.value }))}><option value="">{t('choose')}</option>{control.options.map((option) => <option key={`${control.name}-${option.value}`} value={option.value}>{option.label}</option>)}</Select></div>)}</div><Button type="button" className="mt-4" disabled={busy || Object.keys(officialFields).length === 0} onClick={() => void loadOfficialChoice()}>{busy ? <LoaderCircle className="animate-spin" /> : <Search />}{t('loadRecord')}</Button></section>}
    {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</p>}
    {resultHtml && <section className="space-y-3"><h2 className="font-sans text-lg font-semibold tracking-normal">{recordReady ? t('nakalReady') : t('officialResponse')}</h2><div className="official-record overflow-x-auto rounded-xl border bg-white p-4 text-sm text-foreground [&_table]:w-full [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:bg-muted [&_th]:p-2" aria-label={t('officialResult')} dangerouslySetInnerHTML={{ __html: resultHtml }} /></section>}
  </div>;
}
