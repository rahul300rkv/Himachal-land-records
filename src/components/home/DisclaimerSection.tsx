import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';

const POINTS = ['independent', 'notLegalRecord', 'verify', 'landLaws'] as const;

/** Prominent legal disclaimer on the homepage. The complete text lives on /disclaimer. */
export function DisclaimerSection() {
  const t = useTranslations('Home.disclaimer');
  const d = useTranslations('Disclaimer.points');

  return (
    <section className="container py-12 sm:py-16">
      <Reveal>
        <div className="rounded-xl border border-notice-border bg-notice p-6 text-notice-foreground sm:p-8">
          <h2 className="flex items-start gap-3 text-2xl text-notice-foreground sm:text-3xl">
            <TriangleAlert className="mt-1 size-6 shrink-0" aria-hidden="true" />
            {t('title')}
          </h2>
          <p className="mt-3 max-w-3xl text-lg">{t('intro')}</p>

          <ul className="mt-6 grid gap-x-10 gap-y-4 lg:grid-cols-2">
            {POINTS.map((key) => (
              <li key={key} className="flex gap-3">
                <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-notice-foreground" aria-hidden="true" />
                <span>{d(key)}</span>
              </li>
            ))}
          </ul>

          <Button asChild variant="outline" className="mt-7 border-notice-border bg-white/60 hover:bg-white">
            <Link href="/disclaimer">{t('readFull')}</Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
