'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, ImagePlus, Loader2, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LocationFields, type Location } from '@/components/search/LocationFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Link } from '@/i18n/navigation';
import { normalizeIndianMobile } from '@/lib/phone';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { AreaUnit, LandType } from '@/types/database';
import { AREA_UNITS, LAND_TYPES } from '@/types/land-record';

const MAX_PHOTOS = 4;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

// Error messages are keys; they are translated when shown.
const schema = z.object({
  title: z.string().trim().min(5, 'title').max(200, 'title'),
  description: z.string().trim().max(2000),
  district: z.string().min(1, 'district'),
  tehsil: z.string().min(1, 'tehsil'),
  village: z.string().trim().min(1, 'village').max(100, 'village'),
  landType: z.string().min(1, 'landType'),
  area: z.string().refine((v) => Number(v) > 0 && Number(v) < 1e9, 'area'),
  areaUnit: z.string().min(1),
  price: z.string().refine((v) => Number(v) > 0 && Number(v) < 1e11, 'price'),
  negotiable: z.boolean(),
  khasra: z.string().trim().max(100),
  contactName: z.string().trim().min(2, 'name').max(100, 'name'),
  contactPhone: z.string().refine((v) => normalizeIndianMobile(v) !== null, 'phone'),
  consent: z.boolean().refine((v) => v, 'consent'),
});

type FormValues = z.infer<typeof schema>;
type ErrorKey = 'title' | 'district' | 'tehsil' | 'village' | 'landType' | 'area' | 'price' | 'phone' | 'name' | 'consent';

/** Escape LIKE wildcards so the village match is a plain, case-insensitive comparison. */
const escapeLike = (value: string) => value.replace(/[\\%_]/g, (c) => `\\${c}`);

type Outcome = { id: string; linked: boolean } | null;

