import { cn } from '@/lib/utils';

/** Pulsing placeholder block used by the loading.tsx files. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse rounded-md bg-muted', className)} />;
}
