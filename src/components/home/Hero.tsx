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

        <div className="container relative z-10 flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center px-6 pb-40 pt-[calc(8rem-75px)] text-center">
          <p className="animate-fade-rise inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#6f6f6f] sm:text-sm">
            <ShieldCheck className="size-4" aria-hidden="true" /> {t('trustNote')}
          </p>
          <h1 className="font-display animate-fade-rise mt-7 max-w-6xl text-5xl font-normal leading-[0.95] tracking-[-2.46px] text-black sm:text-7xl md:text-8xl">{t('title')}</h1>
          <p className="animate-fade-rise-delay mt-8 max-w-2xl text-base leading-relaxed text-[#6f6f6f] sm:text-lg">{t('subtitle')}</p>
          <a href="#land-search" className="animate-fade-rise-delay-2 mt-12 inline-flex items-center gap-3 rounded-full bg-black px-14 py-5 text-base font-medium text-white shadow-xl transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-black">
            {t('submit')} <ArrowDown className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section id="land-search" className="scroll-mt-24 border-b bg-white/90 backdrop-blur-xl">
        <div className="container py-8 sm:py-10">
          <HeroSearch />
        </div>
      </section>
    </>
  );
}
