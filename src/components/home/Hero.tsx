import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { HeroSearch } from './HeroSearch';

/** Faint topographic contour lines: a nod to the hill terrain the records describe. */
function Contours() {
  return (
    <svg
      viewBox="0 0 640 640"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute -right-48 -top-40 hidden h-[640px] w-[640px] text-primary/15 md:block"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={i}
          cx="320"
          cy="320"
          rx={50 + i * 36}
          ry={36 + i * 28}
          transform={`rotate(${-20 + i * 3} 320 320)`}
        />
      ))}
    </svg>
  );
}

export function Hero() {
  const t = useTranslations('Home.hero');

  return (
    <section className="relative overflow-hidden">
      <Contours />

      <div className="container relative py-12 sm:py-16 lg:py-24">
        <div className="max-w-3xl">
          <Reveal trigger="mount">
            <h1 className="text-4xl leading-[1.15] sm:text-5xl lg:text-6xl">{t('title')}</h1>
          </Reveal>
          <Reveal trigger="mount" delay={0.08}>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">{t('subtitle')}</p>
          </Reveal>
        </div>

        <Reveal trigger="mount" delay={0.16} className="mt-8 sm:mt-10">
          <HeroSearch />
        </Reveal>

        <Reveal trigger="mount" delay={0.24}>
          <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-leaf" aria-hidden="true" />
            {t('trustNote')}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
