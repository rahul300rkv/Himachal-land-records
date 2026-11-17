import { ArrowDown, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { HeroSearch } from './HeroSearch';

export async function Hero() {
  const t = await getTranslations('Home.hero');

  return (
    <>
      <section className="cinematic-hero">
        <div className="cinematic-hero__media" aria-hidden="true">
          <Image src="/images/himachal-concept-hero.webp" alt="" fill priority fetchPriority="high" quality={72} sizes="100vw" className="object-cover" />
          <div className="cinematic-hero__gradient" />
        </div>
        <svg className="pointer-events-none absolute inset-x-0 bottom-8 z-[1] h-[44%] w-full text-[#2a102d]/30" viewBox="0 0 1440 420" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-20 340 180 210l160 58 210-145 190 74 160-112 210 120 170-66 190 119" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="8 8" />
          <path d="M80 392 310 278l180 72 240-124 170 74 220-112 260 128" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="550" cy="123" r="7" fill="none" stroke="currentColor" />
          <circle cx="1110" cy="205" r="7" fill="none" stroke="currentColor" />
        </svg>

        <div className="container relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 pb-40 pt-[calc(8rem-75px)] text-center">
          <p className="field-note animate-fade-rise text-[#69566b]">
            <ShieldCheck className="size-4" aria-hidden="true" /> {t('trustNote')}
          </p>
          <h1 className="font-display animate-fade-rise sketch-underline mt-7 max-w-6xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-[#2a102d] sm:text-7xl md:text-8xl">{t('title')}</h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-[#69566b] sm:text-lg">{t('subtitle')}</p>
          <a href="#land-search" className="animate-fade-rise-delay-2 mt-12 inline-flex items-center gap-3 rounded-full bg-[#2a102d] px-14 py-5 text-base font-medium text-white shadow-xl transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-[#f2b134]">
            {t('submit')} <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section id="land-search" className="concept-grid scroll-mt-24 border-b bg-[#e9eef1]/92 backdrop-blur-xl">
        <div className="container py-8 sm:py-10">
          <HeroSearch />
        </div>
      </section>
    </>
  );
}
