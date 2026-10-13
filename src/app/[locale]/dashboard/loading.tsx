import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="container py-10 sm:py-14" aria-busy="true">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="mt-3 h-5 w-48" />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mt-12 h-8 w-56" />
      <Skeleton className="mt-4 h-28 w-full" />
    </div>
  );
}
