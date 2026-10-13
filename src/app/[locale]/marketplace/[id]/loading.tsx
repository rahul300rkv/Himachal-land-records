import { Skeleton } from '@/components/ui/skeleton';

export default function ListingLoading() {
  return (
    <div className="container py-8 sm:py-12" aria-busy="true">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-6 h-6 w-28" />
      <Skeleton className="mt-3 h-10 w-2/3" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
