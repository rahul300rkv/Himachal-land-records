import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

type PaginationProps = {
  /** Which listing page the links point to. */
  pathname?: '/search' | '/marketplace';
  page: number;
  hasMore: boolean;
  /** Current query string values, so page links keep the search and filters. */
  query: Record<string, string>;
};

export function Pagination({ pathname = '/search', page, hasMore, query }: PaginationProps) {
  const t = useTranslations('Search.pagination');
  if (page === 1 && !hasMore) return null;

  const hrefFor = (target: number) => ({
    pathname,
    query: { ...query, page: String(target) },
  });

  return (
    <nav aria-label={t('label')} className="mt-8 flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={cn(buttonVariants({ variant: 'outline' }))}>
          <ChevronLeft />
          {t('previous')}
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      <span className="text-sm text-muted-foreground" aria-current="page">
        {t('page', { page })}
      </span>

      {hasMore ? (
        <Link href={hrefFor(page + 1)} className={cn(buttonVariants({ variant: 'outline' }))}>
          {t('next')}
          <ChevronRight />
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
