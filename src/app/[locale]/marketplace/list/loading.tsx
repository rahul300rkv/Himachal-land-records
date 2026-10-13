import { Skeleton } from '@/components/ui/skeleton';

export default function ListLoading() {
  return (
    <div className="container max-w-3xl py-10 sm:py-14" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-4 h-5 w-full" />
      <div className="mt-8 space-y-6">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