export function ListingForm({ defaultName }: { defaultName?: string }) {
  const t = useTranslations('Marketplace.form');
  const land = useTranslations('LandTypes');
  const units = useTranslations('Units');
  const fileInput = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '', description: '', district: '', tehsil: '', village: '', landType: '', area: '',
      areaUnit: 'bigha', price: '', negotiable: true, khasra: '', contactName: defaultName ?? '',
      contactPhone: '', consent: false,
    },
  });
  const { district, tehsil, village } = watch();

  const err = (key?: string) => (key ? t(`errors.${key as ErrorKey}`) : undefined);

  function onLocationChange(patch: Partial<Location>) {
    (Object.entries(patch) as [keyof Location, string][]).forEach(([key, value]) =>
      setValue(key, value, { shouldValidate: Boolean(errors[key]) }),
    );
  }

  function addPhotos(files: FileList | null) {
    if (!files) return;
    setPhotoError(null);
    const next = [...photos];
    for (const file of Array.from(files)) {
      if (!(file.type in PHOTO_TYPES)) return setPhotoError(t('errors.photosType'));
      if (file.size > MAX_PHOTO_BYTES) return setPhotoError(t('errors.photosSize'));
      if (next.length >= MAX_PHOTOS) return setPhotoError(t('errors.photosCount', { max: MAX_PHOTOS }));
      next.push(file);
    }
    setPhotos(next);
    if (fileInput.current) fileInput.current.value = '';
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    setSubmitError(null);

    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setSubmitError(t('errors.auth'));
        return;
      }

      // 1. Photos go to the public `listing-images` bucket, under the user's own folder.
      for (const file of photos) {
        const path = `${user.id}/${crypto.randomUUID()}.${PHOTO_TYPES[file.type]}`;
        const { error } = await supabase.storage
          .from('listing-images')
          .upload(path, file, { contentType: file.type, upsert: false });
        if (error) {
          setSubmitError(t('errors.upload'));
          return;
        }
        uploaded.push(path);
      }

      // 2. Link to a land record we hold (same village + khasra), if the seller gave a khasra.
      let landRecordId: string | null = null;
      if (values.khasra) {
        const { data } = await supabase
          .from('land_records')
          .select('id')
          .eq('district', values.district)
          .eq('tehsil', values.tehsil)
          .ilike('village', escapeLike(values.village))
          .eq('khasra_number', values.khasra)
          .order('jamabandi_year', { ascending: false })
          .limit(1);
        landRecordId = data?.[0]?.id ?? null;
      }

      // 3. Create the listing. It starts as "pending_review": only an admin can publish it.
      const { data, error } = await supabase
        .from('listings')
        .insert({
          seller_id: user.id,
          land_record_id: landRecordId,
          title: values.title,
          description: values.description || null,
          district: values.district,
          tehsil: values.tehsil,
          village: values.village,
          price: Number(values.price),
          price_negotiable: values.negotiable,
          area: Number(values.area),
          area_unit: values.areaUnit as AreaUnit,
          land_type: values.landType as LandType,
          contact_name: values.contactName,
          contact_phone: normalizeIndianMobile(values.contactPhone),
          images: uploaded,
          status: 'pending_review',
        })
        .select('id')
        .single();

      if (error || !data) {
        // Do not leave orphaned photos behind.
        if (uploaded.length) await supabase.storage.from('listing-images').remove(uploaded);
        setSubmitError(t('errors.save'));
        return;
      }

      setOutcome({ id: data.id, linked: Boolean(landRecordId) });
    } catch {
      if (uploaded.length) await supabase.storage.from('listing-images').remove(uploaded).catch(() => undefined);
      setSubmitError(t('errors.save'));
    } finally {
      setSubmitting(false);
    }
  }

  if (outcome) {
    return (
      <div role="status" className="rounded-xl border border-leaf/30 bg-leaf-soft p-6 sm:p-8">
        <CheckCircle2 className="size-8 text-leaf" aria-hidden="true" />
        <h2 className="mt-3 text-2xl">{t('success.title')}</h2>
        <p className="mt-2 max-w-2xl">{t('success.body')}</p>
        <p className="mt-2 text-muted-foreground">{outcome.linked ? t('success.linked') : t('success.notLinked')}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href={`/marketplace/${outcome.id}`}>{t('success.view')}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">{t('success.dashboard')}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const fieldError = (message?: string) =>
    message && (
      <p role="alert" className="mt-1.5 text-sm text-destructive">
        {err(message)}
      </p>
    );

  const sectionClass = 'rounded-xl border bg-card p-5 shadow-sm sm:p-6';
  const legendClass = 'mb-4 font-serif text-xl font-semibold';

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.basics')}</legend>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">{t('fields.title')}</Label>
            <Input id="title" maxLength={200} placeholder={t('fields.titlePlaceholder')} aria-invalid={Boolean(errors.title)} {...register('title')} />
            {fieldError(errors.title?.message)}
          </div>
          <div>
            <Label htmlFor="description">{t('fields.description')}</Label>
            <textarea
              id="description"
              rows={5}
              maxLength={2000}
              placeholder={t('fields.descriptionPlaceholder')}
              className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-base shadow-sm placeholder:text-muted-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              {...register('description')}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.location')}</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <LocationFields
            district={district}
            tehsil={tehsil}
            village={village}
            onChange={onLocationChange}
            errors={{ district: err(errors.district?.message), tehsil: err(errors.tehsil?.message), village: err(errors.village?.message) }}
          />
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.land')}</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="landType">{t('fields.landType')}</Label>
            <Select id="landType" aria-invalid={Boolean(errors.landType)} {...register('landType')}>
              <option value="">{t('fields.landTypePlaceholder')}</option>
              {LAND_TYPES.map((v) => (
                <option key={v} value={v}>
                  {land(v)}
                </option>
              ))}
            </Select>
            {fieldError(errors.landType?.message)}
          </div>
          <div>
            <Label htmlFor="area">{t('fields.area')}</Label>
            <Input id="area" type="number" inputMode="decimal" min="0" step="any" aria-invalid={Boolean(errors.area)} {...register('area')} />
            {fieldError(errors.area?.message)}
          </div>
          <div>
            <Label htmlFor="areaUnit">{t('fields.areaUnit')}</Label>
            <Select id="areaUnit" {...register('areaUnit')}>
              {AREA_UNITS.map((u) => (
                <option key={u} value={u}>
                  {units(u)}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.price')}</legend>
        <div className="grid items-end gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">{t('fields.price')}</Label>
            <Input id="price" type="number" inputMode="numeric" min="0" step="any" aria-invalid={Boolean(errors.price)} {...register('price')} />
            {fieldError(errors.price?.message)}
          </div>
          <label className="flex min-h-11 items-center gap-2.5 font-medium">
            <input type="checkbox" className="size-5 rounded border-input accent-[hsl(var(--primary))]" {...register('negotiable')} />
            {t('fields.negotiable')}
          </label>
        </div>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.record')}</legend>
        <div className="max-w-sm">
          <Label htmlFor="khasra">{t('fields.khasra')}</Label>
          <Input id="khasra" autoComplete="off" maxLength={100} aria-describedby="khasra-hint" {...register('khasra')} />
        </div>
        <p id="khasra-hint" className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {t('fields.khasraHint')}
        </p>
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.photos')}</legend>
        <input
          ref={fileInput}
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(e) => addPhotos(e.target.files)}
        />
        <Button type="button" variant="outline" onClick={() => fileInput.current?.click()} disabled={photos.length >= MAX_PHOTOS}>
          <ImagePlus />
          {t('fields.photos')}
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">{t('fields.photosHint', { max: MAX_PHOTOS })}</p>
        {photoError && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {photoError}
          </p>
        )}
        {photos.length > 0 && (
          <ul className="mt-4 space-y-2">
            {photos.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-sm">
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  aria-label={t('fields.removePhoto', { name: file.name })}
                  onClick={() => setPhotos((list) => list.filter((_, i) => i !== index))}
                  className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </fieldset>

      <fieldset className={sectionClass}>
        <legend className={legendClass}>{t('sections.contact')}</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="contactName">{t('fields.contactName')}</Label>
            <Input id="contactName" autoComplete="name" maxLength={100} aria-invalid={Boolean(errors.contactName)} {...register('contactName')} />
            {fieldError(errors.contactName?.message)}
          </div>
          <div>
            <Label htmlFor="contactPhone">{t('fields.contactPhone')}</Label>
            <Input id="contactPhone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={16} aria-invalid={Boolean(errors.contactPhone)} {...register('contactPhone')} />
            {fieldError(errors.contactPhone?.message)}
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t('fields.contactHint')}</p>
      </fieldset>

      <div className="rounded-xl border border-notice-border bg-notice p-5 text-notice-foreground">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 shrink-0 rounded border-input accent-[hsl(var(--primary))]" aria-invalid={Boolean(errors.consent)} {...register('consent')} />
          <span>
            {t('fields.consent')}{' '}
            <Link href="/terms" target="_blank" className="font-semibold underline underline-offset-2">
              {t('fields.termsLink')}
            </Link>
          </span>
        </label>
        {errors.consent && (
          <p role="alert" className="mt-2 text-sm font-medium text-destructive">
            {err(errors.consent.message)}
          </p>
        )}
      </div>

      {submitError && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-destructive">
          {submitError}
        </p>
      )}

      <Button type="submit" size="lg" disabled={submitting} className={cn('w-full sm:w-auto sm:min-w-56')}>
        {submitting && <Loader2 className="animate-spin" />}
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
