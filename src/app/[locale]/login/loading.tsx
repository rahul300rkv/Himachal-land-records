import { Skeleton } from '@/components/ui/skeleton';

export default function LoginLoading() {
  return (
    <div className="container flex justify-center py-10 sm:py-16" aria-busy="true">
      <div className="w-full max-w-md space-y-4 rounded-xl border p-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
