import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind class names, resolving conflicts (the shadcn/ui standard helper). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as Indian Rupees, e.g. 1250000 -> "₹12,50,000". */
export function formatINR(amount: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

/** Absolute URL for the given path, based on NEXT_PUBLIC_SITE_URL. */
export function absoluteUrl(path = '/') {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  return new URL(path, base).toString();
}

/** Price in rupees using Indian digit grouping (₹12,50,000) in the visitor's language. */
export function formatPrice(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
