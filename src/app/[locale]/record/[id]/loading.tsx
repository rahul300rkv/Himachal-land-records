import { Skeleton } from '@/components/ui/skeleton';

export default function RecordLoading() {
  return (
    <div className="container py-8 sm:py-12" aria-busy="true">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-5 h-10 w-72" />
      <Skeleton className="mt-3 h-5 w-96 max-w-full" />
      <Skeleton className="mt-6 h-40 w-full rounded-xl" />
      <Skeleton className="mt-10 h-8 w-56" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className="h-11 w-full" />
        ))}
      </div>
      <Skeleton className="mt-10 h-8 w-56" />
      <Skeleton className="mt-4 h-48 w-full" />
    </div>
  );
}
