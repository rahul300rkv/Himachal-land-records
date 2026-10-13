import { Download } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { displayReportId } from '@/lib/report';
import { cn } from '@/lib/utils';

export type ReportListItem = { id: string; title: string; created_at: string };

/** A user's generated reports with a re-download link for each. Used on /reports and the dashboard. */
export function ReportsTable({ reports }: { reports: ReportListItem[] }) {
  const t = useTranslations('Report.page');
  const locale = useLocale();
  const date = new Intl.DateTimeFormat(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  });

  return (
    <ul className="divide-y rounded-lg border bg-card">
      {reports.map((report) => {
        const displayId = displayReportId(report.id, new Date(report.created_at));
        return (
          <li key={report.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-medium [overflow-wrap:anywhere]">{report.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                <span className="tabular-nums">{displayId}</span>
                <span aria-hidden="true"> · </span>
                {date.format(new Date(report.created_at))}
              </p>
            </div>
            <a
              href={`/api/report/generate?id=${report.id}&locale=${locale}`}
              download
              aria-label={t('downloadFor', { id: displayId })}
              className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'shrink-0 self-start sm:self-auto')}
            >
              <Download />
              {t('table.download')}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
