/** Shown instantly while a new search is running, so the page never feels stuck. */
export default function SearchLoading() {
  return (
    <div className="container py-10 sm:py-14" aria-busy="true">
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-muted" />
      <div className="mt-8 h-72 animate-pulse rounded-xl bg-muted/70" />
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-56 animate-pulse rounded-lg bg-muted/70" />
        ))}
      </div>
    </div>
  );
}
