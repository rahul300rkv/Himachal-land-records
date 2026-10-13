import { Skeleton } from '@/components/ui/skeleton';

export default function MarketplaceLoading() {
  return (
    <div className="container py-10 sm:py-14" aria-busy="true">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="mt-4 h-5 w-full max-w-xl" />
      <Skeleton className="mt-8 h-12 w-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border">
            <Skeleton className="aspect-[16/10] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
