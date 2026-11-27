'use client';

import { ArrowUpRight, MapPinned } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { BhunakshaViewer } from './BhunakshaViewer';

type Option = { id: string; name: string; hi?: string };
type ViewerStatus = 'idle' | 'loading' | 'ready' | 'village-ready' | 'plot-found' | 'plot-unavailable' | 'error';
type PlotApiValue = string | Record<string, unknown>;

function normalizePlotNumbers(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const numbers = value.flatMap((item: PlotApiValue) => {
    if (typeof item === 'string' || typeof item === 'number') return [String(item).trim()];
    if (!item || typeof item !== 'object') return [];
    for (const key of ['plotno', 'plotNo', 'plot', 'khasra', 'khasraNo', 'name', 'value']) {
      const candidate = item[key];
      if (typeof candidate === 'string' || typeof candidate === 'number') return [String(candidate).trim()];
    }
    return [];
  });
  return [...new Set(numbers)].filter(Boolean).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function PlotMapLookup() {
  const t = useTranslations('MapExplorer');
  const locale = useLocale();
  const [districts, setDistricts] = useState<Option[]>([]);
  const [tehsils, setTehsils] = useState<Option[]>([]);
  const [villages, setVillages] = useState<Option[]>([]);
  const [districtId, setDistrictId] = useState('02');
  const [tehsilId, setTehsilId] = useState('37');
  const [villageId, setVillageId] = useState('011601');
  const [loading, setLoading] = useState<'districts' | 'tehsils' | 'villages' | ''>('districts');
  const [plot, setPlot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewerOpen, setViewerOpen] = useState(true);
  const [viewerStatus, setViewerStatus] = useState<ViewerStatus>('idle');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [availablePlots, setAvailablePlots] = useState<string[]>([]);
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const canShare = Boolean(districtId && tehsilId && villageId && plot.trim());

  // Opened from a marketplace listing: /map?gis=<10-digit village code>&plot=<khasra>.
  // Fill in the village and plot and show the map straight away.
  const searchParams = useSearchParams();
  useEffect(() => {
    const gis = searchParams.get('gis') ?? '';
    if (!/^\d{10}$/.test(gis)) return;
    setDistrictId(gis.slice(0, 2));
    setTehsilId(gis.slice(2, 4));
    setVillageId(gis.slice(4, 10));
    const plotParam = (searchParams.get('plot') ?? '').trim().slice(0, 50);
    if (plotParam) setPlot(plotParam);
    setShareLink(window.location.href);
    setViewerOpen(true);
    const timer = window.setTimeout(() => document.getElementById('plot-map-viewer')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 400);
    return () => window.clearTimeout(timer);
    // Only the address the page was opened with matters, not later changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch('/api/bhunaksha/locations')
      .then((response) => response.json())
      .then((data: { districts?: Option[] }) => setDistricts(data.districts ?? []))
      .finally(() => setLoading(''));
  }, []);

  useEffect(() => {
    if (!districtId) {
      setTehsils([]);
      return;
    }
    setLoading('tehsils');
    fetch(`/api/bhunaksha/locations?districtId=${districtId}`)
      .then((response) => response.json())
      .then((data: { tehsils?: Option[] }) => setTehsils(data.tehsils ?? []))
      .finally(() => setLoading(''));
  }, [districtId]);

  useEffect(() => {
    if (!districtId || !tehsilId) {
      setVillages([]);
      return;
    }
    setLoading('villages');
    fetch(`/api/bhunaksha/locations?districtId=${districtId}&tehsilId=${tehsilId}`)
      .then((response) => response.json())
      .then((data: { villages?: Option[] }) => setVillages(data.villages ?? []))
      .finally(() => setLoading(''));
  }, [districtId, tehsilId]);

  useEffect(() => {
    setAvailablePlots([]);
    setLocationStatus('idle');
    setViewerStatus('idle');
    if (!districtId || !tehsilId || !villageId) return;
    let cancelled = false;
    setLocationStatus('loading');
    fetch('/api/bhunaksha/viewer?gisCode=' + districtId + tehsilId + villageId)
      .then(async (response) => {
        const data = await response.json() as { extent?: unknown; plots?: unknown };
        if (!response.ok || !data.extent) throw new Error('location');
        if (cancelled) return;
        setAvailablePlots(normalizePlotNumbers(data.plots));
        setLocationStatus('ready');
      })
      .catch(() => { if (!cancelled) setLocationStatus('error'); });
    return () => { cancelled = true; };
  }, [districtId, tehsilId, villageId]);

  const district = districts.find((item) => item.id === districtId);
  const tehsil = tehsils.find((item) => item.id === tehsilId);
  const village = villages.find((item) => item.id === villageId);
  const reference = useMemo(
    () => [district?.name, tehsil?.name, village?.name, plot && `${t('plotLabel')}: ${plot}`].filter(Boolean).join(' · '),
    [district, tehsil, village, plot, t],
  );

  function syncMapQuery(nextDistrict: string, nextTehsil: string, nextVillage: string, nextPlot: string) {
    const url = new URL(window.location.href);
    const gis = nextDistrict && nextTehsil && nextVillage
      ? nextDistrict + nextTehsil + nextVillage
      : '';
    if (gis) {
      url.searchParams.set('gis', gis);
    } else {
      url.searchParams.delete('gis');
    }
    if (gis && nextPlot.trim()) {
      url.searchParams.set('plot', nextPlot.trim());
    } else {
      url.searchParams.delete('plot');
    }
    window.history.replaceState(null, '', url);
  }

  function validate() {
    const normalizedPlot = plot.trim();
    const plotNotListed = locationStatus === 'ready' && availablePlots.length > 0 && !availablePlots.includes(normalizedPlot);
    const next = {
      district: districtId ? '' : t('requiredDistrict'),
      tehsil: tehsilId ? '' : t('requiredTehsil'),
      village: villageId ? '' : t('requiredVillage'),
      plot: normalizedPlot ? (plotNotListed ? t('plotNotListed') : '') : t('requiredPlot'),
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  }

  function updateShareableUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set('gis', districtId + tehsilId + villageId);
    url.searchParams.set('plot', plot.trim());
    window.history.replaceState(null, '', url);
    setShareLink(url.toString());
    return url.toString();
  }

  async function copyShareLink() {
    const link = updateShareableUrl();
    await navigator.clipboard.writeText(link);
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1800);
  }

  async function shareCurrentView() {
    const link = updateShareableUrl();
    if (navigator.share) {
      await navigator.share({ title: t('shareTitle'), text: link, url: link });
    } else {
      await copyShareLink();
    }
  }

  function openOfficialMap() {
    if (!validate()) return;
    updateShareableUrl();
    setViewerOpen(true);
    const locationCode = districtId + tehsilId + villageId;
    window.open('https://bhunakshahp.nic.in/plotreport/' + locationCode + '/' + encodeURIComponent(plot.trim()), '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="mt-8 space-y-6">
      {viewerOpen && districtId && tehsilId && villageId && (
        <div id="plot-map-viewer" className="scroll-mt-20 lg:col-span-2">
          <BhunakshaViewer
            key={shareLink || (districtId + tehsilId + villageId + '-' + plot.trim())}
            gisCode={districtId + tehsilId + villageId}
            plot={plot.trim()}
            attribution={reference}
            onStateChange={setViewerStatus}
            onShare={districtId && tehsilId && villageId ? shareCurrentView : undefined}
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,.75fr)]">
      <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-7" aria-labelledby="plot-map-form-title">
        <div className="flex items-start gap-3 border-b border-border/70 pb-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-notice text-primary">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="plot-map-form-title" className="text-2xl sm:text-3xl">{t('formTitle')}</h2>
            <p className="mt-1 text-muted-foreground">{t('formIntro')}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="min-w-0">
            <Label htmlFor="map-district">{t('districtLabel')}</Label>
            <Select id="map-district" value={districtId} disabled={loading === 'districts'} aria-invalid={Boolean(errors.district)} onChange={(event) => {
              const nextDistrict = event.target.value;
              setDistrictId(nextDistrict); setTehsilId(''); setVillageId(''); setErrors((current) => ({ ...current, district: '', tehsil: '', village: '' }));
              syncMapQuery(nextDistrict, '', '', '');
            }}>
              <option value="">{loading === 'districts' ? t('loading') : t('districtPlaceholder')}</option>
              {districts.map((item) => <option key={item.id} value={item.id}>{locale === 'hi' ? item.hi : item.name}</option>)}
            </Select>
            {errors.district && <p className="mt-1.5 text-sm text-destructive">{errors.district}</p>}
          </div>
          <div className="min-w-0">
            <Label htmlFor="map-tehsil">{t('tehsilLabel')}</Label>
            <Select id="map-tehsil" value={tehsilId} disabled={!districtId || loading === 'tehsils'} aria-invalid={Boolean(errors.tehsil)} onChange={(event) => {
              const nextTehsil = event.target.value;
              setTehsilId(nextTehsil); setVillageId(''); setErrors((current) => ({ ...current, tehsil: '', village: '' }));
              syncMapQuery(districtId, nextTehsil, '', '');
            }}>
              <option value="">{loading === 'tehsils' ? t('loading') : t('tehsilPlaceholder')}</option>
              {tehsils.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            {errors.tehsil && <p className="mt-1.5 text-sm text-destructive">{errors.tehsil}</p>}
          </div>
          <div className="min-w-0">
            <Label htmlFor="map-village">{t('villageLabel')}</Label>
            <Select id="map-village" value={villageId} disabled={!tehsilId || loading === 'villages'} aria-invalid={Boolean(errors.village)} onChange={(event) => {
              const nextVillage = event.target.value;
              setVillageId(nextVillage); setErrors((current) => ({ ...current, village: '' }));
              syncMapQuery(districtId, tehsilId, nextVillage, plot);
            }}>
              <option value="">{loading === 'villages' ? t('loading') : t('villagePlaceholder')}</option>
              {villages.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </Select>
            {errors.village && <p className="mt-1.5 text-sm text-destructive">{errors.village}</p>}
          </div>
          <div className="min-w-0">
            <Label htmlFor="plot-number">{t('plotLabel')}</Label>
            <Input
              id="plot-number"
              value={plot}
              inputMode="text"
              placeholder={t('plotPlaceholder')}
              aria-invalid={Boolean(errors.plot)}
              list="bhunaksha-plot-options"
              aria-describedby={errors.plot ? 'plot-number-error' : 'plot-number-hint'}
              onChange={(event) => {
                const nextPlot = event.target.value;
                setPlot(nextPlot);
                setErrors((current) => ({ ...current, plot: '' }));
                syncMapQuery(districtId, tehsilId, villageId, nextPlot);
              }}
            />
            <datalist id="bhunaksha-plot-options">
              {availablePlots.map((plotNumber) => <option key={plotNumber} value={plotNumber} />)}
            </datalist>
            {errors.plot ? (
              <p id="plot-number-error" role="alert" className="mt-1.5 text-sm text-destructive">{errors.plot}</p>
            ) : (
              <p id="plot-number-hint" className="mt-1.5 text-sm text-muted-foreground">
                {availablePlots.length > 0 ? t('plotSuggestions', { count: availablePlots.length }) : t('plotHint')}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 min-h-6" aria-live="polite">
          {locationStatus === 'loading' && <p className="text-sm text-muted-foreground">{t('status.loadingVillage')}</p>}
          {locationStatus === 'error' && <p className="text-sm text-destructive">{t('status.villageError')}</p>}
          {viewerStatus === 'plot-found' && <p className="text-sm font-medium text-leaf">{t('status.plotFound')}</p>}
          {viewerStatus === 'plot-unavailable' && <p className="text-sm text-destructive">{t('status.plotUnavailable')}</p>}
          {viewerStatus === 'error' && <p className="text-sm text-destructive">{t('status.viewerError')}</p>}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" className="w-full sm:w-auto" onClick={openOfficialMap}>
            {t('openOfficial')} <ArrowUpRight aria-hidden="true" />
          </Button>
        </div>
      </section>

      <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{t('officialEyebrow')}</p>
        <h2 className="mt-2 text-2xl">{t('officialTitle')}</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground">
          <li>{t('step1')}</li>
          <li>{t('step2')}</li>
          <li>{t('step3')}</li>
        </ol>
      </aside>

      </div>
    </div>
  );
}
