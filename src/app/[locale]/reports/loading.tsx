import { Skeleton } from '@/components/ui/skeleton';

export default function ReportsLoading() {
  return (
    <div className="container py-10 sm:py-14" aria-busy="true">
      <Skeleton className="h-10 w-80 max-w-full" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <Skeleton className="mt-6 h-12 w-48" />
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
        <div className="space-y-5">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-14 h-40 w-full" />
    </div>
  );
}
