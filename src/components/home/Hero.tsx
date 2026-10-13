import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/ui/reveal';
import { HeroSearch } from './HeroSearch';

export function Hero() {
  const t = useTranslations('Home.hero');
  return (
    <>
      <section className="land-hero">
        <Image src="/images/himachal-valley.jpg" alt="" fill priority sizes="100vw" className="land-hero__image" />
        <div className="container py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <Reveal trigger="mount">
              <h1 className="land-hero__title text-4xl leading-tight sm:text-5xl lg:text-6xl">{t('title')}</h1>
            </Reveal>
            <Reveal trigger="mount" delay={0.08}>
              <p className="land-hero__subtitle mt-5 max-w-2xl text-lg sm:text-xl">{t('subtitle')}</p>
            </Reveal>
            <Reveal trigger="mount" delay={0.16}>
              <p className="land-hero__subtitle mt-7 flex items-start gap-2 text-sm">
                <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {t('trustNote')}
              </p>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="border-b bg-primary-soft">
        <div className="container py-6 sm:py-8">
          <Reveal trigger="mount" delay={0.16}><HeroSearch /></Reveal>
        </div>
      </section>
    </>
  );
}
