'use client';

import { useEffect, useRef } from 'react';
import { ArrowDown, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HeroSearch } from './HeroSearch';

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_083109_283f3553-e28f-428b-a723-d639c617eb2b.mp4';
const FADE_SECONDS = 0.5;

export function Hero() {
  const t = useTranslations('Home.hero');
  const videoRef = useRef<HTMLVideoElement>(null);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let animationFrame = 0;

    const monitorOpacity = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        const fadeIn = Math.min(currentTime / FADE_SECONDS, 1);
        const fadeOut = Math.min((duration - currentTime) / FADE_SECONDS, 1);
        video.style.opacity = String(Math.max(0, Math.min(fadeIn, fadeOut)));
      }
      animationFrame = requestAnimationFrame(monitorOpacity);
    };

    animationFrame = requestAnimationFrame(monitorOpacity);
    return () => {
      cancelAnimationFrame(animationFrame);
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    };
  }, []);

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = '0';
    restartTimerRef.current = setTimeout(() => {
      video.currentTime = 0;
      void video.play().catch(() => undefined);
    }, 100);
  };

  return (
    <>
      <section className="cinematic-hero">
        <div className="cinematic-hero__media" aria-hidden="true">
          <video ref={videoRef} className="cinematic-hero__video" autoPlay muted playsInline preload="metadata" poster="/images/himachal-valley.jpg" onEnded={restartVideo}>
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
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
