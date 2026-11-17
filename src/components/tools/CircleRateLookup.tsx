'use client';

import { useEffect, useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import type { MeghOffice, MeghReport } from '@/lib/megh-circle-rates';

type Props = {
  districts: readonly (readonly [string, string])[];
  copy: Record<'district' | 'office' | 'choose' | 'submit' | 'loading' | 'failed' | 'empty' | 'file' | 'uploaded' | 'download', string>;
};

async function lookup(params: Record<string, string>, signal: AbortSignal) {
  const response = await fetch(`/api/circle-rate?${new URLSearchParams(params)}`, { signal });
  if (!response.ok) throw new Error('Lookup failed');
  return response.json();
}

export function CircleRateLookup({ districts, copy }: Props) {
  const [district, setDistrict] = useState('');
  const [office, setOffice] = useState('');
  const [offices, setOffices] = useState<MeghOffice[]>([]);
  const [reports, setReports] = useState<MeghReport[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!district) return;
    const controller = new AbortController();
    lookup({ district }, controller.signal)
      .then((data: { offices: MeghOffice[] }) => setOffices(data.offices))
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [district]);

  async function search() {
    setLoading(true);
    setError(false);
    setReports(null);
    try {
      const data: { reports: MeghReport[] } = await lookup({ district, office }, AbortSignal.timeout(28000));
      setReports(data.reports);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={(event) => {
        event.preventDefault();
        if (!loading && office) void search();
      }}>
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          {copy.district}
          <Select value={district} disabled={loading} onChange={(event) => {
            const next = event.target.value;
            setDistrict(next);
            setOffice('');
            setOffices([]);
            setReports(null);
            setError(false);
            setLoading(Boolean(next));
          }}>
            <option value="">{copy.choose}</option>
            {districts.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </Select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-medium">
          {copy.office}
          <Select value={office} disabled={loading || !offices.length} onChange={(event) => {
            setOffice(event.target.value);
            setReports(null);
            setError(false);
          }}>
            <option value="">{copy.choose}</option>
            {offices.map(({ id, name }) => <option key={id} value={id}>{name}</option>)}
          </Select>
        </label>
        <Button type="submit" disabled={loading || !office}>{copy.submit}</Button>
      </form>
      <div aria-live="polite">
        {loading && <p className="mt-4 text-sm">{copy.loading}</p>}
        {error && <p className="mt-4 text-sm text-destructive">{copy.failed}</p>}
        {reports?.length === 0 && <p className="mt-4 text-sm">{copy.empty}</p>}
        {reports && reports.length > 0 && (
          <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" tabIndex={0} role="region" aria-label={copy.submit}>
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="border-b border-border bg-primary/5 text-primary">
                <tr>
                  <th scope="col" className="px-4 py-4 sm:px-5">{copy.office}</th>
                  <th scope="col" className="px-4 py-4 sm:px-5">{copy.file}</th>
                  <th scope="col" className="px-4 py-4 sm:px-5">{copy.uploaded}</th>
                  <th scope="col" className="px-4 py-4 text-right sm:px-5">{copy.download}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report, index) => (
                  <tr key={`${report.url}-${index}`} className="even:bg-muted/30 hover:bg-primary/5">
                    <th scope="row" className="px-4 py-4 font-semibold sm:px-5">{report.office}</th>
                    <td className="px-4 py-4 sm:px-5">
                      <span className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="size-4" aria-hidden="true" />
                        </span>
                        <span className="break-all font-medium">{report.file}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 tabular-nums text-muted-foreground sm:px-5">{report.uploaded}</td>
                    <td className="px-4 py-4 text-right sm:px-5">
                      <Button asChild className="group gap-2.5 rounded-full pl-2 pr-4 shadow-sm">
                        <a href={report.url} target="_blank" rel="noopener noreferrer" aria-label={`${copy.download} — ${report.file}`}>
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber-300 text-[#261026]">
                            <Download className="size-4 motion-safe:transition-transform motion-safe:group-hover:translate-y-0.5" aria-hidden="true" />
                          </span>
                          {copy.download}
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
