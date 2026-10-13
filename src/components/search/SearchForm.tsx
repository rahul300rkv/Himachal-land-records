'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from '@/i18n/navigation';
import { LocationFields, type Location } from './LocationFields';

// Messages are stored as keys and translated when displayed.
const formSchema = z
  .object({
    district: z.string().min(1, 'district'),
    tehsil: z.string(),
    village: z.string().trim().max(100),
    khasra: z.string().trim().max(100),
    owner: z.string().trim().max(100),
  })
  .refine((v) => Boolean(v.tehsil || v.village || v.khasra || v.owner), {
    message: 'atLeastOne',
    path: ['tehsil'],
  });

type FormValues = z.infer<typeof formSchema>;

type SearchFormProps = {
  defaultValues?: Partial<FormValues>;
};

export function SearchForm({ defaultValues }: SearchFormProps) {
  const t = useTranslations('Search.form');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { district: '', tehsil: '', village: '', khasra: '', owner: '', ...defaultValues },
  });

  const { district, tehsil, village } = watch();

  function onLocationChange(patch: Partial<Location>) {
    (Object.entries(patch) as [keyof Location, string][]).forEach(([key, value]) =>
      setValue(key, value, { shouldValidate: Boolean(errors[key] || errors.root) }),
    );
  }

  function onSubmit(values: FormValues) {
    const query: Record<string, string> = {};
    (Object.entries(values) as [string, string][]).forEach(([key, value]) => {
      if (value.trim()) query[key] = value.trim();
    });
    // A new search starts from page 1 with no filters.
    startTransition(() => router.push({ pathname: '/search', query }));
  }

  function onReset() {
    reset({ district: '', tehsil: '', village: '', khasra: '', owner: '' });
    startTransition(() => router.push('/search'));
  }

  const translate = (key?: string) => (key ? t(`errors.${key as 'district' | 'atLeastOne'}`) : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <LocationFields
          district={district}
          tehsil={tehsil}
          village={village}
          onChange={onLocationChange}
          errors={{ district: translate(errors.district?.message), tehsil: translate(errors.tehsil?.message) }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="khasra">{t('khasra')}</Label>
          <Input
            id="khasra"
            inputMode="text"
            autoComplete="off"
            maxLength={100}
            placeholder={t('khasraPlaceholder')}
            aria-describedby="khasra-hint"
            {...register('khasra')}
          />
          <p id="khasra-hint" className="mt-1.5 text-sm text-muted-foreground">
            {t('khasraHint')}
          </p>
        </div>
        <div>
          <Label htmlFor="owner">{t('owner')}</Label>
          <Input
            id="owner"
            autoComplete="off"
            maxLength={100}
            placeholder={t('ownerPlaceholder')}
            {...register('owner')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={isPending} className="sm:min-w-44">
          <Search />
          {t('submit')}
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={onReset} disabled={isPending}>
          <X />
          {t('reset')}
        </Button>
      </div>
    </form>
  );
}
