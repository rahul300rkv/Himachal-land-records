import { ArrowRight, FileKey2, Gavel, Landmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';

const CHECKS = [
  { key: 'ownership', icon: FileKey2 },
  { key: 'encumbrances', icon: Landmark },
  { key: 'litigation', icon: Gavel },
] as const;

export function DueDiligence() {
  const t = useTranslations('Home.dueDiligence');

  return (
    <section className="due-diligence" aria-labelledby="due-diligence-title">
      <div className="container py-20 sm:py-28">
        <Reveal className="max-w-4xl">
          <p className="field-note text-leaf">{t('eyebrow')}</p>
          <h2 id="due-diligence-title" className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-6xl">
            {t('title')}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{t('intro')}</p>
        </Reveal>

        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {CHECKS.map(({ key, icon: Icon }, index) => (
            <li key={key} className={index === 1 ? 'lg:translate-y-5' : ''}>
              <Reveal delay={index * 0.08} className="due-diligence__card">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-6 text-2xl">{t(`checks.${key}.title`)}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{t(`checks.${key}.description`)}</p>
                <p className="mt-5 border-l-2 border-leaf/40 pl-4 text-sm font-medium text-foreground">
                  {t(`checks.${key}.evidence`)}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal delay={0.2} className="mt-8 flex flex-col gap-6 rounded-3xl border border-primary/15 bg-primary p-8 text-primary-foreground shadow-2xl sm:flex-row sm:items-center sm:justify-between lg:p-10">
          <div>
            <h3 className="text-2xl text-primary-foreground">{t('ctaTitle')}</h3>
            <p className="mt-2 max-w-2xl text-primary-foreground/80">{t('ctaBody')}</p>
          </div>
          <Link href="/check" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-primary transition hover:scale-[1.03]">
            {t('cta')} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
