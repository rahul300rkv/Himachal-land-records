import { Search, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Link } from '@/i18n/navigation';

export function CTA() {
  const t = useTranslations('Home.cta');

  return (
    <section className="container pb-4 pt-2 sm:pb-8">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 rounded-xl bg-leaf-soft px-6 py-9 sm:px-10 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl">{t('title')}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{t('body')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg" variant="leaf">
              <Link href="/search">
                <Search />
                {t('button')}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/60">
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
