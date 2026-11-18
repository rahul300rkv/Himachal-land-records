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
 * Gentle fade-and-rise entrance. Renders plain markup when the visitor has asked their
 * system to reduce motion.
 */
export function Reveal({ children, className, delay = 0, y = 14, trigger = 'inView' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(trigger === 'mount');
  useEffect(() => {
    if (trigger === 'mount' || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { rootMargin: '0px 0px -60px 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [trigger]);
  return <div ref={ref} className={className} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : `translateY(${y}px)`, transition: `opacity .5s ease-out ${delay}s, transform .5s cubic-bezier(.22,1,.36,1) ${delay}s` }}>{children}</div>;
}
