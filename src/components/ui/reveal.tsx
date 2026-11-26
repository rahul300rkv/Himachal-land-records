'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts (use for staggering). */
  delay?: number;
  /** Starting vertical offset in px. Kept small so the motion feels calm. */
  y?: number;
  /**
   * 'mount'  : animate as soon as the component appears (above-the-fold content)
   * 'inView' : animate once, when scrolled into view (everything else)
   */
  trigger?: 'mount' | 'inView';
};

/**
 * Gentle fade-and-rise entrance. Content always fails open if motion is reduced,
 * IntersectionObserver is unavailable, or an observer callback is delayed.
 */
export function Reveal({ children, className, delay = 0, y = 14, trigger = 'inView' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(trigger === 'mount');
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const shouldReduceMotion = media.matches;
    setReducedMotion(shouldReduceMotion);

    if (shouldReduceMotion || trigger === 'mount' || !ref.current) {
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '0px 0px -60px 0px' });

    observer.observe(ref.current);

    // Never leave content hidden if the browser delays or suppresses the callback.
    const fallback = window.setTimeout(() => setVisible(true), 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [trigger]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: reducedMotion
          ? 'none'
          : `opacity .5s ease-out ${delay}s, transform .5s cubic-bezier(.22,1,.36,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
