'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

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
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const transition = { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const };

  if (trigger === 'mount') {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0, y }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
