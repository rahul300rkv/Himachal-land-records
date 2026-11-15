import { Search, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';

export function CTA() {
  const t = useTranslations('Home.cta');

  return (
    <section className="container py-16 sm:py-24">
      <Reveal>
        <div className="concept-card concept-grid relative flex flex-col items-start justify-between gap-8 rounded-[2rem] border border-black/15 bg-leaf-soft px-7 py-12 shadow-[10px_12px_0_rgba(42,16,45,0.12)] sm:px-12 lg:flex-row lg:items-center lg:px-16 lg:py-16">
          <div className="max-w-xl">
            <h2 className="text-4xl sm:text-5xl">{t('title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{t('body')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" variant="leaf" className="rounded-full px-7">
              <Link href="/search">
                <Search />
                {t('button')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-white/70 px-7">
              <Link href="/marketplace">
                <Store />
                {t('secondary')}
              </Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
