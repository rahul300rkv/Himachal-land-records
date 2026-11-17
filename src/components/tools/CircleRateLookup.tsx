'use client';

import { useEffect, useState } from 'react';
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
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b">
                <th scope="col" className="p-3">{copy.office}</th>
                <th scope="col" className="p-3">{copy.file}</th>
                <th scope="col" className="p-3">{copy.uploaded}</th>
                <th scope="col" className="p-3">{copy.download}</th>
              </tr></thead>
              <tbody>{reports.map((report, index) => (
                <tr key={`${report.url}-${index}`} className="border-b">
                  <td className="p-3">{report.office}</td>
                  <td className="p-3">{report.file}</td>
                  <td className="p-3">{report.uploaded}</td>
                  <td className="p-3"><a className="inline-flex min-h-12 items-center whitespace-nowrap font-medium text-primary underline" href={report.url} target="_blank" rel="noopener noreferrer">{copy.download}</a></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
