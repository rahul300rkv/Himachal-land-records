# HimBhoomi dropdown scraper

This scraper archives only public dropdown options shown before CAPTCHA. It does
not submit, bypass, OCR, or solve CAPTCHA and does not download Nakal records.

## Setup

```powershell
cd "C:\Users\RAHUL\Documents\Codex\2026-11-14\check-that-rea-is-connected-and\work\Himachal-land-records"
py -m venv .venv-scraper
.\.venv-scraper\Scripts\python -m pip install -r scripts\requirements-scraper.txt
```

## Recommended economical run

First collect district → tehsil/sub-tehsil → village mappings:

```powershell
.\.venv-scraper\Scripts\python scripts\scrape_himbhoomi.py --depth locations
```

If your network has trouble with the NIC TLS endpoint, use the identical public
HTTP endpoint explicitly:

```powershell
.\.venv-scraper\Scripts\python scripts\scrape_himbhoomi.py --depth locations --base-url http://himbhoomilmk.nic.in/
```

Then collect Jamabandi years. This is much more expensive because each village
requires its own ASP.NET postback sequence:

```powershell
.\.venv-scraper\Scripts\python scripts\scrape_himbhoomi.py --depth years
```

Finally, collect only the latest year's Khewat numbers (the default and most
economical number mode):

```powershell
.\.venv-scraper\Scripts\python scripts\scrape_himbhoomi.py --depth numbers
```

To include all three number types for the latest year:

```powershell
.\.venv-scraper\Scripts\python scripts\scrape_himbhoomi.py --depth numbers --record-keys Khewat Khatauni Khasra
```

Adding `--all-years` multiplies the workload and should only be used after the
latest-year run is complete. Use `--district 04` and `--max-villages 10` for a
small test. The default delay is 0.75 seconds plus jitter after every request;
do not reduce it for a full scrape.

Output is written as UTF-8 CSV to `data/himbhoomi/`:

- `locations.csv`
- `years.csv`
- `record_numbers.csv`
- `errors.csv`

Every CSV is append-only and de-duplicated by its natural key. Stop with
`Ctrl+C` and run the same command again to resume.
